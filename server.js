const express = require('express');
const hbs = require('hbs'); //templating library Handlebars
const fs = require('fs');

// App can run on Heroku or Locally
const port = process.env.PORT || 3000;

var app = express();

// add support for HBS partials
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

// How you register Middleware
// Middleware does not move on unless next() is called
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// Maintenance Middleware
/*
app.use((req, res, next) => {
    res.render('maintenance.hbs');
});*/

// Middleware to help serve files in public folder
app.use(express.static(__dirname + '/public'));

// Can invoke methods from within HBS files using a Helper
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});
// HTTP Route Handler

app.get('/', (req, res) => {
    //res.send('<h1>Hello Express!</h1>');
    /*
    res.send({
        name: 'Poop',
        likes: [
            'biking',
            'comics'
        ]
    });*/
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the Home Page!'
    })
});

app.get('/about', (req, res) => {
    //res.send('About Page');
    // render any templates you have defined the node view engine to use
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});


app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Unable to handle request"
    });
});

// Bind the app to a port on your machine
// Need to make the port dynamic using an ENVIRONMENT variable Heroku sets
app.listen(port, () => {
    console.log('Server is up on port ' + port);
});