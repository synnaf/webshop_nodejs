const VIEW = {
    index: 'index',
    admin: "admin",
    adminAddProduct: 'addProduct',
    createAdmin: "createadmin",
    createUser: "createuser",
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
    adminAddProduct: '/admin/addproduct',
    loginAdmin: '/adminlogin',
    loginUser: '/userlogin',
    userAccountId: '/account/:username',
    userAccount: "/useraccount",
    createUser: "/createuser",
    gallery: '/gallery',
    product: '/gallery/:id',
    checkout: '/checkout',
    confirmation: '/checkout/confirmation',
    error: '/*',
}

module.exports = {
    VIEW,
    ROUTE
}