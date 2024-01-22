const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 600 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return (
      console.log(req.session.authorization),
      res.status(200).send("User successfully logged in")
    );
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { isbn } = req.params;
  if (req.session.authorization) {
    const userExists = books[isbn].reviews.includes(
      req.session.authorization.username
    );
    const username = req.session.authorization.username;
    if (userExists) {
      books[isbn].reviews = books[isbn].reviews.replace(
        new RegExp(username + ":.*?(?=(\\S+:|$))", "i"),
        username + ":" + review
      );
    } else {
      books[isbn].reviews +=
        " " + req.session.authorization.username + ":" + review;
    }
  } else {
    console.log(
      " you should register and login again because the user string is empty"
    );
  }

  res.send(books[isbn].reviews);
  console.log(req.session.authorization);
  console.log(users);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  if (req.session.authorization) {
    const userExists = books[isbn].reviews.includes(
      req.session.authorization.username
    );
    const username = req.session.authorization.username;
    if (userExists) {
      books[isbn].reviews = books[isbn].reviews.replace(
        new RegExp(username + ":.*?(?=(\\S+:|$))", "i"),
        ""
      );
    } else {
      books[isbn].reviews +=
        " " + req.session.authorization.username + ":" + review;
    }
  } else {
    console.log(" i think you should register and login again ");
  }

  res.send(books[isbn].reviews);
  console.log(req.session.authorization);
  console.log(users);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
