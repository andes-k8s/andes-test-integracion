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


    it('Agregar unidad organizativa', () => {
   
        cy.get('plex-button[label="Editar"]').first().click({ force: true });
        cy.get('plex-select[name="servicio"] input').type('pediatria')
        cy.get('.option[data-value="3211000013109"]').click()
        cy.get('.mdi-plus').click({ force: true });
        cy.get('plex-button[label="Guardar"]').first().click({ force: true });


     })





})