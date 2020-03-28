// TESTING SERVER.JS
const supertest = require('supertest')
const { app, port } = require('../src/server');

describe('Testing routes', () => {
    let server

    beforeEach(() => {
        server = app.listen(port, () => console.log('    >>>>>>>>>>>> Testing server is running'))
    })

    it('Should respond to /useraccount', (done) => {
        supertest(server).get('/useraccount').expect(200, done())
    })

    it('Should respond to /login', (done) => {
        supertest(server).get('/login').expect(200, done())
    })

    it('Should respond to post /login', (done) => {
        supertest(server).post('/login').expect(302, done())
    })

    afterEach((done) => {
        server.close(done)
    })
})