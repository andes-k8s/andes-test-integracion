/// <reference types="Cypress" />

context('Aliasing', () => {
    let token
    before(() => {
        cy.login('37781560', 'asd').then(t => {
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

    // it('ingreso workflow simple datos completos', () => {
    //     cy.get('.disponible').first().click();
    //     cy.get('.mdi-account-plus').first().click({ force: true });
    //     cy.get('plex-text[name="buscador"] input').first().type('25715826');
    //     cy.get('table tr').contains('25715826').first().click();
    //     cy.wait(4000)
    //     cy.get('plex-button').contains('Cambiar Paciente').click();
    //     cy.get('plex-text[name="buscador"] input').first().type('16314916');
    //     cy.get('table tr').contains('16314916').first().click();
    //     cy.get('plex-select[label="Cobertura"] input').type('Ninguno');
    //     cy.wait(1000)
    //     cy.get('.option[data-value="Ninguno"]').click();
    //     cy.get('plex-button').contains('Nueva Carpeta').click({ force: true });
    //     cy.get('plex-button[label="Cancelar"]').click();
    //     cy.get('plex-select[label="Origen hospitalización"] input').type('Consultorio externo')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="Consultorio externo"]').click()
    //     cy.get('plex-select[label="Organización origen"] input').type('castro')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="57e9670e52df311059bc8964"]').click({ force: true })
    //     cy.get('plex-text[name="motivo"] input').first().type('apendicitis');
    //     cy.get('plex-select[label=" Situación laboral "] input').type('Trabaja o está de licencia')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="Trabaja o está de licencia"]').click();
    //     cy.get('plex-select[label="Ocupación habitual "] input').type('Actor')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="Actor"]').click()
    //     cy.get('plex-select[label="Nivel instrucción"] input').type('Secundario incompleto')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="Secundario incompleto"]').click()
    //     cy.get('plex-button').contains('INICIAR').click({ force: true });
    //     cy.get('plex-button[label="Guardar"]').click();
    // })

    // it('Ingreso en una cama ocupada', () => {
    //     cy.get('.disponible').first().click();
    //     cy.get('.mdi-account-plus').first().click({ force: true });
    //     cy.get('plex-text[name="buscador"] input').first().type('30178762');
    //     cy.get('table tr').contains('30178762').first().click();
    //     cy.wait(4000)
    //     cy.get('plex-dateTime[label="Fecha Ingreso"] input').clear();
    //     cy.get('plex-dateTime[label="Hora Ingreso"] input').clear();
    //     // Es una cama que está ocupada el 11/02 desde las 15:10 a las 15:30, por lo que a las 15:12 no me debera dejar ingresar.
    //     cy.get('plex-dateTime[label="Fecha Ingreso"] input').first().type('11/02/2019');
    //     cy.get('plex-dateTime[label="Hora Ingreso"] input').first().type('15:12');
    //     cy.get('plex-select[label="Origen hospitalización"] input').type('Otro')
    //     cy.get('.option[data-value="Otro"]').click()
    //     cy.get('plex-button').contains('INICIAR').click({ force: true });
    //     cy.contains('La cama seleccionada no está disponible en la fecha ingresada. Por favor controle la fecha y hora de ingreso.');
    //     cy.log('Termino bien');
    // })

    it('ingreso por traslado', () => {
        cy.get('.disponible').first().click();
        cy.get('.mdi-account-plus').first().click({ force: true });
        cy.get('plex-text[name="buscador"] input').first().type('30178762');
        cy.get('table tr').contains('30178762').first().click();
        cy.wait(4000)
        cy.get('plex-select[label="Origen hospitalización"] input').type('Trasl')
        cy.wait(2000)
        cy.get('.option[data-value="Traslado"]').click()
        cy.get('plex-select[label="Organización origen"] input').type('heller')
        cy.wait(2000)
        cy.get('.option[data-value="57fcf038326e73143fb48dac"]').click({ force: true })
        cy.get('plex-button').contains('INICIAR').click({ force: true });



        cy.log('Termino bien');
    })

    it('ingreso sin cama', () => {
        cy.get('[ng-reflect-content="Ingresar paciente"]').click();
        cy.get('plex-text[name="buscador"] input').first().type(Cypress.env('dni'));
        cy.get('table tr').contains(Cypress.env('dni')).first().click()
        cy.get('plex-select[label="Origen hospitalización"] input').type('Otro')
        cy.get('plex-button').contains('INICIAR').click({ force: true });
    })



})