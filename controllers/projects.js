let express = require('express')
let db = require('../models')
let router = express.Router()

// POST /projects - create a new project
router.post('/', (req, res) => {
  db.project.findOrCreate({
    where: {
      name: req.body.name,
      githubLink: req.body.githubLink,
      deployLink: req.body.deployLink,
      description: req.body.description
    }
  }).then(([project, created]) => {
    let categoryName = req.body.category.toLowerCase()
    // console.log(categoryName)
    db.category.findOrCreate({
      where: {name: categoryName}
    }).then( ([category, created]) => {
      project.addCategory(category).then(relationInfo => {
        // console.log(relationInfo)
        console.log("--------------------------")
        console.log(`${category.name} has been added to project ${project.name}`)
      })
    })
  }).then((project) => {
    res.redirect('/')
  }).catch((error) => {
    console.log(error);
    res.status(400).render('main/404')
  })
})

// GET /projects/new - display form for creating a new project
router.get('/new', (req, res) => {
  res.render('projects/new')
})

// GET /projects/:id - display a specific project
router.get('/:id', (req, res) => {
  db.project.findOne({
    where: {id: req.params.id},
    include: [{
      model: db.category,
    }]
  }).then(results => {
      // console.log("results: ", results)
      res.render("projects/show", {project: results, categories: results.categories})
  }).catch((error) => {
    res.status(400).render('main/404')
  })
})

// DELETE /projects/id
router.delete('/:id', (req, res) => {
  db.project.destroy({
    where: {id:req.params.id}
  }).then( deleted => {
    res.redirect('/')
  })
})


// UPDATE /projects/id/edit
router.get('/:id/edit', (req, res) => {
  db.project.findOne({
    where: {id: req.params.id},
    include: [{
      model: db.category
    }]
  }).then( foundProj => {
    res.render('projects/edit', {project: foundProj, category: foundProj.categories})
  })
})

router.put('/:id', (req, res) => {
  // console.log("hello")
  console.log(req.body)
  db.project.findOne({
    where: {id: req.params.id},
    include: [{model: db.category}]
  }).then(proj => {
    console.log("PROJ: --------", proj)
    console.log("PROJ.CAT: --------", proj.categories)

    // HELP?? The code below does not work
    if (proj.categories.length === 1) {
      // update project and category
      db.project.update({
        where: {
          name: req.body.name,
          githubLink: req.body.githubLink,
          deployLink: req.body.deployedLink,
          description: req.body.description,
        }
      }).then(([project, created]) => {
        console.log(project)
        db.category.findOrCreate({
          where: {name: req.body.category}
        }).then( ([category, created]) => {
          project.addCategory(category).then(relationInfo => {
            console.log(relationInfo)
            console.log("--------------------------")
            console.log(`${category.name} has been added to project ${project.name}`)
          })
        })
      })
    } else {
      // loop through each category and update? or create? 
    }
  })
})


module.exports = router
