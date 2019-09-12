let express = require('express');
let app = express();
let mysql = require('./dbcon.js')

let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3306);
app.use(express.static('public'));

// The homepage route 
app.get('/',function(req,res){
  res.render('index') //We can omit the .handlebars extension as we do below
});


// The delete patient route
app.post('/deletePatient',function(req,res){
  let context = {};
  //Remove action
  if(req.body.action == "Remove"){
    console.log("Remove is running");
    mysql.pool.query('DELETE FROM patient WHERE id=?;',[req.body.id], function(err,rows,fields){
      if(err){
        next(err);
        return;
      }
      context =rows;
      res.send(context);
      return;
    });
  }
});


//Route for deleting an illness.
app.post('/deleteIllness',function(req,res){
  let context = {};
  //Remove action
  if(req.body.action == "Remove"){
    console.log("Remove is running");
    mysql.pool.query('DELETE FROM illness WHERE id=?;',[req.body.id], function(err,rows,fields){
      if(err){
        next(err);
        return;
      }
      context =rows;
      res.send(context);
      return;
    });
  }
});

app.post('/deleteDoctor',function(req,res){
  let context = {};
  //Remove action
  if(req.body.action == "Remove"){
    console.log("Remove is running");
    mysql.pool.query('DELETE FROM doctor WHERE id=?;',[req.body.id], function(err,rows,fields){
      if(err){
        next(err);
        return;
      }
      context =rows;
      res.send(context);
      return;
    });
  }
});

app.post('/deleteDepartment',function(req,res){
  let context = {};
  //Remove action
  if(req.body.action == "Remove"){
    console.log("Remove is running");
    mysql.pool.query('DELETE FROM department WHERE id=?;',[req.body.id], function(err,rows,fields){
      if(err){
        next(err);
        return;
      }
      context =rows;
      res.send(context);
      return;
    });
  }
});

// Route for creating a patient.
app.post('/createPatient',function(req,res,next){
  var context = {};
  console.log(req.body);
  
    var userData={
	    first_name: req.body.first_name,
	    last_name: req.body.last_name,
	    birthday: req.body.birthday,
	    gender: req.body.gender,
	    occupation: req.body.occupation,
	    smoker: req.body.smokerRadios,
	    alcohol: req.body.alcoholRadios,
	    weight:req.body.weight,
	    height:req.body.height,
	    doctor_id:req.body.doctor_id,
	    hospital_location:req.body.hospital_location,
    
    };    
    
    mysql.pool.query("INSERT INTO patient set ?", userData,function(err,results){
      if(err) next(err);
      res.redirect('patient');
    });
 
});


// Route for creating a doctor.
app.post('/createDoctor',function(req,res,next){
  var context = {};
  
    var userData={
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      position_title: req.body.position_title,
      Rating: req.body.Rating,
      hospital_location: req.body.hospital_location,
      
    
    };    
    
    mysql.pool.query("INSERT INTO doctor set ?", userData,function(err,results){
      if(err) next(err);
      res.redirect('doctor');
    });
 
});



//Route for creating a department.
app.post('/createDept',function(req,res,next){
  var context = {};
  
    var userData={
      floor: req.body.floor,
      title: req.body.title
    };    
    
    mysql.pool.query("INSERT INTO department set ?", userData,function(err,results){
      if(err) next(err);
      res.redirect('department');
    });
 
});

//Route for creating an illness.
app.post('/createIllness',function(req,res,next){
  var context = {};
  
    var userData={
    	symptom_length: req.body.symptom_length,
    	discomfort: req.body.discomfort,
    	illness_name: req.body.illness_name,	
    };    
    
    mysql.pool.query("INSERT INTO illness set ?", userData,function(err,results){
      if(err) next(err);
      res.redirect('illness');
    });
 
});


