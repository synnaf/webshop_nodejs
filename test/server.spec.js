const supertest = require('supertest')
const expect = require('chai').expect
const app = require("../src/server")

describe('Testing functions for Vinylshop webshop', () => {

    describe('Does app exist', () => {
        it('Should respond to app', () => {
            expect(app).to.exist
        })
    })
})