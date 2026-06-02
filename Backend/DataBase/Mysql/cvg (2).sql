-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-04-2026 a las 14:57:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cvg`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `codigo` bigint(20) DEFAULT NULL,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `codigo`, `nombre_categoria`, `descripcion`) VALUES
(9, 102, 'Papelería y Oficina', 'Resmas de papel, bolígrafos, carpetas y consumibles.'),
(10, 7030, 'Limpieza', 'Artículos de aseo y desinfección para oficinas.'),
(11, 4050, 'Tecnología', 'Equipos de computación, periféricos y cables.'),
(12, 3010, 'Mobiliario', 'Sillas, escritorios y estantes.'),
(13, 3011, 'Comestibles', 'Todo aquel que se consume'),
(14, 4533, 'Idrocarburos', 'compuestos orgánicos formados exclusivamente por átomos de carbono e hidrógeno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centro_costo`
--

CREATE TABLE `centro_costo` (
  `id_centro_costo` int(11) NOT NULL,
  `codigo_centro` varchar(100) NOT NULL,
  `id_gerencia` int(11) DEFAULT NULL,
  `presupuesto_asignado` decimal(15,2) DEFAULT 35000.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `centro_costo`
--

INSERT INTO `centro_costo` (`id_centro_costo`, `codigo_centro`, `id_gerencia`, `presupuesto_asignado`) VALUES
(1, '810100', 1, 35000.00),
(2, '811000', 2, 35000.00),
(3, '820100', 3, 35000.00),
(4, '821000', 4, 35000.00),
(5, '821001', 5, 35000.00),
(6, '821002', 6, 35000.00),
(7, '821100', 7, 35000.00),
(8, '821200', 8, 35000.00),
(9, '830100', 9, 35000.00),
(10, '830101', 10, 35000.00),
(11, '831000', 11, 35000.00),
(12, '840100', 12, 35000.00),
(13, '840200', 13, 35000.00),
(14, '840300', 14, 35000.00),
(15, '840400', 15, 35000.00),
(16, '841000', 16, 35000.00),
(17, '841001', 17, 35000.00),
(18, '841002', 18, 35000.00),
(19, '841003', 19, 35000.00),
(20, '910100', 20, 35000.00),
(21, '911000', 21, 35000.00),
(22, '911001', 22, 35000.00),
(23, '911100', 23, 35000.00),
(24, '921000', 24, 35000.00),
(25, '921001', 25, 35000.00),
(26, '921002', 26, 35000.00),
(27, '921003', 27, 35000.00),
(28, '921100', 28, 35000.00),
(29, '921200', 29, 35000.00),
(30, '921300', 30, 35000.00),
(31, '921400', 31, 35000.00),
(32, '921501', 32, 35000.00),
(33, '931000', 33, 35000.00),
(34, '931001', 34, 35000.00),
(35, '931002', 35, 35000.00),
(36, '931003', 36, 35000.00),
(37, '931004', 37, 35000.00),
(38, '931005', 38, 35000.00),
(39, '931006', 39, 35000.00),
(40, '940200', 40, 35000.00),
(41, '940201', 41, 35000.00),
(42, '940202', 42, 35000.00),
(43, '940203', 43, 35000.00),
(44, '940204', 44, 35000.00),
(45, '940300', 45, 35000.00),
(46, '940301', 46, 35000.00),
(47, '940302', 47, 35000.00),
(48, '940303', 48, 35000.00),
(49, '940304', 49, 35000.00),
(50, '940305', 50, 35000.00),
(51, '940306', 51, 35000.00),
(52, '940307', 52, 35000.00),
(53, '940308', 53, 35000.00),
(54, '940309', 54, 35000.00),
(55, '940400', 55, 35000.00),
(56, '940401', 56, 35000.00),
(57, '940402', 57, 35000.00),
(58, '941000', 58, 35000.00),
(59, '941001', 59, 35000.00),
(60, '941002', 60, 35000.00),
(61, '941003', 61, 35000.00),
(62, '941004', 62, 35000.00),
(63, '941005', 63, 35000.00),
(64, '941006', 64, 35000.00),
(65, '941007', 65, 35000.00),
(66, '941008', 66, 35000.00),
(67, '941009', 67, 35000.00),
(68, '941010', 68, 35000.00),
(69, '941011', 69, 35000.00),
(70, '941012', 70, 35000.00),
(71, '941013', 71, 35000.00),
(72, '951000', 72, 35000.00),
(73, '951001', 73, 35000.00),
(74, '951002', 74, 35000.00),
(75, '951003', 75, 35000.00),
(76, '951004', 76, 35000.00),
(77, '951005', 77, 35000.00),
(78, '951006', 78, 35000.00),
(79, '951007', 79, 35000.00),
(80, '951008', 80, 35000.00),
(81, '951009', 81, 35000.00),
(82, '951010', 82, 35000.00),
(83, '951011', 83, 35000.00),
(84, '951012', 84, 35000.00),
(85, '951013', 85, 35000.00),
(86, '961000', 86, 35000.00),
(87, '961001', 87, 35000.00),
(88, '961002', 88, 35000.00),
(89, '961003', 89, 35000.00),
(90, '961004', 90, 35000.00),
(91, '961005', 91, 35000.00),
(92, '961006', 92, 35000.00),
(93, '961007', 93, 35000.00),
(94, '961008', 94, 35000.00),
(95, '961009', 95, 35000.00),
(96, '961010', 96, 35000.00),
(97, '961011', 97, 35000.00),
(98, '961012', 98, 35000.00),
(99, '961013', 99, 35000.00),
(100, '961014', 100, 35000.00),
(101, '971000', 101, 35000.00),
(102, '971001', 102, 35000.00),
(103, '971002', 103, 35000.00),
(104, '971003', 104, 35000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

CREATE TABLE `chats` (
  `id_chat` int(11) NOT NULL,
  `id_solicitud` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` enum('individual','grupal') DEFAULT 'individual'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat_participantes`
--

CREATE TABLE `chat_participantes` (
  `id_chat` int(11) NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_solicitud`
--

CREATE TABLE `detalles_solicitud` (
  `id_detalle` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `id_servicio` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_solicitud`
--

INSERT INTO `detalles_solicitud` (`id_detalle`, `id_solicitud`, `id_producto`, `id_servicio`, `cantidad`) VALUES
(2, 5, 2, NULL, 1),
(3, 7, 2, NULL, 1),
(4, 8, 2, NULL, 1),
(5, 9, 2, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_solicitud`
--

CREATE TABLE `estados_solicitud` (
  `id_estado` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `color_hex` varchar(7) DEFAULT '#64748b',
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_solicitud`
--

INSERT INTO `estados_solicitud` (`id_estado`, `nombre`, `color_hex`, `descripcion`) VALUES
(1, 'Borrador', '#94a3b8', 'Solicitud en preparación por el usuario'),
(2, 'Pendiente', '#f59e0b', 'Esperando revisión inicial'),
(3, 'Aprobado Gerencia', '#10b981', 'Aprobado por el jefe inmediato'),
(4, 'Verificado Almacen', '#3b82f6', 'Almacén confirmó que no hay stock disponible'),
(5, 'En Compras', '#8b5cf6', 'Proceso de procura y licitación activo'),
(6, 'Aprovadas', '#059669', 'Material entregado o servicio ejecutado'),
(7, 'Rechazado', '#ef4444', 'Solicitud no procedente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gerencias`
--

CREATE TABLE `gerencias` (
  `id_gerencia` int(11) NOT NULL,
  `nombre_gerencia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gerencias`
--

INSERT INTO `gerencias` (`id_gerencia`, `nombre_gerencia`) VALUES
(1, 'JUNTA DIRECTIVA'),
(2, 'JUNTA DIRECTIVA'),
(3, 'GERENCIA GENERAL'),
(4, 'GERENCIA GENERAL'),
(5, 'ASEGURAMIENTO DE CALIDAD'),
(6, 'VENTAS'),
(7, 'ASEGURAMIENTO DE CALIDAD'),
(8, 'VENTAS Y LOGISTICA'),
(9, 'RECURSO HUMANO'),
(10, 'SEGURIDAD E HIGIENE DE LA PLANTA'),
(11, 'RECURSOS HUMANOS'),
(12, 'GCIA.ADMINISTRACION Y FINANZAS'),
(13, 'DPTO. DE ADMINISTRACION'),
(14, 'DPTO. DE FINANZAS'),
(15, 'DPTO. DE COMPRA'),
(16, 'GCIA. ADMINISTRACION Y FINANZAS'),
(17, 'DPTO. DE FINANZAS Y CONTABILIDAD'),
(18, 'DPTO. DE COMPRAS'),
(19, 'GASTOS GENERALES ADMINISTRATIVOS'),
(20, 'GERENCIA DE PLANTA'),
(21, 'GERENCIA DE PLANTA'),
(22, 'CONTROLDE CALIDAD'),
(23, 'PCP y LOGISTICA'),
(24, 'PCP Y LOGISTICA'),
(25, 'P.C.P.'),
(26, 'LOGISTICA DE DESPACHO'),
(27, 'LOGISTICA DE RECEPCION'),
(28, 'DPTO. MANTENIMIENTO ELECTRICO'),
(29, 'DPTO. MANTENIMIENTO MECANICO'),
(30, 'MANTENIMIENTO EQUIPO MOVIL'),
(31, 'SERVICIOS GENERALES'),
(32, 'NOMINA ALMACEN'),
(33, 'GERENCIA DE MANTENIMIENTO'),
(34, 'DPTO. DE MANTENIMIENTO'),
(35, 'DPTO. MANTENIMIENTO ELECTRICO'),
(36, 'DPTO. MANTENIMIENTO MECANICO'),
(37, 'MANTENIMIENTO EQUIPO MOVIL'),
(38, 'SERVICIOS GENERALES'),
(39, 'ALMACEN GENERAL'),
(40, 'DPTO. DE PRODUCCIÓN DE ALAMBRON'),
(41, 'HORNO DE RETENCION 1'),
(42, 'HORNO DE RETENCION 2'),
(43, 'LAMINADOR PROPERZI'),
(44, 'NOMINA FASE II'),
(45, 'DPTO. DE PRODUCCIÓN DE CILINDRO'),
(46, 'HORNO DE RETENCION 1'),
(47, 'MESA DE COLADA'),
(48, 'HORNO DE RETENCION 2'),
(49, 'HORNO DE HOMOGENIZACION 1'),
(50, 'ENFRIADOR DE CILINDRO'),
(51, 'SIERRA DE CORTE'),
(52, 'EMBALAJE'),
(53, 'NOMINA FASE III'),
(54, 'HORNO DE HOMOGENIZACION 2'),
(55, 'DEPARTAMENTO DE PRODUCCION'),
(56, 'SUELDOS Y SALARIOS DPTO. PRODUCCION'),
(57, 'GASTOS POR DEPRECIACION DPTO. PRODUCCION'),
(58, 'DPTO. RECUPERACION DE ESCORIA'),
(59, 'DPTO. DE RECUPERACION DE ESCORIA'),
(60, 'MOLINO DE BOLAS'),
(61, 'HORNO ROTATIVO'),
(62, 'MAQUINARIA DE COLADA'),
(63, 'SISTEMA CONTROL DE HUMOS'),
(64, 'HORNO FUNDICION DE 25 TM.'),
(65, 'ESCORIA VANALUM'),
(66, 'ESCORIA FASE II'),
(67, 'ESCORIA FASE III'),
(68, 'PLANCHONES'),
(69, 'DERRAMES'),
(70, 'GASTOS COMUNES FASE I'),
(71, 'NOMINA FASE I'),
(72, 'GERENCIA DE PRODUCCION FASE II'),
(73, 'DPTO. PRODUCCION FASE II'),
(74, 'HORNOS DE FUNDICION'),
(75, 'CANALES/MINTS'),
(76, 'COLADA'),
(77, 'PUENTE/INDUCCION'),
(78, 'MOLINO PROPERZI'),
(79, 'BOBINADORES'),
(80, 'EMBALAJE'),
(81, 'GASTOS COMUNES FASE II'),
(82, 'NOMINA FASE II'),
(83, 'ALUMINIO LIQUIDO'),
(84, 'PAILAS'),
(85, 'ALEANTES'),
(86, 'GERENCIA DE PRODUCCION FASE III'),
(87, 'DPTO. PRODUCCION FASE III'),
(88, 'HORNOS DE RETENCION'),
(89, 'CANALES MINTS'),
(90, 'COLADA'),
(91, 'MESA Y MOLDES DE COLADA'),
(92, 'HORNOS DE HOMOGENEIZADO'),
(93, 'HORNOS DE ENFRIAMIENTO'),
(94, 'SIERRA DE CORTE'),
(95, 'EMBALAJE'),
(96, 'GASTOS COMUNES FASE III'),
(97, 'NOMINA FASE III'),
(98, 'ALUMINIO LIQUIDO'),
(99, 'PAILAS'),
(100, 'ALEANTES'),
(101, 'SERVICIOS GENERALES'),
(102, 'PROTECCION DE PLANTA'),
(103, 'SEGURIDAD E HIGIENE INDUSTRIAL'),
(104, 'TRANSPORTE DE PERSONAL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_estados`
--

CREATE TABLE `historial_estados` (
  `id_historial` int(11) NOT NULL,
  `id_solicitud` int(11) NOT NULL,
  `estado_anterior` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) DEFAULT NULL,
  `fecha_cambio` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_responsable` varchar(100) DEFAULT NULL,
  `comentarios_observacion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_estados`
--

INSERT INTO `historial_estados` (`id_historial`, `id_solicitud`, `estado_anterior`, `estado_nuevo`, `fecha_cambio`, `usuario_responsable`, `comentarios_observacion`) VALUES
(1, 2, 'Aprobado Gerencia', 'En Compras', '2026-04-27 06:28:34', 'Leo17k', 'Verificado por Almacén. Producto en stock.'),
(2, 2, 'En Compras', 'Finalizado', '2026-04-27 06:29:46', 'Leo17k', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_movimientos`
--

CREATE TABLE `inventario_movimientos` (
  `id_movimiento` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `tipo_movimiento` enum('Entrada','Salida','Ajuste') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_movimiento` timestamp NOT NULL DEFAULT current_timestamp(),
  `motivo` varchar(255) DEFAULT NULL,
  `id_solicitud` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id_mensaje` int(11) NOT NULL,
  `id_chat` int(11) NOT NULL,
  `id_emisor` int(10) UNSIGNED NOT NULL,
  `contenido` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id_modulo` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nombre`) VALUES
(2, 'Almacen'),
(6, 'Centro de coste'),
(3, 'Inventario'),
(7, 'Mensajería'),
(10, 'Reportes y Aprobaciones'),
(9, 'Respaldo de Base de Datos'),
(12, 'Roles y Permisos'),
(11, 'Solicitudes'),
(1, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_solicitud` int(11) DEFAULT NULL,
  `contenido` text NOT NULL,
  `status` enum('error','ok','info','advertencia') DEFAULT 'ok',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id_notificacion`, `id_solicitud`, `contenido`, `status`, `fecha`) VALUES
(0, 2, 'Tu solicitud \"123\" ha sido Aprobado.', 'ok', '2026-04-16 01:57:11'),
(0, 2, 'Tu solicitud \"123\" pasó a: Finalizado.', 'ok', '2026-04-27 06:29:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_not_solisitud`
--

CREATE TABLE `notificaciones_not_solisitud` (
  `id_not_soli` int(11) NOT NULL,
  `id_gerencia` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `status` enum('error','ok','info','warning') DEFAULT 'warning',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` int(10) UNSIGNED NOT NULL,
  `id_modulo` int(10) UNSIGNED NOT NULL,
  `accion` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id_permiso`, `id_modulo`, `accion`, `descripcion`) VALUES
(3, 11, 'leer', 'Ver listado de solicitudes'),
(4, 11, 'crear', 'Crear nueva solicitud'),
(5, 11, 'editar', 'Modificar solicitud'),
(6, 11, 'borrar', 'Eliminar solicitud'),
(7, 11, 'auditar', 'Aprobar/Rechazar y ver historial'),
(8, 11, 'pdf', 'Descargar comprobantes'),
(9, 3, 'leer', 'Ver stock disponible'),
(10, 3, 'escribir', 'Agregar o modificar productos'),
(11, 3, 'borrar', 'Eliminar productos'),
(12, 3, 'movimientos', 'Ver historial y ajustar stock'),
(13, 2, 'leer', 'Acceder al almacén'),
(14, 2, 'logistica', 'Gestionar despachos y recepciones'),
(15, 1, 'leer', 'Ver lista de usuarios'),
(16, 1, 'escribir', 'Crear/Editar usuarios'),
(17, 1, 'borrar', 'Eliminar usuarios'),
(18, 1, 'estructurar', 'Gestionar gerencias'),
(19, 12, 'leer', 'Ver roles actuales'),
(20, 12, 'gestionar', 'Crear, editar y asignar permisos'),
(21, 7, 'leer', 'Ver chats activos'),
(22, 7, 'escribir', 'Enviar mensajes'),
(23, 6, 'leer', 'Ver centros de costo'),
(24, 6, 'presupuesto', 'Modificar presupuestos'),
(25, 9, 'leer', 'Ver lista de respaldos'),
(26, 9, 'ejecutar', 'Realizar o restaurar backups'),
(27, 10, 'leer', 'Visualizar estadísticas'),
(28, 10, 'exportar', 'Descargar reportes PDF/Excel'),
(29, 1, 'admin', 'Acceso total (SuperAdmin)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `codigo_producto` varchar(50) NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT 0,
  `stock_actual` int(11) DEFAULT 0,
  `id_unidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `id_gerencia` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo_producto`, `nombre_producto`, `descripcion`, `id_categoria`, `stock_minimo`, `stock_actual`, `id_unidad`, `precio_unitario`, `id_gerencia`, `fecha_creacion`) VALUES
(16, '3010', 'Licencia office', 'Licencia para poder usar todos los servicios de Microsoft Office', 11, 1, 30, NULL, 9.89, 5, '2026-03-30 06:29:49'),
(17, '9087', 'Laptop Dell', 'Dispositivo portátil marca Dell', 11, 1, 5, NULL, 230.00, 1, '2026-03-30 06:29:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_almacen`
--

CREATE TABLE `productos_almacen` (
  `id_producto` int(11) NOT NULL,
  `codigo_producto` varchar(50) NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT 0,
  `stock_actual` int(11) DEFAULT 0,
  `id_unidad` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos_almacen`
--

INSERT INTO `productos_almacen` (`id_producto`, `codigo_producto`, `nombre_producto`, `descripcion`, `id_categoria`, `stock_minimo`, `stock_actual`, `id_unidad`, `fecha_creacion`) VALUES
(1, '3150', 'algo', 'algo', 14, 2, 3, 3, '2026-04-21 13:23:23'),
(2, '1291', 'Dell XPS', 'Diseñadas para alto rendimiento y portabilidad premium (modelos destacados: XPS 13, 14, 16)', 11, 1, 2, 3, '2026-04-21 13:28:11'),
(3, '44', 'Condones', 'Xvideo', 10, 2, 10, NULL, '2026-04-30 02:13:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(11, 'Administrador'),
(9, 'Almacenista'),
(6, 'Cesar'),
(10, 'Comprador'),
(8, 'Gerente'),
(5, 'SuperAdministrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_permisos`
--

CREATE TABLE `rol_permisos` (
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_permisos`
--

INSERT INTO `rol_permisos` (`id_rol`, `id_permiso`) VALUES
(5, 3),
(5, 4),
(5, 5),
(5, 6),
(5, 7),
(5, 8),
(5, 9),
(5, 10),
(5, 11),
(5, 12),
(5, 13),
(5, 14),
(5, 15),
(5, 16),
(5, 17),
(5, 18),
(5, 19),
(5, 20),
(5, 21),
(5, 22),
(5, 23),
(5, 24),
(5, 25),
(5, 26),
(5, 27),
(5, 28),
(5, 29),
(11, 3),
(11, 4),
(11, 5),
(11, 6),
(11, 7),
(11, 8),
(11, 9),
(11, 10),
(11, 11),
(11, 12),
(11, 21),
(11, 22),
(11, 27),
(11, 28);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `codigo_servicio` varchar(50) NOT NULL,
  `nombre_servicio` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `precio_estimado` decimal(10,2) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_compra`
--

CREATE TABLE `solicitudes_compra` (
  `id_solicitud` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_gerencia` int(11) DEFAULT NULL,
  `resumen` varchar(100) NOT NULL,
  `justificacion` text NOT NULL,
  `requerimientos_texto` text DEFAULT NULL,
  `requerimientos_pdf_url` varchar(255) DEFAULT NULL,
  `prioridad` enum('Baja','Media','Alta') DEFAULT 'Media',
  `id_solicitante` int(10) UNSIGNED DEFAULT NULL,
  `tipo_solicitud` enum('Compra','Servicio','Obra') NOT NULL DEFAULT 'Compra',
  `id_estado` int(11) NOT NULL DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_compra`
--

INSERT INTO `solicitudes_compra` (`id_solicitud`, `fecha_creacion`, `id_gerencia`, `resumen`, `justificacion`, `requerimientos_texto`, `requerimientos_pdf_url`, `prioridad`, `id_solicitante`, `tipo_solicitud`, `id_estado`) VALUES
(1, '2026-04-15 03:28:58', 5, 'algo', 'hi', NULL, NULL, 'Media', 1, 'Servicio', 2),
(2, '2026-04-15 03:28:58', 1, '123', '123', NULL, NULL, 'Media', 6, 'Compra', 6),
(3, '2026-04-29 05:15:36', 5, 'xd', 'xd', 'xdf', NULL, 'Media', 1, 'Compra', 2),
(4, '2026-04-29 05:28:06', 5, '12', '12', '12', NULL, 'Media', 1, 'Compra', 2),
(5, '2026-04-29 05:30:56', 5, '12', '12', '12', NULL, 'Media', 1, 'Compra', 2),
(6, '2026-04-30 02:43:31', 5, 'xd', 'sexo uhhh', 'xd', NULL, 'Media', 1, 'Compra', 3),
(7, '2026-04-30 02:45:36', 5, 'xd', 'ss', 'dd', NULL, 'Media', 1, 'Compra', 3),
(8, '2026-04-30 02:46:25', 5, 'xd33', 'ss3', '1222', NULL, 'Media', 1, 'Servicio', 2),
(9, '2026-04-30 02:52:12', 5, 'll', 'samuel terminado.pdf', 'sexo', 'sol_1777517532030.pdf', 'Media', 1, 'Servicio', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_medida`
--

CREATE TABLE `unidades_medida` (
  `id_unidad` int(11) NOT NULL,
  `nombre_unidad` varchar(50) NOT NULL,
  `abreviatura` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidades_medida`
--

INSERT INTO `unidades_medida` (`id_unidad`, `nombre_unidad`, `abreviatura`) VALUES
(1, 'Metro', 'M'),
(2, 'Litros', 'L'),
(3, 'Unidad', 'UND'),
(4, '', 'PQT');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_gerencia` int(11) DEFAULT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'avatar-1.png',
  `sexo` varchar(10) DEFAULT NULL,
  `telf` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `cedula` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `username`, `email`, `password`, `id_rol`, `id_gerencia`, `nombres`, `apellidos`, `avatar`, `sexo`, `telf`, `direccion`, `cedula`) VALUES
(1, 'Leo17k', 'esteysertorres2@gmail.com', '$2a$10$tXpn50VNQ14ktdDOw51cyuWkCbetgjEmV29Kjh03SfzitOqY.ZOzS', 5, 5, 'Cesar Alejandro', 'Torres Nuñez', '608648896_1589026689201868_291608303146887053_n.jpg', 'Masculino', '04128746822', 'Venezuela ,Bolívar ,Ciudad Bolívar, Parroquia La Sabanita, Sector Las Piedritas, Calle Páez, Casa 1456', '30939693'),
(6, 'Kely', 'joanquelis08@gmail.com', '$2a$12$IwOIiAP4mJ2MwDwIlbL5mu5T9CacdQOCAzCzLhBDRP4kIE/BEh.5C', 5, 1, 'Joanquelis Karolina', 'Torres Nuñez', '484539495_1613413199542517_608959181159966383_n.jpg', 'Femenino', '04128746822', 'Venezuela ,Bolívar ,Ciudad Bolívar, Parroquia La Sabanita, Sector Las Piedritas, Calle Páez, Casa 1456', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `unq_codigo_categoria` (`codigo`);

--
-- Indices de la tabla `centro_costo`
--
ALTER TABLE `centro_costo`
  ADD PRIMARY KEY (`id_centro_costo`),
  ADD KEY `id_gerencia` (`id_gerencia`);

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `fk_chat_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `chat_participantes`
--
ALTER TABLE `chat_participantes`
  ADD PRIMARY KEY (`id_chat`,`id_usuario`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `detalles_solicitud`
--
ALTER TABLE `detalles_solicitud`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_solicitud` (`id_solicitud`),
  ADD KEY `fk_detalle_servicio` (`id_servicio`),
  ADD KEY `fk_detalle_producto` (`id_producto`);

--
-- Indices de la tabla `estados_solicitud`
--
ALTER TABLE `estados_solicitud`
  ADD PRIMARY KEY (`id_estado`),
  ADD UNIQUE KEY `unq_nombre_estado` (`nombre`);

--
-- Indices de la tabla `gerencias`
--
ALTER TABLE `gerencias`
  ADD PRIMARY KEY (`id_gerencia`);

--
-- Indices de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `inventario_movimientos`
--
ALTER TABLE `inventario_movimientos`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `fk_inv_producto` (`id_producto`),
  ADD KEY `fk_inv_usuario` (`id_usuario`),
  ADD KEY `fk_inv_solicitud` (`id_solicitud`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `id_chat` (`id_chat`),
  ADD KEY `id_emisor` (`id_emisor`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id_modulo`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD KEY `notificacion-solit` (`id_solicitud`);

--
-- Indices de la tabla `notificaciones_not_solisitud`
--
ALTER TABLE `notificaciones_not_solisitud`
  ADD PRIMARY KEY (`id_not_soli`),
  ADD KEY `fk_not_soli_gerencia` (`id_gerencia`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`),
  ADD UNIQUE KEY `unq_modulo_accion` (`id_modulo`,`accion`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo_producto` (`codigo_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_gerencia` (`id_gerencia`),
  ADD KEY `fk_unidad_medida` (`id_unidad`);

--
-- Indices de la tabla `productos_almacen`
--
ALTER TABLE `productos_almacen`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo_producto` (`codigo_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `fk_unidad_medida` (`id_unidad`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD PRIMARY KEY (`id_rol`,`id_permiso`),
  ADD KEY `fk_rol_permisos_permiso` (`id_permiso`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD UNIQUE KEY `codigo_servicio` (`codigo_servicio`),
  ADD KEY `fk_servicio_categoria` (`id_categoria`);

--
-- Indices de la tabla `solicitudes_compra`
--
ALTER TABLE `solicitudes_compra`
  ADD PRIMARY KEY (`id_solicitud`),
  ADD KEY `fk_gerencia` (`id_gerencia`),
  ADD KEY `fk_usuario_solicitante` (`id_solicitante`),
  ADD KEY `fk_solicitud_estado` (`id_estado`);

--
-- Indices de la tabla `unidades_medida`
--
ALTER TABLE `unidades_medida`
  ADD PRIMARY KEY (`id_unidad`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `nombre_usuario` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_id_rol` (`id_rol`),
  ADD KEY `fk_usuario_gerencia` (`id_gerencia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `centro_costo`
--
ALTER TABLE `centro_costo`
  MODIFY `id_centro_costo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalles_solicitud`
--
ALTER TABLE `detalles_solicitud`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estados_solicitud`
--
ALTER TABLE `estados_solicitud`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `gerencias`
--
ALTER TABLE `gerencias`
  MODIFY `id_gerencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT de la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario_movimientos`
--
ALTER TABLE `inventario_movimientos`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `notificaciones_not_solisitud`
--
ALTER TABLE `notificaciones_not_solisitud`
  MODIFY `id_not_soli` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `productos_almacen`
--
ALTER TABLE `productos_almacen`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudes_compra`
--
ALTER TABLE `solicitudes_compra`
  MODIFY `id_solicitud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `unidades_medida`
--
ALTER TABLE `unidades_medida`
  MODIFY `id_unidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `centro_costo`
--
ALTER TABLE `centro_costo`
  ADD CONSTRAINT `centro_costo_ibfk_1` FOREIGN KEY (`id_gerencia`) REFERENCES `gerencias` (`id_gerencia`);

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `fk_chat_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_compra` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `chat_participantes`
--
ALTER TABLE `chat_participantes`
  ADD CONSTRAINT `chat_participantes_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `chats` (`id_chat`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_participantes_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalles_solicitud`
--
ALTER TABLE `detalles_solicitud`
  ADD CONSTRAINT `detalles_solicitud_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_compra` (`id_solicitud`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos_almacen` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detalle_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`);

--
-- Filtros para la tabla `historial_estados`
--
ALTER TABLE `historial_estados`
  ADD CONSTRAINT `historial_estados_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_compra` (`id_solicitud`);

--
-- Filtros para la tabla `inventario_movimientos`
--
ALTER TABLE `inventario_movimientos`
  ADD CONSTRAINT `fk_inv_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inv_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_compra` (`id_solicitud`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inv_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `chats` (`id_chat`) ON DELETE CASCADE,
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_emisor`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificacion-solit` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_compra` (`id_solicitud`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones_not_solisitud`
--
ALTER TABLE `notificaciones_not_solisitud`
  ADD CONSTRAINT `fk_not_soli_gerencia` FOREIGN KEY (`id_gerencia`) REFERENCES `gerencias` (`id_gerencia`) ON DELETE CASCADE;

--
-- Filtros para la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_unidad_medida` FOREIGN KEY (`id_unidad`) REFERENCES `unidades_medida` (`id_unidad`),
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_gerencia`) REFERENCES `gerencias` (`id_gerencia`);

--
-- Filtros para la tabla `productos_almacen`
--
ALTER TABLE `productos_almacen`
  ADD CONSTRAINT `fk_unidad_medida_almacen` FOREIGN KEY (`id_unidad`) REFERENCES `unidades_medida` (`id_unidad`),
  ADD CONSTRAINT `productoalmacens_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`);

--
-- Filtros para la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD CONSTRAINT `fk_rol_permisos_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rol_permisos_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `fk_servicio_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`);

--
-- Filtros para la tabla `solicitudes_compra`
--
ALTER TABLE `solicitudes_compra`
  ADD CONSTRAINT `fk_gerencia` FOREIGN KEY (`id_gerencia`) REFERENCES `gerencias` (`id_gerencia`),
  ADD CONSTRAINT `fk_solicitud_estado` FOREIGN KEY (`id_estado`) REFERENCES `estados_solicitud` (`id_estado`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_solicitante` FOREIGN KEY (`id_solicitante`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_gerencia` FOREIGN KEY (`id_gerencia`) REFERENCES `gerencias` (`id_gerencia`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
