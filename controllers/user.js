/////////////////////////////////////////////////
////////////// DEPENDENCIES /////////////////////
/////////////////////////////////////////////////

const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

/////////////////////////////////////////////////
////////////// ROUTER ///////////////////////////
/////////////////////////////////////////////////

const router = express.Router()

/////////////////////////////////////////////////
////////////// ROUTES ///////////////////////////
/////////////////////////////////////////////////

// example
router.get('/', (req, res) => {
    res.send('hello')
})
// two sign up routes
// get to render the signup form
router.get('/signup', (req, res) => {
    res.render('users/signup')
})
// post to send the signup info
router.post('/signup', async (req, res) => {
    // console.log('this is initial req.body in signup', req.body)
    // first encrypt our password
    req.body.password = await bcrypt.hash(
        req.body.password, 
        await bcrypt.genSalt(10)
    )
    // console.log('req.body after hash', req.body)
    // create a new user
    User.create(req.body)
        // if created successfully redirect to login
        .then(user => {
            res.redirect('/user/login')
        })
        // if an error occurs, send err
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

// two login routes
// get to render the login form
router.get('/login', (req, res) => {
    res.render('users/login')
})
// post to send the login info(and create a session)
router.post('/login', async (req, res) => {
    // console.log('request object', req)
    // get the data from the request body
    const { username, password } = req.body
    // then we search for the user
    User.findOne({ username })
        .then(async (user) => {
            // check if the user exists
            if (user) {
                // compare the password
                // bcrypt.compare evaluates to a truthy or a falsy value
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    // then we'll need to use the session object
                    // store some properties in the session
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    console.log('session user id', req.session.userId)
        
                    res.redirect('/products')
                } else {
                    // send an error if the password doesn't match
                    res.json({ error: 'username or password incorrect'})

                }
            } else {
                // send an error if the user doesn't exist
                res.json({ error: 'user does not exist' })
            }
        })
        // catch any other errors that occur
        .catch(error => {
            console.log(error)
            res.json(error)
        })
})

// logout route -> destroy the session
router.get('/logout', (req, res) => {
    // destroy the session and redirect to the main page
    req.session.destroy(err => {
        console.log('this is err in logout', err)
        res.redirect('/')
    })
})

/////////////////////////////////////////////////
////////////// EXPORT ROUTER ////////////////////
/////////////////////////////////////////////////

module.exports = router