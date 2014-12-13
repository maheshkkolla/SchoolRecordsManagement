var fs = require('fs');
var sqlite3 = require('sqlite3');
var location = "";
var JsSql = require('./JsSql.js').JsSql;
var dbOperations = {};
exports.Create = function(path){
	location = path;
	return dbOperations;
}

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

dbOperations.getGrades = function(callback){
	var gradeQry = new JsSql();
	gradeQry.select();
	gradeQry.from(["grades"]);
	var db = openDBConnection(location);
	gradeQry.ready(db,"all",callback);
	gradeQry.fire();
	closeDBConnection(db);
}

dbOperations.getStudentDetailsByGrade = function(grade,callback){
	var studentQry = new JsSql();
	studentQry.select();	
	studentQry.from(["students"]);
	studentQry.where(["grade_id='" + grade + "'"]);
	var db = openDBConnection(location);
	studentQry.ready(db,"all",callback);
	studentQry.fire();
	closeDBConnection(db);
}

dbOperations.getAllStudentsListByGrade = function(callback){
	var db = openDBConnection(location);
	dbOperations.getGrades(function(err,grades){
		grades.forEach(function(gradesObject,index){
			dbOperations.getStudentDetailsByGrade(gradesObject.id,function(err,studentsList){
				gradesObject.students = studentsList;
				if(index == grades.length-1) callback(null,grades);
			});
		});
	});
	closeDBConnection(db);
}

dbOperations.getGradeByGradeId = function(gradeId,callback){
	var gradeQry = new JsSql();
	gradeQry.select();
	gradeQry.from(['grades']);
	gradeQry.where(["id='"+gradeId+"'"]);
	var db = openDBConnection(location);
	gradeQry.ready(db,"get",callback);
	gradeQry.fire();
	closeDBConnection(db);
}

dbOperations.getSubjectsByGrade = function(grade,callback){
	var subjectQry = new JsSql();
	subjectQry.select();
	subjectQry.from('subjects');
	var db = openDBConnection(location);
	subjectQry.ready(db,"all",callback);
	subjectQry.fire();
	closeDBConnection(db);
}

dbOperations.getGradeSummary = function(gradeId,callback){
	dbOperations.getGradeByGradeId(gradeId,function(err,grade){
		if(err){callback(err)}
		else{
			dbOperations.getStudentDetailsByGrade(gradeId,function(err,students){
				grade.students = students;
				dbOperations.getSubjectsByGrade(gradeId,function(err,subjects){
					grade.subjects = subjects;
					callback(null,grade);
				});
			});
		}
	});
}

dbOperations.getStudentById = function(studentId,callback){
	var studentQry = new JsSql();
	studentQry.select();
	studentQry.from('students');
	studentQry.where(["id='"+studentId+"'"]);
	var db = openDBConnection(location);
	studentQry.ready(db,"get",callback);
	studentQry.fire();
	closeDBConnection(db);
}

dbOperations.getStudentSummary = function(studentId,callback){
	var conditions = ["st.id='"+ studentId+"'",]
	var studentQry = new JsSql();
	studentQry.select(["st.id","st.name","st.grade_id","g.name","sb.id","sb.name","sb.maxScore","sc.score"])
		.as(["studentId","studentName","gradeId","gradeName","subjectId","subjectName","maxScore","score"]);
	studentQry.from(["students s","grades g","subjects sb","scores sc"]);
	studentQry.where()
	console.log(studentQry.query)
}

