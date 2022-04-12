const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentSchema = new mongoose.Schema({
  boardNo: {
    type: Number,
    required: true,
  },
  commentNo: {
    type: Number,
  },
  userName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  regDate: {
    type: Date,
    default: Date.now,
  },
  updDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

commentSchema.plugin(AutoIncrement, { inc_field: 'commentNo' });

module.exports = mongoose.model('Comment', commentSchema);
