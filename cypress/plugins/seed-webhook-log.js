const faker = require('faker');
const { connectToDB, ObjectId } = require('./database');

module.exports.createWebhookLog = async (mongoUri, params) => {
    //recibe un webhooklog en params o vacio y usa datos propios
    params = params || {};
    try {
        const client = await connectToDB(mongoUri);
        const WebhookLogDB = await client.db().collection('webhookLog');
        let webhooklog = params;
        webhooklog.method = (webhooklog.method) ? (webhooklog.method) : ('' + faker.random.arrayElement(['GET', 'PATCH', 'DELETE', 'POST', 'PUT']));

        let nom1 = faker.lorem.word();
        let nom2 = faker.lorem.word();
        if (webhooklog.event) {
            webhooklog.event = webhooklog.event.replace(' ', '');
        }
        else {
            let e = nom1 + ':' + nom2 + ':' + faker.lorem.word();
            webhooklog.event = e;
        }

        if (webhooklog.url) {
            webhooklog.url = webhooklog.url.replace(' ', '');
        }
        else {
            webhooklog.url = 'http://' + faker.internet.ip() + '/' + nom1 + '/' + nom2;
        }

        webhooklog.status = (webhooklog.status) ? (webhooklog.status) : ('' + faker.random.arrayElement([200.0, 201.0, 403.0, 404.0, 500.0]));

        // response
        // si no contiene datos creamos response.message de acuerdo al valor de status
        if (!webhooklog.response) {
            webhooklog.response = {};
            if (webhooklog.status && webhooklog.status >= 200 && webhooklog.status < 300) {
                webhooklog.response.message = 'ok';
            }
            else {
                webhooklog.response.message =
                    (webhooklog.status && webhooklog.status == 403) ? 'Forbidden' :
                        (webhooklog.status && webhooklog.status == 304) ? 'Not Modified' :
                            (webhooklog.status && webhooklog.status == 500) ? 'Internal Server Error' : ' Bad Request';
            }
        }

        webhooklog.createdAt = (webhooklog.createdAt) ? webhooklog.createdAt : faker.date.past(2, '2019-01-01');
        webhooklog.updatedAt = (webhooklog.updatedAt) ? webhooklog.updatedAt : faker.date.past(1, '2020-02-01');

        webhooklog._id = new ObjectId();
        await WebhookLogDB.insertOne(webhooklog);
        return webhooklog;
    } catch (e) {
        return e;
    }
}