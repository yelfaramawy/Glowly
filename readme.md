<h1 align="center">Glowly</h1>
<p align="center">
  <img src="https://i.imgur.com/qhL5gOu.png" alt="Glowly Logo" width="200" height="200">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js badge">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express badge">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB badge">
</p>

# Glowly E-Commerce Platform

Glowly is a feature-rich e-commerce platform built with Node.js and MongoDB, designed to provide a seamless shopping experience for users.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## 🚀 Features

- **User Authentication**: Secure user registration and login with hashed passwords and JSON Web Tokens (JWT).
- **Product Management**: Admin can add, update, and delete products with various details like name, category, price, and more.
- **Order Management**: Users can create, view, update, and cancel orders. Admin has additional endpoints for managing all orders.
- **Reviews and Ratings**: Users can leave reviews and ratings for products, helping others make informed purchase decisions.
- **Search and Filters**: Users can easily search for products and apply filters to find what they're looking for.
- **Pagination**: Smooth navigation through a large number of products with paginated results.
- **User Cart**: Users can add products to their cart, view and edit the cart contents, and proceed to checkout.
- **Wishlist and Favorites**: Users can add products to their wishlist and mark products as favorites for future reference.
- **Product Recommendations**: Provide bestselling product recommendations.
- **Payment Integration**: Seamless integration with Stripe for secure online payments.
- **Admin Dashboard**: An intuitive dashboard for the admin to manage users, orders, products, and reviews with ease.
- **Caching with Redis**: Utilizes Redis for caching frequently accessed data, improving performance and reducing database load.

## 🛠️ Installation

1. Clone the repository: `git clone https://github.com/yourusername/your-repo.git`
2. Install dependencies: `npm install`
3. Set up environment variables (e.g., MongoDB , Stripe API keys, etc.).
4. Start the server: `npm start`

## 🌟 Usage

1. Register for an account or log in as an admin.
2. Browse products, add to cart, and proceed to checkout.
3. Manage products, orders, and reviews via the admin panel.

<!-- ## 🛤️ Endpoints  -->

<!-- - [API Documentation](/docs/api.md) -->

## 🧰 Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Stripe for payment processing
- Redis for caching

## Contributing 🤝

Contributions are welcome! If you find a bug or have a suggestion, please create an issue. Pull requests are also appreciated.
