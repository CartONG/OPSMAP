function info(h, fields, ch){
        //emptying divs
        left_of_map.innerHTML = "";
        below_map.innerHTML = "";
        var c = config.categories;

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