import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as SolicitudesController from '../Controllers/SolicitudesController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storagePDF = multer.diskStorage({
	destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'solicitudes')),
	filename: (req, file, cb) => cb(null, `sol_${Date.now()}${path.extname(file.originalname)}`)
});
const uploadPDF = multer({ storage: storagePDF, limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

router.get('/solicitudes', SolicitudesController.getSolicitudes);
router.get('/solicitudes/almacen', SolicitudesController.getSolicitudesAlmacen);
router.get('/solicitudes/compras', SolicitudesController.getSolicitudesCompras);
router.get('/solicitudes/:id', SolicitudesController.getSolicitudById);

router.get('/solicitudes/:id/participants', SolicitudesController.getParticipants);
router.get('/solicitudes/:id/mensajes', SolicitudesController.getMensajesBySolicitud);
router.post('/solicitudes/:id/mensaje', uploadPDF.none(), SolicitudesController.postMensajeSolicitud);

router.get('/solicitudes/stats/gerencia', SolicitudesController.getStatsGerencia);

router.post('/crearsolicitud', uploadPDF.fields([
	{ name: 'justificacion_pdf', maxCount: 1 },
	{ name: 'requerimientos_pdf', maxCount: 1 }
]), SolicitudesController.createSolicitud);
router.put('/solicitudes/:id/estado', SolicitudesController.updateEstado);
router.put('/solicitudes/:id', uploadPDF.fields([
	{ name: 'justificacion_pdf', maxCount: 1 },
	{ name: 'requerimientos_pdf', maxCount: 1 }
]), SolicitudesController.updateSolicitud);
router.put('/solicitudes/:id/verificar', SolicitudesController.verificarSolicitud);

// Solicitudes de creación de producto
router.get('/solicitudes-producto', SolicitudesController.getSolicitudesProducto);
router.post('/solicitudes-producto', SolicitudesController.createSolicitudProducto);
router.post('/solicitudes-producto/:id/codificar', SolicitudesController.codificarSolicitudProducto);

export default router;
