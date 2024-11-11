import { Server } from '../../core/server';
import { Database } from '../../core/database';
import request from 'supertest';
import AuthRoute from './auth.route'

const server   = Server.instance
const database = Database.instance

server.start()
database.connect()

server.app.use( '/auth', AuthRoute )
const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoyNCwibmFtZSI6IkFsYmVydG8iLCJsYXN0X25hbWUiOiJWdWxjYW4iLCJlbWFpbCI6ImFsYmVydG9AdnVsY2FuLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjQtMTEtMTBUMDM6MDE6NTMuMzk5WiIsInVwZGF0ZWRBdCI6IjIwMjQtMTEtMTBUMDM6MDE6NTMuMzk5WiJ9LCJpYXQiOjE3MzEyMTAwOTEsImV4cCI6MTczMTI5NjQ5MX0.Ldh4JbQ3el6RtP7PE4qnJc_r1wUqIOxf82G0UHIXV8s';

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
        .set('Authorization', 'invalid-token')
        .expect( 403 ) 
    })

    it( 'should get 200 http code - Valid token', async () => {
        await request( server.app )
        .get('/auth')
        .set('Authorization', bearer)
        .expect( 200 ) 
    })
})
