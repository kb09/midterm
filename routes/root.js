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
    req.session.userId = req.params.userId;
    console.log(req.session.userId);
    if (!req.session.userId) {
      res.redirect("/");
      return;
    }
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



  router.post("/:userId/cart", (req, res) => {
    // Need passing data
    res.redirect("/checkout");
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


