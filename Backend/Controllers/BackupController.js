/**
 * BackupController.js — Versión portable sin dependencias de sistema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Importamos la librería de npm
import mysqldump from 'mysqldump';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUPS_DIR = path.resolve(__dirname, '..', 'backups');
const DB_NAME = process.env.DB_NAME || 'cvg';
const DB_USER = process.env.DB_USER || 'root';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PASS = process.env.DB_PASS || '';

const esAdmin = (req) => {
  if (!req.session?.isLoggedIn) return false;
  const idRol = Number(req.session.rol);
  return idRol === 5 || idRol === 11;
};

const ensureDir = () => {
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
};

// GET /api/backup/list
export const listBackups = (req, res) => {
  // Usamos tu middleware de protección de roles
  if (!esAdmin(req)) return res.status(403).json({ error: 'No autorizado.' });

  ensureDir();

  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.endsWith('.sql'))
      .map(f => {
        const stats = fs.statSync(path.join(BACKUPS_DIR, f));
        return {
          name: f,
          size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
          date: stats.mtime
        };
      })
      // Ordenar de más reciente a más antiguo
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({ ok: true, backups: files });
  } catch (err) {
    console.error('[BackupController] Error listando:', err.message);
    return res.status(500).json({ error: 'No se pudieron leer los puntos de restauración.' });
  }
};
// GET /api/backup/export?destino=server|download
export const exportBackup = async (req, res) => {
  if (!esAdmin(req)) return res.status(403).json({ error: 'No autorizado.' });

  const destino = (req.query.destino || 'server').toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `CVG_Backup_${timestamp}.sql`;

  ensureDir();
  const filePath = path.join(BACKUPS_DIR, fileName);

  try {
    // Ejecutamos el volcado usando la librería de JS de forma asíncrona
    await mysqldump({
      connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
      },
      dumpToFile: filePath,
    });

    // Manejo de respuesta de destino (igual que antes)
    if (destino === 'download') {
      return res.download(filePath, `Seguridad_CVG_${timestamp}.sql`, (err) => {
        if (err) {
          console.error('[BackupController] Error descarga:', err.message);
        } else {
          // Opcional: Elimina el archivo tras enviarlo si solo querían descargarlo
          try { fs.unlinkSync(filePath); } catch (e) { }
        }
      });
    }

    const stats = fs.statSync(filePath);
    return res.status(200).json({
      ok: true,
      message: `Backup guardado en servidor: ${fileName}`,
      file: { name: fileName, size: (stats.size / 1024).toFixed(1) + ' KB' },
    });

  } catch (err) {
    console.error('[BackupController] Error en volcado JS:', err.message);
    return res.status(500).json({ error: 'No se pudo generar el backup portable.', detail: err.message });
  }
};

