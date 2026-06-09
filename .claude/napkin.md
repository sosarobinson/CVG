# Napkin Runbook — CVG

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

---

## Execution & Validation (Highest Priority)

1. **[2026-06-02] `conn.query(bigContent)` explota con `max_allowed_packet`**
   El fallback JS en RestoreController manda todo el SQL como un único paquete.
   Do instead: parsear el SQL en statements individuales con `parseSQLStatements()` y ejecutar uno por uno. Nunca usar `multipleStatements: true` + `conn.query(fullFile)`.

2. **[2026-06-02] MySQL CLI (`mysql --version`) falla en Windows aunque MySQL esté instalado**
   El binario no está en PATH aunque el servidor sí corre. El check `shellAvailable` cae en `false` y activa el fallback.
   Do instead: probar paths comunes de Windows (`C:\Program Files\MySQL\...`) antes de marcar CLI como no disponible.

3. **[2026-06-02] Multer sin `limits.fileSize` permite subir archivos ilimitados**
   Un archivo SQL enorme puede agotar la RAM del servidor.
   Do instead: siempre configurar `multer({ limits: { fileSize: 200 * 1024 * 1024 } })` en rutas de restore/upload.

---

## Shell & Command Reliability

1. **[2026-06-02] `exec(cmd)` en Node.js Windows usa `cmd.exe` — redirección `<` funciona**
   Do instead: el pipe `mysql ... < filePath` es válido en Windows con `exec()`.

2. **[2026-06-02] Credenciales hardcodeadas en `ConexionSQL.js` — no hay `.env`**
   Do instead: mover a variables de entorno (`.env` + `dotenv`) en cualquier cambio futuro de auth.

---

## Domain Behavior Guardrails

1. **[2026-06-02] `sanitizarSQL` bloquea `GRANT` como word-boundary — puede fallar con strings que contengan "GRANT" en datos**
   El regex `/\bGRANT\b/i` evalúa todo el contenido sin saltar literales de cadena.
   Do instead: aceptar que es conservador; documentar la limitación. No modificar sin revisión de seguridad.

2. **[2026-06-02] `mysqldump` npm (v3.2.0) no vuelca stored procedures/triggers por defecto**
   Do instead: el parser de statements solo necesita manejar `;` como delimitador para backups de este sistema.

3. **[2026-06-02] `SET SESSION max_allowed_packet` es global-only en MySQL ≥ 8.0.3**
   Do instead: intentar el SET de todas formas (raíz tiene SUPER), ignorar error si falla. La solución real es statement-by-statement.

---

## User Directives

1. **[2026-06-02] El usuario pide fixes definitivos y exhaustivos como equipo de expertos**
   Do instead: analizar toda la cadena (ruta, controlador, conexión, configuración) antes de proponer el fix; no parches superficiales.
