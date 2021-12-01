const express = require('express');
const router = express.Router();

const cookieSession = require('cookie-session');
router.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

module.exports = (db) => {
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  router.get("/login/:userId", (req, res) => {
    const itemsPromise = db.query(`SELECT * FROM items;`);
    const categoriesPromise = db.query(`SELECT * FROM categories;`);
    const customerId = req.params.userId;
    const customerQueryString = `
    SELECT first_name, last_name FROM customers WHERE id = $1;
    `;
    const customerPromise = db.query(customerQueryString, [customerId]);
    Promise.all([itemsPromise, categoriesPromise, customerPromise])
      .then(response => {
        const items = response[0].rows;
        const categories = response[1].rows;
        const customer = response[2].rows;
        const templateVars = { items, categories, customer };

        //If customer is not resistered, redirect to '/'
        if (!customer.length) {
          res.redirect("/");
          return;
        }
        //If customer is resistered, set session
        req.session.userId = req.params.userId;
        console.log(req.session.userId);
        if (!req.session.userId) {
          res.redirect("/");
          return;
        }
        //  objects: items, categories, customer
        // res.json(templateVars);
        res.render("index", templateVars);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:userId/cart", (req, res) => {
    const itemsPromise = db.query(`SELECT * FROM items;`);
    const customerId = req.params.userId;
    const customerQueryString = `
    SELECT first_name, last_name, email, phone FROM customers WHERE id = $1;
    `;
    const customerPromise = db.query(customerQueryString, [customerId]);
    Promise.all([itemsPromise, customerPromise])
      .then(response => {
        const items = response[0].rows;
        const customer = response[1].rows;
        const templateVars = { items, customer };
        // res.json(templateVars);
        res.render("checkout", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:userId/cart", (req, res) => {
    // Need passing data
  });

  router.get("/", (req, res) => {
    const itemsPromise = db.query(`SELECT * FROM items;`);
    const categoriesPromise = db.query(`SELECT * FROM categories;`);
    Promise.all([itemsPromise, categoriesPromise])
      .then(response => {
        const items = response[0].rows;
        const categories = response[1].rows;
        const templateVars = { items, categories };
        // res.json(templateVars);
        res.render("index", templateVars);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};


