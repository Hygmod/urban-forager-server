const Marker = require("../models/Marker")
const asyncHandler = require("express-async-handler")

const getAllMarkers = asyncHandler(async (req, res) => {
  // Get all markers from MongoDB
  const markers = await Marker.find({user:req.query.user}).lean()

  // If no markers
  if (!markers?.length) {
    return res.status(400).json({ message: "No markers found" })
  }

  res.json(markers)
})

const createNewMarker = asyncHandler(async (req, res) => {
  const lat = req.body.lat
  const lng = req.body.lng
  const markerType = req.body.markerType
  const user = req.body.user
  const marker = new Marker({ lat: lat, lng: lng, markerType: markerType, user: user })

  await marker.save()
  res.send("Marker Added")
})

module.exports = {
  getAllMarkers,
  createNewMarker,
}
