var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Se carga el modulo de sqlite3
var sqlite3 = require('sqlite3')
const e = require("express");

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//se carga el modulo de knex
//se inicializa el knex con sqlite3


module.exports = app;

var db = require('knex')({
    client:'sqlite3',
    connection:{
      filename:'cinematography.db'
    }
  }
);

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//RUTAS DEL USUARIO

//Rutas para films
app.get('/api/films/',function (req, res){
  db.select('f.id','f.name','f.protagonist','f.adaptation','f.date','f.country','f.director','f.img')
      .from('Films as f')
      .then( function (data){
          data = {films:data}
          res.send(data)
    })
      .catch(function (error) {
          console.log(error)
      })

});

app.post('/api/films/',function (req,res){
    let data_form = req.body;
    console.log(' app.je app.post().Params:',data_form)

    db.insert(data_form)
        .into('Films')
        .then( function (data){
            res.json(data)
        }).catch(function (error){
            console.log(error)
    });

});

// Seleccion por id
app.get('/api/films/:id',function (req,res){

    //where id=parametro_id
    //Como es un string lo convertimos a entero
    //porque el campo actors es entero, no es cadena
    let id =parseInt(req.params.id);
    db.select('f.id','f.name','f.protagonist','f.adaptation','f.date','f.country','f.director','f.img')
        .from('Films as f')
        .where('f.id',id)
        .then( function (data){
            data = {films:data}
            res.send(data);
        }).catch(function (error){
            console.log(error)
    });
});
// Delete por id
app.delete('/api/films/:id',function (req,res){

    //where id=parametro_id
    //Como es un string lo convertimos a entero
    //porque el campo actors es entero, no es cadena
    let id =parseInt(req.params.id);
    console.log('Se borrarara el elemento con id'+ id);
    db.delete()
        .from('Films')
        .where('id',id)
        .then(function (data){
            res.json(data);
            data = {films:data}
        }).catch(function (error){
            console.log(error)
    })
});

// Se hace un endpoint con POST para un album con id concreto
app.post('/api/films/:id', function (req,res){
    let id = req.params.id;
    let filmData = req.body;
    db('Films')//tabla a actualizar
        .update(filmData)
        .where('id',id)
        .then(function (data){
            res.send(data)
        })
        .catch(function (error){
            console.log('ERROR',error)
        })
})
// Rutas para actors
//Todos
app.get('/api/actors/',function (req, res){
    console.log('-----------test-----------------')
    db.select('a.id','a.name','a.cast','a.birth_date','a.year_of_death','a.nationality','a.years_active','a.img')
        .from('Actors as a')
        .then( function (data){
            data = {actors:data}
            res.send(data)
        })
        .catch(function (error) {
            console.log(error)
        })

});
//Pedir los datos completos de todas las films
//SELECT a.id,a.name,f.name as 'film',a.birth_date,a.nationality,a.years_active FROM actors a JOIN films f ON a."cast" = f.id;
app.get('/api/actors/all',function (req,res){

    db.select('a.id','a.name','a.cast','f.name as film','a.birth_date','a.year_of_death','a.nationality','a.years_active','a.year_of_death')
        .from ('Actors as a')
        .join('Films as f','a.cast','f.id')
        .then(function (data){
            console.log(data);
            res.json(data);
        })
        .catch(function (error){
            console.log(error);
            res.send(error);
        })
});

// Seleccion por id
app.get('/api/actors/:id',function (req,res){

    //where id=parametro_id
    //Como es un string lo convertimos a entero
    //porque el campo actors es entero, no es cadena
    let id =parseInt(req.params.id);
    db.select('a.id','a.name','a.cast','a.birth_date','a.year_of_death','a.nationality','a.years_active','a.img')
        .from('Actors as a')
        .where('a.id',id)
        .then( function (data){
            data = {actors:data}
            res.send(data);

        });
});
app.post('/api/actors/',function (req,res){
    let data_form = req.body;
    console.log(' app.je app.post().Params:',data_form)

    db.insert(data_form)
        .into('Actors')
        .then( function (data){
            res.json(data)
        }).catch(function (error){
        console.log(error)
    });

});
app.delete('/api/actors/:id',function (req,res){

    //where id=parametro_id
    //Como es un string lo convertimos a entero
    //porque el campo actors es entero, no es cadena
    let id =parseInt(req.params.id);
    console.log('Se borrarara el elemento con id'+ id);
    db.delete()
        .from('Actors')
        .where('id',id)
        .then(function (data){
            res.json(data);
            data = {actors:data}
        }).catch(function (error){
        console.log(error)
    })
});

// Se hace un endpoint con POST para un album con id concreto
app.post('/api/actors/:id', function (req,res){
    let id = req.params.id;
    let actorData = req.body;
    db('Actors')//tabla a actualizar
        .update(actorData)
        .where('id',id)
        .then(function (data){
            res.send(data)
        })
        .catch(function (error){
            console.log('ERROR',error)
        })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
