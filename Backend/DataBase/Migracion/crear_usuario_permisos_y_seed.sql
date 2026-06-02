-- Migration: crear tabla usuario_permisos, insertar permisos faltantes y asignarlos a SuperAdministrador (id_rol = 5)

CREATE TABLE IF NOT EXISTS `usuario_permisos` (
  `id_usuario` int(10) unsigned NOT NULL,
  `id_permiso` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_permiso`),
  KEY `fk_usuario_permisos_permiso` (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar permisos necesarios (se usa ON DUPLICATE KEY para no duplicar)
INSERT INTO permisos (id_modulo, accion, descripcion) VALUES
(1, 'ver_roles', 'Ver lista de roles'),
(1, 'crear_roles', 'Crear roles'),
(1, 'editar_roles', 'Editar roles'),
(1, 'eliminar_roles', 'Eliminar roles'),
(1, 'asignar_permisos', 'Asignar permisos a roles y usuarios'),
(1, 'ver_permisos', 'Ver permisos disponibles'),
(2, 'crear_categorias', 'Crear categorias de inventario'),
(2, 'crear_productos', 'Crear productos en almacen'),
(2, 'crear_movimientos', 'Crear movimientos de inventario')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

-- Asignar esos permisos al rol SuperAdministrador (id_rol = 5)
INSERT IGNORE INTO rol_permisos (id_rol, id_permiso)
SELECT 5, p.id_permiso FROM permisos p
WHERE p.accion IN (
  'ver_roles','crear_roles','editar_roles','eliminar_roles','asignar_permisos','ver_permisos',
  'crear_categorias','crear_productos','crear_movimientos'
);

-- Opcional: asignar permisos directamente al usuario 1 (superadmin) si lo prefieres
-- INSERT IGNORE INTO usuario_permisos (id_usuario, id_permiso)
-- SELECT 1, p.id_permiso FROM permisos p
-- WHERE p.accion IN ('ver_roles','crear_roles','editar_roles','eliminar_roles','asignar_permisos','ver_permisos');
