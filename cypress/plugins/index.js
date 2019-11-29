// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {
    seedUsuario
} = require('./seed-usuario');
const {
    seedPerfil
} = require('./seed-perfil');


module.exports = (on, config) => {
    // ref: https://docs.cypress.io/api/plugins/browser-launch-api.html#Usage
    on('before:browser:launch', (browser = {}, args) => {
        if (browser.name === 'chrome') {
            args.push('--disable-dev-shm-usage')
            return args
        }

        return args
    });

    const mongoUri = config.env.MONGO_URI || 'mongodb://localhost:27066/andes';
    const elasticuri = config.env.ELASTIC_URI || 'http://localhost:9266';

    on('task', {
        'database:drop': (collection) => {
            return dropCollection(mongoUri, elasticuri, collection);
        },
        'database:seed:paciente': (params) => {
            return seedPaciente(mongoUri, elasticuri, params);
        },
        'database:create:paciente': (params = {}) => {
            return createPaciente(mongoUri, elasticuri, params);
        },
        'database:seed:agenda': (dto) => {
            return seedAgenda(mongoUri, dto);
        },
        'database:seed:usuario': (dto) => {
            return seedUsuario(mongoUri, dto);
        },
        'database:seed:perfil': (dto) => {
            return seedPerfil(mongoUri, dto);
        }
    });

}
