const express = require('express');
const router = express.Router();
const Book = require('../models').Book;


/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        next(error);ç
      }
    }
}

/* GET Books listing. */
router.get('/', asyncHandler(async (req, res) => {
    const data = await Book.findAll();
    const books = [];
    data.map( book => books.push(book));
    res.render("index", {books});
}));

router.get('/new_book', asyncHandler(async (req, res) => {
    res.render('new-book', {book: {}});
}));

router.get('/book/:id/edit', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  console.log(book.id);
  if(book) {
    res.render('update-book', {book});
  } else {
    const err = new Error();
    err.status = 404;
    err.message = "Oops! It seems the page could not be found...";
    next(err);
  }
}));

router.post('/new_book', asyncHandler(async (req, res) => {
  let book;
  console.log(req.body);
  try {
    book = await Book.create(req.body)
    res.redirect('/');
  } catch (error) {
    if(error.name ==="SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors})
    } else {
        throw error; // error caught in the asyncHandler's catch block
    }
  }
}));

//Update book in DB
router.post('/book/update/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Oops! It seems the page could not be found...";
      next(err);
    }
  } catch(error){
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: error.title })
    } else {
      throw error;
    }
  }
}));

router.post('/:id/delete', asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    book.destroy();
    res.redirect('/');
}));
  
module.exports = router;