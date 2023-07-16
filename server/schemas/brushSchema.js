const mongoose = require("mongoose")
const { Schema } = mongoose;
const brushSchema = new Schema({
    color: String,
    x: Number,
    y: Number
});
const Brush = mongoose.model('Brush', brushSchema);
module.exports = Brush;