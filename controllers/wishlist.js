const Listing = require('../models/listing');
const User = require('../models/user');

module.exports.toggleWishlist = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const alreadyInWishlist = user.wishlist.includes(id);

  if (alreadyInWishlist) {
    user.wishlist.pull(id);
    await user.save();
    return res.json({ status: 'removed' });
  } else {
    user.wishlist.push(id);
    await user.save();
    return res.json({ status: 'added' });
  }
};
module.exports.wish=async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.render('wishlist', { wishlist: user.wishlist });
}
