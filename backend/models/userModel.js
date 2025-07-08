const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    profilePic : String,
    role : String,
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        label: String, // e.g., Home, Work
      }
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel