const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    res.status(300).send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const { isbn } = req.params;
    res.status(300).send(books[isbn]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const { author } = req.params;
    let bookKeys = Object.keys(books);
    let numBookKeys = bookKeys.map(Number);
    const foundNum = numBookKeys.find(
      (numBook) => books[numBook].author === author
    );
    res.send(books[foundNum]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const { title } = req.params;
    let bookKeys = Object.keys(books);
    let numBookKeys = bookKeys.map(Number);
    const foundNum = await numBookKeys.find(
      (numBook) => books[numBook].title === title
    );
    res.send(books[foundNum]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const bookReview = books[isbn];
  res.send(bookReview.reviews);
});

module.exports.general = public_users;
