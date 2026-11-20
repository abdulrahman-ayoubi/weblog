const express = require('express');
const bodyParser = require('body-parser');
const layout = require('express-ejs-layouts');
const dotenv = require('dotenv');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const debug = require('debug')('weblog-project')


const path = require("path");


const connectDatabase = require('./config/database.js')

const MongoStore = require('connect-mongodb-session')(session)

dotenv.config({path: './config/.config'})

const app = express();
// database connection
connectDatabase()
    .catch(err => {
        debug(err)
    });
// passport
require('./config/passport');
// costume middleware
app.use(bodyParser.urlencoded({extended: true}));
// template engine
app.use(layout);
app.set('view engine', 'ejs');
app.set('layout', './layouts/mainLayout.ejs');
app.set('views', 'views');


// morgan logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    store: new MongoStore({
        uri: process.env.MONGO_URL,
        collection: "session",
    })
}));
app.use(passport.initialize({}))
app.use(passport.session({}))
// flash
app.use(flash());
//public
app.use(express.static(path.join(__dirname, 'public')));


//routes
app.use('/', require('./router/index'));
app.use('/dashboard', require('./router/dashboard.js'));
app.use('/users', require('./router/user'),);


// 404page Not Founded
app.use(require('./controller/errorController').get404);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    debug(`server connect to port ${PORT}`)
})
