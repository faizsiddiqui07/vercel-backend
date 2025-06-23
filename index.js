const express = require('express')
const dotenv = require('dotenv')
const db_connect = require('./utils/db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')

dotenv.config()

const app = express()
const port = process.env.port || 8000;

app.use(express.json());
app.use(cookieParser())

if (process.env.mode === 'production') {
    app.use(cors())
} else {
    app.use(cors({
        origin: ["http://localhost:5174", "http://localhost:5173"],
        credentials: true,
    }))
}

app.use(session({
    secret: "erjgqrg5ergwgwt2hw5twjgh534BjugKJ", //Random key
    resave: false,
    saveUninitialized: true,
}))

db_connect()

app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/projectRoutes'))


app.listen(port, () => console.log(`Server running on port ${port}!`))