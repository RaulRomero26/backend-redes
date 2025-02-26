/* 
    Con el controllador realizado el archivo de rutas se encarga de habilitar las url para que se pueda recibir y mandar informacion
*/
//se importa el roiter de express para habilitar las salidas
const { Router } = require('express');
//se importan las diferentes funciones que realizan las consultas sql
const { RemisionesByName, TelefonoByRemision,ContactoByRemision, HistoricoByName, InspeccionByName ,VehiculoByInspeccion
    ,DetenidoCon, BuscarTelefono,RemisionesByTelefono, BuscarVehiculo,BuscarContactosTelefono, BuscarLlamadas911,
    BuscarPersonasInspeccion, BuscarPersonasAura,BuscarPersonasBanda, BuscarUbicacionesRemision
} = require('../controllers/search.controller');
// se crea el router asi como las diferentes rutas que son los endpoint de la informacion
const router = Router();

router.post('/remisiones',RemisionesByName);
router.post('/telefono',TelefonoByRemision);
router.post('/contactos',ContactoByRemision);
router.post('/historico',HistoricoByName);
router.post('/inspeccion',InspeccionByName);
router.post('/detenidoCon',DetenidoCon);
router.post('/vehiculoInspeccion',VehiculoByInspeccion)
router.post('/telefono-contacto', BuscarTelefono)
router.post('/vehiculoRemision', BuscarVehiculo);
router.post('/remisionesTelefono',RemisionesByTelefono);
router.post('/contactosTelefono',BuscarContactosTelefono);
router.post('/llamadas911',BuscarLlamadas911);
router.post('/inspeccion-persona',BuscarPersonasInspeccion);
router.post('/redes-aura',BuscarPersonasAura);
router.post('/banda-aura',BuscarPersonasBanda);
router.post('/ubicaciones-remision', BuscarUbicacionesRemision);

module.exports = router;