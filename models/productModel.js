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
    images: [],
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color"
    },
    tags: [],
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    totalRating: {
        type: String,
        default: 0
    },
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