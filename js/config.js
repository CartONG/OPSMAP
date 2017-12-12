var config = {};
config.appConfig = {
// General
    // Language - STRING : Works only for the dictionnary.
    Language : "en",

// Map options
    // MapClustering - BOOLEAN : Enable clustering on markers (Cluster radius per zoom level to be defined below [cf:"maxClusterRadius"]).
    MapClustering: true,

    // MapMaxBounds - BOOLEAN : Enable bounds constraint on default map's view.
    MapMaxBounds: true,

    // MapMinZoom - INTEGER : Default map's min zoom (the min zoom has the largest extent), set to 'false' (BOOLEAN) for leaflet's default setup.
    MapMinZoom: 4,

    // MapMaxZoom - INTEGER : Default map's max zoom (the max zoom has the smallest extent), set to 'false' (BOOLEAN) for leaflet's default setup.
    MapMaxZoom: 22,

    // DefaultZoom - INTEGER : Default map's zoom level on start.
    DefaultZoom: 5,

    // DefaultCenter - ARRAY : Array of FLOATs, coordinates for init map centre [y, x].
    DefaultCenter: [5.54, 46.7],
}
// config.dictionary : set a dictionnary for dataset values - each value listed from the dataset as property of the dictionnary object holds an object containing matching aliases for given languages.
config.dictionary = {
    planned_site: {
        en: "Planned site",			
    },
    spontaneous_site: {
        en: "Spontaneous site"
    }    
}
config.data = {
		
		// URL of the CSV
		url : "data/dataset.csv",
		
		// Latitude field
		lat : "geopoint_latitude",
		
		// longitude field
		lon : "geopoint_longitude",
		
		// Name field
		name : "site_name",
		
		// Unique identifier field
		uid : "site_name",
		
		// Last update field
		last_update : "date",
    
        // Date parser : function that get a date as string from the dataset as parameters and returns it properly formatted for display
        dateParser : function(rawDate){
              return getJsDateFromExcel(rawDate);
        },
		
		// Type (field for icon)
		type : "settlement_type",
		
		// Expected types (array of expected values for types - values associated with icon set)
		expectedTypes : ["spontaneous_site", "planned_site"],	
		
		// Categories of attributes
		categories : [
			{
				name: "Key_informant_information",
				alias: "Key informant information",
				icon: "activity_meeting_60px_bluebox",
				col: 0
			},
			{
				name: "Geographic_Information",
				alias: "Geographic Information",
				icon: "socioeconomic_urban_rural_60px_bluebox",
				col: 1
			},
			{
				name: "Protection",
				alias: "Protection",
				icon: "cluster_protection_60px_bluebox",
				col: 2
			},						
			{
				name: "Displacement",
				alias: "Displacement",
				icon: "activity_deployment_60px_bluebox",
				col: 3
			},
			{
				name: "Camp_Management",
				alias: "Camp Management",
				icon: "camp_idp_refugee_camp_60px_bluebox",
				col: 1
			},
			{
				name: "Shelter",
				alias: "Shelter",
				icon: "cluster_shelter_60px_bluebox",
				col: 2
			},		
			{
				name: "WASH",
				alias: "Water, sanitation and hygiene",
				icon: "wash_sanitation_60px_bluebox",
				col: 2
			},
			{
				name: "Food_Security",
				alias: "Food security",
				icon: "food_NFI_food_60px_bluebox",
				col: 3
			},
			{
				name: "Health",
				alias: "Health",
				icon: "cluster_health_60px_bluebox",
				col: 3
			},			
			{
				name: "Education",
				alias: "Education",
				icon: "activity_learning_60px_bluebox",
				col: 3
			},
			{
				name: "Nutrition",
				alias: "Nutrition",
				icon: "cluster_nutrition_60px_bluebox",
				col: 2
			},
			{
				name : "Communication",
				alias : "Communication",
				icon : "activity_public_information_60px_bluebox",
				col: 3
			},
			{
				name : "Validation",
				alias : "Validation",
				icon : "activity_preparedness_60px_bluebox",
				col: 3
			}			
		],
		
		
		//Charts
		charts : [
			// Vulnerable type
//			{
//				name: "vulnerable_type",
//				height: "200",
//				category: "vulnerable",
//				config: {
//					type: "pie",
//					data:{
//						datasets:[
//							{
//								data:[],
//								backgroundColor: []
//							}
//						],
//						labels:[]
//					},
//					options: {
//						title:{
//							display:true,
//							text:"Vulnerable population"
//						},
//						responsive: true,
//						legend:{
//							position:'bottom',
//							labels: {
//								padding:4,
//								boxWidth:10
//							}
//						}
//					}
//				}	
//			},
			
			// Shelter type
			
			//keep only the 4 biggest + others
			
			// {
				// name: "shelter_type",
				// height: "150",
				// category: "shelter",
				// config: {
					// type: "pie",
					// data:{
						// datasets:[
							// {
								// data:[],
								// backgroundColor: []
							// }
						// ],
						// labels:[]
					// },
					// options: {
						// title:{
							// display:true,
							// text:"Shelters"
						// },
						// responsive: true,
						// legend:{
							// position:'bottom',
							// labels: {
								// padding:4,
								// boxWidth:10
							// }
						// }
					// }
				// }	
			// },
			
			// age_pyramid
			
			{
				name: "age_pyramid",
				height: "200",
				category: "Camp_Management",
				config: {
					type: "horizontalBar",
					data:{
						datasets: [{
							label:"Female",
							backgroundColor: '#f37788',
							data:[]
						}, 
						{
							label:"Male",
							backgroundColor: '#4095cd',
							data:[]
						}],
						labels: ["60+", "18-59", "5-17", "1-4", "0-1"],

					},
					options: {
                    // Elements options apply to all of the options unless overridden in a dataset
                    // In this case, we are setting the border of each horizontal bar to be 2px wide
                    
                    responsive: true,
                    legend: {
                        position: 'top',
						reverse: true
                    },
                    title: {
                        display: true,
                        text: 'Age Pyramid'
                    },
					scales: {
						xAxes: [
							{
							ticks: {
								callback: function(label, index, labels) {
									if (label < 0){
										return 0-label;
									}
									else {return label}
									}
								}
							}
						],
						yAxes: [{
                            stacked: true,
							barThickness:15,
                        }]
					}
                }
				}	
			},
		]

}

