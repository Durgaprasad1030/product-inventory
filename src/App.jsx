import { useState, useEffect } from "react";
import axiosClient from "./api/axiosClient";
import { format } from "date-fns";
import "./index.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for Editing
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // State for Adding New Product
  const [isAdding, setIsAdding] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: "", brand: "", category: "", unit: "", stock: 0
  });

  // --- API CALLS ---
  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get(search ? `/api/products/search?name=${search}` : "/api/products");
      setProducts(res.data);
    } catch (err) { console.error("Error fetching", err); }
  };

  useEffect(() => {
    const delay = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delay);
  }, [search]);

  // --- HANDLERS ---

  // 1. DELETE HANDLER
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosClient.delete(`/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  // 2. Add Product
  const handleAddChange = (e) => {
    setNewProductData({ ...newProductData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/products", newProductData);
      setIsAdding(false);
      setNewProductData({ name: "", brand: "", category: "", unit: "", stock: 0 });
      fetchProducts();
      alert("Product Added Successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding product");
    }
  };

  // 3. Export Only (Import Removed)
  const handleExport = () => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/products/export`, "_blank");
  };

  // 4. Edit Handlers
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditFormData({ ...product });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async () => {
    try {
      await axiosClient.put(`/api/products/${editingId}`, editFormData);
      setEditingId(null);
      fetchProducts();
    } catch (err) { alert("Failed to update"); }
  };

  // 5. History
  const handleShowHistory = async (product) => {
    setSelectedProduct(product);
    try {
      const res = await axiosClient.get(`/api/products/${product._id}/history`);
      setHistoryLogs(res.data);
      setIsSidebarOpen(true);
    } catch (err) { console.error("Error fetching history"); }
  };

  return (
    <div className="container">
      <header>
        <h1>Inventory Manager</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={() => setIsAdding(!isAdding)} style={{background: '#28a745'}}>
            {isAdding ? "Close Form" : "+ Add New Product"}
          </button>
          
          <button className="secondary" onClick={handleExport}>Export CSV</button>
        </div>
      </header>

      {isAdding && (
        <div style={{ background: '#e9ecef', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Add New Product</h3>
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: '10px' }}>
            <input name="name" placeholder="Name" required value={newProductData.name} onChange={handleAddChange} />
            <input name="brand" placeholder="Brand" required value={newProductData.brand} onChange={handleAddChange} />
            <input name="category" placeholder="Category" required value={newProductData.category} onChange={handleAddChange} />
            <input name="unit" placeholder="Unit (e.g. kg)" required value={newProductData.unit} onChange={handleAddChange} />
            <input name="stock" type="number" placeholder="Stock" required value={newProductData.stock} onChange={handleAddChange} />
            <button type="submit">Save</button>
          </form>
        </div>
      )}

      <div className="controls">
        <input 
          placeholder="Search by name..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{width: "100%", padding: "10px"}}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              {editingId === product._id ? (
                <>
                  <td><input name="name" value={editFormData.name} onChange={handleEditChange} /></td>
                  <td><input name="brand" value={editFormData.brand} onChange={handleEditChange} /></td>
                  <td><input name="category" value={editFormData.category} onChange={handleEditChange} /></td>
                  <td><input name="unit" value={editFormData.unit} onChange={handleEditChange} /></td>
                  <td><input type="number" name="stock" value={editFormData.stock} onChange={handleEditChange} style={{width: '60px'}} /></td>
                  <td>-</td>
                  <td>
                    <button onClick={handleSaveClick}>Save</button>
                    <button className="secondary" onClick={() => setEditingId(null)} style={{marginLeft: "5px"}}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td onClick={() => handleShowHistory(product)} style={{cursor: 'pointer', color: '#007bff', fontWeight: 'bold'}}>
                    {product.name}
                  </td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.unit}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={product.status === "In Stock" ? "status-in" : "status-out"}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button className="secondary" onClick={() => handleEditClick(product)}>Edit</button>
                    <button 
                        className="danger" 
                        onClick={() => handleDeleteClick(product._id)} 
                        style={{marginLeft: "8px"}}
                    >
                        Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>History Log</h2>
            <button className="danger" onClick={() => setIsSidebarOpen(false)}>Close</button>
        </div>
        <h3>{selectedProduct?.name}</h3>
        <hr />
        {historyLogs.length === 0 ? <p>No history found.</p> : (
            <ul style={{padding: 0, listStyle: 'none'}}>
                {historyLogs.map(log => (
                    <li key={log._id} style={{borderBottom: '1px solid #eee', padding: '10px 0'}}>
                        <strong>{log.actionType}</strong> <small style={{color: '#666'}}>{format(new Date(log.timestamp), 'MMM dd, HH:mm')}</small> <br/>
                        <span>{log.description}</span> <br/>
                        {log.oldStock !== undefined && <span style={{fontWeight: 'bold'}}>{log.oldStock} ➝ {log.newStock}</span>}
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
}

export default App;