const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
 username: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 role: { type: String, default: 'user' }
});

UserSchema.pre('save', function(next) {
 if (!this.isModified('password')) return next();
 this.password = bcrypt.hashSync(this.password, 10);
 next();
});

UserSchema.methods.comparePassword = function(plaintext, callback) {
 return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = mongoose.model('User', UserSchema);
