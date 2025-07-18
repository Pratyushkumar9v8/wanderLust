if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter=require('./routes/listing.js');
const reviewsRouter=require('./routes/review.js');
const userRouter = require('./routes/user');
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const multer = require('multer');
const {storage}=require("./cloudConfig.js");
const upload = multer({storage});
const wishlistRoutes = require('./routes/wishlist');
const bookingRoutes = require('./routes/bookings');
const partialsRoutes = require('./routes/partials');

require('dotenv').config();
require('./passportConfig.js')();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

async function main() {
  try {
    const dbUrl = (process.env.ATLASDB_URL || 'mongodb://localhost:27017/wanderlust') ;
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(" MongoDB connected successfully.");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
}

main()
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

const store = MongoStore.create({
  mongoUrl:(process.env.ATLASDB_URL || 'mongodb://localhost:27017/wanderlust'),
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on('error', ()=> {
  console.error('Session store error:', err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    maxAge: 60 * 60 * 24 * 2 * 1000 ,
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.render('loading');
});

app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);
app.use('/user', userRouter);
app.use("/bookings", bookingRoutes);
app.use(wishlistRoutes);
app.use(partialsRoutes);


app.use((err,req, res,next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("error", { statusCode,message,error: err });
});



app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
