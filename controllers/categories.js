const express = require('express')
const db = require('../models')
const router = express.Router()

router.get('/', (req, res) => {
  db.category.findAll().then(categories => {
    console.log(categories)
    res.render('categories/index', {categories: categories})
  }).catch(err => {
    console.log('Error in GET /', err)
    res.status(400).render('main/404')
  })
})

router.get('/:id', (req, res) => {
  db.category.findOne({
    where: {id: req.params.id},
    include: [{
      model: db.project,
    }]
  }).then( results => {
      console.log("results: ", results)
      res.render("categories/show", {category: results.name, projects: results.projects})

  })
})

module.exports = router