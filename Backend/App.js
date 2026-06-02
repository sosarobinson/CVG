import express from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { initSocket } from './socket.js';
import rolesRouter from './Routes/roles.js';
import permisosRouter from './Routes/permisos.js';
import mensajesRouter from './Routes/mensajes.js';
import solicitudesRouter from './Routes/Solicitudes.js';
import authRouter from './Routes/auth.js';
import usuariosRouter from './Routes/usuarios.js';
import inventarioRouter from './Routes/inventario.js';
import backupRouter from './Routes/backup.js';
import gerenciasRouter from './Routes/gerencias.js';
import reportesRouter from './Routes/reportes.js';
import migracionRouter from './Routes/migracion.js';
import historyRouter from './Routes/history.js';

// Asegurar directorios necesarios al arranque
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
['backups', 'uploads/restore_tmp'].forEach(dir => {
    const p = path.resolve(__dirname, dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Servir archivos subidos (avatares, pdfs, etc.)


const app = express();
app.use(morgan('dev'));
// Servir archivos subidos (avatares, pdfs, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || `http://localhost:5173`;
// En desarrollo permitimos reflejar el origin para facilitar pruebas desde la LAN (móvil).
// En producción usa FRONTEND_ORIGIN explícito.
const commonMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const commonHeaders = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'];
const corsOptions = process.env.NODE_ENV !== 'production'
    ? {
        origin: (origin, callback) => callback(null, true),
        credentials: true,
        methods: commonMethods,
        allowedHeaders: commonHeaders
    }
    : {
        origin: FRONTEND_ORIGIN,
        credentials: true,
        methods: commonMethods,
        allowedHeaders: commonHeaders
    };
app.use(cors(corsOptions));
// Preflight será manejado automáticamente por el middleware CORS global.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
    name: process.env.SESSION_COOKIE_NAME || 'mi_sid',
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8, sameSite: 'lax' }
});
app.use(sessionMiddleware);
// Mount routers. Routers define full paths (e.g. '/categorias', '/solicitudes', '/mensajes')
app.use('/', mensajesRouter);
app.use('/', solicitudesRouter);
app.use('/', inventarioRouter);
app.use('/', backupRouter);
app.use('/', historyRouter);
app.use('/', gerenciasRouter);
app.use('/', reportesRouter);
app.use('/', migracionRouter);
app.use('/roles', rolesRouter);
app.use('/permisos', permisosRouter);
app.use('/auth', authRouter);
app.use('/', usuariosRouter);

const server = createServer(app);
const io = initSocket(server, corsOptions);

// Share express-session with socket.io (attach to engine if available)
if (io && io.engine && typeof io.engine.use === 'function') {
    io.engine.use((req, res, next) => sessionMiddleware(req, res, next));
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    const networkInterfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const interfaceName in networkInterfaces) {
        for (const iface of networkInterfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIp = iface.address;
            }
        }
    }

    console.log('--------------------------------------------------');
    console.log(`Servidor local:   http://localhost:${PORT}`);
    console.log(`Servidor en red:  http://${localIp}:${PORT}`);
    console.log('--------------------------------------------------');
});
