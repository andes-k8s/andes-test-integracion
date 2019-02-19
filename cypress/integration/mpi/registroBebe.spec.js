

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
        });
    })

    let hoy = new Date().toLocaleDateString().split('/');
    hoy = hoy[1] + '/' + hoy[0] + '/' + hoy[2];

    it('login complete', () => {

        cy.get('div').contains('CARGAR BEBÉ').click();

        cy.get('plex-text[name="apellido"] input').first().type('apellidoBebe').should('have.value', 'apellidoBebe');

        cy.get('plex-text[name="nombre"] input').first().type('nombreBebe').should('have.value', 'nombreBebe');

        cy.get('plex-radio[name="sexo"]').find('div').contains(' Femenino ').click();

        cy.get('plex-datetime[name="fechaNacimiento"] input').first().type(hoy).should('have.value', hoy);

        cy.get('paciente-buscar[label="Buscar Mamá"] input').first().type('HUENCHUMAN, NATALIA VANESA');

        cy.get('paciente-listado').find('td').contains('HUENCHUMAN, NATALIA VANESA').click();

        // cy.get('plex-button[label="Guardar"]').click();

    })

})