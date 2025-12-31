const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/products", require("./routes/product.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/wishlist", require("./routes/wishlist.routes"));
app.use("/api", require("./routes/review.routes"));
app.use("/api/addresses", require("./routes/address.routes"));
app.use("/api/orders", require("./routes/order.routes"));

// Error Middleware (آخر شيء)
app.use(errorHandler);

module.exports = app;
