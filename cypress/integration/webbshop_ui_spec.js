describe('UI test for Vinylshop gallery link and login function', () => {
    it('Should load index and redirect to gallery', () => {
        cy.visit('http://localhost:8080')
        cy.url().should('include', '/')
        cy.contains('WEBSHOP').click()
        cy.url().should('include', 'gallery')
        cy.contains('INFO')
    })

    it('Should go from gallery to sign in and log in', () => {
        cy.get('.fa-bars').click()
        cy.contains('LOGGA IN').click()

        cy.get('input').first().type('kund@mail.se').should('have.value', 'kund@mail.se')
        cy.get('input').last().type('0000').should('have.value', '0000')
        cy.contains('Logga in').click()
    })

    it('Should log out', () => {
        cy.get('button').contains('LOGGA UT').click()
    })

})

describe('UI test for Vinylshop gallery genres', () => {
    afterEach(() => {
        cy.get('.fa-bars').click()
        cy.contains('HEM').click()
    })

    it('Should redirect to the "All" genre', () => {
        cy.get('img[alt="All"]').click()
    })

    it('Should redirect to the "Rock" genre', () => {
        cy.get('img[alt="Rock"]').click()
    })

    it('Should redirect to the "Pop" genre', () => {
        cy.get('img[alt="Pop"]').click()
    })

    it('Should redirect to the "Soul" genre', () => {
        cy.get('img[alt="Soul"]').click()
    })

    it('Should redirect to the "Rap" genre', () => {
        cy.get('img[alt="Rap"]').click()
    })

    it('Should redirect to the "Rnb" genre', () => {
        cy.get('img[alt="Rnb"]').click()
    })

    it('Should redirect to the "Blues" genre', () => {
        cy.get('img[alt="Blues"]').click()
    })
})