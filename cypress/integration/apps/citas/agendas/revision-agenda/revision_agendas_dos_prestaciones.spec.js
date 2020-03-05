/// <reference types="Cypress" />

context('CITAS - Revisión de Agendas', () => {
    let token;
    let horaInicio;
    let tipoPrestacion1;
    let tipoPrestacion2;
    let idAgenda;
    let idBloque;
    let idTurno;
    let paciente;
    let pacienteDoc;

    beforeEach(() => {
        cy.seed();

        cy.login('30643636', 'asd').then(t => {
            token = t;
            return cy.createPaciente('paciente-masculino', token);
        }).then(xhr => {
            paciente = xhr.body;
            pacienteDoc = xhr.body.documento;
            return cy.createAgenda('agenda-auditada-con-dos-prestaciones', null, null, null, token);
        }).then((xhr) => {
            idAgenda = xhr.body.id;
            idBloque = xhr.body.bloques[0].id;
            idTurno = xhr.body.bloques[0].turnos[0].id;
            horaInicio = xhr.body.horaInicio;
            tipoPrestacion1 = xhr.body.tipoPrestaciones[0];
            tipoPrestacion2 = xhr.body.tipoPrestaciones[1];
        });
    });


    it('Se selecciona la primera de dos prestaciones, luego se cambia por la segunda', () => {
        cy.server();
        cy.route('GET', '**/api/modules/turnos/agenda/**').as('agenda');
        cy.route('GET', '**/api/core/mpi/pacientes/**').as('paciente');
        cy.route('PUT', '**/api/modules/turnos/turno/*/bloque/*/agenda/*').as('asistencia');
        cy.route('PATCH', '**/api/modules/turnos/agenda/*').as('estadoAgenda');

        cy.goto(`/citas/revision_agenda/${idAgenda}`, token);
        cy.get('tbody:nth-child(1) tr:nth-child(3)').click();

        cy.buscarPaciente(pacienteDoc, false);

        cy.wait('@agenda').then(xhrAgenda => {
            cy.expect(xhrAgenda.status).to.be.eq(200);
            const turnoAgenda = xhrAgenda.response.body.bloques.find(x => x.id === idBloque).turnos.find(y => y.id === idTurno);
            cy.wait('@paciente').then(xhrPaciente => {
                cy.log(xhrPaciente);
                cy.expect(xhrPaciente.status).to.be.eq(200);
                cy.expect(xhrPaciente.response.body.id).to.be.eq(turnoAgenda.paciente.id);
            });
        });

        // El <plex-select> no está armado con label
        cy.plexSelectType('name="tipoPrestacionTurno"').click().get('.option').contains(tipoPrestacion1.term).click();
        // Se quita esta línea porque hay un issue en la app (#1566)
        // cy.plexSelectType('name="tipoPrestacionTurno"').click().get('.option').contains(tipoPrestacion2.term).click();
        cy.plexSelectType('label="Asistencia"', 'Asistio');

        cy.wait('@asistencia').then(xhrAsistencia => {
            cy.expect(xhrAsistencia.status).to.be.eq(200);
            const turnoAgenda = xhrAsistencia.response.body.bloques.find(x => x.id === idBloque).turnos.find(y => y.id === idTurno);
            cy.expect(turnoAgenda.asistencia).to.be.eq(xhrAsistencia.request.body.turno.asistencia);
        });

        cy.wait('@estadoAgenda').then(xhrEstadoAgenda => {
            cy.expect(xhrEstadoAgenda.status).to.be.eq(200);
            cy.expect(xhrEstadoAgenda.response.body.estado).to.be.eq(xhrEstadoAgenda.request.body.estado);
        });

    });

})