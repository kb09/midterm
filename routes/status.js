/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { getOrder } = require('../global');

const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {

    let orderItem = getOrder().orderItem
    let foodArray = getOrder().foodArray

    let id;

    let query1 = "INSERT INTO orders(customer_id, status, place_order_time, estimated_time) VALUES($1, $2, $3, $4) returning id";
    let values1 = [1, "In Progress", new Date(), new Date(new Date().getTime() + 30*60000)] //change 1 to customer id

    db.query(query1, values1).then(data =>{

      id = data.rows[0].id;
      console.log(id)

      for (let i = 0; i < foodArray.length; i++) {
        const food = foodArray[i];
        const order = orderItem[i];

        let query2 = "INSERT INTO order_items(order_id, item_id, quantity) VALUES($1, $2, $3) returning *";
        let values2 = [id, order.id, food.quantity]

        db.query(query2, values2).then(data =>{
          console.log(data.rows)
        }).catch(err =>{
          console.log(err)
        })
      }

      res.render("../views/status", {
        orderItem,
        foodArray,
        id
      })

    }).catch(err =>{
      console.log(err)
    });






  })
  return router;
};
