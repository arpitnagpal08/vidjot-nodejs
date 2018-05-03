const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");

const app = express();

const Ideas = require("./routes/ideas");
const User = require("./routes/user");


require("./config/passport")(passport);

const db = require("./config/database");

mongoose.connect(db.mongoURI, (err, client) => {
    if (err) throw err;
    console.log("Connected to database");
});


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


//static folder
app.use(express.static(path.join(__dirname, 'public')))

//method override middleware
app.use(methodOverride("_method"));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


app.get("/", (req, res) => {
    res.render("index", {
        title: "Page"
    })
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.use("/ideas", Ideas)

app.use("/user", User);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})