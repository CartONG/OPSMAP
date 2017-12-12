swal({
	  title: 'Loading',
	  html: '<i class="glyphicon glyphicon-hourglass" style="font-size: 40px;color:#286090"></i>',
//	  imageUrl: "img/loading.gif",
	  showConfirmButton: false
	});
jQuery(document).ready(function() {
	$('.typeahead').hide();
	$('#left_of_map').hide();
	$('#analysis').hide();
	
	
	function toDataURL(url, callback) {
		  var xhr = new XMLHttpRequest();
		  xhr.onload = function() {
		    var reader = new FileReader();
		    reader.onloadend = function() {
		      callback(reader.result);
		    }
		    reader.readAsDataURL(xhr.response);
		  };
		  xhr.open('GET', url);
		  xhr.responseType = 'blob';
		  xhr.send();
	}
	
	$.each(config.categories, function(i, v){
		var url  = 'img/ocha_icon/' + v.icon + '.png';
		toDataURL(url, function(dataUrl) {
			v['dataUrl'] = dataUrl;
		});
	});

	var u = config.url;
	var map, loc, name;
	
Papa.parse("data/external_choices.csv", {
	download: true,
	header: true,	
//	worker: true,	
	delimiter: ",",
	complete: function(externalChoices){
		var external = externalChoices.data;
		var ext = {};
		$.each(external, function(i, v){
			if(!ext[v.list_name]){
				ext[v.list_name] = {};
			}
			ext[v.list_name][v.name] = v["label"];
		});
		Papa.parse("data/choices.csv", {
			download: true,
//			worker: true,	
			header: true,	
			delimiter: ",",
			complete: function(choices){
				var rawChoices = choices.data;
				Papa.parse(u, {
					download: true,
					header: true,
//					worker: true,	
					delimiter: ",",
					complete: function(results){
						var data = results.data;
						var ch = {};
						$.each(rawChoices, function(i, v){
							if(!ch[v.list_name]){
								ch[v.list_name] = {};
							}
							ch[v.list_name][v.name] = v["label::English"];
						});
						$.each(ext, function(k, v){
							if(!ch[k]){
								ch[k] = v;
							}
						});					
						Papa.parse("data/fields.csv", {
							download: true,
							header: true,
//							worker: true,	
							delimiter: ",",	
							complete: function(r){
								var fields = r.data;
									// RUN ZOOM INTERACTION - Set zoom interaction at start to avoid shivers behaviour (along with lines below).
									var defaultZoom = (function(){
										if(appConfig.MapMinZoom){
											if(appConfig.DefaultZoom > appConfig.MapMinZoom){
												return appConfig.DefaultZoom - 1;
											} else {
												return appConfig.DefaultZoom;
											}
										} else {
											return appConfig.DefaultZoom;
										}
									})();
						
									//map
									var map = L.map('map', {
//										renderer: L.canvas(),
//										preferCanvas: true,
										minZoom: appConfig.MapMinZoom ? appConfig.MapMinZoom : "",
										maxZoom: appConfig.MapMaxZoom ? appConfig.MapMaxZoom : "",
									}).setView(appConfig.DefaultCenter, defaultZoom);
								
									if(appConfig.MapMaxBounds){
										var bounds = map.getBounds();
										$.each(bounds, function(k, v){
											$.each(v, function(i, w){
												w += 0.1;
											});
										});
										map.setMaxBounds(bounds);
									}
									
									//scalebar
									L.control.scale().addTo(map);
									
									//basemaps
									var mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 18, crossOrigin: true});
									var osm_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>', crossOrigin: true});
									var esri_satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community', maxZoom: 18, crossOrigin: true});
									var esri_lightGrey = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; <a href="http://www.esri.com/">Esri</a>,  HERE, DeLorme, MapmyIndia, © OpenStreetMap contributors, and the GIS user community ',maxZoom: 18, crossOrigin: true});
									var esri_street = L.tileLayer('https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: '&copy; <a href="http://www.esri.com/">Esri</a>', maxZoom: 18, crossOrigin: true});
									osm_HOT.addTo(map);
				
									var selectionArray = [];
									if (appConfig.MapClustering){
										var selectionLayer = L.layerGroup();
										selectionLayer.addTo(map);
									}
										
									// adding markers from CSV to map + to search fonction		
									if (!appConfig.MapClustering){
										var csv_markers = new L.featureGroup().addTo(map);
									} else {	
										var csv_markers = L.markerClusterGroup({
											chunkedLoading: true,
											showCoverageOnHover: false,
											// maxClusterRadius - FUNCTION : Defines cluster radius (catching area in pixels [INTEGER]) accordingly with z as zoomLevel [INTEGER].
											maxClusterRadius: function(z){
												if(z < 5){
													return 80;
												} else if(z === 5){
													return 40;
												} else if(z === 6){
													return 70;
												} else if(z === 7){
													return 65;
												} else if(z === 8){
													return 60;
												} else if(z === 9){
													return 55;
												} else if(z === 10){
													return 50;
												} else if(z === 11){
													return 45;
												} else if(z === 12){
													return 40;
												} else if(z === 13){
													return 35;
												} else if(z === 14){
													return 30;
												} else if(z === 15){
													return 25;
												} else if(z === 16){
													return 20;
												}
												else {
													return 1;
												}
											}
										});
										map.addLayer(csv_markers);
									}
									var marker_list = [];
									
						
						
									$.each(data, function(i, v){
										if (v[config.lat] && v[config.lon]){
											var tValues = config.expectedTypes;
											var t = v[config.type];
											t = t.toLowerCase()
											var icon = L.icon({
												iconUrl: tValues.indexOf(t) !== -1 ? 'img/markers_icon/'+t+'.svg' : 'img/markers_icon/default.svg',
												iconSize: [20, 20],
												iconAnchor: [10, 10],
												popupAnchor: [0, -10]
											});
											var iconHovered = L.icon({
												iconUrl: tValues.indexOf(t) !== -1 ? 'img/markers_icon/'+t+'_hovered.svg' : 'img/markers_icon/default_hovered.svg',
												iconSize: [22, 22],
												iconAnchor: [11, 11],
												popupAnchor: [0, -11]						
											});
											var iconSelected = L.icon({
												iconUrl: tValues.indexOf(t) !== -1 ? 'img/markers_icon/'+t+'_selected.svg' : 'img/markers_icon/default_selected.svg',
												iconSize: [22, 22],
												iconAnchor: [11, 11],
												popupAnchor: [0, -11]						
											});							
											var marker = new L.marker([parseFloat(v[config.lat]), parseFloat(v[config.lon])], {icon: icon, riseOnHover: true, obj:v}).bindPopup(toProperCase(v[config.name]),{autoPan: false});
											marker.options.iconSet = {};
											marker.options.iconSet.icon = icon;
											marker.options.iconSet.iconHovered = iconHovered;
											marker.options.iconSet.iconSelected = iconSelected;
											marker.on('mouseover', function(e) {
												this.openPopup();
												if (this.options.icon !== this.options.iconSet.iconSelected){
													this.setIcon(this.options.iconSet.iconHovered);							
												}
											});
											marker.on('mouseout', function(e) {
												this.closePopup();
												if (this.options.icon !== this.options.iconSet.iconSelected){
													this.setIcon(this.options.iconSet.icon);
												}
											});
											if (appConfig.MapClustering){
												marker.on('click', function(e) {
													this.setIcon(this.options.iconSet.iconSelected);
													this.setZIndexOffset(1000);
													if(selectionArray.length){
														selectionArray[0].setIcon(selectionArray[0].options.iconSet.icon);
														if(selectionLayer.getLayers().length){
															selectionLayer.removeLayer(selectionArray[0]);
															csv_markers.addLayer(selectionArray[0]);
														}
														selectionArray.splice(0, 1);
													}
													selectionArray.push(this);
													info(this.options.obj);				
												});
											} else {
												marker.on('click', function(e) {
													this.setIcon(this.options.iconSet.iconSelected);
													this.setZIndexOffset(1000);
													if(selectionArray.length){
														selectionArray[0].setIcon(selectionArray[0].options.iconSet.icon);
														selectionArray.splice(0, 1);
													}
													selectionArray.push(this);
													info(this.options.obj);
												});
											}
						
											csv_markers.addLayer(marker);
											marker_list.push({'name':toProperCase(v[config.name]), 'coordo': [parseFloat(v[config.lat]), parseFloat(v[config.lon])], "properties":v});
											
            
                                            
											// RUN ZOOM INTERACTION - Part of action described above.
											if(appConfig.MapMaxZoom){
												if(map.getZoom() < appConfig.MapMaxZoom){
													map.setZoom(map.getZoom() + 1);
												}
											}
										}
									});
                                
                                    // animationend event : avoids hovered markers to get "trapped" into a cluster (and hence keep the hovered style) on zoom change.
                                    csv_markers.on('animationend', function (a) {
                                        $.each(a.target.getLayers(), function(i, v){
                                            if (v.options.icon === v.options.iconSet.iconHovered){
                                                v.setIcon(v.options.iconSet.icon);							
                                                v.closePopup();
                                            }   
                                        })
                                    });
                                
									$('.js-loading-bar').hide();
									$('.container').show();
									
                                
                                

									//LEGEND GLOBALS
                                    var legend = new Leaflet_mapLegend('bottomright', csv_markers, config.expectedTypes, true, data, config.type, true);
									legend.addTo(map);
		
									
									
									if (appConfig.MapClustering){
										map.on('zoomstart', function(){
											if(selectionArray.length){
												csv_markers.removeLayer(selectionArray[0]);
												selectionArray[0].addTo(selectionLayer);
											}
										});
										map.on('click', function(){
											$("#left_of_map").html("");
											$("#below_map").html("");
											if(selectionArray.length){
												selectionArray[0].setIcon(selectionArray[0].options.iconSet.icon);
												if(selectionLayer.getLayers().length){
													selectionLayer.removeLayer(selectionArray[0]);
													csv_markers.addLayer(selectionArray[0]);
												}
												selectionArray.splice(0, 1);
											}					
										});
									} else {
										map.on('click', function(){
											$("#left_of_map").html("");
											$("#below_map").html("");
											if(selectionArray.length){
												selectionArray[0].setIcon(selectionArray[0].options.iconSet.icon);
												selectionArray.splice(0, 1);
											}						
										});
									}
						
									$('.typeahead').typeahead({
										source:marker_list,
										afterSelect: function(item){
											info(item.properties);
//                                            csv_markers.off('animationend');                                              
											function interaction(obj){
												csv_markers.zoomToShowLayer(obj);
                                                    obj.setIcon(obj.options.iconSet.iconSelected);
                                                    obj.setZIndexOffset(1000);
                                                    var run = true;
                                                    if(selectionArray.length){
                                                        if(toProperCase(selectionArray[0].options.obj[config.name]) !== item.name){
                                                            selectionArray[0].setIcon(selectionArray[0].options.iconSet.icon);
                                                            if(appConfig.MapClustering){
                                                                if(selectionLayer.getLayers().length){
                                                                    selectionLayer.removeLayer(selectionArray[0]);
                                                                    csv_markers.addLayer(selectionArray[0]);
                                                                }
                                                            }
                                                            selectionArray.splice(0, 1);
                                                        } else {
                                                            run = false;
                                                        }

                                                    }
                                                    if(run){
                                                        selectionArray.push(obj);
                                                        obj.openPopup();
                                                    }
											}
											var found = false;
												$.each(csv_markers.getLayers(), function(i, v){
													if (item.name === toProperCase(v.options.obj[config.name])){							
														interaction(v);
														found = true;
														return false;
													}			
												});
											if(!found){
												$('.mapLegendCh:checkbox:not(:checked)').click();
												$.each(csv_markers.getLayers(), function(i, v){
													if (item.name === toProperCase(v.options.obj[config.name])){							
														interaction(v);
														found = true;
														return false;
													}			
												});	
											}
//                                            setTimeout(function(){
//                                                csv_markers.on('animationend', function (a) {
//                                                    $.each(a.target.getLayers(), function(i, v){
//                                                        if (v.options.icon === v.options.iconSet.iconHovered){
//                                                            v.setIcon(v.options.iconSet.icon);							
//                                                            v.closePopup();
//                                                        }   
//                                                    })
//                                                });  
//                                            }, 500);
                                            
										},
									})
									
									//layer switcher
									var baseMaps = {
										"OSM": mapnik,
										"OSM_HOT": osm_HOT,
										"Esri Satellite": esri_satellite,
										"Esri Light Grey": esri_lightGrey,
										"Esri Streets": esri_street,
									};
									var overlayMaps = {
										"Sites": csv_markers
									};
									L.control.layers(baseMaps, overlayMaps).addTo(map);
									                                    
									$('.typeahead').show();
									$('.typeahead').val('');
									$('#left_of_map').show();
									
									var c = config.categories;
									
									//map analysis
									for (var i in c){
										$('#dropdown-list').append('<li class="dropdown-submenu"><a href="#"><img height="15px" src="img/ocha_icon/'+c[i].icon+'.png">&nbsp;'+c[i].alias+'</a><ul class="dropdown-menu" id="submenu_'+c[i].name+'"></ul></li>')
									}
									for (var i in fields){
										$('#submenu_'+fields[i].category+'').append('<li><a href="#">'+fields[i].alias+'</a></li>')
									}
									
									//$('#analysis').show();
									
									
						//********  when clicking on a marker  ********//
//									$('.progress-bar').css('width', '100%');
									swal.close();
//									$('.container').show();
									function info(h){
										//emptying divs
										left_of_map.innerHTML = "";
										below_map.innerHTML = "";
										
										var dpHtml = '<div class="dropdown">';
										dpHtml += '<button id="buttonExport" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span class="glyphicon glyphicon-file"></span> Export as PDF</button>';
										dpHtml += '<ul class="dropdown-menu">';
										dpHtml += '<li><a class="exportB" data-export="page">Export full page</a></li>';
										dpHtml += '<li><a class="exportB" data-export="doc">Export multi-page document</a></li>';
										dpHtml += '</ul>';
										dpHtml += '</div>';
										
										$('#left_of_map').append(dpHtml);
										
									
										
										//adding name, coordinates and last update [last_update converted from EXCEL format to DD/MM/YYYY]
										$('#left_of_map').append('<h3><span id="itemTitle">'+toProperCase(h[config.name])+'</span><br><small id="itemDate">Last Update: '+getJsDateFromExcel(h[config.last_update])+'</small></h3>');
//										$('#left_of_map').append('<br><select id="icon-print" name="icon-print"><option disabled selected>Export as .PDF</option><option class="exportB" data-export="fullPage">Export full page</option><option class="exportB" data-export="doc">Export several pages</option></select>');										
//										$('#icon-print').selectmenu();
									

										
										
										
										//recreating divs								
										var cl = c.length;
											if (cl > 0){
												$('#left_of_map').append("<div><h4 class='categoryTitle' data-cat='" + c[0].name + "'><img class='catImage'  height='30px' data-cat='" + c[0].name + "' data-dataurl='" + c[0].dataUrl + "' src='img/ocha_icon/"+c[0].icon+".png'>&nbsp;"+c[0].alias+"</h4><div  id='"+c[0].name+"'></div></div>");
												
												///
												var nb_col = 3;
												var rcl = cl-1;
												for (var i = 1; i < nb_col+1; i++){
													$('#below_map').append('<div id="col_'+i+'" class="col-md-'+12/nb_col+'"></div>')
												}
												for (var i = 1; i <= rcl; i++){
													var y = i%nb_col
													if (y==0){y=nb_col}
													$('#col_'+ c[i].col).append("<div class='row categories'><h4 class='categoryTitle' data-cat='" + c[i].name + "'><img class='catImage' height='30px' data-cat='" + c[i].name + "' data-dataurl='" + c[i].dataUrl + "' src='img/ocha_icon/"+c[i].icon+".png'>&nbsp;"+c[i].alias+"</h4><div id='"+c[i].name+"'></div></div>")
												}
												///
											}
											
										//looping on fields and populating
										for (var i in fields){
											var f = fields[i];
											if (h[f.csv_field]){ //if field is not null in data
												if (f.chart){	
												} //if it's a chart we add nothing here
												else { // if it's not a chart
													
													var tl = getTrafficLight(f.traffic_light,h[f.csv_field]);
													var htmlStr = "";
													if (f.type === "list"){//if list
														if(h[f.csv_field] !== " "){
															var array = h[f.csv_field].split(' ');
															var list = [];
															if (ch[f.choices]){
																$.each(array, function(i, v){
																	if(ch[f.choices][v]){
																		list.push(ch[f.choices][v]);
																	} else {
																		list.push(v);
																	}
																});
															} else {
																$.each(array, function(i, v){
																	list.push(v);
																});
															}
															if (list.length > 1){
																htmlStr += '<p>';
																if(tl !== "N/A"){
																	htmlStr += '<img class="tl" data-field="' + f.csv_field + '" data-tlight="' + tl + '" src="img/tl/tl-' + tl + '.svg">&nbsp;';														
																}
																htmlStr += '<span class="infoEl" data-field="' + f.csv_field + '" data-cat="' + f.category + '" data-chart="false">' + f.alias + ' : </span>';
																htmlStr += '<ul id="list_'+i+'"></ul></p>';																	
//																$("#"+f.category+"").append("<p><img class='tl' src='img/tl/tl-"+tl+".svg'>&nbsp;"+f.alias+" :<ul id='list_"+i+"'></ul></p>")
																$("#"+f.category).append(htmlStr);
																for (var y in list){
																	if (list[y] !== ""){
																		$("#list_"+i).append('<li><b class="infoVal" style="color:#4095cd" data-field="' + f.csv_field + '">' + list[y] + '</b></li>');
																	}
																}
															}
															else {
																htmlStr += '<p>';
																if(tl !== "N/A"){
																	htmlStr += '<img class="tl" data-field="' + f.csv_field + '" data-tlight="' + tl + '" src="img/tl/tl-'+tl+'.svg">&nbsp;';														
																}
																htmlStr += '<span class="infoEl" data-field="' + f.csv_field + '" data-cat="' + f.category + '" data-chart="false">' + f.alias + ' : </span>';
																htmlStr += '<b class="infoVal" style="color:#4095cd" data-field="' + f.csv_field + '">' + list[0] + '</b></p>';																
//																$("#"+f.category+"").append("<p><img class='tl' src='img/tl/tl-"+tl+".svg'>&nbsp;"+f.alias+" : <b style='color:#4095cd'>"+list[0]+"</b></p>")
																$("#"+f.category).append(htmlStr);
															}
														}
													} else if (f.type === "date"){
														if (h[f.csv_field] !== "" && h[f.csv_field] !== " "){
															htmlStr += '<p>';
															if(tl !== "N/A"){
																htmlStr += '<img class="tl" data-field="' + f.csv_field + '" data-tlight="' + tl + '" src="img/tl/tl-'+tl+'.svg">&nbsp;';														
															}
															htmlStr += '<span class="infoEl" data-field="' + f.csv_field + '" data-cat="' + f.category + '" data-chart="false">' + f.alias + ' : </span>';
															htmlStr += '<b class="infoVal" style="color:#4095cd" data-field="' + f.csv_field + '">' + getJsDateFromExcel(h[f.csv_field]) + '</b></p>';
//															$("#"+f.category+"").append("<p><img class='tl' src='img/tl/tl-"+tl+".svg'>&nbsp;"+f.alias+" : <b style='color:#4095cd'>"+getJsDateFromExcel(h[f.csv_field])+"</b></p>")									
															$("#"+f.category).append(htmlStr);									
														}
													} else if (f.type === "exception"){

													}
													else {
														var val;
														if (f.choices){
															val = ch[f.choices][h[f.csv_field]];																						
														} else {
															val = h[f.csv_field];
														}
														if (h[f.csv_field] !== "" && h[f.csv_field] !== " "){
															htmlStr += '<p>';
															if(tl !== "N/A"){
																htmlStr += '<img class="tl" data-field="' + f.csv_field + '" data-tlight="' + tl + '" src="img/tl/tl-'+tl+'.svg">&nbsp;';														
															}
															htmlStr += '<span class="infoEl" data-field="' + f.csv_field + '" data-cat="' + f.category + '" data-chart="false">' + f.alias + ' : </span>';
															htmlStr += '<b class="infoVal" style="color:#4095cd" data-field="' + f.csv_field + '">'+val+'</b></p>';
//															$("#"+f.category+"").append("<p><img class='tl' src='img/tl/tl-"+tl+".svg'>&nbsp;"+f.alias+" : <b style='color:#4095cd'>"+val+"</b></p>")									
															$("#"+f.category).append(htmlStr);									
														}
													}
												}
											}
										}
										
										// charts
										for (var i in config.charts){
											var chartValidation = true;
		
											//create the graphs config
											var g = config.charts[i];
											
											//filter fields on "chart IS NOT NULL"
											var chartFields = fields.filter(function(obj){
												return obj.chart;
											});
											if (g.name === "age_pyramid"){  // si le graph est la pyramide des ages
												g.config.data.datasets[0].data = [];
												g.config.data.datasets[1].data = [];
												for (var y in chartFields){
													var f = chartFields[y];
													if(h[f.csv_field] === "" || h[f.csv_field] === " "){
														chartValidation = false;
													}
													if (g.name == f.chart){
														if (h[f.csv_field] > 0){
															if (f.chart_details == "f"){
																g.config.data.datasets[0].data.push(Number(h[f.csv_field]))
															}
															else if (f.chart_details == "m"){
																g.config.data.datasets[1].data.push(Number(0-h[f.csv_field]))
															}
														}
													}
													
												}
												g.config.options.tooltips = {
														callbacks: {
															obj: function(t,d){
																return d.datasets[t[0].datasetIndex].label+": "+d.labels[t[0].index];
															},
															label: function(t,d) {
																if (t.datasetIndex == 1){
																	var invert = Number(0-d.datasets[1].data[t.index])
																	return invert;
																}
																else {
																	return d.datasets[0].data[t.index];
																}
															}
														}
													}
											}
											else { // autres graphs
												g.config.data.datasets[0].data = [];
												g.config.data.datasets[0].backgroundColor = [];
												g.config.data.labels = [];
												var data_list = [];
												for (var y in chartFields){
													var f = chartFields[y]
													if (g.name == f.chart){
														if (h[f.csv_field] > 0){
															data_list.push({"a":f.alias+" ("+Number(h[f.csv_field])+")","v": Number(h[f.csv_field])})
														}
													}
												}
												
												data_list.sort(function(a, b) {
													return parseFloat(b.v) - parseFloat(a.v);
												});
												var other_label = ["Others:"];
												if (data_list.length > 5){
													for (var i in data_list){
														if (i > 4){
															data_list[4].v = (data_list[4].v)+(data_list[i].v);
														}
														if (i > 3){
															var t = data_list[i].a;
															other_label.push(t);
														}
													}
													data_list[4].a = "Others"
													var de = data_list.length - 5;
													data_list.splice(5,de);
													var lb = other_label;
													g.config.options.tooltips = {
														callbacks: {
															label: function(t,d) {
																if (t.index == 4){
																return  lb;
																}
																else{
																	return d.labels[t.index];
																}
															}
														}
													}
												}
												for (var i in data_list){
													g.config.data.datasets[0].data.push(data_list[i].v);
													g.config.data.datasets[0].backgroundColor.push(color_list[i]);
													g.config.data.labels.push(data_list[i].a);
												}
												
												
											}
											if(chartValidation){
												//creates the graphs div
												$("#"+g.category).append('<div class="canvas-holder" style="width:100%"><canvas height="'+g.height+'" id="chart_'+g.name+'" /></div>');										
												//generates the graphs
												var ctx = document.getElementById("chart_"+g.name).getContext("2d");
												var chart = new Chart(ctx, g.config);
												$("#chart_" + g.name).addClass('infoEl');
												$("#chart_" + g.name).attr('data-cat', f.category);
												$("#chart_" + g.name).attr('data-chart', true);
											} else {
												$("#"+g.category).append("<p><img class='tl' src='img/tl/tl-null.svg'>&nbsp;<b style='color:#808080'><i>Data not available for age pyramid chart</i></b></p>")
											}
		
										}
									



//									$('#icon-print').unbind('click').click(function() { 
//											exportPdf(map);
//									});
									$("#buttonExport").on('click', function(){
//										html2canvas($("canvas.leaflet-zoom-animated"), {
//											html2canvas($("#map"), {
//											onrendered: function(canvas){
//												window.open(canvas.toDataURL())
//											}
//										})
										
										
//										map.eachLayer(function(layer){
//											if(layer._icon){
//												if (layer._icon.tagName === "DIV"){
//													html2canvas(layer._icon, {
//														onrendered : function(canvas){
////															var element = new Image();
////															element.src = canvas.toDataURL();
////															element.crossorigin = "";
//															layer._domIconClusterBounds = {};
//															var bounds = layer._icon.getBoundingClientRect();
//															layer._domIconClusterBounds.left = bounds.left;
//															layer._domIconClusterBounds.top = bounds.top;
//															layer._domIconClusterBounds.width = bounds.width;
//															layer._domIconClusterBounds.height = bounds.height;
////															layer._domIconCluster = element;
//															layer._domIconCluster = canvas.toDataURL();
//														}
//													});													
//												}
//											}
//										})
									})
									
									$('.exportB').on('click', function(){
										var e = this.dataset.export
										if (e === "page"){
											exportPdf(map);
										} else if (e === "doc"){										
											exportPdfDoc(map);
										}
									});										
								}
							}
						});
					}
				});		
				
				
			}
		});
	}
});
	




});	
	

