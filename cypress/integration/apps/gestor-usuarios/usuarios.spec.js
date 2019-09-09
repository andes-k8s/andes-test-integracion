context('Gestor de Usuarios', () => {
    let token;

    before(() => {
        cy.login('30643636', 'asd').then(t => {
            token = t;
        })
    })

    it('get usuario', () => {
        const request = cy.get('/api/modules/gestor-usuarios/usuarios/30643636', token);
        request.its('status').should('equal', 200);
    });

    it('search usuario by documento', () => {
        cy.get('/api/modules/gestor-usuarios/usuarios?search=38906735&fields=-password -permisosGlobales', token, {
            fields: '-password'
        }).then(xhr => {
            expect(xhr.status).to.eq(200);
            expect(xhr.body).to.have.lengthOf(1);
            expect(xhr.body[0]).to.have.property('nombre', '38906735');
        });
    });

    it('get usuarios by organización', () => {
        cy.get('/api/modules/gestor-usuarios/usuarios?organizacion=57e9670e52df311059bc8964&fields=-password -permisosGlobales', token, {
            fields: '-password'
        }).then(xhr => {
            expect(xhr.status).to.eq(200);
            expect(xhr.body).to.have.lengthOf(3);
        });
    });

    it('patch usuario', () => {
        let cambios = {
            "permisos": ["turnos:*", "mpi:nuevoPaciente", "mpi:editarPaciente", "mpi:bloque:*", "mpi:matching:*", "mpi:paciente:*"],
            "id": "57fcf037326e73143fb48af5",
            "nombre": "CENTRO DE SALUD VALENTINA SUR",
            "perfiles": []
        };
        cy.patch('/api/modules/gestor-usuarios/usuarios/38906735/organizaciones/57fcf037326e73143fb48af5', cambios, token).then(xhr => {
            expect(xhr.status).to.eq(200);
            expect(xhr.body.nombre).to.be.equal('CENTRO DE SALUD VALENTINA SUR');
        });
    });

});