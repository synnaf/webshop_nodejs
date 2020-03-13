const VIEW = {
    index: 'index',
    admin: "admin",
    adminAddProduct: 'addProduct',
    createUser: "createuser",
    login: 'login',
    loginUser: 'loginuser',
    userAccount: 'useraccount',
    gallery: 'gallery',
    product: 'product',
    checkout: 'checkout',
    confirmation: 'confirmation',
    error: 'errors', 
    resetpassword: 'resetpassword'
}

const ROUTE = {
    index: '/',
    admin: '/admin',
    adminAddProduct: '/admin/addproduct',
    login: '/login',
    loginUser: '/loginuser',
    userAccountId: '/account/:username',
    userAccount: "/useraccount",
    createUser: "/createuser",
    gallery: '/gallery',
    product: '/gallery/:id',
    checkout: '/checkout',
    confirmation: '/checkout/confirmation',
    error: '/*',
    resetpassword: '/resetpassword'
}

module.exports = {
    VIEW,
    ROUTE
}