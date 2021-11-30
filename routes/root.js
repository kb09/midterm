const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const items = data.rows;
        const templateVars = { items };
        res.render("index", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:userId", (req, res) => {
    // req.session.userId = req.params.userId;
    // if (!req.session.userId) {
    //   res.redirect("/");
    //   return;
    // }
    db.query(`SELECT * FROM items;`)
      .then(data => {
        const items = data.rows;
        const templateVars = { items };
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
  });


  return router;
};


