/**
 * SolicitudesController.js
 * CRUD completo de solicitudes de compra/servicio/obra:
 *   - listar, detalle, crear, cambiar estado, verificar (almacén),
 *     vistas especiales de almacén y compras.
 */

import pool from '../DataBase/Mysql/ConexionSQL.js';
import { insetSolicitud } from '../DataBase/Mysql/InsertSQL.js';
import { consultarproductos, solicitudESCOMPRA } from '../DataBase/Mysql/ConsultasSQL.js';
import { getIO } from '../socket.js';

// ── Helper privado ────────────────────────────────────────────────────────────
const getEstadoId = async (nombre) => {
    const [rows] = await pool.query(
        'SELECT id_estado, color_hex FROM estados_solicitud WHERE nombre = ? LIMIT 1',
        [nombre]
    );
    if (!rows.length) throw new Error(`Estado '${nombre}' no existe en estados_solicitud`);
    return rows[0];
};

// GET /solicitudes
export const getSolicitudes = async (req, res) => {
    try {
        const userId   = req.session.userId  ?? null;
        const userRole = req.session.rol      ?? null;

        if (!req.session.isLoggedIn || !userId) {
            return res.status(401).json({ err: 'No autenticado' });
        }

        const page     = parseInt(req.query.page)   || 1;
        const limit    = parseInt(req.query.limit)  || 10;
        const estado   = req.query.estado   || null;
        const busqueda = req.query.busqueda || null;

        const isAdmin = Number(userRole) === 1 || Number(userRole) === 5 || Number(userRole) === 11;
        const result  = isAdmin
            ? await solicitudESCOMPRA({ page, limit, estado, busqueda, roleId: userRole, userId })
            : await solicitudESCOMPRA({ userId, roleId: userRole, page, limit, estado, busqueda });

        res.status(200).json({
            mensaje: result.rows,
            total:   result.totalRows.total,
            counts:  result.totalRows,
            page,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'error del servidor' });
    }
};

