﻿'use strict';


//var mongoose = require('mongoose'),
  //Task = mongoose.model('Tasks');

exports.convert_image = function(req, res) {
console.log('received request');
	var start = new Date();
	var fs = require('fs');
	var img=req.body.name;
	// strip off the data: url prefix to get just the base64-encoded bytes
	var data ='';
	data = img.replace(/^data:image\/\w+;base64,/, "");
	/*
	var buf = new Buffer(data, 'base64');
	// write to a new file named 2pac.txt
		fs.writeFile('image.jpeg', buf, (err) => {
    	if (err) throw err;
 		//res.json({ code: '2000' });
    	console.log('Image saved!');
		});
	*/
	//code to send image to clarifai//
	const Clarifai = require('clarifai');
	/*const app = new Clarifai.App({
	 apiKey: 'b47fca0da52e4b318b6ba89fa0aa53f6'
	});*/
	//API key with surhg
	const app = new Clarifai.App({
	 apiKey: 'a7ab3cb1da4442f688f19129a8d45db4'
	});
	//check if it is food or not
	app.models.predict(Clarifai.GENERAL_MODEL, {base64: data}).then(
  	function(response)
		{
		  console.log(response);
		  var concepts=response.outputs[0].data.concepts;
			var name_of_concept=response.outputs[0].data.concepts[0].name;
						console.log(name_of_concept);
						var arr = [];
						arr = name_of_concept.split('_');
						var dish_type=arr[0];
				 var endFindingFood = new Date() - start;

   							 console.info("Execution time: %dms", endFindingFood);

		  var rta =  concepts.filter(
	   		(it) => {
		 	return it.name === 'food';
			}
			);
		var startFindingCat = new Date();
			if( typeof rta != "undefined" && rta != null && rta.length>0)
			{
				console.log('inside if');
				app.models.predict('SnapAndroid', {base64: data}).then(
					function(response) {
						console.log(response);
						var concepts=response.outputs[0].data.concepts[0];
						concepts.execution_time_to_check_if_food=endFindingFood;
						concepts.code=true;
						 var endFindingCategory = new Date() - startFindingCat;
						concepts.execution_time_to_check_category=endFindingCategory;
						if(concepts)
							{
								if(dish_type=='')
								dish_type='pizza';
								var startFindingIngred = new Date();
								app.models.predict('bd367be194cf45149e75f01d59f77ba7', {base64: data}).then(
									function(response) {
										var ingredients='';
										ingredients=response.outputs[0].data.concepts;
										 var endFindingIngradiates = new Date() - startFindingIngred;
						concepts.execution_time_to_check_ingredients=endFindingIngradiates;
										//check if it contains pizza//
											if(concepts.value < 0.9)
											{
												var checkPizza =  ingredients.filter(
												(it) => {
												return it.name === dish_type;
												}
												);

												//
												if( typeof checkPizza != "undefined" && checkPizza != null && checkPizza.length>0)
												{
														concepts.ingredients=ingredients;
												}
												else
												{
													concepts.code=false;
												}
											}
											else
												concepts.ingredients=ingredients;
							var end = new Date() - start;
   							 console.info("Total Execution time: %dms", end);
							concepts.total_execution_time=end;
										res.json(concepts);
										},
									function(err) {  console.error(err);}
									);
							}
						else{
							 var end = new Date() - start;
   							 console.info("Total Execution time: %dms", end);
							concepts.total_execution_time=end;
								res.json(concepts);
							}
					},
				 function(err) {  console.error(err);}
			);
		}
		else
		{
			console.log('Image is not Food Image');

			var end = new Date() - start;
			var concepts={'total_execution_time':end};
			//concepts.total_execution_time=end;
			concepts.code=false;
			res.json(concepts);
		}

	},
    function(err) {  console.error(err);}
 );
	console.log('done');



	//code to send image to clarifai end //
};
