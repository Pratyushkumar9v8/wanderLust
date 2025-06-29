const Listing = require('../models/listing');

module.exports.index=async (req, res,next) => {
  const { type } = req.query;
  try {
    const filter = type ? { type } : {};
    const listings = await Listing.find(filter);
    res.render('listings/index', { listings, selectedType: type || '' });
  } catch (error) {
    next(error);
    // res.status(500).send('Error fetching listings: ' + error.message);
  }
}

module.exports.new=(req,res)=>{
  console.log(req.user);
  res.render('./listings/new');
}

module.exports.create = async (req, res,next) => {
  console.log("Incoming listing data:", req.body);
  console.log("Incoming listing data:", req.body.listing);
console.log("Uploaded file:", req.file);

  const data = req.body.listing;
  
  let image = null;

  if (req.file) {
    image = { url: req.file.path, filename: req.file.filename };
  } else if (typeof data.image === 'string') {
    image = { url: data.image, filename: 'listingimage' };
  }

  try {
    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    if (image) {
      newListing.image = image;
    }
    await newListing.save();
    console.log("New listing added");
    req.flash('success', 'Listing added successfully!');
    res.redirect('/listings');
  } catch (error) {
    next(new ExpressError("Error creating listing: " + error.message, 500));
  }
};


module.exports.getEdit=async (req,res)=>{
  let {id} =req.params;
  const listing= await Listing.findById(id);
  if(listing){ 
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/uploads/", "/uploads/h_300,w_250");
    res.render('./listings/edit',{listing,originalImageUrl});
  }
  else{
    req.flash('error', 'Do not find that id');
    res.redirect(`/listings`);
  }
}

module.exports.show=async(req,res,next)=>{
  const {id}=req.params;
  try{
    const listing=await Listing.findById(id).populate({path:'reviews',populate:{path:"author"}}).populate('owner');
    if(!listing){
      req.flash('error', 'Listing do not exits');
      res.redirect('/listings');
    }
    else{
      res.render('./listings/view',{listing});
    }
  }catch(error){
  next(new ExpressError("Listing not found", 404));

  }
}



// const Listing = require('../models/listing');
// const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utils/ExpressError');

const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const data   = req.body.listing;   // ← assumes form fields are listing[title], …

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found.');
      return res.redirect('/listings');
    }

    /* ---------------- Handle the image ---------------- */
    // 1.  Declare image once.
    // 2.  If a new file was uploaded, take Cloudinary URL.
    // 3.  Otherwise fall back to plain URL string (rare on update).

    let image = listing.image;   // start with the existing image

    if (req.file) {
      image = { url: req.file.path, filename: req.file.filename };
    } else if (typeof data.image === 'string' && data.image.trim() !== '') {
      image = { url: data.image,   filename: 'listingimage' };
    }

    /* --------------- Merge changes & save ------------- */
    // Combine the primitive fields in `data` and the (possibly) new image.
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...data, image },           // ← merge image
      { new: true, runValidators: true }
    );

    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
  } catch (err) {
    next(new ExpressError(`Editing failed: ${err.message}`, 500));
  }
};





module.exports.destroy=async (req,res)=>{
  let {id}=req.params;
  try {
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
  } catch (error) {
    res.status(500).send("delete not complete " + error.message);
  }
}

