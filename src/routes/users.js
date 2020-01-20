const express=require('express');
const User=require('../model/database');
const router=express.Router();
const passport=require('passport');

router.get('/signin',(req,res,next)=>{
	res.render('signin');
});
router.post('/signin',passport.authenticate('local-signin',{
	successRedirect: '/profile',
	failureRedirect: '/signin',
	failureFlash: true
}));
router.get('/signup',(req,res,next)=>{
	res.render('signup');
});
router.post('/signup',async(req,res,next)=>{
	const {email,name,password,comfirm} = req.body;
	const errors = [];
	if(email <= 0 || name <= 0 || password <= 0 || comfirm <= 0){
		errors.push({text: 'todos los campos son hobligatorios'});
	}
	if(password.length <= 6){
		errors.push({text: 'la contraseña debe ser mayor a seis caracteres'});
	}
	if(password != comfirm){
		errors.push({text: 'las contraseñas no coinciden'});
	}
	if(errors.length > 0){
		res.render('signup',{email,name,password,comfirm,errors});
	}else{
		const emailUser = await User.findOne({email: email});
		if(emailUser){
			res.redirect('/signup');
			req.flash('error_msg','el correo ya a sido tomado');
		}else{
			const newuser = new User({email,name,password});
			newuser.password = newuser.encryptPassword(password);
			await newuser.save();
			console.log(newuser);
			req.flash('success_msg','registrado correctamente inicia secion');
			res.redirect('/signin')
		}
	}
});

module.exports=router;
