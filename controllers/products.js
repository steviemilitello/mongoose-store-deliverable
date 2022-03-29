// Import Dependencies
const express = require('express')
const Product = require('../models/products')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	Product.find({})
		.then(products => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('products/index', { products, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's products
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Product.find({ owner: userId })
		.then(products => {
			res.render('products/index', { products, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('products/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {

	req.body.owner = req.session.userId
	Product.create(req.body)
		.then(product => {
			console.log('this was returned from create', Product)
			res.redirect('/products')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const productId = req.params.id
	Product.findById(productId)
		.then(products => {
			res.render('products/edit', { product })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const productId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Product.findByIdAndUpdate(productId, req.body, { new: true })
		.then(product => {
			res.redirect(`/products/${product.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const productId = req.params.id
	Product.findById(productId)
		.then(product => {
            const {username, loggedIn, userId} = req.session
			res.render('products/show', { product, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// buy route 

router.put('/:id/buy/', (req, res) => {
	const productId = req.params.id 
	Product.findByIdAndUpdate(productId, { $inc: {qty: -1 } } )
		.then((product) => {
			console.log('the new quantity of the product is', product)
			res.redirect(`/products/${product.id}`)
		})
		.catch(error => {
			console.log(error)
			res.json({ error })
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const productId = req.params.id
	Product.findByIdAndRemove(productId)
		.then(product => {
			res.redirect('/products')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
