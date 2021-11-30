const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:orderId", (req, res) => {
    const queryString = `
      SELECT order_id, customers.first_name, customers.last_name, items.name, items.price, quantity
      FROM order_items
      JOIN orders ON orders.id = order_id
      JOIN customers ON customers.id = customer_id
      JOIN items ON items.id = item_id
      WHERE order_id = 1;
      `;
    db.query(queryString)
      .then(data => {
        const orderItems = data.rows;
        const templateVars = { orderItems };
        res.json(templateVars);
        // res.render("?", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  return router;
};
