var mongoose = require('mongoose');

var dataSchema = new mongoose.Schema({
    productname:{type:String},
    price:{type:Number}
    
});

module.exports = mongoose.model('data',dataSchema);