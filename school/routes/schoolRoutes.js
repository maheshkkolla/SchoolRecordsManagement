var dbOperations = require('./dbOperations.js').Create('./data/school.db');

var schoolRoutes = {};
exports.schoolRoutes = schoolRoutes;

schoolRoutes.getStudentsList = function(req,res,next){
	dbOperations.getAllStudentsListByGrade(function(err,list){
		if(err){}
		else res.render("students",{list: list});	
	});
}


schoolRoutes.getGradeSummary = function(req,res,next){
	var gradeId = req.params.id;
	dbOperations.getGradeSummary(gradeId,function(err,grade){
		if(err){}
		else res.render("grade",{grade: grade});
	});
}

schoolRoutes.getStudentSummary = function(req,res,next){
	var studentId = req.params.id;
	dbOperations.getStudentSummary(studentId,function(err,summary){
		if(err){}
		else res.render("student",{summary: summary});
	});
}

schoolRoutes.getSubjectSummary = function(req,res,next){
	var subjectId = req.params.id;
	dbOperations.getSubjectSummary(subjectId,function(err,summary){
		if(err){}
		else{
			res.render("subject",{summary: summary});
		}
	});
}




