const dotenv = require('dotenv').config({ path: './config.env' });

exports.initializePayment = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            active: false
        });

        res.status(204).json({
            status: 'success',
            data: null
        });


    } catch (error) {
        next(error);
    }
};

exports.publishableKey = (req, res, next) =>{
    res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
}