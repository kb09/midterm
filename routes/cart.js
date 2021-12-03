const express = require('express');
const { order, setOrder } = require('../global');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    // console.log("request method", req.method)
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const items = data.rows;
        // console.log("items", items)
        console.log(req.body);

        let userData = req.body
        let foodArray = [];


        for (let item in userData) {
          if (userData[item] !== '') {
            foodArray.push({ name: item, quantity: Number(userData[item]) })
          };
        }
        //console.log(foodArray)
        let orderItem = []
        for (let i = 0; i < items.length; i++) {
          for (let j = 0; j < foodArray.length; j++) {
            if (foodArray[j].name == items[i].name) {
              orderItem.push(items[i])
            }
          }
        }
        let quantity = 0
        for (let b = 0; b < foodArray.length; b++) {
          quantity += foodArray[b].quantity

        }

        console.log(foodArray)

        setOrder( {orderItem, foodArray})


        res.render('../views/checkout', {
          orderItem,
          quantity,
          foodArray,
        });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

