import { Server } from '../../core/server';
import { Database } from '../../core/database';
import request from 'supertest';
import AuthRoute from './auth.route'

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()

server.app.use( '/auth', AuthRoute )
const bearer = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxNCwibmFtZSI6Ik1lbCIsImxhc3RfbmFtZSI6IkdpYiIsImVtYWlsIjoiY2NjY0BhYWIuY29tIiwiY3JlYXRlZEF0IjoiMjAyNC0xMS0wOVQwNzozMToyOC40MzJaIiwidXBkYXRlZEF0IjoiMjAyNC0xMS0wOVQxNjo1MToxNS42MjlaIn0sImlhdCI6MTczMTE5ODY2OCwiZXhwIjoxNzMxMjg1MDY4fQ.bAvgQdUmBX8Y8R_SdzKu3jsETrAbIA1VjKLBMMoeHAk';

afterAll(done => {
    server.httpServer.close()
    done();
});

describe('Auth login endpoint', () => {
    it( 'should get 401 http code - wrong email', async () => {
        await request( server.app )
        .post('/auth')
        .send({
            email: 'cccc@aaa.com',
            pass: 'Password1!'
        })
        .expect(401)
    })

    it( 'should get 401 http code - wrong password', async () => {
        await request( server.app )
        .post('/auth')
        .send({
            email: 'cccc@aab.com',
            pass: 'Password1!'
        })
        .expect(401)
    })

    it( 'should get 200 http code and valid body - success login', async () => {
        const result = await request( server.app )
        .post('/auth')
        .send({
            email: 'cccc@aab.com',
            pass: 'Password5!'
        })
        .expect(200);

        expect( result.body ).toEqual(
            expect.objectContaining({
                status: 200,
                title: "Operación exitosa",
                message: "Autenticación correcta",
                map: "Autenticación Auth",
                payload: expect.any(Object)
            })
        )
    })
})

describe( 'Auth token valid', () => {
    it( 'should get 403 http code - No bearer', async () => {

        await request( server.app )
        .get('/auth')
        .expect( 403 ) 
    })

    it( 'should get 403 http code - Expired token', async () => {
        await request( server.app )
        .get('/auth')
        .set('bearer', 'invalid-token')
        .expect( 403 ) 
    })

    it( 'should get 200 http code - Valid token', async () => {
        await request( server.app )
        .get('/auth')
        .set('bearer', bearer)
        .expect( 200 ) 
    })
})
