import { Server } from '../../core/server';
import { Database } from '../../core/database';
import request from 'supertest';
import UsersRoute from './users.route'

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()

const bearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxNCwibmFtZSI6Ik1lbCIsImxhc3RfbmFtZSI6IkdpYiIsImVtYWlsIjoiY2NjY0BhYWIuY29tIiwiY3JlYXRlZEF0IjoiMjAyNC0xMS0wOVQwNzozMToyOC40MzJaIiwidXBkYXRlZEF0IjoiMjAyNC0xMS0wOVQxNjo1MToxNS42MjlaIn0sImlhdCI6MTczMTE5ODY2OCwiZXhwIjoxNzMxMjg1MDY4fQ.bAvgQdUmBX8Y8R_SdzKu3jsETrAbIA1VjKLBMMoeHAk';

server.app.use( '/users', UsersRoute )

afterAll(done => {
    server.httpServer.close()
    done();
});


describe( 'GET specific user', () => {

    it( 'Should return 403 http code if you are not logged or with valid token', async () => {

        await request( server.app )
        .get('/users')
        .set('bearer', 'invalid token')
        .expect( 403 )

    });

    it( 'Should return 400 http code if no user sent', async () => {

        await request( server.app )
        .get('/users')
        .set('bearer', bearer)
        .expect( 400 )

    });

    it( 'Should return 500 http code if the Id of user is different to a number value', async () => {

        await request( server.app )
        .get('/users/asd')
        .set('bearer', bearer)
        .expect( 500 )
    });

    it( 'Should return 200 http code and empty payload if user doesnt exists', async () => {

        const result = await request( server.app )
        .get('/users/15')
        .set('bearer', bearer)
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Lectura usuario",
                payload: {}
            })
        )
    });

    it( 'Should return 200 http code and payload with user`s data', async () => {

        const result = await request( server.app )
        .get('/users/11')
        .set('bearer', bearer)
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Lectura usuario",
                payload: expect.any(Object)
            })
        )
    });
})


describe( 'PUT update data from specific user', () => {

    it( 'Should return 403 http code if you are not logged or with valid token', async () => {

        await request( server.app )
        .put('/users')
        .set('bearer', 'invalid token')
        .expect( 403 )

    });

    it( 'Should return 400 http code if no user sent', async () => {

        await request( server.app )
        .put('/users')
        .set('bearer', bearer)
        .expect( 400 )

    });

    it( 'Should return 200 http code if the Id of user is different to a number value', async () => {

        const result = await request( server.app )
        .put('/users/asd')
        .set('bearer', bearer)
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Actualización usuario",
                payload: {
                    updated: false
                }
            })
        )
    });

    it( 'Should return 500 http code if name, last_name or email are duplicated', async () => {

        await request( server.app )
        .put('/users/14')
        .set('bearer', bearer)
        .send({
            email: 'ooo@bba.com',
        })
        .expect( 500 )
    });

    it( 'Should return 200 http code and payload with updated property as false', async () => {

        const result = await request( server.app )
        .put('/users/1')
        .set('bearer', bearer)
        .send({
            email: 'cccc@aab.com',
        })
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Actualización usuario",
                payload: {
                    updated: false
                }
            })
        )
    });

    it( 'Should return 200 http code and payload with updated property as true', async () => {

        const result = await request( server.app )
        .put('/users/12')
        .set('bearer', bearer)
        .send({ last_name: "bur"})
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Actualización usuario",
                payload: {
                    updated: true
                }
            })
        )
    });

    it( 'Should return 200 http code and payload with updated property as true and token property as new token', async () => {

        const result = await request( server.app )
        .put('/users/12')
        .set('bearer', bearer)
        .send({ pass: "Password6!"})
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Actualización usuario",
                payload: {
                    updated: true,
                    token: expect.any(String)
                }
            })
        )
    });
})


describe( 'DELETE specific user', () => {

    it( 'Should return 403 http code if you are not logged or with valid token', async () => {

        await request( server.app )
        .delete('/users')
        .set('bearer', 'invalid token')
        .expect( 403 )

    });

    it( 'Should return 400 http code if no user sent', async () => {

        await request( server.app )
        .delete('/users')
        .set('bearer', bearer)
        .expect( 400 )

    });

    it( 'Should return 500 http code if the Id of user is different to a number value', async () => {

        await request( server.app )
        .delete('/users/asd')
        .set('bearer', bearer)
        .expect( 500 )
    });

    it( 'Should return 200 http code and payload with deleted property as false', async () => {

        const result = await request( server.app )
        .delete('/users/15')
        .set('bearer', bearer)
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Borrado usuario",
                payload: {
                    deleted: false
                }
            })
        )
    });

    it( 'Should return 200 http code and payload with deleted property as true', async () => {

        const result = await request( server.app )
        .delete('/users/11')
        .set('bearer', bearer)
        .expect( 200 )

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message:expect.any(String),
                map: "Borrado usuario",
                payload: {
                    deleted: true
                }
            })
        )
    });
})


