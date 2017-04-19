var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaders = require('../models/leadership')
var leaderRouter = express.Router();
var Verify = require('./verify');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')

.get(function(req, res, next) {
    Leaders.find({}, function(err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})

.post(Verify.verifyAdmin, function(req, res, next) {
    Leaders.create(req.body, function(err, leader) {
        if (err) next(err);
        console.log('Leader Created');
        var id = leader._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Leader created with id: ' + id);
    });
})

.delete(Verify.verifyAdmin, function(req, res, next) {
    Leaders.remove({}, function(err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

leaderRouter.route('/:leaderId')

.get(function(req, res, next) {
    Leaders.findById(req.params.leaderId, function(err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})

.put(Verify.verifyAdmin, function(req, res, next) {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function(err, leader) {
        if (err) next(err);

        res.json(leader);
    });
})

.delete(Verify.verifyAdmin, function(req, res, next) {
    Leaders.findByIdAndRemove(req.params.leaderId, function(err, resp) {
        if (err) next(err);

        res.json(resp);
    });
})

module.exports = leaderRouter;