/// <reference types="Cypress" />

context('Webhook-logs', () => {
    let token;
    let listado = [];
    let webhookLog = {
        method: "POST",
        event: "citas:turno:asignar",
        url: "http://172.16.1.82:3007/cda/ejecutar",
        body: {},
        status: 200.0,
        response: {
            message: 'ok'
        },
        createdAt: Cypress.moment().date('2019-08-08T11:46:49.466Z'),
        updatedAt: Cypress.moment().date('2020-03-07T11:46:49.466Z')
    }

    before(() => {
        cy.login('38906735', 'asd').then(t => {
            token = t;
        });
        cy.task('database:create:webhook-log', webhookLog).then(webhooklog => {
            webhookLog = webhooklog;
            listado.push(webhookLog);
            cy.log("webhookLog: ", webhookLog);
        });
        cy.task('database:create:webhook-log', null).then(webhl => {
            listado.push(webhl);
            cy.log("webhookLog: ", webhl);
        });
        cy.task('database:create:webhook-log', null).then(webhl => {
            listado.push(webhl);
            cy.log("webhookLog: ", webhl);
        });
        cy.task('database:create:webhook-log', null).then(webhl => {
            listado.push(webhl);
            cy.log("webhookLog: ", webhl);
        });
        cy.log("list2: ", listado);
    });

    beforeEach(() => {
        cy.server();


        cy.goto('/monitoreo/webhooklog', token);
    });

    it('Cargar lista de Webhooklog, con filtro de texto', () => {
        cy.route('GET', '**/api/modules/webhook/log?*search=**').as('busqTxt');
        let busq = webhookLog.event;
        cy.log(busq)
        cy.plexText('name="buscar"', busq);
        cy.wait('@busqTxt').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.get('plex-list plex-item plex-label').contains(busq);
    });

    it('Cargar lista de Webhooklog, con filtro de fecha inicio y fecha fin', () => {
        cy.route('GET', '**/api/modules/webhook/log?*fecha=**').as('busquedaFecha');
        let hasta = Cypress.moment().format('DD/MM/YYYY hh:mm');
        let desde = Cypress.moment().date((webhookLog.updatedAt.toDate));
        cy.plexDatetime('label="Desde"').find('input').type(desde);
        cy.plexDatetime('name="fechaF"').find('input').type(hasta);
        cy.log(hasta);
        cy.wait('@busquedaFecha ').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        })
    });
    it('Cargar lista de Webhooklog, con filtro de fecha inicio mayor a fecha fin', () => {
        cy.route('GET', '**/api/modules/webhook/log?*fecha=**').as('busquedaFecha');
        let hasta = Cypress.moment().format('DD/MM/YYYY hh:mm');
        let desde = Cypress.moment().date((webhookLog.updatedAt.toDate));
        cy.plexDatetime('label="Desde"').find('input').type(hasta);
        cy.plexDatetime('name="fechaF"').find('input').type(desde);
        cy.contains('La fecha final no puede ser menor a la fecha inicial');
        cy.contains('Aceptar').click();
    });

    it('Ver detalles de un webhooklog', () => {
        cy.route('GET', '**/api/modules/webhook/log/**').as('busqElem');
        cy.get('plex-list plex-item').contains(webhookLog.event).click();

        cy.wait('@busqElem').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        })

        cy.get('plex-layout-sidebar div div div div div span').contains(webhookLog.status).first();

    });

});