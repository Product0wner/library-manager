const express = require('express');
const path = require('path');
const sequelize = require('./models').sequelize
const Book = require('./models').Book;


const app = express();
const port = 3000

sequelize.sync()
    .then(() => {
        app.listen(port);
});

app.get('/', (req, res) => {
  const books = Book.findAll();
  console.log(books);
  res.send('Yes man!')
})


// /* Handler function to wrap each route. */
// function asyncHandler(cb){
//     return async(req, res, next) => {
//       try {
//         await cb(req, res, next)
//       } catch(error){
//         // Forward error to the global error handler
//         next(error);
//       }
//     }
//   }

//   router.get('/', asyncHandler(async (req, res) => {
//     const books = await Book.findAll();
//     console.log(books.res.json())
//     //res.render("articles/index", { articles: articles, title: "Sequelize-It!" });
//   }));


