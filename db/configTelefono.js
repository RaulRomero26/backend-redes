/* 
    Este archivo se encarga de realizar la conexion a la base de datos de telefonos
    MongoDB 
*/
//se importa mongoose
const mongoose = require("mongoose");
/*
    En esta funcion se reliza la conexion utilizando la variable de entorno de conexion hacia mongodb
    su unica funcion es exportar la conexion para poder ser usada en el servidor, asi como el manejo de posibles
    errores en el caso de que la conexion no haya sido exitosa
*/
const dbConectionTelefono = async () =>{
    console.log(process.env.MONGODB_CNN)
    try {
        
        await mongoose.connect(process.env.MONGODB_CNN,{
            dbName: 'BASES_INTELIGENCIA',
        });
        console.log('BASES_INTELIGENCIA base de datos online');
    
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}
//se exporta la funcion para poderla usar en el exterior
module.exports = {
    dbConectionTelefono
}