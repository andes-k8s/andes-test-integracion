/// <reference types="Cypress" />

context('Aliasing', () => {
    let token
    before(() => {
        cy.login('38906735', 'asd').then(t => {
            token = t;
        })
    })

    beforeEach(() => {
        cy.visit(Cypress.env('BASE_URL') + '/internacion/camas', {
            onBeforeLoad: (win) => {
                win.sessionStorage.setItem('jwt', token);
            }
        });
    })


    // it('ingreso camino feliz', () => {
    //     cy.get('.card-container').then(($body) => {
    //         if ($body.hasClass('disponible')) {
    //             console.log("aca si")
    //             cy.get('.disponible').first().click();
    //             cy.get('.disponible').first().get('.disponible .mdi-account-plus').first().click({ force: true });
    //             // cy.get('.mdi-account-plus').first().click({ force: true });
    //             cy.get('plex-text[name="buscador"] input').first().type(Cypress.env('dni'));
    //             cy.get('table tr').contains(Cypress.env('dni')).first().click()
    //             cy.get('plex-select[label="Origen hospitalización"] input').type('Otro')
    //             cy.wait(2000)
    //             cy.get('.option[data-value="Otro"]').click()
    //             cy.get('plex-button').contains('INICIAR').click({ force: true });
    //             //     cy.get('plex-button[label="Guardar"]').click();

    //         }

    //     })




    // })



    it('ingreso sin cama', () => {
        cy.get('[ng-reflect-content="Ingresar paciente"]').click();
        cy.get('plex-text[name="buscador"] input').first().type(Cypress.env('dni'));
        cy.get('table tr').contains(Cypress.env('dni')).first().click()
        cy.get('plex-select[label="Origen hospitalización"] input').type('Otro')
        cy.wait(2000)
        cy.get('.option[data-value="Otro"]').click()
        cy.get('plex-button').contains('INICIAR').click({ force: true });
        cy.get('plex-button').contains('INICIAR').click({ force: true });
    })



})