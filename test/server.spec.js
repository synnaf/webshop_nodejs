// Test för server.js
const supertest = require('supertest')
const { app, port } = require('../src/server') // hämtar in app och port från server.js

describe('Router tests', () => { // Huvudrubrik till våra test
    let server

    beforeEach(() => {                          // beforeEach körs innan varje 'it' test
        server = app.listen(port, () => console.log('                  >>>>>>>>>>>> Testing server up')) // servern körs igång
    })

    it('Should respond to /gallery', (done) => {       // Ett test för att se om servern svarar på get /
        supertest(server).get('/gallery').expect(200, done());   // vi testar om vi får svar på /
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

    afterEach((done) => {                       // afterEach körs efter varje 'it' test
        server.close(done)                          // servern stängs
    })
})