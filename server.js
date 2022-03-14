/////////////////////////////////////////////////
////////////// DEPENDENCIES /////////////////////
/////////////////////////////////////////////////

require('dotenv').config()
const express = require('express')
// now that we're using controllers as they should be used
// we need to require our routers
const ProductRouter = require('./controllers/products')
const UserRouter = require('./controllers/user')
const HomeRouter = require('./controllers/home')
const middleware = require('./utils/middleware')

const app = require('liquid-express-views')(express())

/////////////////////////////////////////////////
////////////// MIDDLEWARE ///////////////////////
/////////////////////////////////////////////////

middleware(app)

/////////////////////////////////////////////////
////////////// ROUTES ///////////////////////////
/////////////////////////////////////////////////

app.use('/products', ProductRouter)
app.use('/user', UserRouter)
app.use('/', HomeRouter)

/////////////////////////////////////////////////
////////////// SERVER LISTENER //////////////////
/////////////////////////////////////////////////

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`)
})