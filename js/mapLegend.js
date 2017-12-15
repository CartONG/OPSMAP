/* mapLegend.js
 * Custom map legend for leaflet.js (tested with 0.7.7).
 * Goes along with mapLegend.css
 * Require : 
 *  - jQuery,
 *  - function getUniqueValues(s, f) from utils.js,
 *  - Bootstrap : glyphicon + table-responsive class.
 */

/* Leaflet_mapLegend(...) : returns legend L.control object to be added to the map with its "addTo(map)" method.
 * @params pos String : position of the control in the map (see Leaflet reference L.control).
 * @params layerGroup Object : L.layerGroup to be described by the legend.
 * @params expectedValues Array : array of values expected in the legend (restrains possible values) - Set to false (Boolean) if not required.
 * @params dictionary Object : return alias for certain values (see config.dictionary in config.js).
 * @params language String : language parameter to find the relevant alias in the dictionnary.
 * @params count Boolean : if true, displays the feature counts in the legend (set to false to hide it).
 * @params dataset Array : array of objects : the dataset to be displayed in the map (used for the count).
 * @params field String : name of the field that contains the values to be displayed in the legend.
 * @params checkboxes Boolean : if true, displays the checkboxes alowing filter based on legend entry.
 */
var Leaflet_mapLegend = function(pos, layerGroup, expectedValues, dictionary, language, count, dataset, field, checkboxes) {
  var legend = L.control({ position: pos });
  legend.dictionary = dictionary;
  legend.language = language;
  legend.count = count;
  legend.field = field;
  legend.checkboxes = checkboxes;
  legend.layerGroup = layerGroup;
  legend.ref = {};
  if (dataset && field) {
    if (!expectedValues) {
      legend.ref = getUniqueValues(dataset, field);
    } else {
      var temp = getUniqueValues(dataset, field);
      legend.ref.list = [];
      legend.ref.count = {};
      $.each(temp.list, function(i, v) {
        if (expectedValues.indexOf(v) !== -1) {
          legend.ref.list.push(v);
          legend.ref.count[v] = temp.count[v];
        }
      });
    }
  } else {
    legend.ref.list = expectedValues;
  }

  legend.legendDisplay = new L.featureGroup();
  legend.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'mapLegend table-responsive');
    $(this._div).hover(
      function() {
        map.doubleClickZoom.disable();
      },
      function() {
        map.doubleClickZoom.enable();
      }
    );
    this.update();
    return this._div;
  };

  legend.update = function() {
    var obj = this.ref;

    // Renew div
    var htmlStr = '<div class="mapLegendL"><table class="table"><tbody><tr><td><table class="table"><tbody>';
    $.each(obj.list, function(i, v) {
      var text = legend.dictionary[v] ? legend.dictionary[v][legend.language] : v;
      htmlStr += '<tr>';
      htmlStr += '<td><img height="15px" src="img/markers_icon/' + v + '.svg"></td><td><span class="mapLegendTx">' + text + '</span></td>';
      if (legend.count) {
        htmlStr += '<td class="mapLegendCl"><span class="mapLegendCt" title="' + obj.count[v] + ' feature(s)">' + obj.count[v] + '</span></td>';
      }
      if (legend.checkboxes) {
        htmlStr += '<td class="mapLegendCl"><input class="mapLegendCh" data-field="' + legend.field + '" type="checkbox" style="float:right" value="' + v + '" checked></td>';
      }
      htmlStr += '</tr>';
    });
    htmlStr += '</tbody></table></td><td class="mapLegendB" rowspan="' + obj.list.length + '"><span id="test" class="mapLegendGl glyphicon glyphicon-chevron-right"></span></td></tr><tr></tr></tbody></table></div>';
    $(this._div).append(htmlStr);

    // Set events
    $(this._div).on('click', '.mapLegendB', function() {
      $('.mapLegendCl').toggle(75);
      $('.mapLegendGl').toggleClass('glyphicon-chevron-left').toggleClass('glyphicon-chevron-right');
    });
    if (legend.checkboxes) {
      $(this._div).on('change', '.mapLegendCh', function() {
        var item = this;
        if (this.checked) {
          legend.legendDisplay.eachLayer(function(layer) {
            if (layer.options.obj[item.dataset.field] === item.value) {
              layer.addTo(legend.layerGroup);
              legend.legendDisplay.removeLayer(layer);
            }
          });
        } else {
          legend.layerGroup.eachLayer(function(layer) {
            if (layer.options.obj[item.dataset.field] === item.value) {
              layer.addTo(legend.legendDisplay);
              legend.layerGroup.removeLayer(layer);
            }
          });
        }
      });
    }
  };
  
  return legend;
};
