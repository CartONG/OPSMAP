/* mapLegend.js
 * Custom map legend for leaflet.js (tested with 0.7.7).
 * Goes along with mapLegend.css
 * Works with jQuery.
 */
var Leaflet_mapLegend = function(pos, layerGroup, expectedValues, count, dataset, field, checkboxes){
    var legend = L.control({position: pos});    
    legend.count = count;
    legend.checkboxes = checkboxes;
    legend.ref = {};
    legend.layerGroup = layerGroup;
    if(dataset && field){
        if(!expectedValues){
            legend.ref = getUniqueValues(dataset, field);
        } else {
            var temp = getUniqueValues(dataset, field);
            legend.ref.list = [];
            legend.ref.count = {};
            $.each(temp.list, function(i, v){
                if(expectedValues.indexOf(v) !== -1){
                    legend.ref.list.push(v);
                    legend.ref.count[v] = temp.count[v];
                }
            });
        }
    } else {
        legend.ref.list = expectedValues;
    }
    
    legend.legendDisplay = new L.featureGroup();
    legend.onAdd = function(map, layerGroup, expectedValues, count, dataset, field, checkboxes){
        this._div = L.DomUtil.create('div', 'mapLegend table-responsive');
        $(this._div).hover(
            function(){
                map.doubleClickZoom.disable();
            },
            function(){
                map.doubleClickZoom.enable();
            }
        );
        //LEGEND GLOBALS
        this.update(expectedValues, count, dataset, field, checkboxes);
        return this._div;
    };
    
    legend.update = function(layerGroup, expectedValues, count, dataset, field, checkboxes){
        var obj = this.ref;
        // Renew div
        var htmlStr = '<div class="mapLegendL"><table class="table"><tbody><tr><td><table class="table"><tbody>';
        console.log(obj)
        console.log(this.layerGroup);
        console.log(this.count);
        console.log(dictionnary);
        $.each(obj.list, function(i, v){
            //LEGEND GLOBALS
            var text = dictionnary[v] ? dictionnary[v][appConfig.Language] : v;
            htmlStr += '<tr>';
            htmlStr += '<td><img height="15px" src="img/markers_icon/' + v + '.svg"></td><td><span class="mapLegendTx">' + text + '</span></td>';
            if(legend.count){
                htmlStr += '<td class="mapLegendCl"><span class="mapLegendCt" title="' + obj.count[v] + ' feature(s)">' + obj.count[v] + '</span></td>';										
            }
            if(legend.checkboxes){
                htmlStr += '<td class="mapLegendCl"><input class="mapLegendCh" data-field="' + field + '" type="checkbox" style="float:right" value="' + v + '" checked></td>';										
            }
            htmlStr += '</tr>';
        });
        htmlStr += '</tbody></table></td><td class="mapLegendB" rowspan="' + obj.list.length + '"><span id="test" class="mapLegendGl glyphicon glyphicon-chevron-right"></span></td></tr><tr></tr></tbody></table></div>';
        $(this._div).append(htmlStr);

        // Set events

        $(this._div).on('click', '.mapLegendB', function(){
            console.log('test')
            $('.mapLegendCl').toggle(100);
            $('.mapLegendGl').toggleClass('glyphicon-chevron-left').toggleClass('glyphicon-chevron-right');
        })						
        $(this._div).on('change', '.mapLegendCh', function(){
            var item = this;
            console.log(this)
            if(this.checked){												
                //LEGEND GLOBALS
                legend.legendDisplay.eachLayer(function (layer) {
                    if (layer.options.obj[item.dataset.field] === item.value) {
                        //LEGEND GLOBALS												
                        layer.addTo(legend.layerGroup);
                        legend.legendDisplay.removeLayer(layer);		
                    }
                });
            } else {									
                legend.layerGroup.eachLayer(function (layer) {
                    if (layer.options.obj[item.dataset.field] === item.value) {
                        //LEGEND GLOBALS												
                        layer.addTo(legend.legendDisplay);
                        legend.layerGroup.removeLayer(layer);		
                    }
                });										
            }
        });																										
    };
    return legend;
}