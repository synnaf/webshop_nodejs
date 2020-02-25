// TESTING SERVER.JS
const supertest = require('supertest')
const { app, port } = require('../src/server')

describe('Testing routes', () => {
    let server

    beforeEach(() => {
        server = app.listen(port, () => console.log('         >>>>>>>>>>>> Testing server up'))
    })

    it('Should respond to /gallery', (done) => {
        supertest(server).get('/gallery').expect(200, done());
    })

    it('Should respond to /product', (done) => {
        supertest(server).get('/product').expect(200, done)
    })

    it('Should respond to post /add-product', (done) => {
        supertest(server).post('/add-product').expect(302, done)
    })

    it('Should respond to post /', (done) => {
        supertest(server).get('/').expect(200, done)
    })

    it('Should respond to get /add-product', (done) => {
        supertest(server).get('/add-product').expect(200, done)
    })

    afterEach((done) => {
        server.close(done)
    })
})