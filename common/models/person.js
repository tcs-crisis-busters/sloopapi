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

	Person.getIndividualsCountByAmount = function(callback){

		var response = [];
		var cities = ['Bangalore', 'Chennai', 'Delhi', 'Mumbai', 'Pune'];
		response.push({});
		response[0].key = "Individual Count";
		response[0].values = [];

		cities.forEach(function(city, index){
			if(response[0].values[index] === undefined) {
				response[0].values[index] = {};
				response[0].values[index].label = city;			
				response[0].values[index].value = 0;	
			}		
			Person.getIndividuals(city.toUpperCase(), function(obj, transactions){
				transactions.forEach(function(transaction){
					if(parseInt(transaction.total) > 250000) {
						console.log(index);
						response[0].values[index].value += 1;
					}
				});
			});
		});
				console.log(response);
				callback(null, response);
	};

	Person.sumTotalCex = function(transactions){
		
		var sum = 0;
		if(transactions !== undefined) {
			transactions.forEach(function(transaction){
				sum += parseInt(transaction.totalCex);
			});
		}
		return sum;
	};

	
	Person.sumTotalAde = function(transactions){
		
		var sum = 0;
		if(transactions !== undefined) {
			transactions.forEach(function(transaction){
				sum += parseInt(transaction.totalAde);
			});
		}
		return sum;
	};

	Person.remoteMethod('getIndividuals', {
		accepts: {arg: 'city', type: 'string'},	
		http: {path: '/grid', verb: 'get'},
		returns: {type: 'array', root: true}
	});

	
	Person.remoteMethod('getIndividualsCountByAmount', {
		http: {path: '/barChart', verb: 'get'},
		returns: {type: 'array', root: true}
	});
};
