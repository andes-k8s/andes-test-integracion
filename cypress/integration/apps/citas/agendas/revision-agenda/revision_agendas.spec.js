/// <reference types="Cypress" />

export function buscarPaciente(pacienteDoc) {
    cy.plexButton("Buscar Paciente").click();
    cy.plexText('name="buscador"', pacienteDoc);

    cy.server();

    cy.wait('@listaPacientes');

    cy.get('tr td').contains(pacienteDoc).click();
    cy.wait(100);

    cy.plexButton("Cambiar Paciente").click();
    cy.plexText('name="buscador"', pacienteDoc);

    cy.wait('@listaPacientes');
    cy.get('tr td').contains(pacienteDoc).click();
};


context('CITAS - Revisión de Agendas', () => {
    let token;
    let idAgenda;
    let idBloque;
    let idTurno;
    let paciente;
    let pacienteDoc;
    const estadosAuditables = [
        'publicada',
        'pendienteAsistencia',
        'pendienteAuditoria',
        'auditada'
    ];
    const asistencias = [
        'Asistio',
        'No Asistio',
        'Sin Datos'
    ];
    before(() => {
        cy.seed();

        cy.login('30643636', 'asd').then(t => {
            token = t;
            return cy.createPaciente('paciente-masculino', token);
        }).then(xhr => {
            paciente = xhr.body;
            pacienteDoc = xhr.body.documento;
            return cy.createAgenda('agenda-auditada', null, null, null, token);
        }).then((xhrAgenda) => {
            idAgenda = xhrAgenda.body.id;
            idBloque = xhrAgenda.body.bloques[0].id;
            idTurno = xhrAgenda.body.bloques[0].turnos[0].id;
            return cy.createTurno('nuevo-turno-asistio', idTurno, idBloque, idAgenda, paciente, token);
        });
    });

    beforeEach(() => {
        cy.server();
        cy.route('GET', '**/api/modules/turnos/agenda/*').as('agenda');
        cy.route('GET', '**/api/core/mpi/pacientes**').as('listaPacientes');
        cy.goto(`/citas/revision_agenda/${idAgenda}`, token);
    });

    it('Comprueba datos de la agenda', () => {

        cy.plexButtonIcon('chevron-down').click();
        cy.get('plex-layout-sidebar header > fieldset > div > div:nth-child(2) > div').contains(/[A-Z]{3}\. [0-9]{2}\/[0-9]{2}\/[0-9]{4}, [0-9]{2}:[0-9]{2} a [0-9]{2}:[0-9]{2} hs/).should('not.be.empty');
        cy.get('plex-layout-sidebar header > fieldset > div > div:nth-child(3) > div div').should('not.be.empty');
        cy.get('plex-layout-sidebar header > fieldset > div > div:nth-child(4) > div div').should('not.be.empty');
        cy.get('plex-layout-sidebar header > fieldset > div > div:nth-child(5) > div span').should('not.be.empty');
        cy.plexButtonIcon('chevron-up').click();

        cy.wait('@agenda').then(xhrAgenda => {
            cy.expect(xhrAgenda.status).to.be.eq(200);

            const body = xhrAgenda.response.body;

            // El ID de la Agenda es el que se buscó en un principio?
            cy.expect(body.id).to.be.eq(idAgenda);

            // El estado de la Agenda es 'pendienteAuditoria'?
            cy.expect(body.estado).to.be.eq('pendienteAuditoria');

            // El horario de la agenda ya pasó?
            cy.expect(Cypress.moment(body.horaFin).format('x')).to.be.lt(Cypress.moment().format('x'));

            // La agenda es auditable? estados auditables: publicada, pendienteAsistencia, pendienteAuditoria, auditada
            cy.expect(estadosAuditables.findIndex(x => x === body.estado)).to.be.gt(-1);

        });

    });

    it('Agregar y eliminar un diagnóstico', () => {

        cy.route('PUT', '**/api/modules/turnos/turno/*/bloque/*/agenda/*').as('asistencia');
        cy.route('PATCH', '**/api/modules/turnos/agenda/*').as('estadoAgenda');

        cy.get('tr:nth-child(1) td:first-child').click();

        buscarPaciente(pacienteDoc);
        cy.plexSelectType('label="Asistencia"', 'Asistio');
        cy.plexText('name="searchTerm"', 'c11');

        cy.route('GET', '**/api/core/term/cie10**').as('diagnosticos');

        cy.wait('@diagnosticos').then(xhrDiag => {
            cy.expect(xhrDiag.status).to.be.eq(200);
            cy.expect(xhrDiag.response.body.length).to.be.gt(0);
            const diagnostico = xhrDiag.response.body.find(x => x.codigo === 'C11.0').codigo;

            cy.get('tr td').contains(diagnostico).click();

            cy.plexButtonIcon('delete').click();

        });

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


    it.only('Asignar asistencia a todos los turnos, mismo paciente', () => {
        cy.route('PATCH', '**/api/modules/turnos/agenda/*').as('estadoAgenda');

        let listaTurnos = cy.get('plex-layout-sidebar > .plex-box > .plex-box-content table:first-child tr');

        listaTurnos.each(($el, index, $list) => {
            cy.log($list);
            if (index > -1) {
                cy.get($el).click();
                buscarPaciente(pacienteDoc);
                const key = cy.random(2);
                cy.log(key);
                cy.plexSelectType('label="Asistencia"').click().get('.option').contains(String(asistencias[key])).click();
                cy.get('.simple-notification').click();
            }
        });

        // Se cambió el estado a 'auditada'?
        cy.wait('@estadoAgenda').then(xhrEstadoAgenda => {
            cy.expect(xhrEstadoAgenda.status).to.be.eq(200);
            cy.expect(xhrEstadoAgenda.response.body.estado).to.be.eq(xhrEstadoAgenda.request.body.estado);
        });

    });

});