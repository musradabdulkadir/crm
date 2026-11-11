
const express = require("express");
const router = express.Router();

const protect = require("../middleware/Auth");

const {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

// All routes require authentication
router.use(protect);

router.post("/", addCustomer);
router.get("/", getCustomers);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
