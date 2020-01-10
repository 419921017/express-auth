const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');


mongoose.connect('mongodb://localhost:27017/epxress-auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    set(val) {
      return bcryptjs.hashSync(val, 10)
    }
  }
})

const User = mongoose.model('User', UserSchema)



module.exports = {
  User
}