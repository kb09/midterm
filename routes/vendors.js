const express = require('express');
const router  = express.Router();

module.exports = (db) => {


  router.get("/:id/:orders/:order_id", (req, res) => {
    res.json(`I'm a id ${req.params.id}, orders: ${req.params.orders}, order_id${req.params.order_id}`);

  });
  router.post("/:id/:orders/:order_id", (req, res) => {
    res.json(`I'm a id ${req.params.id}, orders: ${req.params.orders}, order_id${req.params.order_id}`);

  });

  return router;
};
