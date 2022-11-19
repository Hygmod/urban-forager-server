const express = require("express")
const router = express.Router()
const markersController = require("../controllers/markersController")

router.route("/").get(markersController.getAllMarkers).post(markersController.createNewMarker)

module.exports = router
