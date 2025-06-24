const Listing = require('../models/listing'); // FIXED: was '../models/review'
const Review = require('../models/review');   // ADD this if not present
const User = require('../models/user');   // ADD this if not present
const ExpressError = require("../utils/ExpressError"); // ADD this if not present

module.exports.getSignup=async (req, res) => {
    res.render('./users/signup');
}

module.exports.postSignup= async (req, res,next) => {
    try{
        let {username, password, email,confirmPassword} = req.body;
        if(password!==confirmPassword) throw new ExpressError('Passwords do not match', 400);
        const newUser = new User({username,  email});
        const registeredUser =  await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) return next(err);
            req.flash('success', 'You are now registered!');
            const redirectUrl = req.session.redirectUrl || '/listings';
            delete req.session.redirectUrl; // Clear after use
            res.redirect(redirectUrl);
        });
    }catch(e){
        req.flash('error', ' Please try again.' + e.message);
        res.redirect('/user/signup');
    }
}

module.exports.getLogin=(req, res) => {
    res.render('./users/login');
}

module.exports.postLogin=async (req, res) => {
    req.flash('success', 'welcome back '+ req.user.username + ' !');
    const redirectUrl = req.session.redirectUrl || '/listings';
    delete req.session.redirectUrl; // Clear after use
    res.redirect(redirectUrl);
}

module.exports.logOut=(req, res,next) => {
    req.logout((err)=> {
        if(err) return  next(err);
        delete req.session.redirectUrl; // Clear after logout
        req.flash('success', 'You are now logged out!');
        res.redirect('/listings');
    });
    
}
