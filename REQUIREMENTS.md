# API Requirements

The company stakeholders want to create an online storefront to showcase their products. Users can browse products, see details, and add them to an order/cart. This API supports that functionality.

## API Endpoints and RESTful Routes

### Products
| Endpoint | Route | HTTP Verb | Token Required |
|----------|-------|-----------|----------------|
| Index | /products | GET | No |
| Show | /products/:id | GET | No |
| Create | /products | POST | Yes |
| Top 5 popular (optional) | /products/top | GET | No |
| Products by category (optional) | /products/category/:category | GET | No |

### Users
| Endpoint | Route | HTTP Verb | Token Required |
|----------|-------|-----------|----------------|
| Index | /users | GET | Yes |
| Show | /users/:id | GET | Yes |
| Create | /users | POST | Yes |

### Orders
| Endpoint | Route | HTTP Verb | Token Required |
|----------|-------|-----------|----------------|
| Current order by user | /users/:id/orders/current | GET | Yes |
| Completed orders by user (optional) | /users/:id/orders/completed | GET | Yes |

---

## Data Shapes

### Product
- id: number
- name: string
- price: number
- category: string (optional)

### User
- id: number
- firstName: string
- lastName: string
- password: string (hashed in DB)

### Order
- id: number
- user_id: number (FK)
- status: string (active/complete)
- products: array of { product_id: number, quantity: number }

---

## Database Schema

### Table: users
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Unique user id |
| first_name | VARCHAR(50) | First name |
| last_name | VARCHAR(50) | Last name |
| password_digest | VARCHAR(255) | Hashed password |

### Table: products
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Unique product id |
| name | VARCHAR(100) | Product name |
| price | NUMERIC | Product price |
| category | VARCHAR(50) | Optional product category |

### Table: orders
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Unique order id |
| user_id | INT REFERENCES users(id) | Owner of order |
| status | VARCHAR(20) | 'active' or 'complete' |

### Table: order_products
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Unique record id |
| order_id | INT REFERENCES orders(id) | Order reference |
| product_id | INT REFERENCES products(id) | Product reference |
| quantity | INT | Quantity of this product in order |

**Notes:** `order_id` + `product_id` should have UNIQUE constraint to prevent duplicate entries.