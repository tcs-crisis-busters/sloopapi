'use strict';

module.exports = function(app){
	function modifyResponse(ctx, model, next){

		var status = ctx.res.statusCode;
		ctx.res.set('Nanz', 'I am missing you!');
		ctx.res.set('Access-Control-Allow-Origin', 'https://sloopapi.mybluemix.net');
		ctx.res.status(status);
		next();
	};

	app.models.Person.afterRemote('**', modifyResponse);
	app.models.Bank.afterRemote('**', modifyResponse);
};