//Route for selecting all of the patients to display.
app.get('/getPatients', function(req, res) {
    let context = {};
    mysql.pool.query('SELECT last_name, id FROM doctor', function (err, doctorName){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
        console.log(doctorName);
        mysql.pool.query('SELECT id,title FROM department', function (err, deptTitle){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
                console.log(deptTitle);
        console.log("Got the department titles");
    	mysql.pool.query('SELECT pat.id, pat.first_name, pat.last_name, pat.birthday, pat.occupation, pat.smoker, pat.alcohol, pat.height, pat.weight, doc.id AS \'doc_id\', doc.last_name AS \'doctor_name\',dept.id AS \'dep_id\', dept.title, pat.gender FROM patient pat LEFT JOIN department dept ON dept.id=pat.hospital_location LEFT JOIN doctor doc ON doc.id=pat.doctor_id GROUP BY pat.id, pat.first_name, pat.last_name, pat.birthday, pat.occupation, pat.smoker, pat.alcohol, pat.height, pat.weight, doc.last_name, dept.title, pat.gender, doc.id, dept.id;',
    				function(err,rows,fields) {
        if (err) {
        	console.log("there was an error.");
            next(err);
            return;
        }
        console.log('Got the patients!');
        context.results = rows;
        context.deptTitle=deptTitle;
        context.doctorName=doctorName;
        console.log(context.results);
        res.send(context);
    });
    });
       });
});

//Route for selecting all of the illnesses to display.
app.get('/getIllness', function(req, res) {
    let context = {};
    console.log("this is getting here");
    mysql.pool.query('SELECT * FROM illness;', 
    				function(err,rows,fields) {
        if (err) {
        	console.log("there was an error.");
            next(err);
            return;
        }
        console.log('Got the illness! :[');
        context.results = rows;
        res.send(context);
    });
});

//Route for selecting all the doctors to display.
app.get('/getdoctor', function(req, res) {
    let context = {};
    console.log("this is getting here");
        mysql.pool.query('SELECT first_name FROM doctor', function (err, doctorName){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
        console.log(doctorName);
    mysql.pool.query('SELECT id,title FROM department', function (err, deptTitle){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
        //console.log(deptTitle);
        console.log("Got the department titles");
    mysql.pool.query('SELECT doc.id, doc.first_name, doc.last_name, doc.position_title, doc.rating, doc.hospital_location,dept.title FROM doctor doc inner join department dept on dept.id = doc.hospital_location;',
    				function(err,rows,fields) {
        if (err) {
        	console.log("there was an error.");
            next(err);
            return;
        }

        console.log('Got the doctors!');
        console.log(rows);

        context.results = rows;
        context.deptTitle=deptTitle;
        context.doctorName=doctorName;
        console.log(context);
        res.send(context);
    });
  });
});
});

//Route for selecting all the departments to display.
app.get('/getDepartment', function(req, res) {
    let context = {};
    console.log("this is getting here");
    mysql.pool.query('SELECT dept.id, dept.floor, dept.title FROM department dept;',
            function(err,rows,fields) {
        if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
        console.log('Got the department!');
        context.results = rows;
        res.send(context);
    });
});

// Route for rendering the patient page.
app.get('/patient',function(req,res){
  res.render('Patient');
});

// Route for rendering the doctor page.
app.get('/doctor',function(req,res){
  res.render('doctor');
});

// Route for rendering the illness page.
app.get('/illness',function(req,res){
  res.render('illness');
});

// Route for rendering the department page.
app.get('/department',function(req,res){
  res.render('department');
});

//Route for updating an patient
app.post('/patient',function(req,res){
  if(req.body.update){
    console.log("Update is running");

    let parameters = [req.body.first_name, req.body.last_name, req.body.birthday, req.body.occupation, req.body.smoker, req.body.alcohol, req.body.height, req.body.weight, req.body.doctor_id, req.body.hospital_location, req.body.gender];
    mysql.pool.query('UPDATE patient SET first_name=?, last_name=?, birthday=?, occupation=?, smoker=?, alcohol=? height=?, weight=?, doctor_id=?, hospital_location=?, gender=? WHERE id=?', parameters,function(err,rows,fields){
      if (err) {
          next(err);
          return;
      }
    });
  }
});

//Route for updating an illness.
app.post('/illness',function(req,res){
  console.log("we are getting here")
  if(req.body.update){
    console.log("Update is running");

    let whatever = [req.body.illness_name, req.body.discomfort, req.body.symptom_length, req.body.id];
    mysql.pool.query('UPDATE illness SET illness_name=?, discomfort=?, symptom_length=? WHERE id=?', whatever,function(err,rows,fields){
      if (err) {
          next(err);
          return;
      }
    });
  }
});

