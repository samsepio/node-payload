const express=require('express');
const path=require('path');
const morgan=require('morgan');
const helmet=require('helmet');
const mongoose=require('mongoose');
const exphbs=require('express-handlebars');
const methodOverride=require('method-override');
const multer=require('multer');
const uuid=require('uuid/v4');
const session=require('express-session');
const passport=require('passport');
const flash=require('connect-flash');
const app=express();

mongoose.connect('mongodb+srv://eliotalderson_01:3219329910@databasered-6xixf.mongodb.net/test?retryWrites=true&w=majority')
	.then(db => console.log('conectado a la base de datos'))
	.catch(err => console.log(err));

require('../model/database');

app.set('puerto',process.env.PORT || 8000);
app.set('views',path.join(__dirname,'./views'));
app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'),'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs'
}));
app.set('view engine','.hbs');

app.use(morgan('dev'));
app.use(helmet());
//con esto podemos enviar metodos aparte del get y el post como el put y el delete
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
	destination: path.join(__dirname,'./public/img/uploads'),
	filename: (req,file,cb,filename) => {
		cb(null,uuid()+path.extname(file.originalname));
	}
});
app.use(multer({
	storage
}).single('image'));
app.use(session({
	secret: uuid(),
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=>{
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});
app.use(require('./routes/index'));
app.use(require('./routes/app'));
app.use(require('./routes/users'));

app.use(express.static(path.join(__dirname,'./public')));

app.listen(app.get('puerto'),()=>{
	console.log(`servidor ejecutandose en el puerto ${app.get('puerto')}`);
});
