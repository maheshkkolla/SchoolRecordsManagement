var dbOperations = require('./dbOperations.js').dbOperations;

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
		else res.render("grade",{grade:grade});
	});
}






