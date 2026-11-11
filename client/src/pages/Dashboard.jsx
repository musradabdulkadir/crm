
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead"
  };

  const [form, setForm] = useState(emptyForm);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/customers");
      setCustomers(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchCustomers();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer._id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company || "",
      status: customer.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      alert("Name, email and phone are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      alert("Please enter a valid email");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/customers/${editingId}`, form);
        alert("Customer updated successfully");
      } else {
        await API.post("/customers", form);
        alert("Customer added successfully");
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchCustomers();

    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      alert("Customer deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = customers.filter(
    (c) => c.status === "Active"
  ).length;

  const leadCount = customers.filter(
    (c) => c.status === "Lead"
  ).length;

  const inactiveCount = customers.filter(
    (c) => c.status === "Inactive"
  ).length;

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <span className="sidebar-logo">C</span>
          <span>Connectly</span>
        </div>

        <div className="sidebar-section">MENU</div>

        <div className="sidebar-link active">
          <span>▦</span> Dashboard
        </div>

        <div className="sidebar-link">
          <span>♙</span> Customers
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="user-info">
              <strong>{user.name || "User"}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            ↪ Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back, {user.name || "User"}! Here's your business overview.</p>
          </div>

          <button className="header-add-button" onClick={openAddModal}>
            + Add Customer
          </button>
        </header>

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">♙</div>
            <p>Total Customers</p>
            <h2>{customers.length}</h2>
            <span>All registered customers</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Active Customers</p>
            <h2>{activeCount}</h2>
            <span>Currently active</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <p>Potential Leads</p>
            <h2>{leadCount}</h2>
            <span>Customers to follow up</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">○</div>
            <p>Inactive Customers</p>
            <h2>{inactiveCount}</h2>
            <span>Currently inactive</span>
          </div>

        </section>

        {/* CUSTOMER TABLE */}
        <section className="customer-section">

          <div className="table-heading">
            <div>
              <h2>Customer Management</h2>
              <p>Manage and organize your customers.</p>
            </div>

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {error && <p className="dashboard-error">{error}</p>}

          <div className="table-wrapper">
            <table className="customer-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Company</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id}>

                      <td>
                        <div className="customer-name">
                          <div className="customer-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{customer.name}</strong>
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>{customer.company || "—"}</td>
                      <td>{customer.phone}</td>

                      <td>
                        <span className={`status-badge ${customer.status.toLowerCase()}`}>
                          {customer.status}
                        </span>
                      </td>

                      <td>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => openEditModal(customer)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => deleteCustomer(customer._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>

        </section>

      </main>

      {/* ADD / EDIT CUSTOMER MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="customer-modal">

            <div className="modal-header">
              <div>
                <h2>{editingId ? "Edit Customer" : "Add New Customer"}</h2>
                <p>Enter the customer information below.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <label>Customer Name *</label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />

              <label>Company</label>
              <input
                type="text"
                placeholder="Enter company name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              <label>Customer Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button">
                  {editingId ? "Update Customer" : "Save Customer"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
