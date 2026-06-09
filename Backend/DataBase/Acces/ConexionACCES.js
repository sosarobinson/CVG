import ADODB from 'node-adodb'
import picocolors from 'picocolors';
import fs from 'fs';
import path from 'path';

const { red, green, bold, yellow, blueBright } = picocolors;

// 1. Conexión existente para Almacén (Repuestos)
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:/acces/Almacen.mdb;');
const connectionCompras = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:/acces/Compras.mdb;');

async function statusconnection() {
    let statusconnection = false
    try {
        const data = await connection.query('SELECT * FROM tiporepuesto');
        statusconnection = true
        console.log(green('Conexion exitosa ACCES'));
    } catch (error) {
        console.error(red('Error al conectar a ACCES'), error && error.message ? `(${error.message})` : '');
    }
    return statusconnection
}

async function statusconnectionCompras() {
    let statusconnection = false
    try {
        const data = await connectionCompras.query('SELECT * FROM REQCOMPRA');
        statusconnection = true
        console.log(green('Conexion exitosa ACCES'));
    } catch (error) {
        console.error(red('Error al conectar a ACCES'), error && error.message ? `(${error.message})` : '');
    }
    return statusconnection
}






statusconnection();
statusconnectionCompras();
export { connection, statusconnection, connectionCompras, statusconnectionCompras };