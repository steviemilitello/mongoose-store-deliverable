/////////////////////////////////////////////////
////////////// DEPENDENCIES /////////////////////
/////////////////////////////////////////////////

const express = require('express')
const res = require('express/lib/response')
const Product = require('../models/products')

/////////////////////////////////////////////////
////////////// ROUTER ///////////////////////////
/////////////////////////////////////////////////

const router = express.Router()

/////////////////////////////////////////////////
////////////// ROUTER MIDDLEWARE ////////////////
/////////////////////////////////////////////////

// create some middleware to protect these routes
// Authorization middleware
router.use((req, res, next) => {
	// checking the logged in boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/user/login')
	}
})

/////////////////////////////////////////////////
////////////// ROUTES ///////////////////////////
/////////////////////////////////////////////////

// index ALL product route
router.get('/', (req, res) => {
	Product.find({})
		.then((products) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('/products/index', { products, username, loggedIn })
		})

		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// index that shows only the user's products
router.get('/mine', (req, res) => {
	Product.find({ owner: req.session.userId })
		.then((products) => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn

			res.render('products/index', { products, username, loggedIn })
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const username = req.session.username
	const loggedIn = req.session.loggedIn
	res.render('/products/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.owner = req.session.userId
	Product.create(req.body)
		.then((product) => {
			console.log('this was returned from create', product)
			res.redirect('/products')
		})
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

router.get('/:id/edit', (req, res) => {
	const productId = req.params.id
	Product.findById(productId)
		.then((product) => {
			console.log('edit product', product)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			res.render('/products/edit', { product, username, loggedIn })
		})
		.catch((err) => {
			console.log(err)
			res.json(err)
		})
})

// update route -> sends a put request to our database
router.put('/:id', (req, res) => {
	const productId = req.params.id
	Product.findByIdAndUpdate(productId, req.body, { new: true })
		
		.then((product) => {
			console.log('the updated product', product)

			res.redirect(`/products/${product.id}`)
		})
		// if an error, display that
		.catch((error) => res.json(error))
})

// show route
router.get('/:id', (req, res) => {
	// first, we need to get the id
	const productId = req.params.id

	Product.findById(productId)
	.populate('comments.author')
		// once found, we can render a view with the data
		.then((product) => {
			console.log('the product we got\n', product)
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			const userId = req.session.userId
			res.render('/products/show', { product, username, loggedIn, userId })
		})
		// if there is an error, show that instead
		.catch((err) => {
			console.log(err)
			res.json({ err })
		})
})

// buy route 

router.put('buy/:id')
	const productId = req.params.id 
	Product.findByIdAndUpdate(productId, { qty: product.qty - 1 }, {new: true })
		.then((product) => {
			console.log('the new quantity of the product is', product.qty)
			res.redirect('/products/')
		})
		.catch(error => {
			console.log(error)
			res.json({ error })
		})


// delete route
router.delete('/:id', (req, res) => {
	const productId = req.params.id
	Product.findByIdAndRemove(productId)
		.then((product) => {
			console.log('this is the response', product)
			res.redirect('/products')
		})
		.catch((error) => {
			console.log(error)
			res.json({ error })
		})
})

/////////////////////////////////////////////////
////////////// EXPORT ROUTER ////////////////////
/////////////////////////////////////////////////

module.exports = router