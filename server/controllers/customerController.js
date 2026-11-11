
const Customer = require("../models/CustomerModel");

// ADD CUSTOMER
exports.addCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email and phone are required"
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      status,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Customer added successfully",
      customer
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add customer",
      error: error.message
    });
  }
};

// GET ALL CUSTOMERS
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({
      createdBy: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json(customers);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message
    });
  }
};

// UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const { name, email, phone, company, status } = req.body;

    customer.name = name ?? customer.name;
    customer.email = email ?? customer.email;
    customer.phone = phone ?? customer.phone;
    customer.company = company ?? customer.company;
    customer.status = status ?? customer.status;

    const updatedCustomer = await customer.save();

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update customer",
      error: error.message
    });
  }
};

// DELETE CUSTOMER
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete customer",
      error: error.message
    });
  }
};
