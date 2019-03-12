/// <reference types="Cypress" />

context('Aliasing', () => {
    let token
    before(() => {
        cy.login('38906735', 'asd').then(t => {
            token = t;
        })
    })

    beforeEach(() => {
        cy.visit(Cypress.env('BASE_URL') + '/tm/organizacion', {
            onBeforeLoad: (win) => {
                win.sessionStorage.setItem('jwt', token);
            }
        });
    })


    it('Agregar sectores', () => {

        cy.get('plex-button[label="Ver sectores"]').first().click({ force: true });
        // cy.get('plex-select[name="servicio"] input').type('pediatria')
        cy.get('.mdi-plus').first().click({ force: true });
        cy.get('plex-select[name="servicio"] input').type('ala')
        cy.get('.option[data-value="2371000013103"]').click()
                cy.get('plex-text[name="nombre-sector"] input').first().type('el mejor sector')
        cy.get('plex-button[label="Agregar item"]').first().click({ force: true });

        
        // cy.get('plex-button[label="Guardar"]').first().click({ force: true });


    })





})