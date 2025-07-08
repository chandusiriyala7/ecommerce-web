const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const saveCustomizedProduct = require('../controller/product/saveCustomizedProduct')
const getCustomizedProduct = require('../controller/product/getCustomizedProduct')
const placeOrder = require('../controller/user/placeOrder');
const getUserOrders = require('../controller/user/getUserOrders');
const getAllOrders = require('../controller/admin/getAllOrders');
const updateOrderStatus = require('../controller/admin/updateOrderStatus');
const permission = require('../helpers/permission');
const getUserAddresses = require('../controller/user/getUserAddresses');
const addUserAddress = require('../controller/user/addUserAddress');
const updateUserAddress = require('../controller/user/updateUserAddress');
const deleteUserAddress = require('../controller/user/deleteUserAddress');
const addToWishlist = require('../controller/user/addToWishlist');
const removeFromWishlist = require('../controller/user/removeFromWishlist');
const getWishlist = require('../controller/user/getWishlist');
const addReview = require('../controller/product/addReview');
const getReviews = require('../controller/product/getReviews');


router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

//customized product
router.post("/save-customized-product", authToken, saveCustomizedProduct)
router.get("/get-customized-product", authToken, getCustomizedProduct)

// Order routes
router.post('/place-order', placeOrder);
router.get('/user-orders', getUserOrders);

// Admin order routes
router.get('/admin/orders', authToken, getAllOrders);
router.post('/admin/order-status', authToken, updateOrderStatus);

// User address routes
 
router.get('/user/addresses', authToken, getUserAddresses);
router.post('/user/address', authToken, addUserAddress);
router.put('/user/address', authToken, updateUserAddress);
router.delete('/user/address', authToken, deleteUserAddress);

// Wishlist routes
router.post('/user/wishlist/add', authToken, addToWishlist);
router.post('/user/wishlist/remove', authToken, removeFromWishlist);
router.get('/user/wishlist', authToken, getWishlist);

// Product reviews routes
router.post('/product/review', authToken, addReview);
router.get('/product/reviews', getReviews);







module.exports = router