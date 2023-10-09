const express = require('express')
const app = express();
require('dotenv').config()
const dbConfig = require('./config/dbConfig')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoutes')
const bodyParser = require("body-parser")
const doctorRoute = require("./routes/doctorsRoute")


app.use(bodyParser.json())

app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/doctor', doctorRoute)


app.use(express.json())
app.use(express.urlencoded({ extended: false }));



const port = process.env.PORT || 5000;




app.listen(port, () => console.log(`Node server started at port ${port}`))