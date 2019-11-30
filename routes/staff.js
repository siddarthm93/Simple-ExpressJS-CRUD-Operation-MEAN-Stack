var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF staff
app.get('/', function(req, res, next) {	
	// fetch and sort staff collection by id in descending order
	req.db.collection('staff').find().sort({"_id": -1}).toArray(function(err, result) {
		//if (err) return console.log(err)
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'User List', 
				data: ''
			})
		} else {
			// render to views/user/list.ejs template file
			res.render('user/list', {
				title: 'User List', 
				data: result
			})
		}
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: 'Add New User',
		name: '',
		email: '',
		phone: '',
		designation: '',
		department: '',
		staffid: ''		
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('email', 'A valid email is required').isEmail()  //Validate email
	req.assert('phone', 'Phone is required').notEmpty()             //Validate age
	req.assert('designation', 'designation is required').notEmpty()             //Validate age
	req.assert('department', 'department is required').notEmpty()             //Validate age
	req.assert('staffid', 'staffid is required').notEmpty()             //Validate age

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			designation: req.sanitize('designation').escape().trim(),
			department: req.sanitize('department').escape().trim(),
			staffid: req.sanitize('staffid').escape().trim()
		}
				 
		req.db.collection('staff').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/add.ejs
				res.render('user/add', {
					title: 'Add New User',
					name: user.name,
					email: user.email,
					phone: user.phone,
					designation: user.designation,
					department: user.department,
					staffid: user.staffid

				})
			} else {				
				req.flash('success', 'Data added successfully!')
				
				// redirect to user list page				
				res.redirect('/users')
				
				// render to views/user/add.ejs
				/*res.render('user/add', {
					title: 'Add New User',
					name: '',
					age: '',
					email: ''					
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: 'Add New User',
            name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			designation: req.body.designation,
            department: req.body.department,
            staffid: req.body.staffid
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('staff').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		// if user not found
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else { // if user found
			// render to views/user/edit.ejs template file
			res.render('user/edit', {
				title: 'Edit User', 
				//data: rows[0],
				id: result[0]._id,
				name: result[0].name,
				email: result[0].email,
				phone: result[0].phone,
				designation: result[0].designation,
				department: result[0].department,
				staffid: result[0].staffid,					
			})
		}
	})	
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('email', 'A valid email is required').isEmail()  //Validate email
	req.assert('phone', 'phone is required').notEmpty()             //Validate age
	req.assert('designation', 'designation is required').notEmpty()             //Validate age
	req.assert('department', 'department is required').notEmpty()             //Validate age
	req.assert('staffid', 'staffid is required').notEmpty()             //Validate age


    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			designation: req.sanitize('designation').escape().trim(),
			department: req.sanitize('department').escape().trim(),
			staffid: req.sanitize('staffid').escape().trim(),

		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('staff').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				// render to views/user/edit.ejs
				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					email: req.body.email,
					phone: req.body.phone,
					designation: req.body.designation,
					department: req.body.department,
					staffid: req.body.staffid

				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/users')
				
				// render to views/user/edit.ejs
				/*res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email
				})*/
			}
		})		
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			designation: req.body.designation,
			department: req.body.department,
			staffid: req.body.staffid
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('staff').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to staff list page
			res.redirect('/users')
		} else {
			req.flash('success', 'User deleted successfully! id = ' + req.params.id)
			// redirect to staff list page
			res.redirect('/users')
		}
	})	
})

module.exports = app
