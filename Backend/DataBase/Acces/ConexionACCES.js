import ADODB from 'node-adodb'
import picocolors from 'picocolors';

const { red, green, bold, yellow, blueBright } = picocolors;


const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:/acces/Almacen.mdb;');

async function statusconnection() {
    let statusconnection = false
    try {
        const data = await connection.query('SELECT * FROM tiporepuesto');
        statusconnection = true
        console.log(green('Conexion exitosa ACCES'));
    } catch (error) {
        console.error(red('Error al conectar a ACCES'));
    }
    return statusconnection
}


export { connection, statusconnection };