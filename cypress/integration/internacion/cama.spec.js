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

    beforeEach(function () {
        cy.visit('/users/new')
        cy.get('#first').type('Johnny')
        cy.get('#last').type('Appleseed')
    })
    // it('ABM camas datos requeridos', () => {
    //     cy.get('.mdi-plus').first().click({ force: true });
    //     cy.get('plex-text[name="nombre"] input').first().type('CamaH')
    //     cy.get('plex-select[label="Tipo de cama"] input').type('cama')
    //     cy.get('.option[data-value="cama"]').click()
    //     cy.get('plex-select[label="Unidad organizativa"] input').type('servicio')
    //     cy.get('.option[data-value="servicio médico"]').click()
    //     cy.get('plex-select[label="Especialidad/es"] input').type('pod')
    //     cy.get('.option[data-value="podología"]').click()
    //     cy.get('plex-select[label="Ubicación de la cama"] input').type('edi')
    //     cy.get('.option[data-value="5b0586800d3951652da7daa1"]').click()
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.log('Termino bien')
    // })
    // it('Dar de baja una cama', () => {
    //     // esta es una cama que tiene historial
    //     cy.visit(Cypress.env('BASE_URL') + '/tm/organizacion/cama/5c6ed134de95b7330a1b3145')
    //     cy.get('footer');
    //     cy.get('plex-button[id="btnEliminar"]').click();
    //     cy.contains('La cama fue dada de baja');
    //     cy.log('Termino bien')

    // })

    it('Eliminar una cama', () => {
        // esta es una cama que no tiene historial
        cy.visit(Cypress.env('BASE_URL') + '/tm/organizacion/cama/5c701f54e4b5b66882533c7c')
        cy.get('footer');
        cy.get('plex-button[id="btnEliminar"]').click();
        cy.contains('Eliminar cama');
        cy.get('button[class="swal2-confirm btn btn-success"]').contains('CONFIRMAR').click();
        cy.contains('La cama fue eliminada');
        cy.log('Termino bien')
    })


})

