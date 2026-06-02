/**
 * MigracionController.js
 * Pipeline secuencial de migración Access → MySQL.
 * Paso 1: Tablas Base  →  Paso 2: Inventario  →  Paso 3: Solicitudes
 * Cada paso espera al anterior con async/await.
 */

import pool from '../DataBase/Mysql/ConexionSQL.js';
import { Migraciondeproductos_almacen, MigracionStockAlmacen, MigrarUnidadesAProductos } from '../DataBase/Migracion/MigracionACCES-MYSQL.js'

// req.session.rol = id_rol numérico (AuthController lo guarda así)
// SuperAdministrador = 5 | Administrador = 11
const ROLES_ADMIN = [5, 11];

const verificarRol = (req) => {
  const idRol = Number(req.session?.rol);
  if (!req.session?.isLoggedIn || !ROLES_ADMIN.includes(idRol)) {
    const err = new Error('Acceso denegado: se requiere rol Administrador o SuperAdministrador.');
    err.status = 403;
    throw err;
  }
};

// ─── Paso 1: Migrar tablas base (categorías, unidades, gerencias…) ─────────
const migrarTablasBase = async () => {
  // TODO: conectar a Access y ejecutar SELECT sobre tablas base.
  // Ejemplo con node-adodb:
  // const { ACCESS_DSN } = await import('../config/dbAccess.js');
  // const conn = ADODB.open(ACCESS_DSN);
  // const rows = await conn.query('SELECT * FROM Categorias');
  // for (const r of rows) {
  //   await pool.query(
  //     'INSERT IGNORE INTO categorias (codigo, nombre) VALUES (?,?)',
  //     [r.Codigo, r.Nombre]
  //   );
  // }
  return { paso: 1, descripcion: 'Tablas Base', registros: 0 };
};

// ─── Paso 2: Migrar inventario (productos, stock) ────────────────────────────
const migrarInventario = async () => {
  // TODO: SELECT de tabla Inventario en Access e INSERT en MySQL.
  // const rows = await conn.query('SELECT * FROM Inventario');
  // for (const r of rows) {
  //   await pool.query(
  //     'INSERT IGNORE INTO productos (codigo_item, nombre, stock) VALUES (?,?,?)',
  //     [r.Codigo, r.Nombre, r.Stock]
  //   );
  // }
  return { paso: 2, descripcion: 'Inventario', registros: 0 };
};

// ─── Paso 3: Migrar solicitudes históricas ───────────────────────────────────
const migrarSolicitudes = async () => {
  // TODO: SELECT de Solicitudes en Access e INSERT en MySQL.
  // const rows = await conn.query('SELECT * FROM Solicitudes');
  // for (const r of rows) {
  //   await pool.query(
  //     `INSERT IGNORE INTO solicitudes
  //        (resumen, justificacion, tipo_solicitud, id_estado, fecha_creacion)
  //      VALUES (?,?,?,2,?)`,
  //     [r.Resumen, r.Justificacion, r.Tipo, r.Fecha]
  //   );
  // }
  return { paso: 3, descripcion: 'Solicitudes', registros: 0 };
};

// ─── Endpoint: Ejecutar pipeline completo ────────────────────────────────────
export const ejecutarMigracion = async (req, res) => {
  try {
    verificarRol(req);

    const r1 = await Migraciondeproductos_almacen();
    const r2 = await MigracionStockAlmacen();
    const r3 = await MigrarUnidadesAProductos();

    return res.status(200).json({
      ok: true,
      message: 'Pipeline de migración completado exitosamente.',
      pasos: [r1, r2, r3],
    });
  } catch (err) {
    console.error('[MigracionController]', err.message);
    return res.status(err.status || 500).json({ ok: false, message: err.message });
  }
};

// ─── Endpoint: Exportar MySQL → Access ───────────────────────────────────────
export const exportToAccess = async (req, res) => {
  try {
    verificarRol(req);

    const [rows] = await pool.query(`
      SELECT s.id_solicitud, s.resumen, s.justificacion, s.tipo_solicitud,
             es.nombre AS estado, u.nombre_completo AS solicitante, s.fecha_creacion
      FROM solicitudes s
      LEFT JOIN estados_solicitud es ON s.id_estado = es.id_estado
      LEFT JOIN usuarios          u  ON s.id_solicitante = u.id_usuario
      ORDER BY s.id_solicitud DESC
    `);

    // TODO: Iterar rows e insertar en Access
    // const { ACCESS_DSN } = await import('../config/dbAccess.js');
    // const conn = ADODB.open(ACCESS_DSN);
    // for (const row of rows) {
    //   await conn.execute(`
    //     INSERT INTO TuTablaAccess (ID, Resumen, Estado, Fecha)
    //     VALUES (${row.id_solicitud}, '${esc(row.resumen)}',
    //             '${esc(row.estado)}', #${fmtDate(row.fecha_creacion)}#)
    //   `);
    // }

    return res.status(200).json({
      ok: true,
      message: `${rows.length} registros listos para exportar a Access. Activa el INSERT en el controlador.`,
      exportados: rows.length,
      preview: rows.slice(0, 5),
    });
  } catch (err) {
    console.error('[MigracionController] exportToAccess:', err.message);
    return res.status(err.status || 500).json({ ok: false, message: err.message });
  }
};
