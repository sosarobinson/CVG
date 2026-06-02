/**
 * RestoreController.js
 * Restauración de base de datos con sanitizador SQL ultra-estricto.
 *
 * SANITIZADOR: bloquea DROP DATABASE, ALTER USER, GRANT, SHUTDOWN
 *              y detecta comillas mal balanceadas antes de ejecutar.
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const BACKUPS_DIR = path.resolve(__dirname, '..', 'backups');
const DB_NAME     = process.env.DB_NAME || 'cvg';
const DB_USER     = process.env.DB_USER || 'root';
const DB_HOST     = process.env.DB_HOST || 'localhost';
const DB_PASS     = process.env.DB_PASS || '';

// req.session.rol = id_rol numérico: 5=SuperAdministrador, 11=Administrador
const esAdmin = (req) => {
  if (!req.session?.isLoggedIn) return false;
  const idRol = Number(req.session.rol);
  return idRol === 5 || idRol === 11;
};

const execAsync = (cmd) =>
  new Promise((resolve, reject) =>
    exec(cmd, (err, stdout, stderr) => (err ? reject(err) : resolve({ stdout, stderr })))
  );

// ═══════════════════════════════════════════════════════════════════════════
// SANITIZADOR SQL — bloque crítico de seguridad
// ═══════════════════════════════════════════════════════════════════════════
const PATRONES_PROHIBIDOS = [
  /DROP\s+DATABASE/i,
  /ALTER\s+USER/i,
  /\bGRANT\b/i,
  /\bSHUTDOWN\b/i,
  /REVOKE\s+/i,
  /DROP\s+USER/i,
  /CREATE\s+USER/i,
  /FLUSH\s+PRIVILEGES/i,
];

/**
 * sanitizarSQL — Analiza el contenido de un archivo .sql y lanza
 * una excepción controlada si detecta comandos peligrosos o
 * comillas mal balanceadas.
 *
 * @param {string} contenido - Texto completo del archivo SQL.
 * @throws {Error} Si detecta patrones prohibidos o comillas desbalanceadas.
 */
export const sanitizarSQL = (contenido) => {
  // 1. Verificar patrones de comandos destructivos/privilegiados
  for (const patron of PATRONES_PROHIBIDOS) {
    if (patron.test(contenido)) {
      throw new Error(
        `[SANITIZADOR] Comando SQL peligroso detectado: "${patron.source}". Restauración bloqueada.`
      );
    }
  }

  // 2. Verificar balance de comillas simples (ignorando escapes \')
  //    Elimina secuencias escapadas y luego cuenta comillas simples sueltas.
  const sinEscapes    = contenido.replace(/\\'/g, '').replace(/\\\"/g, '');
  const comillasSimples = (sinEscapes.match(/'/g) || []).length;
  const comillasDobles  = (sinEscapes.match(/"/g) || []).length;

  if (comillasSimples % 2 !== 0) {
    throw new Error(
      '[SANITIZADOR] Comillas simples desbalanceadas en el SQL. Restauración bloqueada por seguridad.'
    );
  }
  if (comillasDobles % 2 !== 0) {
    throw new Error(
      '[SANITIZADOR] Comillas dobles desbalanceadas en el SQL. Restauración bloqueada por seguridad.'
    );
  }

  // SQL aprobado ✓
  return true;
};

// ─── POST /api/restore/upload ─────────────────────────────────────────────
/**
 * Restaura a partir de un archivo .sql subido por el usuario (multipart).
 */
export const restoreFromUpload = async (req, res) => {
  if (!esAdmin(req)) return res.status(403).json({ error: 'No autorizado.' });
  if (!req.file)           return res.status(400).json({ error: 'No se recibió ningún archivo .sql.' });

  const filePath = req.file.path;

  try {
    const contenido = fs.readFileSync(filePath, 'utf-8');

    // ── Sanitización antes de cualquier ejecución ──────────────────────────
    sanitizarSQL(contenido); // Lanza excepción si hay comandos prohibidos
    // Intentar usar el cliente `mysql` del sistema si está disponible
    let shellAvailable = true;
    try {
      await execAsync('mysql --version');
    } catch (err) {
      shellAvailable = false;
    }

    if (shellAvailable) {
      const passFlag = DB_PASS ? `-p"${DB_PASS}"` : '';
      const cmd      = `mysql -u ${DB_USER} ${passFlag} -h ${DB_HOST} ${DB_NAME} < "${filePath}"`;
      await execAsync(cmd);
      return res.status(200).json({ ok: true, message: 'Base de datos restaurada exitosamente desde el archivo subido.' });
    }

    // Fallback: ejecutar las sentencias SQL usando el driver JS (mysql2)
    try {
      const conn = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        multipleStatements: true,
        charset: 'utf8mb4'
      });
      await conn.query(contenido);
      await conn.end();
      return res.status(200).json({ ok: true, message: 'Base de datos restaurada exitosamente (fallback JS).' });
    } catch (err) {
      throw new Error(`Fallback JS falló: ${err.message}`);
    }
  } catch (err) {
    return res.status(400).json({ ok: false, message: err.message });
  } finally {
    // Eliminar archivo temporal siempre
    fs.unlink(filePath, () => {});
  }
};

// ─── POST /api/restore/server ─────────────────────────────────────────────
/**
 * Restaura a partir de un punto de control guardado en el servidor.
 * Body: { fileName: 'CVG_Backup_2026-05-27.sql' }
 */
export const restoreFromServer = async (req, res) => {
  if (!esAdmin(req)) return res.status(403).json({ error: 'No autorizado.' });

  const { fileName } = req.body;
  if (!fileName) return res.status(400).json({ error: 'Debes indicar el nombre del archivo.' });

  // Sanitizar el nombre del archivo para evitar path traversal
  const safeName = path.basename(fileName);
  const filePath = path.join(BACKUPS_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Archivo no encontrado en el servidor: ${safeName}` });
  }

  try {
    const contenido = fs.readFileSync(filePath, 'utf-8');

    // ── Sanitización antes de cualquier ejecución ──────────────────────────
    sanitizarSQL(contenido);

    // Intentar usar el cliente `mysql` del sistema si está disponible
    let shellAvailable = true;
    try {
      await execAsync('mysql --version');
    } catch (err) {
      shellAvailable = false;
    }

    if (shellAvailable) {
      const passFlag = DB_PASS ? `-p"${DB_PASS}"` : '';
      const cmd      = `mysql -u ${DB_USER} ${passFlag} -h ${DB_HOST} ${DB_NAME} < "${filePath}"`;
      await execAsync(cmd);
      return res.status(200).json({ ok: true, message: `Base de datos restaurada desde el punto de control: ${safeName}` });
    }

    // Fallback: ejecutar por partes usando el driver JS (mysql2)
    try {
      const conn = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        multipleStatements: true,
        charset: 'utf8mb4'
      });
      await conn.query(contenido);
      await conn.end();
      return res.status(200).json({ ok: true, message: `Base de datos restaurada desde el punto de control: ${safeName} (fallback JS).` });
    } catch (err) {
      throw new Error(`Fallback JS falló: ${err.message}`);
    }
  } catch (err) {
    return res.status(400).json({ ok: false, message: err.message });
  }
};
