'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
    dataset_code: String,
    database_code: String,
    name: String,
    newest_available_date: String,
    oldest_available_date: String,
    data: []
});

module.exports = mongoose.model('Stock', Stock);
