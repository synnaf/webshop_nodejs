const VIEW = {
    index: 'index',
    admin: 'admin',
    loginAdmin: 'log-in-admin',
    loginUser: 'log-in-user',
    userAccount: 'useraccount',
    gallery: 'gallery',
    product: 'product',
    checkout: 'checkout',
    confirmation: 'confirmation',
    error: 'errors'
}

const ROUTE = {
    index: '/',
    admin: '/admin',
    loginAdmin: '/adminlogin',
    loginUser: '/userlogin',
    userAccount: '/account/:username',
    gallery: '/gallery',
    product: '/gallery/:id',
    checkout: '/checkout',
    confirmation: '/checkout/confirmation',
    error: '/*'
}

module.exports = {
    VIEW,
    ROUTE
}