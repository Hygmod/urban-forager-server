const mongoose = require("mongoose")

const MarkerSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true,
  },
  lng: {
    type: String,
    required: true,
  },
  markerType: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("Marker", MarkerSchema)
