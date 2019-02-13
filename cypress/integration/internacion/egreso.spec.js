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


    // it('Egreso datos minimos', () => {
    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-format-list-bulleted').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-select[label="Tipo de egreso"] input').type('alta')
    //     cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Alta médica"]').click({ force: true })
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.contains('Prestacion guardada');
    //  cy.log('Termino bien')
    // })


    // it('evento obstétrico', () => {
    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-format-list-bulleted').first().click({ force: true });
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
    //     cy.contains('Prestacion guardada');
    //  cy.log('Termino bien')
    // })

    // it('evento externo', () => {
    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-format-list-bulleted').first().click({ force: true });
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
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.contains('Prestacion guardada');
    //  cy.log('Termino bien')
    // })

    // it('egreso por traslado', () => {
    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-format-list-bulleted').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-select[label="Tipo de egreso"] input').type('Traslado')
    //     cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Traslado"]').click({ force: true })
    //     cy.get('plex-select[label="Unidad organizativa de destino"] input').type('heller')
    //     cy.get('.option[data-value="57fcf038326e73143fb48dac"]').click({ force: true })
    //     cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('G47.3')
    //     cy.get('.option[data-value="59bbf1ed53916746547cb9e9"]').click({ force: true })
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.contains('Prestacion guardada');
    //  cy.log('Termino bien')
    // })


    // it('egreso por traslado', () => {
    //     cy.get('.card-container').then(($body) => {
    //         if ($body.hasClass('ocupada')) {
    //             cy.get('.ocupada').first().click();
    //             cy.get('.mdi-format-list-bulleted').first().click({ force: true });
    //             cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //             cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //             cy.get('plex-select[label="Tipo de egreso"] input').type('alta')
    //             cy.get('plex-select[label="Tipo de egreso"]').children().children().children('.selectize-input').click({ force: true }).get('.option[data-value="Alta médica"]').click({ force: true })
    //             cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('acne tropical')
    //             cy.wait(2000)
    //             cy.get('.option[data-value="59bbf1ee53916746547cc10b"]').click({ force: true })
    //             cy.get('plex-button[label="Guardar"]').click();
    //             cy.contains('Prestacion guardada');
    //             cy.log('Termino bien')
    //         }
    //     })
    // })



    // it('fecha de egreso anterior a la fecha de ingreso', () => {
    //     cy.get('.card-container').then(($body) => {
    //         if ($body.hasClass('ocupada')) {
    //             cy.get('.ocupada').first().click();
    //             cy.get('.mdi-format-list-bulleted').first().click({ force: true });
    //             cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //             cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //             cy.get('plex-dateTime[label="Fecha"] input').clear()
    //             cy.get('plex-dateTime[label="Fecha"] input').first().type('15012019').should('have.value', '15012019');
    //             cy.contains('ERROR: La fecha de egreso no puede ser inferior');
    //             cy.log('Termino bien')
    //         }
    //     })
    // })

    // it('fecha de egreso anterior a la fecha del ultimo movimiento', () => {
    //     cy.get('.card-container').then(($body) => {
    //         if ($body.hasClass('ocupada')) {
    //             cy.get('.ocupada').first().click();
    //             cy.get('.mdi-format-list-bulleted').first().click({ force: true });
    //             cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //             cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //             cy.get('plex-dateTime[label="Fecha"] input').clear()
    //             cy.get('plex-dateTime[label="Fecha"] input').first().type('11022019').should('have.value', '11022019');
    //             cy.contains('ERROR: La fecha de egreso no puede ser inferior a ');
    //             cy.log('Termino bien')
    //         }
    //     })
    // })

    // it('egreso datos completos', () => {
    //     cy.get('.ocupada').first().click();
    //     cy.get('.mdi-format-list-bulleted').first().click({ force: true });
    //     cy.get('#mat-radio-3').children().children('.mat-radio-container').click({ force: true });
    //     cy.get('.mdi-arrow-down-drop-circle-outline').click({ force: true });
    //     cy.get('plex-select[label="Tipo de egreso"] input').type('Trasl')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="Traslado"]').click();
    //     cy.get('plex-select[label="Unidad organizativa de destino"] input').type('heller')
    //     cy.get('.option[data-value="57fcf038326e73143fb48dac"]').click({ force: true })
    //     cy.get('plex-select[label="Diagnostico Principal al egreso"] input').type('T98.2')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="59bbf1f053916746547cd0fc"]').click({ force: true })
    //     cy.get('plex-select[label="Otros Diagnósticos"] input').type('O84.9')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="59bbf1ee53916746547cc6ae"]').click({ force: true })
    //     cy.get('plex-select[label="Otras circunstancias"] input').type('G03.1')
    //     cy.wait(2000)
    //     cy.get('.option[data-value="59bbf1ed53916746547cb960"]').click({ force: true })
    //     cy.get('plex-int[label="Otros días de estada"] input').type(6)
    //     cy.get('plex-int[label="Días de permiso de salida"] input').type(4)
    //     cy.get('plex-select[label="Producido por:"] input').type('agresion')
    //     cy.get('.option[ data-value="agresion"]').click({ force: true })
    //     cy.get('plex-select[label="Lugar donde ocurrio"] input').type('Vía pública')
    //     cy.get('.option[ data-value="viaPublico"]').click({ force: true })
    //     cy.get('plex-select[label="Como se produjo"] input').type('Y07.9')
    //     cy.get('.option[data-value="59bbf1f053916746547cdb88"]').click({ force: true })
    //     cy.get('plex-select[label="Procedimientos"] input').type('Inserción de dispositivos')
    //     cy.get('.option[data-value="5a944889968364d0143dd0ef"]').click({ force: true })
    //     cy.get('plex-dateTime[label="Fecha"] input').eq(1).type('10022019');
    //     cy.get('plex-button[label="Agregar procedimiento"]').click()
    //     cy.get('plex-select[label="Procedimientos"] input').eq(1).type('EXAMEN')
    //     cy.get('.option[data-value="5a944889968364d0143dd0ed"]').eq(1).click({ force: true })
    //     cy.get('plex-dateTime[label="Fecha"] input').eq(2).type('090022019');
    //     cy.get('plex-button[label="Agregar procedimiento"]').click();
    //     cy.get('div[class="col-2 p-1 float-right"]').eq(2).click();
    //     cy.get('plex-button[label="Guardar"]').click();
    //     cy.contains('Prestacion guardada');
    //  cy.log('Termino bien')
    // });

})
