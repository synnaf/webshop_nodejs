// TESTING SERVER.JS
const supertest = require('supertest')
const { app, port } = require('../src/server');

describe('Testing routes', () => {
    let server

    beforeEach(() => {
        server = app.listen(port, () => console.log('    >>>>>>>>>>>> Testing server is running'))
    })

    it('Should respond to /gallery', (done) => {
        supertest(server).get('/gallery').expect(200, done());
    })

    it('Should respond to /', (done) => {
        supertest(server).get('/').expect(200, done())
    })

    it('Should respond to post /admin/addproduct', (done) => {
        supertest(server).post('/admin/addproduct').expect(302, done())
    })

    it("Should do 404 on everything else", (done) => {
        supertest(server).get("/ensidasomintefinns").expect(404, done())
    })

    afterEach((done) => {
        server.close(done)
    })
})