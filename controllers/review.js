const Listing = require('../models/listing'); // FIXED: was '../models/review'
const Review = require('../models/review');   // ADD this if not present
const User = require('../models/user');   // ADD this if not present
const ExpressError = require("../utils/ExpressError"); // ADD this if not present


module.exports.add=async(req,res,next)=>{
    try{
      let listing= await Listing.findById(req.params.id);
      let newReview=new Review(req.body.review);
      newReview.author=req.user._id;
      await newReview.save();
      listing.reviews.push(newReview._id);
      await listing.save();
      console.log("new review saved");
      req.flash('success', 'New review added!');
      res.redirect(`/listings/${req.params.id}`);
    }catch{
        next(new ExpressError("review not saved", 404));
    }
}

module.exports.destroy=async(req,res,next)=>{
  try{
    let listing= await Listing.findById(req.params.id);
    let review=await Review.findByIdAndDelete(req.params.reviewId);
    listing.reviews.pull(review._id);
    await listing.save();
    console.log("review deleted");
    req.flash('success', 'Review deleted!');
    res.redirect(`/listings/${req.params.id}`);
    }catch{
        next(new ExpressError("review not deleted", 404));
    }
}

