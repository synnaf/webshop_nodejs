// TESTING SERVER.JS
const supertest = require('supertest')
const { app, port } = require('../src/server');

describe('Testing routes', () => {
    let server

    beforeEach(() => {
        server = app.listen(port, () => console.log('    >>>>>>>>>>>> Testing server is running'))
    })

    it('Should respond to /admin', (done) => {
        supertest(server).get('/admin').expect(200, done())
    })

    it('Should respond to post /admin/addproduct', (done) => {
        supertest(server).post('/admin/addproduct').expect(302, done())
    })

    afterEach((done) => {
        server.close(done)
    })
})