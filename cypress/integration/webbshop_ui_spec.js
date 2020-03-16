describe('UI test for Vinyshop webbshop-button-link', () => {
    it('Should load/ redirect to gallery', () => {
        cy.visit('http://localhost:8080')
        cy.contains('Webbshop').click()
        cy.url().should('include', 'gallery')
        cy.contains('LÄS MER')
    })
})