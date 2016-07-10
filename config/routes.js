'use strict';

/*
 * Module dependencies.
 */

const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');
const comments = require('../app/controllers/comments');
const requests = require('../app/controllers/requests');
const refugees = require('../app/controllers/refugees');
const organizations = require('../app/controllers/organizations');
const statistics = require('../app/controllers/statistics');
const poles = require('../app/controllers/poles');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');
const temp = require('../app/utils/PageTemplate');

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

const fail = {
    failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, passport) {
    const pauth = passport.authenticate.bind(passport);
    // UI test Ming
    app.get('/test', function (req, res) {
        res.render('dashboard/index.html', temp.adminMainTemp("Dashboard", {}, {}));
    });
    app.get('/summary', function (req, res) {
        res.render('dashboard/summary.html', temp.adminMainTemp("Dashboard", {}, {}));
    });
    app.get('/map', function (req, res) {
        res.render('dashboard/map.html', temp.adminMainTemp("Dashboard", {}, {}));
    });
    app.get('/refugee', function (req, res) {
        res.render('dashboard/refugee.html', temp.adminMainTemp("Dashboard", {}, {}));
    });
    app.get('/selfupdate',function(req,res){
        res.render('refugee/selfUpdate.html',temp.refugeeMainTemp())
    });
    app.get('/selfServiceList',function(req,res){
        res.render('refugee/servicelist.html',temp.refugeeMainTemp())
    })
    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session',
        pauth('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook',
        pauth('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin);
    app.get('/auth/facebook/callback', pauth('facebook', fail), users.authCallback);
    app.get('/auth/github', pauth('github', fail), users.signin);
    app.get('/auth/github/callback', pauth('github', fail), users.authCallback);
    app.get('/auth/twitter', pauth('twitter', fail), users.signin);
    app.get('/auth/twitter/callback', pauth('twitter', fail), users.authCallback);
    app.get('/auth/google',
        pauth('google', {
            failureRedirect: '/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);
    app.get('/auth/google/callback', pauth('google', fail), users.authCallback);
    app.get('/auth/linkedin',
        pauth('linkedin', {
            failureRedirect: '/login',
            scope: [
                'r_emailaddress'
            ]
        }), users.signin);
    app.get('/auth/linkedin/callback', pauth('linkedin', fail), users.authCallback);

    app.param('userId', users.load);

    // article routes
    app.param('id', articles.load);
    app.get('/articles', articles.index);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    app.get('/articles/:id/edit', articleAuth, articles.edit);
    app.put('/articles/:id', articleAuth, articles.update);
    app.delete('/articles/:id', articleAuth, articles.destroy);


    // home route
    app.get('/', articles.index);

    // comment routes
    app.param('commentId', comments.load);
    app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

    // tag routes
    app.get('/tags/:tag', tags.index);

    // localhost:3000/api/requests
    app.post('/api/requests', requests.createApi);
    // localhost:3000/api/requests/list?page=1
    app.post('/api/requests/list', requests.listApi);
    // localhost:3000/api/pole
    app.post('/api/poles', poles.updateApi);
    // localhost:3000/api/pole/list?page=1
    app.post('/api/poles/list', poles.listApi);
    // localhost:3000/api/refugees
    app.post('/api/refugees', refugees.createApi);
    // localhost:3000/api/refugees/list?page=1
    app.post('/api/refugees/list', refugees.listApi);
    // localhost:3000/api/organizations
    app.post('/api/organizations', organizations.createApi);
    // localhost:3000/api/organizations/search
    app.post('/api/organizations/search', organizations.searchNearbyApi);
    // localhost:3000/api/organizations/list?page=1
    app.post('/api/organizations/list', organizations.listApi);


    //poles(access points) Ming
    app.get('/poles/generate', function (req, res) {
      res.render('pole/generate_code.html', temp.adminMainTemp("Generation", {}, {}));
    });
    app.get('/poles/generateBarcode', poles.generateBarcodeImg);
    app.get('/poles/generatePolePDFBatch',poles.generatePolePDFBatch);
    app.get('/poles/posterTemplate',function(req,res){
        res.render('pole/posterTemplate.html', {layout:"template/blank.html",barcode:"SANJ95270"});
    });
    app.post('/api/generatePoleCodes',poles.generatePolePDFBatch);
    app.post('/api/batchCreatePoleCodes',poles.doCreate);
    app.post('/api/poleCodesList',poles.doCreate);

    app.get('/api/statistics/summary', statistics.getSummary);


    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }

        console.error(err.stack);

        if (err.stack.includes('ValidationError')) {
            res.status(422).render('422', {error: err.stack});
            return;
        }

        // error page
        res.status(500).render('500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
};
