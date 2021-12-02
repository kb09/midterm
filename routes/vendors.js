const express = require('express');
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

const accountSid = 'AC21417ecef39f48e33fbf3deb537ab629';
const authToken = '37f530bb6d8119d61f8794e789216c26';
const client = require('twilio')(accountSid, authToken);

module.exports = (db) => {

  router.get("/:id/:orders/:order_id", (req, res) => {
    const orderId = req.params.order_id;
    const orderQueryString = `
      SELECT order_id, items.name, items.price, quantity
      FROM order_items
      JOIN orders ON orders.id = order_id
      JOIN items ON items.id = item_id
      WHERE order_id = $1;
      `;
    const totalQueryString = `
      SELECT orders.id as order_id, SUM(order_items.quantity) AS total_item
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
        const orders = response[0].rows;
        const total = response[1].rows;
        const status = response[2].rows;
        const templateVars = { orders, total, status };
        // res.json(templateVars);
        res.render("vendors", templateVars); //ejs file need to be changed
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


  });
  router.post("/:id/:orders/:order_id", (req, res) => {
    const orderId = parseInt(req.params.order_id);

    if (req.body.estimatedTime) {
      const estimatedTime = parseInt(req.body.estimatedTime);
      const queryParams = [];
      queryParams.push(estimatedTime);
      queryParams.push(orderId);
      const updateQueryString = `
      UPDATE orders SET estimated_time = NOW() + $1 * interval '1 minutes', status = 'In progress'
      WHERE id = $2 RETURNING *;
      `;
      const orderDetailsQueryString = `
      SELECT order_id, customers.first_name, customers.last_name, items.name, items.price, quantity
      FROM order_items
      JOIN orders ON orders.id = order_id
      JOIN customers ON customers.id = customer_id
      JOIN items ON items.id = item_id
      WHERE order_id = $1;
      `;

      const orderPromise = db.query(updateQueryString, queryParams);
      const orderDetailsPromise = db.query(orderDetailsQueryString, [orderId]);
      Promise.all([orderPromise, orderDetailsPromise])
        .then(response => {
          const order = response[0].rows;
          const orderDetails = response[1].rows;
          const estimatedTime = order.estimated_time;
          const firstName = orderDetails[0].first_name;
          console.log(order.estimated_time);
          const msg = `Hello ${firstName}. your order No. ${orderId} is confirmed, please pick it up at ${estimatedTime}`;
          // res.json({ order, orderDetails });
          if (order) {
            client.messages
              .create({
                body: msg,
                from: '+12264000625',
                to: '+16474256464'
              })
              .then(message => console.log(message.sid));
          }
          res.redirect(`/vendors/1/order/${orderId}`);
        })
        .catch(err => {
          console.log(err);
          res
            .status(500)
            .json({ error: err.message });
        });
    }

    if (req.body.completedTime) {
      const updateQueryString = `
      UPDATE orders SET completed_time = NOW(), status = 'Order is ready'
      WHERE id = $1 RETURNING *;
      `;
      const orderDetailsQueryString = `
      SELECT order_id, customers.first_name, customers.last_name, items.name, items.price, quantity
      FROM order_items
      JOIN orders ON orders.id = order_id
      JOIN customers ON customers.id = customer_id
      JOIN items ON items.id = item_id
      WHERE order_id = $1;
      `;
      const updatePromise = db.query(updateQueryString, [orderId]);
      const orderDetailsPromise = db.query(orderDetailsQueryString, [orderId]);
      Promise.all([updatePromise, orderDetailsPromise])
        .then(response => {
          const order = response[0].rows;
          const orderDetails = response[1].rows;
          const completedTime = order.completed_time;
          const firstName = orderDetails[0].first_name;
          // res.json({ order, orderDetails});
          const msg = `Hello ${firstName}. your order No. ${orderId} is confirmed, please pick it up at ${completedTime}`;
          if (order) {
            client.messages
              .create({
                body: msg,
                from: '+12264000625',
                to: '+16474256464'
              })
              .then(message => console.log(message.sid));
          }
          res.redirect(`/vendors/1/order/${orderId}`);
        })
        .catch(err => {
          console.log(err);
          res
            .status(500)
            .json({ error: err.message });
        });
    }

  });

  return router;
};
