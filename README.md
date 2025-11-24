Product Inventory System - Frontend

This is the client-side application for the Inventory System. It provides a user interface to manage products, track stock history, and export reports.

🚀 Tech Stack

React (Vite): UI Library and Build tool.

Axios: For making API requests.

Date-fns: For formatting dates and timestamps.

CSS: Custom styling for tables and layout.

✨ Features

Dashboard Table: View all products with stock status (In Stock/Out of Stock).

Add Product: Form to manually add new inventory items.

Inline Editing: Edit stock levels directly in the table.

History Sidebar: Click a product name to see a log of all stock changes.

Search: Real-time filtering by product name.

Export CSV: Download the current inventory as a CSV file.

Delete: Remove products from the database.

⚙️ Setup & Installation

Navigate to the frontend folder:

cd frontend


Install Dependencies:

npm install


Configure Environment:
Create a .env file in the frontend root:

VITE_API_BASE_URL=http://localhost:5000


Run the App:

npm run dev


Open http://localhost:5173 in your browser.

📂 Project Structure

src/api/: Axios configuration and API helper methods.

src/App.jsx: Main application logic, state management, and UI layout.

src/index.css: Global styles."# product-inventory" 
