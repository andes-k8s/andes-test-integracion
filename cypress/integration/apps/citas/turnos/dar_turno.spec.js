context('CITAS - punto de inicio', () => {
    let token;
    let pacientes;

    before(() => {
        cy.seed();
        cy.login('30643636', 'asd').then(t => {
            token = t;
            cy.task('database:seed:agenda', { tipoPrestaciones: '598ca8375adc68e2a0c121d5', dinamica: true, profesionales: null, inicio: '22', fin: '23' });
            cy.task('database:seed:agenda', { tipoPrestaciones: '598ca8375adc68e2a0c121d5', fecha: 1, tipo: 'programado' });
            cy.task('database:seed:paciente').then(p => { pacientes = p; })
        });
    });

    beforeEach(() => {
        cy.server();
        cy.goto('/citas/punto-inicio', token);
        cy.route('GET', '**api/core/mpi/pacientes?**').as('busquedaPaciente');
        cy.route('GET', '**api/core/log/paciente?idPaciente=**').as('seleccionPaciente');
        cy.route('GET', '**api/core/tm/tiposPrestaciones**').as('prestaciones');
        cy.route('GET', '**/api/modules/turnos/agenda?rango=true&desde=**').as('cargaAgendas');
        cy.route('PATCH', '**/api/modules/turnos/turno/**').as('darTurno');
        cy.route('GET', '**/api/modules/turnos/agenda/**').as('seleccionAgenda');
        cy.route('GET', '**/api/core/tm/profesionales**').as('getProfesionales');
    })


    it('Buscar agenda por prestación (0 resultados)', () => {
        darTurno(pacientes[0]);
        cy.wait('@prestaciones');
        cy.plexSelectAsync('name="tipoPrestacion"', 'Consulta de adolescencia', '@prestaciones', 0);
        cy.wait('@cargaAgendas').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
            expect(xhr.response.body).to.have.length(0);
        });
    });


    it('Buscar agenda por prestación (2 resultados)', () => {
        darTurno(pacientes[0]);
        cy.wait('@prestaciones');
        cy.plexSelectAsync('name="tipoPrestacion"', 'consulta con médico oftalmólogo', '@prestaciones', 0);
        if (cy.esFinDeMes()) {
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(1);
            });
            cy.plexButtonIcon('chevron-right').click();
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(2);
            });
        } else {
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(2);
            });
        }
    });


    it('Buscar agenda por profesional (0 resultados)', () => {
        darTurno(pacientes[0]);
        cy.wait('@prestaciones');
        cy.plexSelectAsync('name="profesional"', 'PRUEBA ALICIA', '@getProfesionales', 0);

        cy.wait('@cargaAgendas').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
            expect(xhr.response.body).to.have.length(0);
        });
    });

    it('Buscar agenda por profesional (1 resultados)', () => {
        darTurno(pacientes[0]);
        cy.wait('@prestaciones');
        cy.plexSelectAsync('name="profesional"', 'HUENCHUMAN NATALIA', '@getProfesionales', 0);

        if (cy.esFinDeMes()) {
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(0);
            });
            cy.plexButtonIcon('chevron-right').click();
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(1);
            });
        } else {
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(1);
            });
        }
    });

    ['validado', 'temporal', 'sin-documento'].forEach((type, i) => {
        it('dar turno programado con filtros - paciente ' + type, () => {
            const paciente = pacientes[i];
            darTurno(paciente);

            cy.wait('@prestaciones');
            cy.plexSelectAsync('name="tipoPrestacion"', 'consulta con médico oftalmólogo', '@prestaciones', 0);

            if (cy.esFinDeMes()) {
                cy.wait('@cargaAgendas').then((xhr) => {
                    expect(xhr.status).to.be.eq(200);
                    expect(xhr.response.body).to.have.length(1);
                });
                cy.plexButtonIcon('chevron-right').click();
                cy.wait('@cargaAgendas').then((xhr) => {
                    expect(xhr.status).to.be.eq(200);
                    expect(xhr.response.body).to.have.length(2);
                });
            } else {
                cy.wait('@cargaAgendas').then((xhr) => {
                    expect(xhr.status).to.be.eq(200);
                    expect(xhr.response.body).to.have.length(2);
                });
            }
            cy.plexSelectAsync('name="profesional"', 'HUENCHUMAN NATALIA', '@getProfesionales', 0);
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(1);
            });

            cy.get('div[class="dia"]').contains(Cypress.moment().add(1, 'days').format('D')).click();

            cy.wait('@seleccionAgenda').then((xhr) => {
                expect(xhr.status).to.be.eq(200)
            });
            cy.get('dar-turnos div[class="text-center hover p-2 mb-3 outline-dashed-default"]').first().click();


            cy.get('label').contains("Paciente").parent().contains(paciente.nombre);
            cy.get('label').contains("Tipo de prestación").parent().contains('consulta con médico oftalmólogo');
            cy.get('label').contains("Equipo de Salud").parent().contains('HUENCHUMAN');
            cy.get('label').contains("Equipo de Salud").parent().contains('NATALIA VANESA');


            cy.plexButton('Confirmar').click();
            cy.wait('@darTurno').then((xhr) => {
                expect(xhr.status).to.be.eq(200)
            });
        });

        it('dar turno agenda dinámica - paciente ' + type, () => {
            const paciente = pacientes[i];
            darTurno(paciente);

            cy.wait('@prestaciones');

            cy.plexSelectAsync('name="tipoPrestacion"', 'consulta con médico oftalmólogo', '@prestaciones', 0);
            cy.wait('@cargaAgendas');
            cy.get('app-calendario .dia').contains(Cypress.moment().date()).click();
            cy.wait('@seleccionAgenda').then((xhr) => {
                expect(xhr.status).to.be.eq(200)
            });
            // cy.get('plex-button[label="Dar Turno"]').click();
            cy.plexButton('Dar Turno').click();
            cy.plexButton('Confirmar').click();
            // Confirmo que se dio el turno desde la API
            cy.wait('@darTurno').then((xhr) => {
                expect(xhr.status).to.be.eq(200)
            });
        });

        // Test para verificar que al no asignar el turno, guarde la organizacion
        it('rechazar turno', () => {
            cy.route('POST', '**/api/modules/turnos/listaEspera**').as('listaEspera');
            const paciente = pacientes[i];
            darTurno(paciente);

            cy.wait('@prestaciones');
            cy.selectOption('name="tipoPrestacion"', '"598ca8375adc68e2a0c121d5"');
            cy.wait('@cargaAgendas');
            cy.get('app-calendario .dia').contains(Cypress.moment().date()).click();
            cy.wait('@seleccionAgenda')
            cy.plexButton('No se asigna turno').click();
            cy.wait('@listaEspera').then((xhr) => {
                expect(xhr.response.body).to.have.property('organizacion');
            });
        });

    })

    it('Verifica fecha/hora y usuario de dacion de turno', () => {
        const hoy = Cypress.moment().format('DD/MM/YYYY')
        darTurno(pacientes[0]);
        cy.wait('@prestaciones');
        cy.plexSelectAsync('name="tipoPrestacion"', 'consulta con médico oftalmólogo', '@prestaciones', 0);
        if (cy.esFinDeMes()) {
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(1);
            });
            cy.plexButtonIcon('chevron-right').click();
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(2);
            });

        } else {
            cy.wait('@cargaAgendas').then((xhr) => {
                expect(xhr.status).to.be.eq(200);
                expect(xhr.response.body).to.have.length(2);
            });

        }
        cy.plexSelectAsync('name="profesional"', 'HUENCHUMAN NATALIA', '@getProfesionales', 0);
        cy.wait('@cargaAgendas').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
            expect(xhr.response.body).to.have.length(1);
        });
        cy.get('div[class="dia"]').contains(Cypress.moment().add(1, 'days').format('D')).click();

        cy.wait('@seleccionAgenda').then((xhr) => {
            expect(xhr.status).to.be.eq(200)
        });
        cy.get('dar-turnos div[class="text-center hover p-2 mb-3 outline-dashed-default"]').first().click();
        cy.plexButton('Confirmar').click();
        cy.wait('@cargaAgendas').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
            const fechaHora = Cypress.moment(xhr.response.body[0].bloques[0].turnos[0].fechaHoraDacion).format('DD/MM/YYYY');
            expect(fechaHora).to.be.eq(hoy);
            expect(xhr.response.body[0].bloques[0].turnos[0].usuarioDacion.nombreCompleto).to.be.eq('Natalia Huenchuman');
        });
    });

});

function darTurno(paciente) {
    cy.route('GET', '**api/core/mpi/pacientes/**').as('darTurnoPaciente');
    let searchField = paciente.documento || paciente.nombre;

    cy.plexText('name="buscador"', searchField);

    cy.wait('@busquedaPaciente').then((xhr) => {
        expect(xhr.status).to.be.eq(200);
    });
    cy.get('paciente-listado table').find('td').contains(searchField).click();
    cy.wait('@seleccionPaciente').then((xhr) => {
        expect(xhr.status).to.be.eq(200);
    });
    cy.plexButtonIcon('calendar-plus').click({ force: true });
    return cy.wait('@darTurnoPaciente').then((xhr) => {
        expect(xhr.status).to.be.eq(200);
    });
}
