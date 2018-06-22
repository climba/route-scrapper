var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RouteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Route = mongoose.model("Route", RouteSchema);

module.exports = Route;