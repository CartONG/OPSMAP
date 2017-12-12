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
	
	$.each(config.data.categories, function(i, v){
		var url  = 'img/ocha_icon/' + v.icon + '.png';
		toDataURL(url, function(dataUrl) {
			v['dataUrl'] = dataUrl;
		});
	});

	var u = config.data.url;
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
										if(config.appConfig.MapMinZoom){
											if(config.appConfig.DefaultZoom > config.appConfig.MapMinZoom){
												return config.appConfig.DefaultZoom - 1;
											} else {
												return config.appConfig.DefaultZoom;
											}
										} else {
											return config.appConfig.DefaultZoom;
										}
									})();
						
									//map
									var map = L.map('map', {
										minZoom: config.appConfig.MapMinZoom ? config.appConfig.MapMinZoom : "",
										maxZoom: config.appConfig.MapMaxZoom ? config.appConfig.MapMaxZoom : "",
									}).setView(config.appConfig.DefaultCenter, defaultZoom);
								
									if(config.appConfig.MapMaxBounds){
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
									if (config.appConfig.MapClustering){
										var selectionLayer = L.layerGroup();
										selectionLayer.addTo(map);
									}
										
									// adding markers from CSV to map + to search fonction		
									if (!config.appConfig.MapClustering){
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
										if (v[config.data.lat] && v[config.data.lon]){
											var tValues = config.data.expectedTypes;
											var t = v[config.data.type];
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
											var marker = new L.marker([parseFloat(v[config.data.lat]), parseFloat(v[config.data.lon])], {icon: icon, riseOnHover: true, obj:v}).bindPopup(toProperCase(v[config.data.name]),{autoPan: false});
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
											if (config.appConfig.MapClustering){
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
													info(this.options.obj, fields, ch, map);				
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
													info(this.options.obj, fields, ch, map);
												});
											}
						
											csv_markers.addLayer(marker);
											marker_list.push({'name':toProperCase(v[config.data.name]), 'coordo': [parseFloat(v[config.data.lat]), parseFloat(v[config.data.lon])], 'properties':v});
											
            
                                            

										}
									});
                                
                                
                                            // RUN ZOOM INTERACTION - Part of action described above.
											if(config.appConfig.MapMaxZoom){
												if(map.getZoom() < config.appConfig.MapMaxZoom){
													map.setZoom(map.getZoom() + 1);
												}
											}
                                
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
                                    var legend = new Leaflet_mapLegend('bottomright', csv_markers, config.data.expectedTypes, config.dictionary, config.appConfig.Language, true, data, config.data.type, true);
									legend.addTo(map);
		
									
									
									if (config.appConfig.MapClustering){
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
											info(item.properties, fields, ch, map);                                          
											function interaction(obj){
												csv_markers.zoomToShowLayer(obj);
                                                    obj.setIcon(obj.options.iconSet.iconSelected);
                                                    obj.setZIndexOffset(1000);
                                                    var run = true;
                                                    if(selectionArray.length){
                                                        if(toProperCase(selectionArray[0].options.obj[config.data.name]) !== item.name){
                                                            selectionArray[0].setIcon(selectionArray[0].options.iconSet.icon);
                                                            if(config.appConfig.MapClustering){
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
													if (item.name === toProperCase(v.options.obj[config.data.name])){							
														interaction(v);
														found = true;
														return false;
													}			
												});
											if(!found){
												$('.mapLegendCh:checkbox:not(:checked)').click();
												$.each(csv_markers.getLayers(), function(i, v){
													if (item.name === toProperCase(v.options.obj[config.data.name])){							
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
									
									var c = config.data.categories;
									
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

							}
						});
					}
				});		
				
				
			}
		});
	}
});
});	