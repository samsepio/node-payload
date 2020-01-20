const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
const Schema=mongoose.Schema;

const userSchema = new Schema({
	name:{type: String},
	email:{type: String},
	password:{type: String}
});

userSchema.methods.encryptPassword = (password) => {
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};

userSchema.methods.compareSync = function(password){
	return bcrypt.compareSync(password,this.password);
};

module.exports=mongoose.model('User',userSchema);
