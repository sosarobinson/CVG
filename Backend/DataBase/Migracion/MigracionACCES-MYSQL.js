import { connection, statusconnection } from "../Acces/ConexionACCES.js";
import pool, { statusconnectionsql } from "../Mysql/ConexionSQL.js";

async function verificarconexiones() {
    const isAccessOk = await statusconnection();
    return (isAccessOk === true && statusconnectionsql === true);
}

async function Esnecesariomigrar() {
    try {
        // 1. Contar en Access
        // node-adodb devuelve un array, tomamos el primer elemento
        const resAccess = await connection.query('SELECT COUNT(*) AS total FROM InventarioRepuestos');
        const totalAccess = resAccess[0].total;

        // 2. Contar en MySQL
        const [resMysql] = await pool.query('SELECT COUNT(*) AS total FROM productos_almacen');
        const totalMysql = resMysql[0].total;

        console.log(`📊 Conteo actual -> Access: ${totalAccess} | MySQL: ${totalMysql}`);

        // 3. Retornar true si las cantidades son distintas
        return totalAccess !== totalMysql;

    } catch (error) {
        console.error("Error al comparar cantidades:", error);
        return false; // Por seguridad, si falla el conteo, no migramos
    }
}

async function Migracion() {
    const conexionesListas = await verificarconexiones();

    if (!conexionesListas) {
        console.error("❌ Abortando: Bases de datos no disponibles.");
        return;
    }

    const necesitaMigrar = await Esnecesariomigrar();

    if (!necesitaMigrar) {
        console.log("✅ Las bases de datos ya están sincronizadas.");
        return;
    }

    console.log("🚀 Iniciando migración de datos...");

    try {
        // 1. Obtenemos los datos completos de Access para no perder la relación
        const rows = await connection.query('SELECT codigo_tipo, Descripcion_tipo FROM tipoRepuesto');

        // 2. IMPORTANTE: Para relacionar tablas, lo más seguro es iterar
        // o usar una lógica de inserción uno a uno si necesitas el ID generado.

        for (const row of rows) {
            // A. Insertamos la Gerencia
            const [resGerencia] = await pool.query(
                'INSERT INTO categorias (codigo, nombre_categoria) VALUES (?,?)',
                [row.codigo_tipo, row.Descripcion_tipo]
            );

            // const nuevoIdGerencia = resGerencia.insertId;

            // // B. Insertamos el Centro de Costo usando el ID que acabamos de obtener
            // await pool.query(
            //     'INSERT INTO centro_costo (codigo_centro, id_gerencia) VALUES (?, ?)',
            //     [row.codigo_CC, nuevoIdGerencia]
            // );
        }

        console.log(`✅ Migración completada: ${rows.length} registros procesados.`);

    } catch (error) {
        console.error("❌ Error durante la migración:", error);
    }
}

