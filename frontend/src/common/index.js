// const backendDomin =
//   window.location.hostname === "localhost"
//     ? "http://localhost:8080"
//     : "https://ecommerce-web-4jpy.onrender.com";

const backendDomin ="https://ecommerce-web-4jpy.onrender.com"
const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    },
    addAddress: {
        url: `${backendDomin}/api/user/address`,
        method: 'POST'
    },
    getUserAddresses: {
        url: `${backendDomin}/api/user/addresses`,
        method: 'GET'
    },
    addToWishlist: {
        url: `${backendDomin}/api/user/wishlist/add`,
        method: 'POST'
    },
    removeFromWishlist: {
        url: `${backendDomin}/api/user/wishlist/remove`,
        method: 'POST'
    },
    getWishlist: {
        url: `${backendDomin}/api/user/wishlist`,
        method: 'GET'
    },
    saveCustomizedProduct : {
        url : `${backendDomin}/api/save-customized-product`,
        method : 'post'
    },
    getCustomizedProduct : {
        url : `${backendDomin}/api/get-customized-product`,
        method : 'get'
    },
    placeOrder: {
        url: `${backendDomin}/api/place-order`,
        method: 'POST'
    },
    adminOrders: {
        url: `${backendDomin}/api/admin/orders`,
        method: 'GET'
    },
    adminOrderStatus: {
        url: `${backendDomin}/api/admin/order-status`,
        method: 'POST'
    },
    productReview: {
        url: `${backendDomin}/api/product/review`,
        method: 'POST'
    },
    getProductReviews: {
        url: `${backendDomin}/api/product/reviews`,
        method: 'GET'
    }
}


export default SummaryApi