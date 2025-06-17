const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

main()
  .then(() => {
    console.log('Connected to MongoDB');
    return initDB(); // Call initDB after connecting
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log('Existing listings deleted');
    initdata.data=initdata.data.map((obj)=>({
      ...obj,
      owner:'684e303ffb825456af0e3ba4'
    }));
    const createdListings = await Listing.insertMany(initdata.data);
    console.log('New listings created:', createdListings);
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    mongoose.connection.close();
  }
}

