context('gestor-usuarios', () => {
    let token;
    let usuario1;
    let perfil1;
    before(() => {
        cy.seed();
        cy.task('database:seed:usuario').then(user => {
            usuario1 = user;
        });
        cy.task('database:seed:perfil').then(profile => {
            perfil1 = profile;
        });
        cy.login('30643636', 'asd', '57e9670e52df311059bc8964').then(t => {
            token = t;
        });
    });

    beforeEach(() => {
        cy.goto('/gestor-usuarios/usuarios', token);
        cy.server();
        cy.route('**api/modules/gestor-usuarios/usuarios?search=**').as('busquedaUsuario');
        cy.route('**api/modules/gestor-usuarios/perfiles').as('perfiles');
        cy.route('**api/core/tm/permisos').as('permisos');
        cy.route('**api/core/tm/profesionales?documento=**').as('profesional');
        cy.route('**/api/modules/gestor-usuarios/usuarios/**').as('guardar');
    });

    it('Asignar perfil a usuario', () => {
        cy.plexText('placeholder="Buscar por DNI, nombre o apellido"', usuario1.documento);
        cy.wait('@busquedaUsuario');
        cy.get('tr').contains(usuario1.nombre).click();
        cy.plexButtonIcon('pencil').click();
        cy.wait(['@perfiles', '@permisos', '@profesional']);
        // cy.plexBool('plex-layout-main','', true)
        // cy.get('plex-layout-main');
        cy.get('plex-layout-main plex-bool input[type="checkbox"]').first().check({
            force: true
        });
        cy.plexButton('GUARDAR').click();
        cy.wait('@guardar').then(xhr => {
            expect(xhr.status).to.be.eq(200);
            console.log(xhr10);
            console.log(xhr.response.body.organizaciones[0]);
            expect(xhr.response.body.organizaciones[0].permisos).to.deep.equal(perfil1.permisos);
            expect(xhr.response.body.organizaciones[0].perfiles[0].nombre).equal(perfil1.nombre);
        });
    });
})