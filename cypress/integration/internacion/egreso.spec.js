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

    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-close-box').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-select[label="Tipo de egreso"] input').type('alta')
    //     cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Alta médica"]').click({ force: true })
    //     cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('acne tropical')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="59bbf1ee53916746547cc10b"]').click({ force: true })
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.get('plex-button[label="Validar Internación"]').click();
    //     cy.get('button').contains('CONFIRMAR').click()         
    // })


    // it('evento obstétrico', () => {

    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-close-box').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-select[label="Tipo de egreso"] input').type('alta')
    //     cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Alta médica"]').click({ force: true })
    //     cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('O84.8')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="59bbf1ee53916746547cc6ad"]').click({ force: true })
    //     cy.get('plex-dateTime[label="Fecha terminación"] input').first().type('10022019');
    //     cy.get('plex-int[name="edadGestacional"] input').first().type(85);
    //     cy.get('plex-int[label="Paridad"] input').first().type(85);
    //     cy.get('plex-int[label="Peso al nacer"] input').first().type(85);


    //     cy.get('mat-radio-button[ng-reflect-value="Simple"] input').first().click({ force: true })

    //     cy.get('mat-radio-button[ng-reflect-value="Nac. Vivo"] input').first().click({ force: true })
    //     cy.get('mat-radio-button[ng-reflect-value="Vaginal"] input').first().click({ force: true })
    //     cy.get('mat-radio-button[ng-reflect-value="Masculino"] input').first().click({ force: true })
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.get('plex-button[label="Validar Internación"]').click();
    //     cy.get('button').contains('CONFIRMAR').click()
    // })

    // it('evento externo', () => {

    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-close-box').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-select[label="Tipo de egreso"] input').type('alta')
    //     cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Alta médica"]').click({ force: true })
    //     cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('S00.4')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="59bbf1ef53916746547ccc04"]').click({ force: true })
    //     cy.get('plex-select[label="Producido por:"] input').type('Accidente')
    //     cy.get('.option[ data-value="Accidente"]').click({ force: true })


    //     cy.get('plex-select[label="Lugar donde ocurrio"] input').type('otro')
    //     cy.get('.option[ data-value="otro"]').click({ force: true })

    //     cy.get('plex-select[label="Como se produjo"] input').type('w21.4')
    //     cy.get('.option[data-value="59bbf1f053916746547cd4de"]').click({ force: true })
    //        cy.get('plex-button[label="Guardar"]').click();
    //     cy.get('plex-button[label="Validar Internación"]').click();
    //     cy.get('button').contains('CONFIRMAR').click()
    // })

    // it('egreso por traslado', () => {

    // cy.get('.ocupada').first().click();
    // cy.get('.mdi-close-box').first().click({ force: true });
    // cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    // cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    // cy.get('plex-select[label="Tipo de egreso"] input').type('Traslado')
    // cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Traslado"]').click({ force: true })


    // cy.get('plex-select[label="Unidad organizativa de destino"] input').type('heller')
    // cy.get('.option[data-value="57fcf038326e73143fb48dac"]').click({ force: true })
    // cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('G47.3')
    // cy.get('.option[data-value="59bbf1ed53916746547cb9e9"]').click({ force: true })
    //          cy.get('plex-button[label="Guardar"]').click();
    // cy.get('plex-button[label="Validar Internación"]').click();
    // cy.get('button').contains('CONFIRMAR').click()



    // })
    it('egreso por traslado', () => {
        cy.get('.card-container').then(($body) => {
            if ($body.hasClass('ocupada')) {
                console.log("aca si")
                cy.get('.ocupada').first().click();
                cy.get('.mdi-close-box').first().click({ force: true });
                cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
                cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
                cy.get('plex-select[label="Tipo de egreso"] input').type('alta')
                cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Alta médica"]').click({ force: true })
                cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('acne tropical')
                cy.wait(2000)
                cy.get('.option[data-value="59bbf1ee53916746547cc10b"]').click({ force: true })
                cy.get('plex-button[label="Guardar"]').click();
                cy.get('plex-button[label="Validar Internación"]').click();
                cy.get('button').contains('CONFIRMAR').click()
                
            }
            if ($body.hasClass('desocupada')) {
                cy.get('.desocupada').first().click();
                cy.get('.mdi-spray').first().click({ force: true });

            }
            if ($body.hasClass('disponible')) {
                cy.get('.disponible').first().click();
            }
        })




    })



    // it('fecha de egreso anterior a la fecha de ingreso', () => {
    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-close-box').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-dateTime[name="fecha-hora"] input').clear()
    //     cy.get('plex-dateTime[name="fecha-hora"] input').first().type('15012019').should('have.value', '15012019');
    // })

})