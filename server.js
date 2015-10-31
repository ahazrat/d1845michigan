var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// passport strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username == 'admin' && password == 'admin')
            return done(null, { name: 'admin' });
        return done(null, false, { message: 'Incorrect username.' });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

// application
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.session({ secret: 'grumpyCat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// routes
app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});
app.get('/users', auth, function (req, res) {
    res.send([{ name: 'User1' }, { name: 'User2' }]);
});
app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
app.post('/login', passport.authenticate('local'), function (req, res) {
    res.send(req.user);
});
app.post('/logout', function (req, res) {
    req.logout();
    res.send(200);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port: ' + app.get('port'));
});