/////////////////////////////////////////////////
////////////// DEPENDENCIES /////////////////////
/////////////////////////////////////////////////

require('dotenv').config()
const mongoose = require('mongoose')

/////////////////////////////////////////////////
////////////// DATABASE CONNECTION //////////////
/////////////////////////////////////////////////

// here we are setting up inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// establish connection
mongoose.connect(DATABASE_URL, CONFIG)

// events for when our connection opens/closes/errors
mongoose.connection
	.on('open', () => console.log('Connected to Mongoose'))
	.on('close', () => console.log('Disconnected from Mongoose'))
	.on('error', (error) => console.log(error))

/////////////////////////////////////////////////
////////////// EXPORT CONNECTION ////////////////
/////////////////////////////////////////////////

module.exports = mongoose
