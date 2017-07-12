'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
    dataset_code: String,
    database_code: String,
    name: String,
    data: []
});

module.exports = mongoose.model('Stock', Stock);
