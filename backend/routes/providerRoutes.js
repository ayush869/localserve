const express = require("express");
const router = express.Router();

const {
  registerProvider,
  loginProvider,
  getAllProviders,
  updateProviderLocation,
} = require("../controllers/providerController");

router.post("/register", registerProvider);
router.post("/login", loginProvider);
router.get("/", getAllProviders);
router.put("/:id/location", updateProviderLocation);

module.exports = router;