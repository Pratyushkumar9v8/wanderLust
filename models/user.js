const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: String,
    password: String,
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing'
        }
    ],
    googleId: String,
    profilePicture: String
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema); 
