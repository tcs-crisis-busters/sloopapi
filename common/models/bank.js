'use strict';

module.exports = function(Bank) {

	/*endpoint grid*/

	Bank.getBanks = function(city, callback) {
		
		var response = [];
		var options = { include: ['tcexes', 'tades'],
				fields: { ifscCode: true, branchCode: true,
					  bankName: true, branchName: true,
					  city: true
					}
			      };
		if(city !== undefined) {
			options.where = {'city': city };
		}

		Bank.find(options, function(err, transactions){
			transactions.forEach(function(transaction){
				var t = transaction.toJSON();
				
				/*summation logic*/
				t.sumCex = Bank.sumTotalCex(t.tcexes);
				t.sumAde = Bank.sumTotalAde(t.tades);
				t.total = t.sumCex + t.sumAde;
				delete t.tcexes;
				delete t.tades;
				
				response.push(t);
			});
			callback(null, response);
		});
	}

	Bank.sumTotalCex = function(transactions){
		
		var sum = 0;
		transactions.forEach(function(transaction){
			sum += parseInt(transaction.totalCex);
		});
		return sum;
	};

	
	Bank.sumTotalAde = function(transactions){
		
		var sum = 0;
		transactions.forEach(function(transaction){
			sum += parseInt(transaction.totalAde);
		});
		return sum;
	};

	Bank.remoteMethod('getBanks', {
		accepts: {arg: 'city', type: 'string'},	
		http: {path: '/grid', verb: 'get'},
		returns: {type: 'array', root: true}
	});

};