// list of colors for graphs
var color_list = ['#0072bc','#4095cd','#7fb8dd','#bfdcee','#bfbfbf']


// traffic lights rules
	function getTrafficLight(tl,v){
		
		var result;
	//yesgreen
		if (tl == "yesgreen"){
			if (v == "yes" || v == "Yes") {
				result= "success"
			}
			else if (v == "no" || v == "No") {
				result= "danger"
			}
			else {
				result= "none"
			}
		}
	//nogreen
		else if (tl == "nogreen"){
			if (v == "yes" || v == "Yes") {
				result= "danger"
			}
			else if (v == "no" || v == "No") {
				result= "success"
			}
			else {
				result= "none"
			}
		}
	//nonered
		else if (tl == "nonered"){
			if (v == "none" || v == "unknown" || v == "None" || v == "Unknown" || v == "No" || v == "no") {
				result= "danger"
			}
			else {
				result= "success"
			}
		}
	//nonegreen
		else if (tl == "nonegreen"){
			if (v == "none" || v == "unknown" || v == "None" || v == "Unknown" || v == "No" || v == "no") {
				result= "success"
			}
			else {
				result= "danger"
			}
		}		      
	//percentagegreen
		else if (tl == "percentagegreen"){
			if (v == "more_75%" || v == "more 75%" || v == "More than 75%") {
				result= "success"
			}
			else if (v == "btw_50%_75%" || v == "btw 50% 75%" || v == "Between 50% and 75%") {
				result= "warning"
			}
			else {
				result= "danger"
			}
		}
	//percentagered
		else if (tl == "percentagered"){
			if (v == "more_75%" || v == "more 75%" || v == "More than 75%") {
				result= "danger"
			}
			else if (v == "btw_50%_75%" || v == "btw 50% 75%" || v == "btw 25% 50%" || v == "btw_25%_50%" || v == "Between 50% and 75%" || v == "Between 25% and 50%") {
				result= "warning"
			}
			else {
				result= "success"
			}
		}
	//distance
		else if (tl == "distance"){
			var Vn = parseInt(v);
			if (Vn > 30) {
				result= "danger"
			}
			else if (Vn <= 30 && Vn > 20){
				result= "warning"
			}
			else if (Vn <= 20 && Vn > 10) {
				result= "mid"
			}
			else {
				result= "success"
			}
		}
	//distanceWater
		else if (tl == "distanceWater"){
			var Vn = parseInt(v);
			if (Vn > 10) {
				result= "danger"
			}
			else if (Vn <= 10 && Vn > 5){
				result= "warning"
			}
			else {
				result= "success"
			}
		}	
	//waterDays
		else if (tl == "waterDays"){
			var Vn = parseInt(v);
			if (Vn < 4) {
				result= "danger"
			}
			else if (Vn >= 5 && Vn < 7){
				result= "warning"
			}
			else {
				result= "success"
			}
		}		
	//wasteDisposal
		else if (tl == "wasteDisposal"){
			if (v == "daily" || v == "weekly") {
				result= "success"
			}
			else if (v == "monthly") {
				result= "warning"
			}
			else {
				result= "danger"
			}
		}	
	//foodDist
		else if (tl == "foodDist"){
			if (v == "daily" || v == "twice daily") {
				result= "success"
			}
			else if (v == "weekly") {
				result= "warning"
			}
			else {
				result= "danger"
			}
		}
	//nonegreendnk
		else if (tl === "nonegreendnk"){
			if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no") {
				result= "success"
			} else if (v === "dnk") {
				result="unknown"
			}
			else {
				result= "danger"
			}
		}				
	//yesgreenManagement
		else if (tl === "yesgreenManagement"){
			if (v === "no_management"){
				result= "danger";
			} else {
				result= "success";
			}
		}
	//forcered
		else if (tl === "forcered"){
			result= "danger";
		}				
	//committees
		else if (tl === "committees"){
			var array = v.split(' ');
			if (array.indexOf('womens') === -1 || v === "none"){
				result= "danger";
			} else {
				result= "success";
			}
		}
	//no rule
		else {
			result= "N/A"
		}
		return result;
		
	}
	
var img_cccm = "data:image/png;base64,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"