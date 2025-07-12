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
     googleId: {
        type: String,
        unique: true,
        sparse: true, // ✅ prevents issues when some users don't have googleId
    },
    profilePicture: String
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema); 