describe( 'POST create a new user', () => {

    it( 'Should return 403 http code if you are not logged or with valid token', async () => {

        await request( server.app )
        .post('/users')
        .set('bearer', 'invalid token')
        .expect( 403 )

    });

    it( 'should return 500 http code if email, name, last_name or password are missed', async() => {
        const result = await request( server.app )
        .post('/users')
        .set('bearer', bearer)
        .send({})
        .expect( 500 )

        expect(result.body).toEqual(
            expect.objectContaining({
                status: 500,
                title: "Ocurrió un error interno",
                message: expect.any( String ),
                map: "Creación usuario",
                errorSelector: [
                    "El nombre no puede estar vacío",
                    "El apellido no puede estar vacío",
                    "El password no puede estar vacío",
                    "El correo electrónico no puede estar vacío"
                ]
            })
        )
    })

    it( 'should return 500 http code if email, name, last_name or password are empty', async() => {
        const result = await request( server.app )
        .post('/users')
        .set('bearer', bearer)
        .send({ email: '', name: '', last_name: '', pass: '' })
        .expect( 500 )

        expect(result.body).toEqual(
            expect.objectContaining({
                status: 500,
                title: "Ocurrió un error interno",
                message: expect.any( String ),
                map: "Creación usuario",
                errorSelector: [
                    "El nombre no puede estar vacío",
                    "El apellido no puede estar vacío",
                    "El password no puede estar vacío",
                    "La contraseña no tiene un formato válido",
                    "El correo electrónico no puede estar vacío",
                    "El correo electrónico no tiene un formato válido"
                ]
            })
        )
    })

    it( 'should return 500 http code if email, name, last_name and password are filled but email has not proper format', async() => {
        const result = await request( server.app )
        .post('/users')
        .set('bearer', bearer)
        .send({ email: 'vul@vul', name: 'yuh', last_name: 'bro', pass: 'Vulcans1!' })
        .expect( 500 )

        expect(result.body).toEqual(
            expect.objectContaining({
                status: 500,
                title: "Ocurrió un error interno",
                message: expect.any( String ),
                map: "Creación usuario",
                errorSelector: [
                    "El correo electrónico no tiene un formato válido"
                ]
            })
        )
    })

    it( 'should return 500 http code if email, name, last_name and password are filled but password has not proper format', async() => {
        const result = await request( server.app )
        .post('/users')
        .set('bearer', bearer)
        .send({ email: 'vul@vul.com', name: 'yuh', last_name: 'bro', pass: 'vulcan' })
        .expect( 500 )

        expect(result.body).toEqual(
            expect.objectContaining({
                status: 500,
                title: "Ocurrió un error interno",
                message: expect.any( String ),
                map: "Creación usuario",
                errorSelector: [
                    "La contraseña no tiene un formato válido",
                ]
            })
        )
    })

    it( 'should return 500 if user has name, last_name, email or/and password duplicated', async() => {
        const result = await request( server.app )
        .post('/users')
        .set('bearer', bearer)
        .send({ email: 'vul@vul.com', name: 'yuh', last_name: 'bro', pass: 'Vulcans2!' })
        .expect( 500 )

        expect(result.body).toEqual(
            expect.objectContaining({
                status: 500,
                title: "Ocurrió un error interno",
                message: expect.any( String ),
                map: "Creación usuario",
                errorSelector: [
                    expect.any(String)
                ]
            })
        )
    })

    it( 'should return 201 if user has been created correctly', async() => {
        const result = await request( server.app )
        .post('/users')
        .set('bearer', bearer)
        .send({ email: 'sdfg@vul.com', name: 'dfgg', last_name: 'vvv', pass: 'Vulcans2!' })
        .expect( 201 )

        expect(result.body).toEqual(
            expect.objectContaining({
                status: 201,
                title: "La operación se realizó correctamente",
                message: expect.any( String ),
                map: "Creación usuario.",
                payload: expect.any( Object )
            })
        )
    })
})