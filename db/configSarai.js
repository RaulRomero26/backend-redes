//se require la biblioteca para hacer el manejo de las conexiones a la base de datos sql
const mysql = require('mysql2');

/* 
    La biblioteca msql2 nos permite crear una alberca o pool de multiples conexiones, con el objetivo de que cada una de ellas tenga un tiempo de vida, 
    es decir se crean con esta configuracion 50 lineas de comunicacion, cuando se realiza una peticion al servidor se usa una de esas lineas
    despues de un tiempo la linea se encuentra inactiva esta se libera 
*/

const saraiPool = mysql.createPool({
    host: process.env.DBHOSTSARAI,
    user: process.env.DBUSERSARAI,
    password: process.env.DBPASSWORDSARAI,
    database: process.env.DBDATABASESARAI,
    waitForConnections: true,
    connectionLimit: 50,
    maxIdle: 50, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000 5 min
    queueLimit: 0
})
// con el pool de conexiones creado, se convierte a un promise pool para poder usar funciones asyncronas
const saraiPromisePool = saraiPool.promise();

//lo que se expone es el promise pool y es el que se llamara siempre que se requiera una conexion a la base de datos
module.exports = {
    saraiPromisePool
}