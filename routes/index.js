const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require ("sequelize");



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
    const n = 1
    const pages = Math.ceil(data.length / 10)
    const current = 1
    data.slice([0], [10]).map( book => books.push(book));
    res.render("index", {books, n, pages, current});
}));

router.get('/books/pages/:id', asyncHandler(async (req, res) => {
  const data = await Book.findAll();
  const books = [];
  const n = 1
  const pages = Math.ceil(data.length / 10)
  const current = req.params.id

  data.slice([(current-1)*10], [current*10]).map( book => books.push(book));
  res.render("index", {books, n, pages, current});
}));

router.get('/new_book', asyncHandler(async (req, res) => {
    res.render('new-book', {book: {}});
}));

router.get('/book/:id/edit', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
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

router.get('/books/', asyncHandler(async(req, res, next) => {
  let { search } = req.query;
  let books;
  
  if(search){
   books = await Book.findAndCountAll({
    attributes: ['title', 'author', 'genre', 'year'],
    where:{
       [Op.or]:  [
         {
           title: {
             [Op.like]: `%${search}%`
           }
         },
         {
           author: {
             [Op.like]: `%${search}%`
           }
         },
         {
           genre:   {
            [Op.like]: `%${search}%`
          }
         },
         {
           year:   {
            [Op.like]: `%${search}%`
          }
         }
       ]
    } ,
   })
} else {
  res.redirect("/")
}
  res.render("index", { books: books.rows });
}));
module.exports = router;