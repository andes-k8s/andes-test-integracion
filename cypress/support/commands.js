// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (usuario, password, id) => {
    let token;
    return cy.request('POST', Cypress.env('API_SERVER') + '/api/auth/login', {
        usuario,
        password
    }).then((response) => {
        token = response.body.token;
        return response = cy.request({
            url: Cypress.env('API_SERVER') + '/api/auth/organizaciones',
            method: 'GET',
            headers: {
                Authorization: 'JWT ' + token
            },
        }).then((response) => {
            let org = response.body[0];
            if (id) {
                org.id = id;
            }
            return response = cy.request({
                url: Cypress.env('API_SERVER') + '/api/auth/v2/organizaciones',
                method: 'POST',
                headers: {
                    Authorization: 'JWT ' + token
                },
                body: {
                    organizacion: org.id
                }
            }).then((response) => {
                return response.body.token;
            });
        });
    });
});




Cypress.Commands.add('goto', (url, token) => {
    if (token) {
        cy.server();
        cy.route('GET', '**/api/auth/sesion**').as('sesion');
    }
    cy.visit(url, {
        onBeforeLoad: (win) => {
            if (token) {
                win.sessionStorage.setItem('jwt', token);
            } else {
                win.sessionStorage.clear('jwt');
            }
        }
    });
    if (token) {
        return cy.wait('@sesion');
    }
});

Cypress.Commands.add('buscarPaciente', (pacienteDoc, cambiarPaciente = true) => {
    cy.plexButton("Buscar Paciente").click();
    cy.plexText('name="buscador"', pacienteDoc);

    cy.server();
    cy.route('GET', '**/api/core/mpi/pacientes**').as('listaPacientes');

    cy.wait('@listaPacientes');

    cy.get('tr td').contains(pacienteDoc).click();

    if (cambiarPaciente) {
        cy.plexButton("Cambiar Paciente").click();
        cy.plexText('name="buscador"', pacienteDoc);

        cy.wait('@listaPacientes');
        cy.get('tr td').contains(pacienteDoc).click();
    }
});

Cypress.Commands.add('countServer', function () {
    cy._apiCount = 0;
    cy.server({
        onRequest: () => {
            cy._apiCount++;
        },
        onResponse: (xhr) => {
            /**
             * Sometimes there are some time windows between API requests, e.g. Request1 finishes,
             * but Request2 starts after 100ms, in this case, cy.waitUntilAllAPIFinished() would
             * not work correctly, so when we decrease the counter, we need to have a delay here.
             */
            const delayTime = 500;
            if (cy._apiCount === 1) {
                setTimeout(() => {
                    cy._apiCount--;
                }, delayTime);
            } else {
                cy._apiCount--;
            }
        },
        onAbort: () => {
            const delayTime = 500;
            if (cy._apiCount === 1) {
                setTimeout(() => {
                    cy._apiCount--;
                }, delayTime);
            } else {
                cy._apiCount--;
            }
        }
    })
})

Cypress.Commands.add('waitUntilAllAPIFinished', () => {
    /**
     * If you pass a function as a parameter when calling should(), Cypress will retry that
     * function continuously within the timeout you provided, until the expectation inside
     * that function has been met.
     *
     * Note: the purpose of get('body') here is just to pass the timeout to the should() call,
     * basically you can get any element on the page.
     */
    const timeout = Cypress.env('apiMaxWaitingTime') || 60 * 1000;
    cy.log('Waiting for pending API requests:');
    cy.get('body', { timeout, log: true }).should(() => {
        expect(cy._apiCount).to.lte(0);
    });
});

