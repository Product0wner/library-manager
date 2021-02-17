const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
}

/* GET Books listing. */
router.get('/', asyncHandler(async (req, res) => {
    const data = await Book.findAll();
    const books = [];
    data.map( book => books.push(book.dataValues));
    res.render("index", {books});
}));

router.get('/new_book', asyncHandler(async (req, res) => {
    res.render('new-book', {book: {}});
}));

router.post('/new_book', asyncHandler(async (req, res) => {
  let book;
  console.log("Book creation started");
  console.log(req.body);
  try {
    book = await Book.create(req.body)
    console.log("a new book was created");
    res.redirect('/');
  }catch (error) {
    console.log(error)
  }
  console.log("Book creation finished");
}));

router.get('/book/:id/edit', asyncHandler(async (req, res) => {
  res.render('update-book', {book: {}});
}));

router.post('/delete_book', asyncHandler(async (req, res) => {
  let book;
  console.log("Book deletion started");
  console.log(req.body);
  try {
    book = await Book.create(req.body)
    console.log("a new book was created");
    res.redirect('/');
  }catch (error) {
    console.log(error)
  }
  console.log("Book creation finished");
}));
  
module.exports = router;