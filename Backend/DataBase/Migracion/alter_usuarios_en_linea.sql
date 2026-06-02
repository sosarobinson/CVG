-- Agrega columnas para marcar usuario en línea y última conexión
ALTER TABLE `usuarios`
ADD COLUMN `en_linea` BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN `ultima_conexion` TIMESTAMP NULL DEFAULT NULL;