//Route for getting to the illness update page.
app.get('/editPatient', function(req,res,next){
  context = {};
      mysql.pool.query('SELECT last_name, id FROM doctor', function (err, doctorName){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
       // console.log(doctorName);
        mysql.pool.query('SELECT id,title FROM department', function (err, deptTitle){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
  mysql.pool.query('SELECT pat.id, pat.first_name, pat.last_name, pat.birthday, pat.occupation, pat.smoker, pat.alcohol, pat.height, pat.weight, doc.last_name AS \'doctor_name\', dept.title, pat.gender FROM patient pat LEFT JOIN department dept ON dept.id=pat.hospital_location LEFT JOIN doctor doc ON doc.id=pat.doctor_id GROUP BY pat.id, pat.first_name, pat.last_name, pat.birthday, pat.occupation, pat.smoker, pat.alcohol, pat.height, pat.weight, doc.last_name, dept.title, pat.gender;' , [req.query.id],function(err,rows,fields){
    if(err){
      next(err);
      return;
    }
    let container = rows[0];

    context.id = container.id;
    context.first_name = container.first_name;
    context.last_name = container.last_name;
    context.birthday = container.birthday;
    context.occupation = container.occupation;
    context.smoker = container.smoker;
    context.alcohol = container.alcohol;
    context.height = container.height;
    context.weight = container.weight;
    context.doctor_name = container.doctor_name;
    context.title = container.title;
    context.gender = container.gender;
    context.deptTitle=deptTitle;
    context.doctorName=doctorName;
    //response = JSON.parse(deptTitle)
    console.log("I am here");
    //console.log(response);
    res.render('editPatient',context);
  });
});
    });
});

//Route for getting to the illness update page.
app.get('/editIllness', function(req,res,next){
  context = {};
  mysql.pool.query('SELECT id, illness_name, discomfort, symptom_length FROM illness WHERE id=?' , [req.query.id],function(err,rows,fields){
    if(err){
      next(err);
      return;
    }
    let container = rows[0];

    context.id = container.id;
    context.illness_name = container.illness_name;
    context.discomfort = container.discomfort;
    context.symptom_length = container.symptom_length;

    res.render('editIllness',context);
  });
});

app.post('/department',function(req,res){
  if(req.body.update){
    console.log("Update is running");

    let whatever = [req.body.floor, req.body.title, req.body.id];
    mysql.pool.query('UPDATE department SET floor=?, title=? WHERE id=?', whatever,function(err,rows,fields){
      if (err) {
          next(err);
          return;
      }
    });
  }
});

//Route for getting to the dept update page.
app.get('/editDepartment', function(req,res,next){
  context = {};
  mysql.pool.query('SELECT id, floor, title FROM department WHERE id=?' , [req.query.id],function(err,rows,fields){
    if(err){
      next(err);
      return;
    }
    let container = rows[0];

    context.id = container.id;
    context.floor = container.floor;
    context.title = container.title;

    res.render('editDepartment',context);
  });
});

app.post('/doctor',function(req,res){
  if(req.body.update){
    console.log("Update is running");

    let whatever = [req.body.first_name, req.body.last_name, req.body.position_title,req.body.hospital_location, req.body.rating, req.body.id];
    mysql.pool.query('UPDATE doctor SET first_name=?, last_name=?, position_title=? ,hospital_location=?, Rating=? WHERE id=?', whatever,function(err,rows,fields){
      if (err) {
          next(err);
          return;
      }
    });
  }
});

//Route for getting to the doctor update page.
app.get('/editDoctor', function(req,res,next){
  context = {};
    mysql.pool.query('SELECT id,title FROM department', function (err, deptTitle){
      if (err) {
          console.log("there was an error.");
            next(err);
            return;
        }
  mysql.pool.query('SELECT id, first_name, last_name, position_title, hospital_location, Rating FROM doctor WHERE id=?' , [req.query.id],function(err,rows,fields){
    if(err){
      next(err);
      return;
    }
    let container = rows[0];

    context.id = container.id;
    context.first_name = container.first_name;
    context.last_name = container.last_name;
    context.hospital_location = container.hospital_location;
    context.position_title = container.position_title;
    context.Rating = container.Rating;
    context.deptTitle=deptTitle;
    console.log("about to list context");
    console.log(context);
    res.render('editDoctor',context);
  });
});
});
// Route for the 404 page.
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

// Route for the 500 page.
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});




app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});



