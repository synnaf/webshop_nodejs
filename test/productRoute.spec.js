// TESTING SERVER.JS
const supertest = require('supertest')
const { app, port } = require('../src/server');

describe('Testing product routes', () => {
    let server

    beforeEach(() => {
        server = app.listen(port, () => console.log('    >>>>>>>>>>>> Testing server is running'))
    })

    it('Should respond to /', (done) => {
        supertest(server).get('/').expect(200, done())
    })

    it('Should respond to /gallery', (done) => {
        supertest(server).get('/gallery').expect(200, done());
    })

    it('Should respond to /gallery/:id', (done) => {
        supertest(server).get('/gallery/:id').expect(200, done());
    })

    afterEach((done) => {
        server.close(done)
    })
})