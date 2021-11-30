const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/:orderId", (req, res) => {

    const orderId = req.params.orderId;
    const orderQueryString = `
      SELECT order_id, customers.first_name, customers.last_name, items.name, items.price, quantity
      FROM order_items
      JOIN orders ON orders.id = order_id
      JOIN customers ON customers.id = customer_id
      JOIN items ON items.id = item_id
      WHERE order_id = $1;
      `;
    const totalQueryString = `
      SELECT orders.id, SUM(order_items.quantity) AS total_item, SUM(items.price * order_items.quantity) AS subtotal
      FROM orders
      JOIN order_items ON order_items.order_id = orders.id
      JOIN items ON items.id = order_items.item_id
      WHERE orders.id = $1
      GROUP BY orders.id;
      `;

    const orderPromise = db.query(orderQueryString, [orderId]);
    const totalPromise = db.query(totalQueryString, [orderId]);
    Promise.all([orderPromise, totalPromise])
      .then(response => {
        const order = response[0].rows;
        const total = response[1].rows;
        const templateVars = { order, total };
        // res.json(templateVars);
        res.render("checkout", templateVars); //ejs file need to be changed

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  return router;
};
