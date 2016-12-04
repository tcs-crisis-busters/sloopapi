'use strict';

module.exports = function(Person) {
	
	/*endpoint grid*/

	Person.getIndividuals = function(city, callback) {
		
		var response = [];
		var options = { include: ['tcexes', 'tades'],
				fields: { panId: true, aadhaarId: true,
					  name: true, avgItrIncome: true,
					  city: true, id: true
					}
			      };

		if(city !== undefined) {
			options.where = {'city': city };
		}

		Person.find(options, function(err, transactions){
			transactions.forEach(function(transaction){
				var t = transaction.toJSON();
				
				/*summation logic*/
				t.sumCex = Person.sumTotalCex(t.tcexes);
				t.sumAde = Person.sumTotalAde(t.tades);
				t.total = t.sumCex + t.sumAde;
				delete t.tcexes;
				delete t.tades;
				
				response.push(t);
			});
			callback(null, response);
		});
	}

	Person.sumTotalCex = function(transactions){
		
		var sum = 0;
		transactions.forEach(function(transaction){
			sum += parseInt(transaction.totalCex);
		});
		return sum;
	};

	
	Person.sumTotalAde = function(transactions){
		
		var sum = 0;
		transactions.forEach(function(transaction){
			sum += parseInt(transaction.totalAde);
		});
		return sum;
	};

	Person.remoteMethod('getIndividuals', {
		accepts: {arg: 'city', type: 'string'},	
		http: {path: '/grid', verb: 'get'},
		returns: {type: 'array', root: true}
	});
};