async function Migracionuni() {
    const conexionesListas = await verificarconexiones();

    if (!conexionesListas) {
        console.error("❌ Abortando: Bases de datos no disponibles.");
        return;
    }

    const necesitaMigrar = await Esnecesariomigrar();


    console.log("🚀 Iniciando migración de datos...");

    try {
        // 1. Obtenemos los datos completos de Access para no perder la relación
        const rows = await connection.query('SELECT unidad, descu FROM unidades');

        // 2. IMPORTANTE: Para relacionar tablas, lo más seguro es iterar
        // o usar una lógica de inserción uno a uno si necesitas el ID generado.

        for (const row of rows) {
            if (row.unidad === null || row.descu === null) {
                continue;
            } else {
                const [resGerencia] = await pool.query(
                    'INSERT INTO unidades_medida (id_unidad, nombre_unidad) VALUES (?,?)',
                    [row.unidad, row.descu]
                );


            }

        }
        console.log(`✅ Migración completada: ${rows.length} registros procesados.`);

    } catch (error) {
        console.error("❌ Error durante la migración:", error);
    }
}
async function Migraciondeproductos_almacen() {
    const conexionesListas = await verificarconexiones();
    if (!conexionesListas) return;

    // 1. Obtener una conexión dedicada para usar transacciones
    const connectionMysql = await pool.getConnection();

    try {
        // 2. Mapear categorías (Igual que antes)
        const [categoriasSql] = await connectionMysql.query('SELECT id_categoria, codigo FROM categorias');
        const mapaCategorias = new Map(
            categoriasSql.map(cat => [String(cat.codigo).trim(), cat.id_categoria])
        );

        // 3. Obtener datos de Access 
        // IMPORTANTE: Asegúrate de que sea 'InventarioRepuestos' si esa es la que tiene los 16k
        const queryAccess = 'SELECT descripcion_repuesto, cod_repuesto, cod_tipo, cant_minima FROM InventarioRepuestos';
        const rows = await connection.query(queryAccess);

        console.log(`🚀 Preparando inserción masiva de ${rows.length} registros...`);

        await connectionMysql.beginTransaction();

        // 4. Insertar por lotes para evitar que la conexión se caiga
        const batchSize = 500;
        let insertados = 0;
        let saltados = 0;

        for (let i = 0; i < rows.length; i += batchSize) {
            const lote = rows.slice(i, i + batchSize);

            // Filtramos y preparamos los datos del lote
            const valoresLote = lote.map(row => {
                const buscar = String(row.cod_tipo || '').trim();
                const idRealCategoria = mapaCategorias.get(buscar) || null;

                if (!idRealCategoria) {
                    saltados++;
                    return null;
                }

                return [
                    row.descripcion_repuesto || 'SIN DESCRIPCION',
                    String(row.cod_repuesto || '').trim(),
                    idRealCategoria,
                    Number(row.cant_minima) || 0,
                    0 // stock_actual inicial
                ];
            }).filter(v => v !== null);

            if (valoresLote.length > 0) {
                await connectionMysql.query(
                    'INSERT IGNORE INTO productos_almacen (nombre_producto, codigo_producto, id_categoria, stock_minimo, stock_actual) VALUES ?',
                    [valoresLote]
                );
                insertados += valoresLote.length;
            }

            console.log(`⏳ Procesando... ${Math.min(i + batchSize, rows.length)} / ${rows.length}`);
        }

        await connectionMysql.commit();
        console.log(`✅ Migración terminada: ${insertados} insertados, ${saltados} saltados por falta de categoría.`);

    } catch (error) {
        if (connectionMysql) await connectionMysql.rollback();
        console.error("❌ Error crítico en migración de productos:", error);
    } finally {
        if (connectionMysql) connectionMysql.release();
    }
}

async function MigracionStockAlmacen() {
    const conexionesListas = await verificarconexiones();
    if (!conexionesListas) return;

    const connectionMysql = await pool.getConnection();

    try {
        // 1. Leer Access (Igual que antes)
        const accessRows = await connection.query('SELECT cod_repuesto, inv_fisico FROM InventarioFisico');
        if (accessRows.length === 0) return;

        // 2. Crear una tabla temporal en MySQL para la carga rápida
        await connectionMysql.query(`
            CREATE TEMPORARY TABLE IF NOT EXISTS temp_stock_migracion (
                codigo VARCHAR(100),
                stock DECIMAL(10,2),
                INDEX (codigo)
            )
        `);
        await connectionMysql.query('TRUNCATE TABLE temp_stock_migracion');

        // 3. Insertar datos en la tabla temporal usando un Multi-Insert (MUY RÁPIDO)
        const batchSize = 1000; // Lotes mucho más grandes
        for (let i = 0; i < accessRows.length; i += batchSize) {
            const lote = accessRows.slice(i, i + batchSize);
            const values = lote.map(row => [
                String(row.cod_repuesto ?? '').trim(),
                Number(row.inv_fisico) || 0
            ]);

            await connectionMysql.query(
                'INSERT INTO temp_stock_migracion (codigo, stock) VALUES ?',
                [values]
            );
        }

        console.log(`🚀 Datos cargados en temporal. Ejecutando actualización masiva...`);

        // 4. El "Truco Maestro": Un solo UPDATE con JOIN
        // Esto actualiza todos los registros que coincidan con el código de un solo golpe
        const [resultado] = await connectionMysql.query(`
            UPDATE productos_almacen p
            INNER JOIN temp_stock_migracion t ON p.codigo_producto = t.codigo
            SET p.stock_actual = t.stock
        `);

        console.log(`✅ ¡Migración relámpago completada!`);
        console.log(`📊 Filas afectadas: ${resultado.affectedRows}`);

    } catch (error) {
        console.error('❌ Error en la migración rápida:', error);
    } finally {
        // Limpiar y liberar
        await connectionMysql.query('DROP TEMPORARY TABLE IF EXISTS temp_stock_migracion');
        connectionMysql.release();
    }
}

