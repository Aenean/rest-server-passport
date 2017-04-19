var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotions = require('../models/promotions');
var promoRouter = express.Router();
var Verify = require('./verify');

promoRouter.use(bodyParser.json());

promoRouter.route('/')

.get(function(req, res, next) {
    Promotions.find(req.body, function(err, promotion) {
        if (err) next(err);
        res.json(promotion);
    });
})

.post(Verify.verifyAdmin, function(req, res, next) {
    Promotions.create(req.body, function(err, promotion) {
        if (err) next(err);
        console.log('Promotion created!');
        var id = promotion._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Promotion created with id: ' + id);
    });
})

.delete(Verify.verifyAdmin, function(req, res, next) {
    Promotions.remove({}, function(err, resp) {
        if (err) next(err);
        res.json(resp);
    })
})

promoRouter.route('/:promoId')

.get(function(req, res, next) {
    Promotions.findById(req.params.promoId, function(err, promotion) {
        if (err) next(err);
        res.json(promotion);
    });
})

.put(Verify.verifyAdmin, function(req, res, next) {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {
        new: true
    }, function(err, resp) {
        if (err) next(err);
        res.json(resp);
    })
})

.delete(Verify.verifyAdmin, function(req, res, next) {
    Promotions.findByIdAndRemove(req.params.promoId, function(err, promotion) {
        if (err) next(err);
        res.json(promotion);
    });
})

module.exports = promoRouter;