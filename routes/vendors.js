const express = require('express');
const router = express.Router();

module.exports = (db) => {


  router.get("/:id/:orders/:order_id", (req, res) => {
    // res.json(`I'm a id ${req.params.id}, orders: ${req.params.orders}, order_id${req.params.order_id}`);

    const orderId = req.params.order_id;
    const orderQueryString = `
      SELECT order_id, items.name, items.price, quantity
      FROM order_items
      JOIN orders ON orders.id = order_id
      JOIN items ON items.id = item_id
      WHERE order_id = $1;
      `;
    const totalQueryString = `
      SELECT orders.id as order_id, SUM(order_items.quantity) AS total_item, SUM(items.price * order_items.quantity) AS subtotal
      FROM orders
      JOIN order_items ON order_items.order_id = orders.id
      JOIN items ON items.id = order_items.item_id
      WHERE orders.id = $1
      GROUP BY orders.id;
      `;
    const statusString = `
      SELECT orders.id as order_id, customers.first_name, customers.last_name, place_order_time, estimated_time, completed_time, status
      FROM orders
      JOIN customers ON customers.id = orders.customer_id
      WHERE orders.id = $1;
      `;

    const orderPromise = db.query(orderQueryString, [orderId]);
    const totalPromise = db.query(totalQueryString, [orderId]);
    const statusPromise = db.query(statusString, [orderId]);
    Promise.all([orderPromise, totalPromise, statusPromise])
      .then(response => {
        const order = response[0].rows;
        const total = response[1].rows;
        const status = response[2].rows;

        const templateVars = { order, total, status };
        // res.json(templateVars);
        res.render("checkout", templateVars); //ejs file need to be changed

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


  });
  router.post("/:id/:orders/:order_id", (req, res) => {
    res.json(`I'm a id ${req.params.id}, orders: ${req.params.orders}, order_id${req.params.order_id}`);

  });

  return router;
};
