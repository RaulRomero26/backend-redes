/* 
    Modelo que se encarga de manejar todas las peticiones del backend de las notificaciones
*/
// Se importan el response y el request de express para tener el tipado
const { response, request } = require('express');
const { saraiPromisePool } = require('../db/configSarai');
const { TelefonoContactos, TelefonoSSC } = require('../models/telefono');

const RemisionesByName = async(req = request, res = response) => {
    console.log('entro a la funcion remisiones by name');
    const {label, tipo} = req.body;

    let coincidencias = [];

        coincidencias = await saraiPromisePool.query(`
            SELECT * 
            FROM argos_detenido_datos_personales
            WHERE 
            replace_special_chars(UCASE(CONCAT_WS(' ', Nombre, Ap_Paterno, Ap_Materno))) = replace_special_chars(UCASE(CONCAT_WS(' ', '${label}')))
            `);
        
    console.log(coincidencias[0]);
    res.json({
        ok: true,
        msg: 'Remisiones encontradas',
        data: {
            remisiones: coincidencias[0]
        }
    });


}

const HistoricoByName = async(req = request, res = response) => {
    console.log('entro a la funcion');
    console.log(req.body);
    const {label, tipo} = req.body;


    let coincidencias = await saraiPromisePool.query(`
        SELECT * 
        FROM historico 
        WHERE 
        replace_special_chars(UCASE(CONCAT_WS(' ', Nombre_d, Ap_paterno_d, Ap_materno_d))) = replace_special_chars(UCASE(CONCAT_WS(' ', '${label}')))
        `);
    
    res.json({
        ok: true,
        msg: 'Remisiones encontradas',
        data: {
            historico: coincidencias[0]
        }
    });


}


const InspeccionByName = async(req = request, res = response) => {
    console.log('entro a la funcion');
    console.log(req.body);
    const {label} = req.body;


    let coincidencias = await saraiPromisePool.query(`
        SELECT ubicacion.*, argos_inspeccion_persona.*
        FROM argos_inspeccion_persona 
        LEFT JOIN ubicacion ON argos_inspeccion_persona.Id_Ubicacion = ubicacion.Id_Ubicacion
        WHERE 
        replace_special_chars(UCASE(CONCAT_WS(' ', Nombre, Ap_Paterno, Ap_Materno))) = replace_special_chars(UCASE(CONCAT_WS(' ', '${label}')))
        `);
    
    res.json({
        ok: true,
        msg: 'Inspecciones encontradas',
        data: {
            inspeccion: coincidencias[0]
        }
    });


}

const VehiculoByInspeccion = async(req = request, res = response) => { 
    console.log('entro a la funcion');
    console.log(req.body);
    const {inspeccion} = req.body;

    let coincidencias = await saraiPromisePool.query(`
        SELECT *
        FROM vehiculo_inspeccion
        WHERE 
        Id_Inspeccion = ${inspeccion}
        `);

    res.json({
        ok: true,
        msg: 'Vehiculos inspeccion encontrados',
        data: {
            vehiculos: coincidencias[0]
        }
    });

}

const TelefonoByRemision = async(req = request, res = response) => {
    console.log(req.body);
    const {label} = req.body;

    let coincidencias = await saraiPromisePool.query(`
        SELECT No_Remision,Telefono
        FROM detenido 
        WHERE 
        No_Remision = ${label}
        `);
    
    res.json({
        ok: true,
        msg: 'Remisiones encontradas',
        data: {
            remisiones: coincidencias[0]
        }
    });
}

const ContactoByRemision = async(req = request, res = response) => {
    console.log(req.body);
    const {remision_primaria} = req.body;

    let coincidencias = await saraiPromisePool.query(`
        SELECT Id_Contacto,No_Remision,replace_special_chars(Nombre) as Nombre,
        replace_special_chars(Ap_Paterno) as Ap_Paterno,
        replace_special_chars(Ap_Materno) as Ap_Materno,
        Telefono,Parentesco,Edad,Genero
        FROM contacto_detenido 
        WHERE 
        No_Remision = ${remision_primaria}
        `);
    
    res.json({
        ok: true,
        msg: 'Remisiones encontradas',
        data: {
            contactos: coincidencias[0]
        }
    });
}

const DetenidoCon = async(req = request, res = response) => {
    console.log(req.body);
    const {ficha,remision_primaria} = req.body;

    let coincidencias = await saraiPromisePool.query(`
        SELECT *
        FROM argos_detenido_datos_personales
        WHERE 
        Ficha = ${ficha}
        AND No_Remision != ${remision_primaria}
        `);
    
    res.json({
        ok: true,
        msg: 'Remisiones encontradas',
        data: {
            remisiones: coincidencias[0]
        }
    });
}

const BuscarTelefono = async(req = request, res = response) => {
    console.log(req.body);
    const { label } = req.body;

    let coincidencias = await TelefonoSSC.find({ Telefono: label }).lean();
    
    res.json({
        ok: true,
        msg: 'Telefonos encontrados',
        data: {
            telefonos: coincidencias
        }
    });
}

const RemisionesByTelefono = async(req = request, res = response) => {  
    console.log(req.body);
    const {label} = req.body;

    let coincidencias = await saraiPromisePool.query(`
        SELECT *
        FROM argos_detenido_datos_personales 
        WHERE 
        Telefono = ${label}
        `);
    
    res.json({
        ok: true,
        msg: 'Remisiones encontradas',
        data: {
            remisiones: coincidencias[0]
        }
    });
}

const BuscarVehiculo = async(req = request, res = response) => {    

    console.log(req.body);
    const { placa, niv} = req.body;

    if(placa != undefined){
        query= `
        SELECT *
        FROM argos_vehiculos_asegurados 
        WHERE 
        Placa_Vehiculo COLLATE utf8mb4_unicode_ci = '${placa}'
        `
    }
    if(niv != undefined){
        query= `
        SELECT *
        FROM argos_vehiculos_asegurados 
        WHERE 
        NIV COLLATE utf8mb4_unicode_ci = '${niv}'
        `
    }
    if(placa != undefined && niv != undefined){
        query= `
        SELECT *
        FROM argos_vehiculos_asegurados 
        WHERE 
        Placa_Vehiculo COLLATE utf8mb4_unicode_ci = '${placa}'
        OR NIV COLLATE utf8mb4_unicode_ci = '${niv}'
        `
    }
    let coincidencias = await saraiPromisePool.query(query);

    res.json({
        ok: true,
        msg: 'Vehiculos encontrados',
        data: {
            vehiculos: coincidencias[0]
        }
    });


};

module.exports = {
    RemisionesByName,
    TelefonoByRemision,
    ContactoByRemision,
    HistoricoByName,
    InspeccionByName,
    DetenidoCon,
    VehiculoByInspeccion,
    BuscarTelefono,
    RemisionesByTelefono,
    BuscarVehiculo
}