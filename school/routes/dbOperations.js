var fs = require('fs');
var sqlite3 = require('sqlite3');
var location = "./data/school.db";
var JsSql = require('./JsSql.js').JsSql;

var dbOperations = {};
exports.dbOperations = dbOperations;

var openDBConnection = function(location){
	var filePresent = fs.existsSync(location);
	if(!filePresent){
		throw new Error("DataBase file not found");
	}
	var db = new sqlite3.Database(location);
	return db;
}

var closeDBConnection = function(db){
	db.close();
}

dbOperations.getGrades = function(callback,testDBLocation){
	var gradeQry = new JsSql();
	gradeQry.select();
	gradeQry.from(["grades"]);
	var db = openDBConnection(testDBLocation || location);
	gradeQry.ready(db,"all",callback);
	gradeQry.fire();
	closeDBConnection(db);
}

dbOperations.getStudentDetailsByGrade = function(grade,callback,testDBLocation){
	var studentQry = new JsSql();
	studentQry.select();	
	studentQry.from(["students"]);
	studentQry.where(["grade_id='" + grade + "'"]);
	var db = openDBConnection(testDBLocation || location);
	studentQry.ready(db,"all",callback);
	studentQry.fire();
	closeDBConnection(db);
}

dbOperations.getAllStudentsListByGrade = function(callback,testDBLocation){
	var db = openDBConnection(testDBLocation || location);
	dbOperations.getGrades(function(err,grades){
		grades.forEach(function(gradesObject,index){
			dbOperations.getStudentDetailsByGrade(gradesObject.id,function(err,studentsList){
				gradesObject.students = studentsList;
				if(index == grades.length-1) callback(null,grades);
			},testDBLocation);
		});
	},testDBLocation);
	closeDBConnection(db);
}

