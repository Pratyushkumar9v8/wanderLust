const Listing = require('./models/listing');
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require('./schema.js');
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.originalUrl);
        if(!req.isAuthenticated()){
            req.session.redirectUrl = req.originalUrl; // redirect to the page the user was trying to access
            // console.log(req.session.redirectUrl);
            req.flash('error', 'You must be logged in to add a listing');
            return res.redirect('/user/login');
        }
   next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    // console.log(req.session.redirectUrl);
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        // console.log(res.locals.redirectUrl);

    }
    next();
};

module.exports.isOwner =async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currentUser._id)){
  req.flash('error', 'You are not authorized to edit this listing');
  return res.redirect(`/listings/${id}`);
} 
next();
}

module.exports.validateListing=(req,res,next)=>{
   let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map(el=>el.message).join(', ');
    // throw new ExpressError(error.details[0].message, 400);
    throw new ExpressError('something wrong ->'+errMsg, 400);
  }
  else next();
};

module.exports.validateReview=(req,res,next)=>{
   let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map(el=>el.message).join(', ');
    // throw new ExpressError(error.details[0].message, 400);
    throw new ExpressError(errMsg, 400);
  }
  else next();
};

module.exports.isAuthor =async (req, res, next) => {
    let {reviewId,id} = req.params;
   try{
     let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error', 'You are not authorized to delete this review');
        return res.redirect(`/listings/${id}`);
    }   
    else next();
   }catch(err){
     req.flash('error', 'You are not authorized to delete this review');
    return res.redirect(`/listings/${id}`);
   }
}