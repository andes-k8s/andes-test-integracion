

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

        cy.get('div').contains('CARGAR NN O EXTRANJERO').click();

        cy.get('plex-text[name="apellido"] input').first().type('apellidoSinDni').should('have.value', 'apellidoSinDni');

        cy.get('plex-text[name="nombre"] input').first().type('nombreSinDni').should('have.value', 'nombreSinDni');

        cy.get('plex-select[name="sexo"] input[type="text"]').type('masculino{enter}');

        cy.get('plex-datetime[name="fechaNacimiento"] input').first().type('19/05/1993').should('have.value', '19/05/1993');

        cy.get('plex-select[name="tipoIdentificacion"] input[type="text"]').type('pasaporte{enter}');

        cy.get('plex-int[name="numeroIdentificacion"] input').first().type('112233').should('have.value', '112233');

        cy.get('plex-bool[name="noPoseeContacto"]').click();

        cy.get('plex-bool[name="viveProvActual"]').click();

        cy.get('plex-bool[name="viveLocActual"]').click();

        cy.get('plex-select[name="barrio"] input[type="text"]').type('alta barda{enter}')

        cy.get('plex-text[name="direccion"] input').first().type('Avenida las Flores 1200').should('have.value', 'Avenida las Flores 1200');

        cy.get('plex-button[label="Actualizar"]').click();

        // cy.get('plex-button[label="Guardar"]').click();
    })

})