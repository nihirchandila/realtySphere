import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["house", "flat", "villa", "plot", "commercial"],
      required: true,
    },

    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    address: String,
    city: String,
    state: String,
    pincode: String,

    bedrooms: Number,
    bathrooms: Number,
    area: Number,

    amenities: [String],

    images: [String],

    model3dUrls: [
      {
        type: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Property", propertySchema);