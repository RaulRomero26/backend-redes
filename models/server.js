/* Esye es el modelo del servidor, en el cual se configura todo al respecto del mismo
puerto sobr eel que va a salir, middlewares, archivos estaticos, rutas, etc. */
const express = require('express');
const cors = require('cors');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.searchPath = '/api/search';

        //Middlewares
        this.middlewares();
        //Rutas de la aplicacion
        this.routes();
    }

    middlewares(){
        //CORS
        this.app.use(cors())
        //Lectura y parseo del body
        this.app.use(express.json());
        //Directorio publico la ruta base  aca se encuentra el "MAUAL"/
        this.app.use( express.static('public'))
    }

    routes(){
        //aca se decide que ruta asignarle y de que archivo tomar las configuraciones
        this.app.use( this.searchPath,require('../routes/search.routes'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en el puerto',this.port);
        })
    }
}

module.exports = Server;