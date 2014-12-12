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

dbOperations.getGradeByGradeId = function(gradeId,callback,testDBLocation){
	var gradeQry = new JsSql();
	gradeQry.select();
	gradeQry.from(['grades']);
	gradeQry.where(["id='"+gradeId+"'"]);
	var db = openDBConnection(testDBLocation || location);
	gradeQry.ready(db,"get",callback);
	gradeQry.fire();
	closeDBConnection(db);
}

dbOperations.getSubjectsByGrade = function(grade,callback,testDBLocation){
	var subjectQry = new JsSql();
	subjectQry.select();
	subjectQry.from('subjects');
	var db = openDBConnection(testDBLocation || location);
	subjectQry.ready(db,"all",callback);
	subjectQry.fire();
	closeDBConnection(db);
}

dbOperations.getGradeSummary = function(gradeId,callback,testDBLocation){
	dbOperations.getGradeByGradeId(gradeId,function(err,grade){
		if(err){callback(err)}
		else{
			dbOperations.getStudentDetailsByGrade(gradeId,function(err,students){
				grade.students = students;
				dbOperations.getSubjectsByGrade(gradeId,function(err,subjects){
					grade.subjects = subjects;
					callback(null,grade);
				},testDBLocation);
			},testDBLocation);
		}
	},testDBLocation);
}