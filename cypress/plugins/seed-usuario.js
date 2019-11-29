const faker = require('faker');
const {
    connectToDB,
    ObjectId
} = require('./database');

module.exports.seedUsuario = async (mongoUri, params) => {
    params = params | {};
    try {
        const client = await connectToDB(mongoUri);
        const UsuarioDB = await client.db().collection('authUsers');

        const templateName = params.template || 'default';
        let dto = require('./data/usuario/usuario-' + templateName);

        const usuario = JSON.parse(JSON.stringify(dto));

        usuario.nombre = params.nombre || faker.name.firstName().toLocaleUpperCase();
        usuario.apellido = params.apellido || faker.name.lastName().toLocaleUpperCase();

        // if (usuario.usuario) {
        const random = faker.random.number({
            min: 40000000,
            max: 49999999
        });
        usuario.usuario = random;
        usuario.documento = ("" + random);
        // }
        usuario._id = new ObjectId();
        await UsuarioDB.insertOne(usuario);

        return usuario;
    } catch (e) {
        return e;
    }
}