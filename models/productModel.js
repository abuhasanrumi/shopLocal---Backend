const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        required: true
    },
    ratings: [
        {
            star: Number,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    wishlist: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],
    address: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Address" }
    ]
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);