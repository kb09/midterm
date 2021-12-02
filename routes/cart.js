const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const items = data.rows;
        const templateVars = { items };
        res.render("checkout", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  return router;
};


















// adding item to cart

// module.exports = function Cart(oldCart){
//   this.items= oldCart.items || {};
//   this.totalQty = oldCart.totalQty || 0;
//   this.totalPrice = oldCart.totalPrice || 0;

//   // add to cart when adding more items

//   this.add = function(item, id){
//     let storedItem = this.items[id];
//     if (!storedItem){
//       storedItem = this.items[id] = {item: item, qty:0, price:0};
//     }
//     storedItem.qty++;
//     storedItem.price = storedItem.item.price * storedItem.qty;
//     this.totalQty++;
//     this.totalPrice += storedItem.item.price;

//   }

//       this.generateArray=function(){
//         let arr =[];
//         for (let id in this.items){
//           arr.push(this.items[id]);
//         }
//         return arr;
//       }

//       return router;

// };
