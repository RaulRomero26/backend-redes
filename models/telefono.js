const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

// Crear una conexión para BASES_INTELIGENCIA utilizando MONGODB_CNN
const connectionBasesInteligencia = mongoose.createConnection("mongodb://admininteligencia:%23inteligenciaroot2024@172.18.110.90:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'BASES_INTELIGENCIA'
});

// Define esquema y modelo para BASES_INTELIGENCIA
const telefonoSchemaContactos = Schema({
    "FOLIO REGISTRO": String,
    "FECHA DEL REGISTRO": String,
    "MOTIVO DEL DELITO Y/O SEGUIMIENTO": String,
    FUENTE: String,
    "NOMBRE/USUARIO": String,
    NUMEROTELEFONICO: String, 
    "NOMBRE DE LA RELACION Y/O PARENTEZCO": String,
    "NUMERO TELEFÓNICO": String,
    
});

// Define esquema y modelo para BASES_INTELIGENCIA
const telefonoSchemaSSC = new Schema({
    Telefono: String,
    Adicional: String,
    ApellidoM: String,
    ApellidoP: String,
    "Cls Desc": String,
    Colonia: String,
    "Color": String,
    Comentarios: String,
    Corporacoion: String,
    DESP: String,
    Despachador: String,
    Div: String,
    Estado: String,
    Fecha: String,
    Folio: String,
    "Folio Externo": String,
    Latitud: String,
    LIB: String,
    LLEG: String,
    "Loc Info": String,
    Longitud: String,
    "Make Desc": String,
    Model: String,
    Municipio: String,
    "Nom completo": String,
    Nombre: String,
    Operador: String,
    Origen: String,
    Placa: String,
    RCBD: String,
    T1: String,
    T2: String,
    T3: String,
    T4: String,
    Tipo: String,
    TR: String,
    Unidad: String,
    Vyr: String,
    Zona: String,
    Ubicacion: String
    // ... otros campos
});

// Crea los modelos
const TelefonoContactos = connectionBasesInteligencia.model('TelefonoContactos', telefonoSchemaContactos, 'Contactos');
const TelefonoSSC = connectionBasesInteligencia.model('TelefonoSSC', telefonoSchemaSSC, 'SSC_TEL');

// Exporta los modelos por separado
module.exports = {
    TelefonoContactos,
    TelefonoSSC
};
