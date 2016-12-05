'use strict';

module.exports = function(Bank) {

	/*endpoint grid*/

	Bank.getBanks = function(bankName, callback) {
		
		var response = [];
		var options = { include: ['tcexes', 'tades'],
				fields: { ifscCode: true, branchCode: true,
					  'bankName': true, branchName: true,
					  city: true
					}
			      };
		if(bankName !== undefined) {
			options.where = {'bankName': bankName };
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

	
	Bank.getBanksCountByAmount = function(callback){
		var counter = 0;
		var response = [];
		var banks = ['AXIS BANK', 'BANK OF INDIA', 'HDFC BANK LTD', 'ICICI BANK LTD', 'STATE BANK OF INDIA'];

		banks.forEach(function(bank, index){
			if(response[index] === undefined) {
				response[index] = {};
				response[index].key = bank;			
				response[index].y = 0;	
			}		
			Bank.getBanks(bank.toUpperCase(), function(obj, transactions){
				transactions.forEach(function(transaction){
					response[index].y += transaction.total;
				});
				counter++;
				if(counter == banks.length){
					callback(null, response);
				}
			});
		});
	};

	Bank.sumTotalCex = function(transactions){
		
		var sum = 0;
		if(transactions !== undefined) {
			transactions.forEach(function(transaction){
				sum += parseInt(transaction.totalCex);
			});
		}
		return sum;
	};

	
	Bank.sumTotalAde = function(transactions){
		
		var sum = 0;
		if(transactions !== undefined) {
			transactions.forEach(function(transaction){
				sum += parseInt(transaction.totalAde);
			});
		}
		return sum;
	};

	Bank.remoteMethod('getBanks', {
		accepts: {arg: 'bankName', type: 'string'},	
		http: {path: '/grid', verb: 'get'},
		returns: {type: 'array', root: true}
	});
	
	Bank.remoteMethod('getBanksCountByAmount', {
		http: {path: '/pieChart', verb: 'get'},
		returns: {type: 'array', root: true}
	});

};
