/* 
    Modelo que se encarga de manejar todas las peticiones del backend de las notificaciones
*/
// Se importan el response y el request de express para tener el tipado
const { response, request } = require('express');
const { saraiPromisePool } = require('../db/configSarai');
const { auraPromisePool } = require('../db/configAura');
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
    const { inspeccion,placas,niv } = req.body;
    let query = `SELECT ubicacion.*, persona_inspeccion.*,vehiculo_inspeccion.*, inspeccion.* 
                FROM vehiculo_inspeccion 
                LEFT JOIN inspeccion ON vehiculo_inspeccion.Id_Inspeccion = inspeccion.Id_Inspeccion 
                LEFT JOIN ubicacion ON ubicacion.Id_Ubicacion = inspeccion.Id_Ubicacion 
                LEFT JOIN persona_inspeccion ON inspeccion.Id_Inspeccion = persona_inspeccion.Id_Inspeccion
                WHERE `;

    if (inspeccion != undefined && inspeccion != '') {
        query += `vehiculo_inspeccion.Id_Inspeccion = ${inspeccion}`;
    } else if (placas != undefined && placas != '' && !['PERMISO','permiso','SIN PLACA','sin placa','SD', 'S/D', 'sd', 's/d','sp','s/p','SP','S/P'].includes(placas) && placas.length>4) {
        query += `vehiculo_inspeccion.Placas_Vehiculo = '${placas}'`;
    } else if (niv != undefined && niv != '' && !['SIN NIV','sin niv','SD', 'S/D', 'sd', 's/d'].includes(niv)) {
        query += `vehiculo_inspeccion.NIV = '${niv}'`;
    } else if (placas != undefined && niv != undefined) {
        let conditions = [];
        if (!['PERMISO','permiso','SIN PLACA','sin placa','SD', 'S/D', 'sd', 's/d','sp','s/p','SP','S/P'].includes(placas)) {
            conditions.push(`vehiculo_inspeccion.Placas_Vehiculo = '${placas}'`);
        }
        if (!['SIN NIV','sin niv','SD', 'S/D', 'sd', 's/d'].includes(niv)) {
            conditions.push(`vehiculo_inspeccion.NIV = '${niv}'`);
        }
        if (conditions.length > 0) {
            query += conditions.join(' OR ');
        } else {
            res.status(400).json({
                ok: false,
                msg: 'No valid search criteria provided'
            });
            return;
        }
    } else {
        res.status(400).json({
            ok: false,
            msg: 'No search criteria provided'
        });
        return;
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
    const { telefono } = req.body;
    const telefonos = telefono.split(',').map(tel => tel.trim()); // ['telefono1', 'telefono2']
    const regexp = telefonos.map(tel => `(^|,)${tel}(,|$)`).join('|').replace(/[\\"']/g, '\\$&');
   
    try {
        let coincidencias = await saraiPromisePool.query(`
        SELECT *
        FROM argos_detenido_datos_personales 
        WHERE Telefono REGEXP '${regexp}'
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
    let query = '';

    if (placa != undefined && placa != 'permiso' && placa != 'PERMISO' && placa != 'SIN PLACA' && placa != 'sin placa' && placa != '' && placa != 'SD' && placa != 'S/D' && placa != 'sp' && placa != 'SP' && placa != 's/p' && placa != 'S/P' && placa.length>4) {
        query = `
        SELECT vehiculos.*, argos_vehiculos_asegurados.*
        FROM argos_vehiculos_asegurados 
        LEFT JOIN vehiculos ON vehiculos.No_Remision = argos_vehiculos_asegurados.No_Remision
        WHERE 
        Placa_Vehiculo COLLATE utf8mb4_unicode_ci = '${placa}'
        `;
    } else if (niv != undefined && niv != 'SIN NIV' && niv != 'sin niv' && niv != '' && niv != 'SD' && niv != 'S/D' && niv != 'sp' && niv != 'SP' && niv != 's/p' && niv != 'S/P') {
        query = `
        SELECT vehiculos.*, argos_vehiculos_asegurados.*
        FROM argos_vehiculos_asegurados 
        LEFT JOIN vehiculos ON vehiculos.No_Remision = argos_vehiculos_asegurados.No_Remision
        WHERE 
        No_Serie COLLATE utf8mb4_unicode_ci = '${niv}'
        `;
    } else if (placa != undefined && niv != undefined) {
        query = `
        SELECT vehiculos.*, argos_vehiculos_asegurados.*
        FROM argos_vehiculos_asegurados 
        LEFT JOIN vehiculos ON vehiculos.No_Remision = argos_vehiculos_asegurados.No_Remision
        WHERE 
        Placa_Vehiculo COLLATE utf8mb4_unicode_ci = '${placa}'
        OR No_Serie COLLATE utf8mb4_unicode_ci = '${niv}'
        `;
    } else {
        res.status(400).json({
            ok: false,
            msg: 'No search criteria provided'
        });
        return;
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

const BuscarContactosTelefono = async (req = request, res = response) => {
    const{label, telefono} = req.body;
    try {
        let coincidencias = await saraiPromisePool.query(`
            SELECT * 
            FROM contacto_detenido
            WHERE
            Telefono IN('${telefono}')
            `);

        res.json({
            ok: true,
            msg: 'Contactos encontrados',
            data: {
                contactos: coincidencias[0]
            }
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar contactos',
            error: error.message
        });
    }

}

const BuscarLlamadas911 = async (req = request, res = response) => {
    console.log(req.body);
    const {telefono} = req.body;

    try {
        const llamadas = await TelefonoSSC.find({Telefono: telefono}).lean();

        res.json({
            ok: true,
            msg: 'Llamadas encontradas',
            data: {
                llamadas
            }
        });

    }catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar llamadas',
            error: error.message
        });

    }
};

const BuscarPersonasInspeccion = async (req = request, res = response) => {
    console.log(req.body);
    const {inspeccion} = req.body;

    try {
        let coincidencias = await saraiPromisePool.query(`
            SELECT *
            FROM argos_inspeccion_persona
            WHERE Id_Inspeccion = ${inspeccion}
            `);

        res.json({
            ok: true,
            msg: 'Personas encontradas',
            data: {
                personas: coincidencias[0]
            }
        });

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar personas',
            error: error.message
        });

    }
}

const BuscarPersonasAura = async (req = request, res = response) => {
    console.log(req.body);
    const { label, tipo } = req.body;

    try {
        let coincidencias = await auraPromisePool.query(`
            SELECT *
            FROM gc_seguimiento_filtro_2
            WHERE Nombre_completo = '${label}'
            `);
        
        if (coincidencias[0].length > 0){
            res.json({
                ok: true,
                msg: 'Personas encontradas',
                data: {
                    aura: coincidencias[0]
                }
            });
        }else {
            res.json({
                ok: true,
                msg: 'Personas encontradas',
                data: {
                    aura: []
                }
            });
        }
       

    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar personas',
            error: error.message
        });

    }
}
const BuscarPersonasBanda = async (req = request, res = response) => {
    console.log(req.body);
    const { Banda } = req.body;

    if (!Banda || Banda.trim() === '') {
        return res.status(400).json({
            ok: false,
            msg: 'No search criteria provided'
        });
    }

    try {
        const bandaList = Banda.split(',').map(b => `'${b.trim()}'`).join(', ');

        let coincidencias = await auraPromisePool.query(`
            SELECT persona_gabinete.Nombre, persona_gabinete.Ap_Paterno, persona_gabinete.Ap_Materno, gc_seguimiento_filtro_2.*
            FROM gc_seguimiento_filtro_2
            LEFT JOIN persona_gabinete
            ON gc_seguimiento_filtro_2.Id_persona = persona_gabinete.Id_persona
            WHERE Nombre_grupo_delictivo IN (${bandaList})
        `);

        if (coincidencias[0].length > 0) {
            res.json({
                ok: true,
                msg: 'Personas encontradas',
                data: {
                    aura: coincidencias[0]
                }
            });
        } else {
            res.json({
                ok: true,
                msg: 'Personas encontradas',
                data: {
                    aura: []
                }
            });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al buscar personas',
            error: error.message
        });
    }
}


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
    BuscarContactosTelefono,
    BuscarVehiculo,
    BuscarLlamadas911,
    BuscarPersonasInspeccion,
    BuscarPersonasAura,
    BuscarPersonasBanda
}