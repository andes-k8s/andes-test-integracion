

/// <reference types="Cypress" />

context('Aliasing', () => {
    let token
    before(() => {
        cy.login('34377650', '159753000').then(t => {
            token = t;
        })
    })

    beforeEach(() => {
        cy.visit(Cypress.env('BASE_URL') + '/apps/mpi/busqueda', {
            onBeforeLoad: (win) => {
                win.sessionStorage.setItem('jwt', token);
            }
        })
    })

    it('login complete', () => {

        cy.get('div').contains('CARGAR IDENTIFICADO').click();

        // Completo datos basicos
        cy.get('plex-int[name="documento"] input').first().type('35466578').should('have.value', '35466578');

        cy.get('plex-text[name="apellido"] input').first().type('manual').should('have.value', 'manual');

        cy.get('plex-text[name="nombre"] input').first().type('paciente').should('have.value', 'paciente');

        cy.get('plex-datetime[name="fechaNacimiento"] input').first().type('19/05/1993').should('have.value', '19/05/1993');

        cy.get('plex-select[name="sexo"] input[type="text"]').type('masculino{enter}');

        // Completo datos de contacto
        cy.get('plex-select[ng-reflect-name="tipo-0"]').children().children('.selectize-control').click()
            .find('div[data-value="fijo"]').click();

        cy.get('plex-phone[ng-reflect-name="valor-0"] input').first().type('02994331614').should('have.value', '02994331614');

        // Agrego nuevo contacto
        cy.get('plex-button[name="agregarContacto"]').click();

        cy.get('plex-select[ng-reflect-name="tipo-1"]').children().children('.selectize-control').click()
            .find('div[data-value="email"]').click();

        cy.get('plex-text[ng-reflect-name="valor-1"] input').first().type('mail@ejemplo.com').should('have.value', 'mail@ejemplo.com');

        //Completo datos de domicilio
        cy.get('plex-bool[name="viveProvActual"]').click();

        cy.get('plex-bool[name="viveLocActual"]').click();

        cy.get('plex-select[name="barrio"] input[type="text"]').type('alta barda{enter}');

        cy.get('plex-text[name="direccion"] input[type="text"]').first().type('Avenida las Flores 1200').should('have.value', 'Avenida las Flores 1200');

        cy.get('plex-button[label="Actualizar"]').click();

        // Guardamos cambios
        // cy.get('plex-button[label="Guardar"]').click();
    })

})