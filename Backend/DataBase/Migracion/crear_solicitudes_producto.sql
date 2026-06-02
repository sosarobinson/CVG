-- ============================================================
-- Tabla: solicitudes_creacion_producto
-- Propósito: registrar solicitudes de creación de productos
--            enviadas desde el dashboard al módulo de Almacén.
-- ============================================================
CREATE TABLE IF NOT EXISTS solicitudes_creacion_producto (
    id_sol_prod         INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto     VARCHAR(255)     NOT NULL,
    descripcion         TEXT,
    cantidad_requerida  INT              NOT NULL DEFAULT 1,
    id_categoria        INT,
    id_solicitante      INT              NOT NULL,
    estado              ENUM('Pendiente','Aprobado','Rechazado') NOT NULL DEFAULT 'Pendiente',
    fecha_creacion      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_solprod_categoria
        FOREIGN KEY (id_categoria)  REFERENCES categorias(id_categoria)  ON DELETE SET NULL,
    CONSTRAINT fk_solprod_solicitante
        FOREIGN KEY (id_solicitante) REFERENCES usuarios(id_usuario)     ON DELETE CASCADE
);

-- Índices para las consultas más frecuentes
CREATE INDEX IF NOT EXISTS idx_solprod_estado
    ON solicitudes_creacion_producto (estado);
CREATE INDEX IF NOT EXISTS idx_solprod_solicitante
    ON solicitudes_creacion_producto (id_solicitante);
