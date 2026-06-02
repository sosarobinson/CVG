-- Agrega la columna id_respuesta para poder referenciar mensajes respuesta
ALTER TABLE `mensajes`
  ADD COLUMN `id_respuesta` INT(11) NULL DEFAULT NULL AFTER `contenido`;

-- Índice para consultas por respuesta
CREATE INDEX `idx_mensajes_id_respuesta` ON `mensajes` (`id_respuesta`);
