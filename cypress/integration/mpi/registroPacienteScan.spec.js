

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

        cy.get('plex-text[name="buscador"] input').first().type('00511808749@CHAVEZ SANDOVAL@TOBIAS AGUSTIN@M@52081206@B@10/01/2012@29/08/2017@208').should('have.value', '00511808749@CHAVEZ SANDOVAL@TOBIAS AGUSTIN@M@52081206@B@10/01/2012@29/08/2017@208');
        // Debe navegar a paciente-cru
        cy.wait(1000);

        cy.url().should('include', '/apps/mpi/paciente');

        // Completo datos basicos
        cy.get('plex-int[name="documento"] input').should('have.value', '52081206');

        cy.get('plex-text[name="apellido"] input').should('have.value', 'CHAVEZ SANDOVAL');

        cy.get('plex-text[name="nombre"] input').should('have.value', 'TOBIAS AGUSTIN');

        cy.get('plex-datetime[name="fechaNacimiento"] input').should('have.value', '10/01/2012');

        cy.get('plex-select[name="sexo"]').children().children().children().should('have.value', 'masculino');

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