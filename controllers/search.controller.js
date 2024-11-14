/* 
    Modelo que se encarga de manejar todas las peticiones del backend de las notificaciones
*/
// Se importan el response y el request de express para tener el tipado
const { response, request } = require('express');
const { saraiPromisePool } = require('../db/configSarai');
const { TelefonoContactos, TelefonoSSC } = require('../models/telefono');

const RemisionesByName = async (req = request, res = response) => {
    console.log('entro a la funcion remisiones by name');
    const { label, tipo } = req.body;

    let coincidencias = [];

    try {
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

    } catch (error) {
        console.log('Error en la base de datos:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar remisiones',
            error: error.message
        });
    }

}

const HistoricoByName = async (req = request, res = response) => {
    console.log('entro a la funcion');
    console.log(req.body);
    const { label, tipo } = req.body;

    try {

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
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar remisiones',
            error: error.message
        });

    }
}


const InspeccionByName = async (req = request, res = response) => {
    console.log('entro a la funcion');
    console.log(req.body);
    const { label } = req.body;
    try {

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
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar inspecciones',
            error: error.message
        });
    }



}

const VehiculoByInspeccion = async (req = request, res = response) => {
    console.log('entro a la funcion');
    console.log(req.body);
    const { inspeccion,placas,NIV } = req.body;
    let query = '';
    if(inspeccion != undefined && inspeccion != ''){
        query = `SELECT * FROM vehiculo_inspeccion WHERE Id_Inspeccion = ${inspeccion}`;
    }
    if(placas != undefined && placas != ''){
        query = `SELECT * FROM vehiculo_inspeccion WHERE Placas_Vehiculo = '${placas}'`;
    }
    if(NIV != undefined && NIV != ''){
        query = `SELECT * FROM vehiculo_inspeccion WHERE NIV = '${NIV}'`;
    }

    if(placas != undefined && NIV != undefined){
        query = `SELECT * FROM vehiculo_inspeccion WHERE Placas_Vehiculo = '${placas}' OR NIV = '${NIV}'`;
    }

    try {

        let coincidencias = await saraiPromisePool.query(`
        ${query}
            `);

        res.json({
            ok: true,
            msg: 'Vehiculos inspeccion encontrados',
            data: {
                vehiculos: coincidencias[0]
            }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar inspecciones',
            error: error.message
        });

    }


}

const TelefonoByRemision = async (req = request, res = response) => {
    console.log(req.body);
    const { label } = req.body;

    try {
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

    } catch (error) {
        conspole.log('Error en la base de datos:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar remisiones',
            error: error.message
        });
    }
}

const ContactoByRemision = async (req = request, res = response) => {
    console.log(req.body);
    const { remision_primaria } = req.body;

    try {

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
    } catch (error) {
        console.log('Error en la base de datos:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar remisiones',
            error: error.message
        });
    }

}

const DetenidoCon = async (req = request, res = response) => {
    console.log(req.body);
    const { ficha, remision_primaria } = req.body;

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

const BuscarTelefono = async (req = request, res = response) => {
    console.log(req.body);
    const { label } = req.body;

    try {

        let coincidencias = await TelefonoSSC.find({ Telefono: label }).lean();

        res.json({
            ok: true,
            msg: 'Telefonos encontrados',
            data: {
                telefonos: coincidencias
            }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar telefonos',
            error: error.message
        });
    }

}

const RemisionesByTelefono = async (req = request, res = response) => {
    console.log('TELEFONO EN REMISIONES:', req.body);
    const { label } = req.body;

    try {
        let coincidencias = await saraiPromisePool.query(`
            SELECT *
            FROM argos_detenido_datos_personales 
            WHERE 
            Telefono = '${label}'
        `);

        res.json({
            ok: true,
            msg: 'Remisiones encontradas',
            data: {
                remisiones: coincidencias[0]
            }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar remisiones',
            error: error.message
        });
    }
}

const BuscarVehiculo = async (req = request, res = response) => {

    console.log(req.body);
    const { placa, niv } = req.body;

    if (placa != undefined && placa != '' && placa != 'SD' && placa != 'S/D') {
        query = `
        SELECT *
        FROM argos_vehiculos_asegurados 
        WHERE 
        Placa_Vehiculo COLLATE utf8mb4_unicode_ci = '${placa}'
        `
    }
    if (niv != undefined && niv != '' && niv != 'SD' && niv != 'S/D') {
        query = `
        SELECT *
        FROM argos_vehiculos_asegurados 
        WHERE 
        No_Serie COLLATE utf8mb4_unicode_ci = '${niv}'
        `
    }
    if (placa != undefined && niv != undefined) {
        query = `
        SELECT *
        FROM argos_vehiculos_asegurados 
        WHERE 
        Placa_Vehiculo COLLATE utf8mb4_unicode_ci = '${placa}'
        OR No_Serie COLLATE utf8mb4_unicode_ci = '${niv}'
        `
    }

    try {

        let coincidencias = await saraiPromisePool.query(query);

        res.json({
            ok: true,
            msg: 'Vehiculos encontrados',
            data: {
                vehiculos: coincidencias[0]
            }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar vehiculos',
            error: error.message
        });

    }



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