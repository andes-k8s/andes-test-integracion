/// <reference types="Cypress" />


// Test realizado para prueba de issue #1111 basado en la huds de un usuario en la DB de testing-sss.

context('HUDS', () => {
    let token
    before(() => {
        cy.login('34377650', '159753000').then(t => {
            token = t;
        })
    })

    beforeEach(() => {
        cy.goto('/rup/vista/586e6e9a27d3107fde18e080', token);
    })

    it('Color-icono de registros de prestaciones', () => {
        cy.wait(5000);
        cy.get('button[class="btn btn-block p-0 btn-procedimiento"]').click();
    });
});