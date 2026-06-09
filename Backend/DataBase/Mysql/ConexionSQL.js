import mysql from "mysql2/promise";
import picocolors from "picocolors";

const { red, green, bold, yellow, blueBright } = picocolors;
export let statusconnectionsql = false
const conexionDATA = {
  host: 'localhost',
  user: 'root',
  database: 'cvg-p',
  password: '',
  supportBigNumbers: true,
  bigNumberStrings: false,
  multipleStatements: true

}

const pool = mysql.createPool(conexionDATA)

try {
  const connection = await pool.getConnection();
  connection.release();
  statusconnectionsql = true
  console.log(green("Conexión a la base de datos exitosa."));
}
catch (err) {
  console.error(red("Error al conectar a la base de datos:", err.message));
}


export default pool;