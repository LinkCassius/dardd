const mongoose = require("mongoose");
const userHistorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  logtimeutc: {
    type: Date,
    default: Date.now
  },
  logtype: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  tablename: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  // logdata: {
  //   type: String,
  //   minlength: 5,
  //   maxlength: 50
  // },
  newdata: {
    type: Object
  },
  olddata: {
    type: Object
  }
});

const UserHistory = mongoose.model("UserHistory", userHistorySchema);

exports.UserHistory = UserHistory;
