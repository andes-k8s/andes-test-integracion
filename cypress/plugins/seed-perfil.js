const faker = require('faker');
const {
    connectToDB,
    ObjectId
} = require('./database');

module.exports.seedPerfil = async (mongoUri, params) => {
    params = params | {};
    try {
        const client = await connectToDB(mongoUri);
        const PerfilDB = await client.db().collection('authPerfiles');

        const templateName = params.template || 'default';
        let dto = require('./data/perfil/perfil-' + templateName);

        const perfil = JSON.parse(JSON.stringify(dto));

        perfil.nombre = params.nombre || faker.name.jobTitle().toLocaleUpperCase();

        perfil._id = new ObjectId();
        await PerfilDB.insertOne(perfil);

        return perfil;
    } catch (e) {
        return e;
    }
}