// GET /solicitudes/almacen
export const getSolicitudesAlmacen = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    try {
        const [rows] = await pool.query(`
            SELECT
                s.id_solicitud,
                s.fecha_creacion,
                s.resumen,
                s.justificacion,
                s.tipo_solicitud,
                g.nombre_gerencia,
                CONCAT(u.nombres, ' ', u.apellidos) AS nombre_completo,
                u.avatar,
                e.nombre     AS estado,
                e.color_hex  AS estado_color,
                IFNULL((
                    SELECT GROUP_CONCAT(CONCAT(
                        COALESCE(p.nombre_producto, srv.nombre_servicio), '::',
                        ds.cantidad, '::',
                        COALESCE(p.stock_actual, 0), '::',
                        COALESCE(p.stock_minimo, 0)
                    ) SEPARATOR '||')
                    FROM detalles_solicitud ds
                    LEFT JOIN productos_almacen p  ON ds.id_producto = p.id_producto
                    LEFT JOIN servicios         srv ON ds.id_servicio = srv.id_servicio
                    WHERE ds.id_solicitud = s.id_solicitud
                ), '') AS items
            FROM solicitudes_compra s
            JOIN gerencias         g ON s.id_gerencia   = g.id_gerencia
            JOIN usuarios          u ON s.id_solicitante = u.id_usuario
            JOIN estados_solicitud e ON s.id_estado      = e.id_estado
            WHERE e.nombre = 'Aprobado Gerencia'
              AND s.tipo_solicitud = 'Compra'
            ORDER BY s.fecha_creacion ASC
        `);
        res.status(200).json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// GET /solicitudes/compras
export const getSolicitudesCompras = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    try {
        const [rows] = await pool.query(`
            SELECT
                s.id_solicitud,
                s.fecha_creacion,
                s.resumen,
                s.justificacion,
                s.tipo_solicitud,
                g.nombre_gerencia,
                CONCAT(u.nombres, ' ', u.apellidos) AS nombre_completo,
                u.avatar,
                e.nombre     AS estado,
                e.color_hex  AS estado_color
            FROM solicitudes_compra s
            JOIN gerencias         g ON s.id_gerencia   = g.id_gerencia
            JOIN usuarios          u ON s.id_solicitante = u.id_usuario
            JOIN estados_solicitud e ON s.id_estado      = e.id_estado
            WHERE e.nombre = 'En Compras'
            ORDER BY s.fecha_creacion ASC
        `);
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// GET /solicitudes/:id
export const getSolicitudById = async (req, res) => {
    const { id } = req.params;
    try {
        const [soliRows] = await pool.execute(`
            SELECT
                s.id_solicitud,
                s.fecha_creacion,
                s.resumen,
                s.justificacion,
                s.requerimientos_texto,
                s.requerimientos_pdf_url,
                s.tipo_solicitud,
                s.prioridad,
                s.id_solicitante,
                g.nombre_gerencia,
                CONCAT(u.nombres, ' ', u.apellidos) AS nombre_completo,
                CONCAT(u.nombres, ' ', u.apellidos) AS nombre_solicitante,
                u.avatar,
                u.email,
                e.nombre    AS estado_nombre,
                e.color_hex AS estado_color
            FROM solicitudes_compra s
            LEFT JOIN gerencias         g ON s.id_gerencia    = g.id_gerencia
            LEFT JOIN usuarios          u ON s.id_solicitante  = u.id_usuario
            LEFT JOIN estados_solicitud e ON s.id_estado       = e.id_estado
            WHERE s.id_solicitud = ?
            LIMIT 1
        `, [id]);

        if (!soliRows.length) return res.status(404).json({ error: 'Solicitud no encontrada' });

        const [detalleRows] = await pool.execute(`
            SELECT
                d.id_detalle,
                d.cantidad,
                d.id_producto,
                d.id_servicio,
                COALESCE(p.nombre_producto,  s.nombre_servicio)  AS nombre_item,
                COALESCE(p.codigo_producto,  s.codigo_servicio)  AS codigo_item,
                COALESCE(p.descripcion,      s.descripcion)      AS descripcion_detalle,
                u_p.nombre_unidad,
                u_p.abreviatura AS unidad_abreviatura
            FROM detalles_solicitud d
            LEFT JOIN productos_almacen p  ON d.id_producto = p.id_producto
            LEFT JOIN servicios          s  ON d.id_servicio = s.id_servicio
            LEFT JOIN unidades_medida   u_p ON p.id_unidad   = u_p.id_unidad
            WHERE d.id_solicitud = ?
            ORDER BY d.id_detalle ASC
        `, [id]);

        return res.json({ solicitud: soliRows[0], detalles: detalleRows });
    } catch (error) {
        console.error('Error obteniendo detalle de solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /crearsolicitud
export const createSolicitud = async (req, res) => {
    const {
        resumen,
        justificacion,
        requerimientos_texto,
        tipo_solicitud = 'Compra',
        prioridad = 'Media',
        usuario,
        productos: productosRaw
    } = req.body;

    let productos = [];
    try { if (productosRaw) productos = JSON.parse(productosRaw); } catch { productos = []; }

    const justificacion_pdf_url = req.files && req.files['justificacion_pdf'] ? req.files['justificacion_pdf'][0].filename : null;
    const requerimientos_pdf_url = req.files && req.files['requerimientos_pdf'] ? req.files['requerimientos_pdf'][0].filename : null;
    const idUsuario = usuario || req.session.userId;

    let id_gerencia = null;
    try {
        const [gRows] = await pool.query('SELECT id_gerencia FROM usuarios WHERE id_usuario = ? LIMIT 1', [idUsuario]);
        id_gerencia = gRows[0]?.id_gerencia || null;
    } catch (e) {
        console.error('Error obteniendo gerencia del usuario:', e);
    }

    try {
        const result = await insetSolicitud({
            resumen,
            justificacion,
            justificacion_pdf_url: justificacion_pdf_url || null,
            requerimientos_texto: requerimientos_texto || null,
            requerimientos_pdf_url: requerimientos_pdf_url || null,
            tipo_solicitud,
            prioridad,
            productos,
            id_usuario: idUsuario,
            id_gerencia
        });

        if (result.codigo && result.codigo !== 201) {
            return res.status(result.codigo).json(result);
        }

        res.status(201).json({ mensaje: 'Solicitud creada con éxito', id: result.id, pdf: requerimientos_pdf_url });
    } catch (error) {
        console.error('Error creando solicitud:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// PUT /solicitudes/:id/estado
export const updateEstado = async (req, res) => {
    try {
        const { id }    = req.params;
        const { estado } = req.body;
        const userId     = req.session.userId;
        const userRole   = req.session.rol ?? null;

        if (!req.session.isLoggedIn) return res.status(401).json({ success: false, message: 'No autenticado' });
        if (!estado)                 return res.status(400).json({ success: false, message: 'Estado requerido' });

        const [soliRows] = await pool.query(
            `SELECT s.*, e.nombre AS estado_actual, s.tipo_solicitud
             FROM solicitudes_compra s
             LEFT JOIN estados_solicitud e ON s.id_estado = e.id_estado
             WHERE s.id_solicitud = ?`,
            [id]
        );
        if (!soliRows.length) return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });

        const solicitud = soliRows[0];

        // Enrutamiento automático: Servicio/Obra aprobado por gerencia → En Compras directamente
        let estadoFinal = estado;
        if (estado === 'Aprobado Gerencia' && ['Servicio', 'Obra'].includes(solicitud.tipo_solicitud)) {
            estadoFinal = 'En Compras';
        }

        // Validaciones de permisos por rol antes de aplicar ciertos estados
        const roleId = Number(userRole || 0);
        const isSuper = roleId === 1 || roleId === 5 || roleId === 11; // roles administrativos

        // Comprador (id_rol = 10) es el que puede marcar como 'Aprovadas'
        if (String(estadoFinal) === 'Aprovadas' && !isSuper && roleId !== 10) {
            return res.status(403).json({ success: false, message: 'No autorizado para aprobar esta solicitud' });
        }

        // Solo Gerente (id_rol = 8) o admins pueden marcar 'Aprobado Gerencia'
        if (String(estadoFinal) === 'Aprobado Gerencia' && !isSuper && roleId !== 8) {
            return res.status(403).json({ success: false, message: 'No autorizado para aprobar en nombre de gerencia' });
        }

        const estadoInfo = await getEstadoId(estadoFinal);
        await pool.execute('UPDATE solicitudes_compra SET id_estado = ? WHERE id_solicitud = ?', [estadoInfo.id_estado, id]);

        // Historial
        const nombreUsuario = req.session.username || 'Sistema';
        await pool.query(
            `INSERT INTO historial_estados (id_solicitud, estado_anterior, estado_nuevo, usuario_responsable)
             VALUES (?, ?, ?, ?)`,
            [id, solicitud.estado_actual, estadoFinal, nombreUsuario]
        );

        // Notificación al solicitante via DB + Socket
        const dbStatus = estadoFinal === 'Rechazado' ? 'error' : estadoFinal === 'Finalizado' ? 'ok' : 'info';
        const contenido = `Tu solicitud "${solicitud.resumen}" pasó a: ${estadoFinal}.`;
        const [resNotif] = await pool.query(
            'INSERT INTO notificaciones (id_solicitud, contenido, status) VALUES (?, ?, ?)',
            [id, contenido, dbStatus]
        );

        try {
            getIO().to(`user_${solicitud.id_solicitante}`).emit('receive_notification', {
                id_notificacion: resNotif.insertId,
                id_solicitud: id,
                contenido,
                status: dbStatus,
                fecha: new Date().toISOString(),
                resumen: solicitud.resumen,
                estado_color: estadoInfo.color_hex
            });
        } catch (_) { /* Socket no crítico */ }

        // Si fue aprobado por gerencia, notificar a usuarios de Almacén (no crear chats automáticamente)
        if (estadoFinal === 'Aprobado Gerencia') {
            try {
                const [almacenUsers] = await pool.execute('SELECT id_usuario FROM usuarios WHERE id_rol = 9');
                for (const u of almacenUsers) {
                    try {
                        const [resAlmNotif] = await pool.query('INSERT INTO notificaciones (id_solicitud, contenido, status) VALUES (?, ?, ?)', [id, contenido, 'info']);
                        try {
                            getIO().to(`user_${u.id_usuario}`).emit('receive_notification', {
                                id_notificacion: resAlmNotif.insertId,
                                id_solicitud: id,
                                contenido: contenido,
                                status: 'info',
                                fecha: new Date().toISOString(),
                                resumen: solicitud.resumen,
                                estado_color: estadoInfo.color_hex
                            });
                        } catch (_) {}
                    } catch (_) {
                        // ignore per-user notification failures
                    }
                }
            } catch (errNotify) {
                console.error('Error notificando a almacén tras aprobación de gerencia:', errNotify);
            }
        }

        res.status(200).json({
            success: true,
            message: `Estado actualizado a: ${estadoFinal}`,
            estado: estadoFinal,
            color: estadoInfo.color_hex
        });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
};

// PUT /solicitudes/:id/verificar  (Almacén → En Compras)
export const verificarSolicitud = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    try {
        const { id }           = req.params;
        const { observacion }  = req.body;

        const [soliRows] = await pool.query(
            `SELECT s.*, e.nombre AS estado_actual FROM solicitudes_compra s
             LEFT JOIN estados_solicitud e ON s.id_estado = e.id_estado
             WHERE s.id_solicitud = ?`,
            [id]
        );
        if (!soliRows.length) return res.status(404).json({ error: 'Solicitud no encontrada' });

        const estadoInfo = await getEstadoId('En Compras');
        await pool.execute('UPDATE solicitudes_compra SET id_estado = ? WHERE id_solicitud = ?', [estadoInfo.id_estado, id]);

        await pool.query(
            `INSERT INTO historial_estados (id_solicitud, estado_anterior, estado_nuevo, usuario_responsable, comentarios_observacion)
             VALUES (?, ?, ?, ?, ?)`,
            [id, soliRows[0].estado_actual, 'En Compras', req.session.username || 'Almacén', observacion || null]
        );

        res.json({ success: true, message: 'Verificado. Solicitud enviada a Compras.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Error del servidor' });
    }
};

// GET /solicitudes/:id/participants
export const getParticipants = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    const { id } = req.params;
    try {
        const [chatRows] = await pool.execute('SELECT id_chat FROM chats WHERE id_solicitud = ? LIMIT 1', [id]);
        let participants = [];

        if (chatRows && chatRows.length) {
            const idChat = chatRows[0].id_chat;
            const [rows] = await pool.execute(
                `SELECT u.id_usuario, u.nombres, u.apellidos, u.avatar
                 FROM chat_participantes cp
                 JOIN usuarios u ON cp.id_usuario = u.id_usuario
                 WHERE cp.id_chat = ?
                 LIMIT 50`,
                [idChat]
            );
            participants = rows.map(r => ({ id_usuario: r.id_usuario, nombres: r.nombres, apellidos: r.apellidos, avatar: r.avatar }));
        } else {
            const [srows] = await pool.execute('SELECT id_solicitante, id_gerencia FROM solicitudes_compra WHERE id_solicitud = ? LIMIT 1', [id]);
            if (srows && srows.length) {
                const s = srows[0];
                if (s.id_solicitante) {
                    const [sr] = await pool.execute('SELECT id_usuario, nombres, apellidos, avatar FROM usuarios WHERE id_usuario = ? LIMIT 1', [s.id_solicitante]);
                    if (sr && sr.length) participants.push({ id_usuario: sr[0].id_usuario, nombres: sr[0].nombres, apellidos: sr[0].apellidos, avatar: sr[0].avatar });
                }
                if (s.id_gerencia) {
                    const [gr] = await pool.execute('SELECT id_usuario, nombres, apellidos, avatar FROM usuarios WHERE id_rol = 8 AND id_gerencia = ?', [s.id_gerencia]);
                    for (const g of gr) participants.push({ id_usuario: g.id_usuario, nombres: g.nombres, apellidos: g.apellidos, avatar: g.avatar });
                }
            }
        }

        return res.json({ participants });
    } catch (err) {
        console.error('Error obteniendo participantes de solicitud:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// GET /solicitudes/:id/mensajes
export const getMensajesBySolicitud = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    const { id } = req.params;

    try {
                
        const senderId = req.session.userId;
        console.log('Obteniendo mensajes para solicitud:', id, 'Usuario:', senderId);
        const Chat = id;



        const [rows] = await pool.execute(`
            SELECT
                m.id_mensaje,
                m.contenido AS mensaje,
                m.fecha_envio,
                m.leido,
                m.id_emisor,
                CONCAT(u.nombres, ' ', u.apellidos) AS nombre_emisor,
                u.avatar,
                (m.id_emisor = ?) AS ismy,
                m.id_respuesta,
                m_resp.contenido AS respuesta_contenido,
                u_resp.nombres  AS respuesta_nombres,
                u_resp.apellidos AS respuesta_apellidos,
                u_resp.avatar AS respuesta_avatar
            FROM mensajes m
            JOIN usuarios u ON m.id_emisor = u.id_usuario
            LEFT JOIN mensajes m_resp ON m.id_respuesta = m_resp.id_mensaje
            LEFT JOIN usuarios u_resp ON m_resp.id_emisor = u_resp.id_usuario
            WHERE m.id_chat = ?
            ORDER BY m.fecha_envio DESC
        `, [senderId, Chat]);
        
        return res.json({ data: rows });
    } catch (err) {
        console.error('Error al obtener mensajes por solicitud:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// POST /solicitudes/:id/mensaje
export const postMensajeSolicitud = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    try {
        const { id } = req.params;
        const { mensaje } = req.body;
        const senderId = req.session.userId;

        if (!mensaje || !String(mensaje).trim()) return res.status(400).json({ error: 'Mensaje requerido' });

        const [soliRows] = await pool.execute('SELECT id_solicitante, id_gerencia, resumen FROM solicitudes_compra WHERE id_solicitud = ? LIMIT 1', [id]);
        if (!soliRows.length) return res.status(404).json({ error: 'Solicitud no encontrada' });
        const solicitud = soliRows[0];

        const [chatRows] = await pool.execute('SELECT id_chat FROM chats WHERE id_solicitud = ? LIMIT 1', [id]);
        let idChat;
        if (!chatRows.length) {
            const [chatRes] = await pool.execute(`INSERT INTO chats (tipo, id_solicitud) VALUES (?, ? )`, ['group', id]);
            idChat = chatRes.insertId;
            try { await pool.execute('INSERT IGNORE INTO chat_participantes (id_chat, id_usuario) VALUES (?, ?)', [idChat, senderId]); } catch (e) { }
            if (solicitud.id_solicitante && solicitud.id_solicitante !== senderId) {
                try { await pool.execute('INSERT IGNORE INTO chat_participantes (id_chat, id_usuario) VALUES (?, ?)', [idChat, solicitud.id_solicitante]); } catch (e) { }
            }
            if (solicitud.id_gerencia) {
                const [gerentes] = await pool.execute('SELECT id_usuario FROM usuarios WHERE id_rol = 8 AND id_gerencia = ?', [solicitud.id_gerencia]);
                for (const g of gerentes) {
                    if (g?.id_usuario) {
                        try { await pool.execute('INSERT IGNORE INTO chat_participantes (id_chat, id_usuario) VALUES (?, ?)', [idChat, g.id_usuario]); } catch (e) { }
                    }
                }
            }
        } else {
            idChat = chatRows[0].id_chat;
            const [existsSender] = await pool.execute('SELECT 1 FROM chat_participantes WHERE id_chat = ? AND id_usuario = ? LIMIT 1', [idChat, senderId]);
            if (!existsSender.length) {
                try { await pool.execute('INSERT IGNORE INTO chat_participantes (id_chat, id_usuario) VALUES (?, ?)', [idChat, senderId]); } catch (e) { }
            }
            if (solicitud.id_solicitante && solicitud.id_solicitante !== senderId) {
                const [existsSol] = await pool.execute('SELECT 1 FROM chat_participantes WHERE id_chat = ? AND id_usuario = ? LIMIT 1', [idChat, solicitud.id_solicitante]);
                if (!existsSol.length) {
                    try { await pool.execute('INSERT IGNORE INTO chat_participantes (id_chat, id_usuario) VALUES (?, ?)', [idChat, solicitud.id_solicitante]); } catch (e) { }
                }
            }
        }

        const idRespuesta = req.body.replyTo?.id || req.body.replyToId || null;
        const [mRes] = await pool.execute('INSERT INTO mensajes (id_chat, id_emisor, contenido, id_respuesta) VALUES (?, ?, ?, ?)', [idChat, senderId, mensaje.trim(), idRespuesta]);

        const payload = {
            id_mensaje: mRes.insertId,
            id_chat: idChat,
            id_emisor: senderId,
            contenido: mensaje.trim(),
            fecha_envio: new Date().toISOString()
        };

        // Añadir metadata del remitente (nombre y avatar) para el socket
        try {
            const [uRows] = await pool.query('SELECT nombres, apellidos, avatar FROM usuarios WHERE id_usuario = ? LIMIT 1', [senderId]);
            if (uRows && uRows.length) {
                const u = uRows[0];
                payload.remitente = { name: `${u.nombres || ''} ${u.apellidos || ''}`.trim() || (req.session.username || 'Usuario'), avatar: u.avatar || null };
            } else {
                payload.remitente = { name: req.session.username || 'Usuario', avatar: null };
            }
        } catch (e) {
            payload.remitente = { name: req.session.username || 'Usuario', avatar: null };
        }

        if (idRespuesta) {
            try {
                const [rrows] = await pool.execute(`SELECT m.contenido AS respuesta_contenido, u.nombres, u.apellidos, u.avatar FROM mensajes m JOIN usuarios u ON m.id_emisor = u.id_usuario WHERE m.id_mensaje = ? LIMIT 1`, [idRespuesta]);
                if (rrows && rrows.length) {
                    payload.respuesta = {
                        id: idRespuesta,
                        mensaje: rrows[0].respuesta_contenido,
                        remitente: { name: `${rrows[0].nombres} ${rrows[0].apellidos}`, avatar: rrows[0].avatar }
                    };
                }
            } catch (e) { }
        }

        try {
            getIO().to(`solicitud_${id}`).emit('nuevo_mensaje', payload);
        } catch (_) { }

        const [participants] = await pool.execute('SELECT id_usuario FROM chat_participantes WHERE id_chat = ?', [idChat]);
        for (const p of participants) {
            if (p.id_usuario === senderId) continue;
            try {
                const [resNot] = await pool.query('INSERT INTO notificaciones (id_solicitud, contenido, status) VALUES (?, ?, ?)', [id, mensaje, 'info']);
                try {
                    getIO().to(`user_${p.id_usuario}`).emit('receive_notification', {
                        id_notificacion: resNot.insertId,
                        id_solicitud: id,
                        contenido: mensaje,
                        status: 'info',
                        fecha: new Date().toISOString(),
                        resumen: solicitud.resumen || '',
                        estado_color: null
                    });
                } catch (_) { }
            } catch (_) { }
        }

        return res.status(201).json({ success: true, chatId: idChat, messageId: mRes.insertId });
    } catch (err) {
        console.error('Error enviando mensaje por solicitud:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// GET /solicitudes/stats/gerencia
export const getStatsGerencia = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    try {
        const mes = req.query.mes || null;
        const [rows] = await pool.query(`
            SELECT
                g.id_gerencia,
                g.nombre_gerencia,
                COUNT(s.id_solicitud) AS total
            FROM gerencias g
            LEFT JOIN solicitudes_compra s ON s.id_gerencia = g.id_gerencia
                ${mes ? "AND DATE_FORMAT(s.fecha_creacion, '%Y-%m') = ?" : ''}
            GROUP BY g.id_gerencia, g.nombre_gerencia
            ORDER BY total DESC
        `, mes ? [mes] : []);
        res.json({ data: rows });
    } catch (err) {
        console.error('Error stats gerencia:', err);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// GET /solicitudes-producto
export const getSolicitudesProducto = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    try {
        const [rows] = await pool.query(`
            SELECT
                sp.id_sol_prod,
                sp.nombre_producto,
                sp.descripcion,
                sp.cantidad_requerida,
                sp.id_categoria,
                sp.estado,
                sp.fecha_creacion,
                c.nombre_categoria,
                CONCAT(u.nombres, ' ', u.apellidos) AS solicitante,
                u.avatar
            FROM solicitudes_creacion_producto sp
            LEFT JOIN categorias c ON sp.id_categoria = c.id_categoria
            JOIN usuarios u ON sp.id_solicitante = u.id_usuario
            ORDER BY sp.fecha_creacion DESC
        `);
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener solicitudes de producto' });
    }
};

// POST /solicitudes-producto
export const createSolicitudProducto = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    const { nombre_producto, descripcion, cantidad_requerida = 1, id_categoria } = req.body;
    if (!nombre_producto?.trim()) return res.status(400).json({ error: 'El nombre del producto es obligatorio' });
    try {
        const [result] = await pool.query(
            `INSERT INTO solicitudes_creacion_producto
             (nombre_producto, descripcion, cantidad_requerida, id_categoria, id_solicitante)
             VALUES (?, ?, ?, ?, ?)`,
            [nombre_producto.trim(), descripcion || null, cantidad_requerida, id_categoria || null, req.session.userId]
        );
        const id = result.insertId;
        try { getIO().to('almacen').emit('nueva_solicitud_producto', { id_sol_prod: id, nombre_producto: nombre_producto.trim(), cantidad_requerida, solicitante: req.session.username || 'Usuario', fecha_creacion: new Date().toISOString() }); } catch (_) {}
        res.status(201).json({ success: true, id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la solicitud de producto' });
    }
};

// POST /solicitudes-producto/:id/codificar
export const codificarSolicitudProducto = async (req, res) => {
    if (!req.session.isLoggedIn) return res.status(401).json({ error: 'No autenticado' });
    const { id } = req.params;
    const { nombre_producto, descripcion, id_categoria, codigo_producto, stock_minimo = 0, stock_actual } = req.body;

    if (!nombre_producto?.trim() || !id_categoria) {
        return res.status(400).json({ error: 'Nombre y categoría son obligatorios.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        let stockToInsert = 0;
        if (typeof stock_actual !== 'undefined' && stock_actual !== null && stock_actual !== '') {
            stockToInsert = Number(stock_actual) || 0;
        } else {
            const [solRows] = await connection.query(`SELECT cantidad_requerida FROM solicitudes_creacion_producto WHERE id_sol_prod = ? LIMIT 1`, [id]);
            stockToInsert = (solRows && solRows[0] && solRows[0].cantidad_requerida) ? Number(solRows[0].cantidad_requerida) : 0;
        }

        const [prodResult] = await connection.query(`INSERT INTO productos_almacen (nombre_producto, descripcion, id_categoria, codigo_producto, stock_actual, stock_minimo) VALUES (?, ?, ?, ?, ?, ?)`, [nombre_producto.trim(), descripcion || null, id_categoria, codigo_producto || null, stockToInsert, stock_minimo]);

        const [[solRow]] = await connection.query(`SELECT id_solicitante FROM solicitudes_creacion_producto WHERE id_sol_prod = ? LIMIT 1`, [id]);
        const idSolicitante = solRow?.id_solicitante || null;
        let idGerencia = null;
        if (idSolicitante) {
            const [[urow]] = await connection.query(`SELECT id_gerencia FROM usuarios WHERE id_usuario = ? LIMIT 1`, [idSolicitante]);
            idGerencia = urow?.id_gerencia || null;
        }

        await connection.query(`DELETE FROM solicitudes_creacion_producto WHERE id_sol_prod = ?`, [id]);

        const contenidoAlert = `Producto creado: ${nombre_producto.trim()} (Solicitud #${id})`;
        const [resAlert] = await connection.query(`INSERT INTO notificaciones_not_solisitud (id_gerencia, contenido, status) VALUES (?, ?, ?)`, [idGerencia || 1, contenidoAlert, 'ok']);

        await connection.commit();

        try { getIO().to('almacen').emit('producto_creado', { id_producto: prodResult.insertId, nombre_producto: nombre_producto.trim(), fecha_creacion: new Date().toISOString(), stock_actual: stockToInsert }); } catch (_) {}

        try {
            const [[gRow]] = await pool.query('SELECT nombre_gerencia FROM gerencias WHERE id_gerencia = ? LIMIT 1', [idGerencia]);
            const gerenciaName = gRow?.nombre_gerencia || 'Gerencia';
            const [usersToNotify] = await pool.query('SELECT id_usuario FROM usuarios WHERE id_rol IN (1,5) OR id_gerencia = ?', [idGerencia]);
            for (const u of usersToNotify) {
                try {
                    getIO().to(`user_${u.id_usuario}`).emit('receive_notification', { id_notificacion: resAlert.insertId, id_solicitud: null, contenido: contenidoAlert, status: 'ok', fecha: new Date().toISOString(), resumen: `Alerta: ${gerenciaName}`, nombres: 'Sistema', apellidos: '' });
                } catch (_) { }
            }
        } catch (emitErr) {
            console.error('Error notificando creación de producto:', emitErr);
        }

        res.status(201).json({ success: true, id_producto: prodResult.insertId, message: 'Producto creado en inventario y solicitud eliminada.' });
    } catch (err) {
        if (connection) {
            try { await connection.rollback(); } catch (e) { console.error('Rollback failed:', e); }
        }
        console.error(err);
        res.status(500).json({ error: 'Error al codificar el producto.' });
    } finally {
        if (connection) connection.release();
    }
};

// PUT /solicitudes/:id
export const updateSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            resumen,
            justificacion,
            requerimientos_texto,
            tipo_solicitud,
            prioridad,
            productos: productosRaw
        } = req.body;

        if (!req.session.isLoggedIn) {
            return res.status(401).json({ success: false, message: 'No autenticado' });
        }

        // 1. Obtener la solicitud actual
        const [soliRows] = await pool.query(
            `SELECT * FROM solicitudes_compra WHERE id_solicitud = ?`,
            [id]
        );
        if (!soliRows.length) {
            return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
        }

        const solicitud = soliRows[0];
        const userId = req.session.userId;
        const userRole = Number(req.session.rol || 0);

        // 2. Verificar permisos (SuperAdmin = 5, Admin = 11, o propietario de la solicitud)
        const isSuper = userRole === 1 || userRole === 5 || userRole === 11;
        const isSolicitante = Number(solicitud.id_solicitante) === Number(userId);

        if (!isSuper && !isSolicitante) {
            return res.status(403).json({ success: false, message: 'No autorizado para editar esta solicitud' });
        }

        // Determinar si hay nuevos archivos PDF o si se eliminan los existentes
        let just_pdf_url = solicitud.justificacion_pdf_url;
        let req_pdf_url = solicitud.requerimientos_pdf_url;

        if (req.files) {
            if (req.files['justificacion_pdf']) {
                just_pdf_url = req.files['justificacion_pdf'][0].filename;
            }
            if (req.files['requerimientos_pdf']) {
                req_pdf_url = req.files['requerimientos_pdf'][0].filename;
            }
        }

        // Limpiar si el frontend envía una cadena vacía o nula explícitamente
        if (req.body.justificacion_pdf_url === 'null' || req.body.justificacion_pdf_url === null || req.body.justificacion_pdf_url === '') {
            just_pdf_url = null;
        }
        if (req.body.requerimientos_pdf_url === 'null' || req.body.requerimientos_pdf_url === null || req.body.requerimientos_pdf_url === '') {
            req_pdf_url = null;
        }

        // 3. Actualizar la solicitud
        await pool.execute(
            `UPDATE solicitudes_compra 
             SET resumen = ?, justificacion = ?, justificacion_pdf_url = ?, requerimientos_texto = ?, requerimientos_pdf_url = ?, tipo_solicitud = ?, prioridad = ?
             WHERE id_solicitud = ?`,
            [
                resumen || solicitud.resumen,
                justificacion || solicitud.justificacion,
                just_pdf_url,
                requerimientos_texto !== undefined ? requerimientos_texto : solicitud.requerimientos_texto,
                req_pdf_url,
                tipo_solicitud || solicitud.tipo_solicitud,
                prioridad || solicitud.prioridad,
                id
            ]
        );

        // 4. Actualizar productos/detalles si se proporcionan
        if (productosRaw !== undefined) {
            let productos = [];
            try {
                productos = typeof productosRaw === 'string' ? JSON.parse(productosRaw) : productosRaw;
            } catch (e) {
                productos = productosRaw || [];
            }

            // Eliminar detalles anteriores
            await pool.execute('DELETE FROM detalles_solicitud WHERE id_solicitud = ?', [id]);

            // Insertar nuevos detalles
            if (productos && productos.length > 0) {
                for (const p of productos) {
                    await pool.execute(
                        `INSERT INTO detalles_solicitud (id_solicitud, id_producto, id_servicio, cantidad)
                         VALUES (?, ?, ?, ?)`,
                        [
                            id,
                            p.id_producto || null,
                            p.id_servicio || null,
                            Number(p.cantidad) || 1
                        ]
                    );
                }
            }
        }

        // Registrar en historial
        const nombreUsuario = req.session.username || 'Sistema';
        await pool.query(
            `INSERT INTO historial_estados (id_solicitud, estado_anterior, estado_nuevo, usuario_responsable, comentarios_observacion)
             VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                solicitud.estado_actual || 'Pendiente',
                solicitud.estado_actual || 'Pendiente',
                nombreUsuario,
                'Solicitud editada por el usuario'
            ]
        );

        res.status(200).json({ success: true, message: 'Solicitud actualizada con éxito' });
    } catch (error) {
        console.error('Error al editar solicitud:', error);
        res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
};
