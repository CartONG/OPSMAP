/* OPSMAP config.js - Dec. 2017 - CartONG */

var config = {};
config.appConfig = {
// General
    // Title - STRING.
    Title : "OPSMAP - Somalia",
    
    // Language - STRING : Works only for the dictionary.
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
    DefaultCenter: [5.54, 46.7]
};

// config.dictionary : set a dictionnary for dataset values - each value listed from the dataset as property of the dictionnary object holds an object containing matching aliases for given languages.
config.dictionary = {
    planned_site: {
        en: "Planned site"
    },
    spontaneous_site: {
        en: "Spontaneous site"
    }    
};

config.data = {
		
		// URL of the dataset
		dataset : "data/dataset.csv",
    
		// URL of the fields definition
		fields : "data/fields.csv",
    
        // Load choices, set to false if no choices requested
        loadChoices : true,
    
            // URL of the choices
            choices : "data/choices.csv",
    
        // Load external choices, set to false if no external choices requested
        loadExternal : true,

            // URL of the external choices
            externalChoices : "data/external_choices.csv",    
		
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
							label: "Female",
							backgroundColor: '#f37788',
							data:[]
						}, 
						{
							label:"Male",
							backgroundColor: '#4095cd',
							data:[]
						}],
						labels: ["60+", "18-59", "5-17", "1-4", "0-1"]
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
						      xAxes: [{
                      ticks: {
                          callback: function(label, index, labels) {
                              if (label < 0){
                                  return 0-label;
                              } else {
                                  return label
                              }
                          }
                      }
                  }],
                  yAxes: [{
                      stacked: true,
							        barThickness: 15
                  }]
					    }
          }
				}
    }]
};

// list of colors for graphs
var color_list = ['#0072bc','#4095cd','#7fb8dd','#bfdcee','#bfbfbf'];


config.tlRules = {
    "percentagegreen" : function(v){
        if (v === "more_75%" || v === "more 75%" || v === "More than 75%") {
            return "success";
        }
        else if (v === "btw_50%_75%" || v === "btw 50% 75%" || v === "Between 50% and 75%") {
            return "warning";
        }
        else {
            return "danger";
        }
    },
    "percentagered" : function(v) {
        if (v === "more_75%" || v === "more 75%" || v === "More than 75%") {
            return "danger";
        }
        else if (v === "btw_50%_75%" || v === "btw 50% 75%" || v === "btw 25% 50%" || v === "btw_25%_50%" || v === "Between 50% and 75%" || v === "Between 25% and 50%") {
            return "warning";
        }
        else {
            return "success";
        }
    },
    "distance" : function(v) {
        var Vn = parseInt(v);
        if (Vn > 30){
            return "danger";
        }
        else if (Vn <= 30 && Vn > 20) {
            return "warning";
        }
        else if (Vn <= 20 && Vn > 10) {
            return "mid";
        }
        else {
            return "success";
        }       
    },
    "distanceWater" : function(v) {
        var Vn = parseInt(v);
        if (Vn > 10){
            return "danger";
        }
        else if (Vn <= 10 && Vn > 5) {
            return "warning";
        }
        else {
            return "success";
        }
    },
    "waterDays" : function(v) {
        var Vn = parseInt(v);
        if (Vn < 4) {
            return "danger";
        }
        else if (Vn >= 5 && Vn < 7) {
            return "warning";
        }
        else {
            return "success";
        }
    },
    "wasteDisposal" : function(v){
        if (v === "daily" || v === "weekly") {
            return "success";
        }
        else if (v === "monthly"){
            return "warning";
        }
        else {
            return "danger";
        }
    },
    "foodDist" : function(v){
        if (v === "daily" || v === "twice daily"){
            return "success";
        }
        else if (v === "weekly"){
            return "warning";
        }
        else {
            return "danger";
        }
    },
    "nonegreendnk" : function(v){
        if (v === "none" || v === "unknown" || v === "None" || v === "Unknown" || v === "No" || v === "no"){
            return "success";
        }
        else if (v === "dnk"){
            return "unknown";
        }
        else {
            return "danger";
        }
    },
    "yesgreenManagement" : function(v){
        if (v === "no_management"){
            return "danger";
        }
        else {
            return "success";
        }
    },
    "forcered" : function(v){
        return "danger";
    },
    "committees" : function(v){
        var array = v.split(' ');
        if (array.indexOf('womens') === -1 || v === "none"){
            return "danger";
        } else {
            return "success";
        }        
    }    
};