async function contardatos(tabla1, tabla2) {
    try {
        const resAccess = await connection.query(`SELECT COUNT(*) AS total FROM ${tabla1}`);
        const total = resAccess[0].total;
        console.log(`Total de registros en ${tabla1}: ${total}`);

        const [rows2] = await pool.query(`SELECT COUNT(*) as total FROM ${tabla2}`);
        const total2 = rows2[0].total;
        console.log(`Total de registros en ${tabla2}: ${total2}`);
    } catch (error) {
        console.error(`❌ Error al contar datos en ${tabla1} o ${tabla2}:`, error);
    }
}
async function MigrarUnidadesAProductos() {
    const conexionesListas = await verificarconexiones();
    if (!conexionesListas) return;

    const connectionMysql = await pool.getConnection();

    try {
        // 1. Obtener las unidades desde Access (tabla tipoRepuesto)
        // Según tu descripción, estos son los campos de origen
        const unidadesAccess = await connection.query('SELECT codigo_tipo, Descripcion_tipo FROM tipoRepuesto');

        if (unidadesAccess.length === 0) {
            console.log("⚠️ No hay unidades para migrar desde Access.");
            return;
        }

        console.log(`🚀 Migrando ${unidadesAccess.length} unidades de medida a MySQL...`);

        // 2. Insertar las unidades en la tabla unidades_medida de MySQL
        // Usamos INSERT IGNORE para evitar errores si ya existen
        const valoresUnidades = unidadesAccess.map(u => [
            String(u.codigo_tipo).trim(),
            u.Descripcion_tipo || 'SIN DESCRIPCION'
        ]);

        await connectionMysql.query(
            'INSERT IGNORE INTO unidades_medida (id_unidad, nombre_unidad) VALUES ?',
            [valoresUnidades]
        );

        // 3. Actualizar los productos en MySQL con su unidad correspondiente
        // Necesitamos leer la relación desde la tabla de inventario en Access
        console.log("🔄 Relacionando unidades con productos...");
        const relacionesAccess = await connection.query('SELECT cod_repuesto, cod_tipo FROM InventarioRepuestos');

        // Creamos una tabla temporal para una actualización masiva (mucho más rápido que un loop)
        await connectionMysql.query(`
            CREATE TEMPORARY TABLE IF NOT EXISTS temp_relacion_unidades (
                cod_prod VARCHAR(100),
                cod_uni VARCHAR(100),
                INDEX (cod_prod)
            )
        `);
        await connectionMysql.query('TRUNCATE TABLE temp_relacion_unidades');

        const batchSize = 1000;
        for (let i = 0; i < relacionesAccess.length; i += batchSize) {
            const lote = relacionesAccess.slice(i, i + batchSize);
            const values = lote.map(r => [
                String(r.cod_repuesto).trim(),
                String(r.cod_tipo).trim()
            ]);

            await connectionMysql.query(
                'INSERT INTO temp_relacion_unidades (cod_prod, cod_uni) VALUES ?',
                [values]
            );
        }

        // 4. Ejecutar el UPDATE masivo con un JOIN
        const [resultado] = await connectionMysql.query(`
            UPDATE productos_almacen p
            INNER JOIN temp_relacion_unidades t ON p.codigo_producto = t.cod_prod
            SET p.id_unidad = t.cod_uni
        `);

        console.log(`✅ Migración de unidades finalizada.`);
        console.log(`📊 Productos actualizados: ${resultado.affectedRows}`);

    } catch (error) {
        console.error("❌ Error crítico en la migración de unidades:", error);
    } finally {
        await connectionMysql.query('DROP TEMPORARY TABLE IF EXISTS temp_relacion_unidades');
        connectionMysql.release();
    }
}
export {
    MigracionStockAlmacen, MigrarUnidadesAProductos, contardatos, Migraciondeproductos_almacen

}