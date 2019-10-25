/// <reference types="Cypress" />

context('TM Organizacion (Ofertas Prestacionales)', () => {
    let token
    before(() => {
        cy.seed();
        cy.login('38906735', 'asd').then(t => {
            token = t;
            cy.createOrganizacion('organizacion-con-oferta.json', token);
        });
    })

    beforeEach(() => {
        cy.server();
        cy.viewport(1280, 720);
        cy.goto('/tm/organizacion', token);
        cy.route('GET', '**/api/core/tm/organizaciones**').as('buscaOrganizaciones');

        cy.wait('@buscaOrganizaciones').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        cy.get('div[class="col h-100"]').find('plex-box').find('table[class="table table-fixed"]')
            .find('tbody').find('tr').find('td').eq(5).find('plex-button[label="Ofertas Prestacionales"]').click();

        cy.route('GET', '**/api/core/tm/organizacion/**').as('buscaOrganizacion');

        cy.wait('@buscaOrganizacion').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        cy.route('PUT', '**/api/core/tm/organizaciones/**').as('putOrganizacion');
    })

    it('crear una oferta prestacional', () => {
        cy.plexButtonIcon('plus').click();

        cy.route('GET', '**/api/core/tm/tiposPrestaciones**').as('prestaciones');
        cy.plexSelectAsync('label="Tipo de prestación"', 'consulta de medicina general', '@prestaciones', 0);

        cy.plexText('label="Detalle"', 'Lunes a Viernes - 8:30');

        cy.plexButtonIcon('check').click();

        cy.wait('@putOrganizacion').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        cy.contains('La oferta prestacional fue agregada');
        cy.swal('confirm');
    })

    it('editar una oferta prestacional', () => {
        cy.get('plex-layout-main').find('fieldset').find('div[class="row"]')
            .find('div[class="col"]').find('div[class="table-responsive"]')
            .find('table[class="table table-striped table-hover"]')
            .find('tr').eq(0).find('td').eq(2).plexButtonIcon('pencil').click();

        cy.route('GET', '**/api/core/tm/tiposPrestaciones**').as('prestaciones');
        cy.plexSelectType('label="Tipo de prestación"').clear();
        cy.plexSelectAsync('label="Tipo de prestación"', 'ecografía', '@prestaciones', 0);

        cy.plexText('label="Detalle"').clear();
        cy.plexText('label="Detalle"', 'Lunes y Martes - 9:00');

        cy.plexButtonIcon('check').click();

        cy.wait('@putOrganizacion').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        cy.contains('La oferta prestacional fue editada');
        cy.swal('confirm');
    })

    it('eliminar una oferta prestacional', () => {
        cy.get('plex-layout-main').find('fieldset').find('div[class="row"]')
            .find('div[class="col"]').find('div[class="table-responsive"]')
            .find('table[class="table table-striped table-hover"]')
            .find('tr').eq(0).find('td').eq(2).plexButtonIcon('delete').click();

        cy.swal('confirm');
        cy.wait('@putOrganizacion').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        cy.contains('La oferta prestacional fue eliminada');
        cy.swal('confirm');
    })
})