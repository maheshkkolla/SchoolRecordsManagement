var dbOperations = require('../routes/dbOperations.js').Create('./tests/data/school.db');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('./tests/data/schoolBackUp.db') 
// var location = "./tests/data/school.db";

describe('Library Records',function(){
	beforeEach(function(){
		fs.writeFileSync('./tests/data/school.db',dbFileData);
	});

	describe("getGrades",function(){
		it("should read students list from database and give as list",function(done){
			dbOperations.getGrades(function(err,list){
				assert.notOk(err);
				assert.deepEqual(list,[
					{'id': 1, 'name': 'class 1'},
					{'id': 2, 'name': 'class 2'}]);
				done();
			});
		});
	});

	describe("getStudentDetailsByGrade",function(){
		it("should give the details of a particular student by id",function(done){
			dbOperations.getStudentDetailsByGrade(1,function(err,list){
				assert.notOk(err);
				assert.deepEqual(list,[
					{'id': 1, 'name': 'Vishnu', 'grade_id': 1},
					{'id': 2, 'name': 'Mahesh', 'grade_id': 1},
					{'id': 3, 'name': 'Parmatma', 'grade_id': 1}]);
				done();
			});
		});
	});

	describe("getAllStudentsListByGrade",function(){
		it("should read students list from database and give as list",function(done){
			dbOperations.getAllStudentsListByGrade(function(err,list){
				assert.notOk(err);
				assert.lengthOf(list,2);
				assert.equal(list[0].id,1);
				assert.deepEqual(list[0].students,[
					{'id': 1, 'name': 'Vishnu', 'grade_id': 1},
					{'id': 2, 'name': 'Mahesh', 'grade_id': 1},
					{'id': 3, 'name': 'Parmatma', 'grade_id': 1}]);
				assert.deepEqual(list[1].students,[]);
				done();
			});
		});
	});

	describe("getGradeByGradeId",function(){
		it("should give the grade id and grade name of a paticular grade id",function(done){
			dbOperations.getGradeByGradeId(1,function(err,grade){
				assert.notOk(err);
				assert.deepEqual(grade,{id: 1, name: 'class 1'});
				done();
			});
		});
	});

	describe("getSubjectsByGrade",function(){
		it("should give all subject details to the given grade id",function(done){
			dbOperations.getSubjectsByGrade(1,function(err,subjects){
				assert.notOk(err);
				assert.deepEqual(subjects,[
					{id: 1, name: 'Cricket', maxScore: 100, grade_id: 1},
					{id: 2, name: 'Hockey', maxScore: 50, grade_id: 1},
					{id: 3, name: 'KhoKho', maxScore: 25, grade_id: 1}]);
				done();
			});
		});
	});

	describe("getGradeSummary",function(){
		it("should give the summary of a particular grade by grade id",function(done){
			dbOperations.getGradeSummary(1,function(err,list){
				assert.notOk(err);
				assert.equal(list.id,1);
				assert.equal(list.name,'class 1');
				assert.deepEqual(list.students,[
					{'id': 1, 'name': 'Vishnu', 'grade_id': 1},
					{'id': 2, 'name': 'Mahesh', 'grade_id': 1},
					{'id': 3, 'name': 'Parmatma', 'grade_id': 1}]);
				assert.deepEqual(list.subjects,[
					{id: 1, name: 'Cricket', maxScore: 100, grade_id: 1},
					{id: 2, name: 'Hockey', maxScore: 50, grade_id: 1},
					{id: 3, name: 'KhoKho', maxScore: 25, grade_id: 1}]);
				done();
			});
		});
	});
	describe("getStudentSummary",function(){
		it("should give the summary of a particular student by student id",function(done){
			dbOperations.getStudentSummary(2,function(err,student){
				assert.notOk(err);
				assert.lengthOf(student,3);
				assert.deepEqual(student[0],{studentId: 2, studentName: 'Mahesh',gradeId: 1, gradeName: 'class 1', 
					subjectId: 3, subjectName: 'KhoKho', maxScore: 25, score: 11 });
				done();
			});
		});
	});
	describe("getStudentById",function(){
		it("should give the student details such as id, name by student id",function(done){
			dbOperations.getStudentById(1,function(err,student){
				assert.notOk(err);
				assert.equal(student.id,1);
				assert.equal(student.name,"Vishnu");
				done();
			});
		});
	});

	describe("getSubjectSummary",function(){
		it("should give the subject summary by subject id",function(done){
			dbOperations.getSubjectSummary(1,function(err,summary){
				assert.notOk(err);
				assert.lengthOf(summary,3);
				assert.equal(summary[0].subjectName,"Cricket");
				assert.deepEqual(summary[2], {subjectId: 1,gradeName: 'class 1',
					subjectName: 'Cricket', maxScore: 100,gradeId: 1, 
					studentId: 3, score: 8, studentName: 'Parmatma'});
				assert.deepEqual(summary.grades,[
					{'id': 1, 'name': 'class 1'},
					{'id': 2, 'name': 'class 2'}]);
				done();
			});
		});
	});
});
