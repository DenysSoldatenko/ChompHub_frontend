# 🍔 ChompHub: E-Commerce Frontend

ChompHub is a React-based frontend application for a modern food delivery platform. It provides a complete, intuitive customer-facing storefront for browsing and ordering, alongside a secure administrative panel for managing the catalog, tracking orders, and viewing payment records.

---

## 🛠️ Tech Stack & Architecture

* ⚛️ **Framework:** Component-driven React architecture.
* 🎨 **Styling:** Custom modular CSS adhering to a unified design system.
* 🌐 **API Layer:** Axios with global interceptors for automated JWT token refreshes and centralized error handling.
* 🔀 **Routing:** React Router DOM with client-side Role-Based Access Control (RBAC).
* 📊 **Data Visualization:** Chart.js via `react-chartjs-2` for administrative analytics.
* 💳 **Payments:** Stripe Elements integration for secure, PCI-compliant checkout.

---

## ✨ Key Features

* 🛍️ **Customer Storefront:** A fully responsive shopping experience from product discovery to checkout.
* 👨‍💼 **Admin Command Center:** A data-dense dashboard to oversee daily operations, revenue, and inventory.
* 🔐 **Secure Routing:** Strict isolation between public consumer routes and protected administrative environments.
* 🛡️ **Robust Error Handling:** Defensive data mapping and graceful UI degradation to prevent crashes during backend anomalies.

---

## 📱 Customer Storefront

The public-facing application allows users to seamlessly discover food, place orders, and manage their accounts.

### 🚪 Authentication
Standard secure login and account registration flow.

![Login Page](docs/login-page.png)
*The secure login gateway for existing users, featuring error validation and credential recovery.*

![Register Page](docs/register-page.png)
*A streamlined registration form to onboard new customers and capture essential contact and delivery information.*

### 🍕 Catalog & Discovery
A welcoming home page storefront, a dynamic filterable menu catalog, and detailed product views.

![Home Page](docs/home-page.png)
*The main landing page designed with high-quality imagery to highlight featured dishes and active promotions.*

![Menu Catalog](docs/menu-catalog.png)
*A comprehensive, filterable grid allowing users to easily browse and sort products by category.*

![Product Details](docs/product-details.png)
*An immersive single-product view with descriptions, pricing details, and a prominent call-to-action for the cart.*

### 🛒 Ordering Pipeline
A frictionless shopping cart review, secure Stripe payment processing, and instant order confirmation.

![Cart & Checkout](docs/cart-checkout.png)
*A transparent order summary page integrating Stripe Elements for seamless, secure payment processing.*

![Payment Success](docs/payment-success.png)
*A clear confirmation screen providing the user with their finalized transaction details and positive reinforcement.*

### 👤 User Dashboard
Self-service profile management and live order history tracking.

![Order History](docs/order-history.png)
*A visual timeline for customers to quickly track their past purchases and monitor live fulfillment statuses.*

![User Profile](docs/user-profile.png)
*A centralized hub for users to securely update their personal details, delivery addresses, and account credentials.*

---

## ⚙️ Administrative Panel

The restricted admin area provides staff with the tools required to manage the platform's daily operations and view vital business data.

### 📈 Business Dashboard
A central view of platform metrics, monthly revenue line charts, order status distributions, and top-selling items.

![Admin Dashboard](docs/admin-dashboard.png)
*The executive overview featuring real-time revenue charts, active customer counts, and top-selling item metrics.*

### 📋 Catalog Management
Intuitive tools to create, edit, and organize menu items and broad categories.

![Categories List](docs/admin-categories-list.png)
*The administrative ledger for creating, updating, and removing high-level product categories.*

![Edit Category](docs/admin-category-edit.png)
*A focused form interface for modifying category names and associated metadata.*

![Menu Items List](docs/admin-menu-items-list.png)
*A comprehensive inventory table displaying all products, their assigned categories, and pricing.*

![Edit Menu Item](docs/admin-menu-item-edit.png)
*The detailed product editor for updating images, descriptions, prices, and category assignments.*

### 🚚 Order Management
A live registry of all customer orders with immediate tools to update fulfillment statuses and track logistics.

![Orders List](docs/admin-orders-list.png)
*A live command center tracking incoming customer orders, total amounts, and current fulfillment stages.*

![Order Details](docs/admin-order-details.png)
*An in-depth view of a specific order, allowing administrators to review items and manually progress the delivery status.*

### 💵 Payment Ledger
A complete record of all Stripe transactions, system success rates, and highly detailed individual payment receipts.

![Payments List](docs/admin-payments-list.png)
*A secure financial ledger tracking all platform transactions, gateways, and overall success rates.*

![Payment Details](docs/admin-payment-details.png)
*A comprehensive audit trail for individual transactions, displaying gateway details, customer data, and linked order items.*