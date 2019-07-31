/// <reference types="Cypress" />

context('Aliasing', () => {
    let token
    before(() => {
        cy.login('30643636', 'asd').then(t => {
            token = t;
            cy.createPaciente('solicitudes/paciente-solicitud', token);
            cy.createAgenda48hs('solicitudes/agendaProfesional', token);
        })
    })

    beforeEach(() => {
        cy.viewport(1280, 720)

        cy.visit(Cypress.env('BASE_URL') + '/solicitudes', {
            onBeforeLoad: (win) => {
                win.sessionStorage.setItem('jwt', token);
            }
        });
    })

    it('crear nueva regla solicitud', () => {
        cy.server();
        cy.route('GET', '**/api/core/tm/tiposPrestaciones?turneable=1').as('getPrestaciones');
        cy.route('GET', '**/api/modules/top/reglas?organizacionDestino=**').as('getReglasOrganizacionDestino');
        cy.route('GET', '**/api/core/tm/organizaciones').as('getOrganizaciones');
        cy.route('POST', '**/api/modules/top/reglas').as('guardarRegla');

        cy.get('plex-button[label="Reglas"]').click();

        cy.wait('@getPrestaciones');

        cy.get('plex-select[label="Prestación Destino"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="5a26e113291f463c1b982d98"]').click({
            force: true
        })
        cy.wait('@getReglasOrganizacionDestino');

        cy.get('plex-select[name="organizacion"] input').type('hospital dr. horacio heller');
        cy.wait('@getOrganizaciones');
        cy.get('plex-select[name="organizacion"] input').type('{enter}');

        cy.get('plex-button[title="Agregar Organización"]').click();

        cy.wait('@getPrestaciones');

        cy.get('plex-select[name="prestacionOrigen"] input').type('medicina general');
        cy.wait('@getPrestaciones');
        cy.get('plex-select[name="prestacionOrigen"] input').type('{enter}');

        cy.get('plex-button[title="Agregar Prestación"]').click();

        cy.get('plex-button[label="Guardar"]').click();

        cy.wait('@guardarRegla').then(xhr => {
            expect(xhr.status).to.be.eq(200);
        });
    })

    it('crear solicitud de entrada', () => {
        cy.server();
        cy.route('GET', '**/api/core/mpi/pacientes**').as('consultaPaciente');
        cy.route('GET', '**/api/modules/top/reglas?organizacionDestino=**').as('getReglas');
        cy.route('GET', '**/api/core/tm/profesionales?nombreCompleto=**').as('getProfesional');
        cy.route('POST', '**/api/modules/rup/prestaciones').as('guardarSolicitud');

        cy.get('plex-button[label="Nueva Solicitud"]').click();
        cy.get('paciente-buscar plex-text[name="buscador"] input').first().type('32589654');
        cy.wait('@consultaPaciente');
        cy.get('table tbody').contains('32589654').click();

        cy.get('a[class="introjs-button introjs-skipbutton introjs-donebutton"]').click();

        cy.get('plex-datetime[name="fechaSolicitud"] input').type(Cypress.moment().format('DD/MM/YYYY'));
        cy.get('plex-select[label="Tipo de Prestación Solicitada"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="5a26e113291f463c1b982d98"]').click({
            force: true
        });

        cy.wait('@getReglas');
        cy.get('plex-select[name="organizacionOrigen"] input').type('hospital dr. horacio heller{enter}');
        cy.get('plex-select[label="Tipos de Prestación Origen"] input').type('consulta de medicina general{enter}');
        cy.get('plex-select[name="profesionalOrigen"] input').type('perez maria');
        cy.wait('@getProfesional');
        cy.get('plex-select[name="profesionalOrigen"] input').type('{enter}');

        cy.get('plex-select[name="profesional"] input').type('natalia huenchuman');
        cy.wait('@getProfesional');
        cy.get('plex-select[name="profesional"] input').type('{enter}');
        cy.get('textarea').last().type('Motivo de la solicitud', {
            force: true
        });
        cy.get('plex-button[label="Guardar"]').click();
        cy.wait('@guardarSolicitud').then(xhr => {
            expect(xhr.status).to.be.eq(200);
            expect(xhr.response.body.solicitud.registros[0].valor.solicitudPrestacion.motivo).to.be.eq('Motivo de la solicitud');
        });
    })

    it.skip('crear solicitud de salida', () => { // TODO: molesta el wizard
        cy.server();
        cy.route('GET', '**/api/core/mpi/pacientes').as('consulta');

        cy.get('plex-button[label="Nueva Solicitud"]').click();

        cy.get('plex-text input[type=text]').first().type('38906735').should('have.value', '38906735');

        // cy.wait('@consulta').then((xhr) => {
        //     expect(xhr.status).to.be.eq(200)
        // })
        cy.get('tr').eq(1).click()

        cy.get('plex-dateTime[name="fechaSolicitud"] input').type('25/10/2018').should('have.value', '25/10/2018');

        cy.get('plex-select[label="Tipo de Prestación Solicitada"]').children().children('.selectize-control').click({
            force: true
        })
            .find('.option[data-value="59ee2d9bf00c415246fd3d6a"]').click({
                force: true
            })

        cy.get('plex-select[label="Organización origen"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="57e9670e52df311059bc8964"]').click({
            force: true
        })
        cy.get('plex-select[label="Tipos de Prestación Origen"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="391000013108"]').click({
            force: true
        })
        cy.get('plex-select[label="Profesional solicitante"] input').type('valverde')
        cy.get('plex-select[label="Profesional solicitante"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="58f74fd4d03019f919ea243e"]').click({
            force: true
        })
        cy.get('plex-select[label="Profesional destino"] input').type('santarelli')
        cy.get('plex-select[label="Profesional destino"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="5b4df3aebd7c1f8e59138be6"]').click({
            force: true
        })
        cy.get('textarea').last().type('ni', {
            force: true
        });
        cy.get('plex-button[label="Guardar"]').click();
        // cy.get('plex-text input[type=text]').first().type('botta').should('have.value', 'botta');

        // cy.get('div.alert.alert-danger').should('exist');
    })

    it('Crear solicitud autocitado', () => {
        cy.server();
        cy.route('GET', '**/api/core/tm/tiposPrestaciones?turneable=1').as('prestacion');
        cy.route('GET', '**/api/core/tm/profesionales?**').as('profesional');
        cy.route('GET', '**/api/core/mpi/pacientes?**').as('busquedaPaciente');
        cy.route('GET', '**/api/modules/top/reglas?organizacionDestino=**').as('getReglasOrganizacionDestino');
        cy.route('POST', '**/api/modules/rup/prestaciones').as('guardarSolicitud');

        cy.get('plex-button[label="Nueva Solicitud"]').click();
        cy.get('paciente-buscar plex-text[placeholder="Escanee un documento digital, o escriba un documento / apellido / nombre"] input').first().type('32589654');

        cy.wait('@busquedaPaciente');

        cy.get('table tbody td span').contains('32589654').click();
        cy.get('plex-datetime[name="fechaSolicitud"] input').type(Cypress.moment().format('DD/MM/YYYY')); -
            cy.get('plex-bool[name="autocitado"] input').check({
                force: true
            });

        // Tipo de prestación solicitada
        cy.get('plex-select[label="Tipo de Prestación Solicitada"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="59ee2d9bf00c415246fd3d6b"]').click({
            force: true
        })

        cy.wait('@getReglasOrganizacionDestino');

        // Profesional Solicitante
        cy.get('plex-select[label="Profesional solicitante"] input').type('PEREZ MARIA', {
            force: true
        });

        cy.wait('@profesional');

        cy.get('plex-select[label="Profesional solicitante"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="5c82a5a53c524e4c57f08cf3"]').click({
            force: true
        })

        // Motivo de la solicitud
        cy.get('textarea').last().type('Motivo Solcitud', {
            force: true
        });

        cy.get('plex-button[label="Guardar"]').click({
            force: true
        });

        cy.wait('@guardarSolicitud').then((xhr) => {
            expect(xhr.status).to.be.eq(200)
        });
    });

    it('dar turno autocitado', () => {
        cy.server();
        cy.route('GET', '**/api/core/tm/tiposPrestaciones?turneable=1').as('getPrestaciones');
        cy.route('GET', '**/api/modules/turnos/agenda?**').as('agendas');
        cy.route('GET', '**api/modules/carpetas/carpetasPacientes**').as('carpetasPacientes');

        cy.get('plex-button[type="default"]').click();
        cy.get('plex-select[label="Estado"] input').type('pendiente{enter}');

        cy.get('plex-select[label="Prestación destino"] input').type('Consulta clínica médica{enter}');

        cy.get('tbody td').should('contain', 'AUTOCITADO').and('contain', 'PEREZ, MARIA');
        cy.get('plex-button[title="Dar Turno"]').click({
            force: true
        });

        cy.wait('@carpetasPacientes');
        cy.wait('@getPrestaciones');
        cy.wait('@agendas');

        let fechaAgenda48hs = Cypress.moment().add(2, 'days');
        if (fechaAgenda48hs.month() > Cypress.moment().month()) {
            cy.get('plex-button[icon="chevron-right"]').click();
            cy.wait('@agendas');
        }

        cy.get('div[class="dia"]').contains(Cypress.moment().add(2, 'days').format('D')).click({
            force: true
        });

        cy.get('dar-turnos div[class="text-center hover p-2 mb-3 outline-dashed-default"]').first().click();
        cy.get('plex-button[label="Confirmar"]').click();

        // Confirmo que se le dio el turno
        cy.get('div[class="simple-notification toast info"]').contains('El turno se asignó correctamente');
    });

    it.skip('crear solicitud desde rup', () => { // TODO: carga mal la prestacion
        cy.server();

        cy.get('plex-button[label="PACIENTE FUERA DE AGENDA"]').click();
        cy.get('plex-select[name="nombrePrestacion"]').children().children('.selectize-control').click()
            .find('.option[data-value="59ee2d9bf00c415246fd3d6a"]').click()
        cy.get('plex-button[label="SELECCIONAR PACIENTE"]').click();
        cy.get('plex-text input[type=text]').first().type('38906735').should('have.value', '38906735');
        cy.get('tr').eq(1).click()
        cy.get('plex-button[label="INICIAR PRESTACIÓN"]').click();

        cy.route('GET', '**/api/modules/rup/elementosRUP').as('elementosRUP');
        cy.route('GET', '**/api/core/tm/tiposPrestaciones').as('tipoPrestaciones');


        cy.wait('@elementosRUP').then((xhr) => {
            expect(xhr.status).to.be.eq(200)
        })
        cy.wait('@tipoPrestaciones').then((xhr) => {
            expect(xhr.status).to.be.eq(200)
        })
        cy.wait(2000)
        cy.get('div').then(($body) => {
            if ($body.hasClass('introjs-helperLayer')) {
                cy.get('.introjs-tooltipbuttons').children('.introjs-skipbutton').click({
                    force: true
                })
            } else { }
        })
        // cy.get('.introjs-skipbutton').should('be.visible').click({ force: true })
        cy.get('plex-text[name="searchTerm"] input').first().type('Consulta De Pediatría')

        // cy.get('.introjs-skipbutton').contains('Cerrar').click({force:true})
        cy.get('.mdi-plus').first().click();
        cy.get('textarea').first().type('ni', {
            force: true
        });
        cy.get('textarea').eq(1).type('ni', {
            force: true
        });
        cy.get('plex-select[label="Organización destino"] input').type('castro')
        cy.get('plex-select[label="Organización destino"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="57e9670e52df311059bc8964"]').click({
            force: true
        })
        cy.get('plex-select[label="Profesional(es) destino"] input').type('valverde')
        cy.get('plex-select[label="Profesional(es) destino"]').children().children().children('.selectize-input').click({
            force: true
        }).get('.option[data-value="58f74fd4d03019f919ea243e"]').click({
            force: true
        })
        cy.get('plex-button').contains('Guardar Consulta de medicina general').click();
        cy.wait(3000)
        cy.get('plex-button').contains('Validar Consulta de medicina general').first().click();
        cy.get('button').contains('CONFIRMAR').click()


        // cy.get('plex-text input[type=text]').first().type('botta').should('have.value', 'botta');

        // cy.get('div.alert.alert-danger').should('exist');
    })
})