
// TODO: make it Retina ready

L.CanvasPointLayer = L.TileLayer.Canvas.extend({ // Leaflet 0.7
// L.CanvasPointLayer = L.GridLayer.extend({ // Leaflet 1.0

  options: {
    radius: 10,
    tileSize: 256,
    zIndex: 0
  },

  initialize: function(collection, options) {
    this._collection = collection;
    L.setOptions(this, options);
  },

  createTile: function(coords, callback) {
    var canvas = L.DomUtil.create('canvas', 'leaflet-tile');
    this.drawTile(canvas, coords, coords.z, callback);
  },

  drawTile: function(canvas, coords, z, callback) {
    var
      context = canvas.getContext('2d'),
      tileSize = this.options.tileSize,
      // tileSize = this.getTileSize(),
      worldSize = tileSize<<z,
      scale = Math.pow(1.2, z-18); // icons scale down with zoom but slower

    canvas.width = tileSize;
    canvas.height = tileSize;
    // canvas.style.imageRendering = 'optimizeSpeed';
    // context.imageSmoothingEnabled = false;

    var scope = this;

    setTimeout(function() {
      scope._collection.features.map(function(feature) {
        var
          pos = scope._project(feature.geometry.coordinates[1], feature.geometry.coordinates[0], worldSize),
          x = pos.x - coords.x*tileSize, // local pixel pos on tile
          y = pos.y - coords.y*tileSize, // local pixel pos on tile
          radius = (feature.properties.radius || scope.options.radius) * scale,
          margin = radius+1;

        if (x < -margin || x > tileSize+margin) return;
        if (y < -margin || y > tileSize+margin) return;

        context.beginPath();
        context.strokeStyle = (feature.properties.stroke || scope.options.stroke);
        context.fillStyle = (feature.properties.fill || scope.options.fill);
        context.lineWidth = (feature.properties.lineWidth || scope.options.lineWidth);

        context.arc(x-radius/2, y-radius/2, radius, 0, Math.PI*2);
        context.stroke();
        context.fill();
      });
      if (typeof callback === 'function') {
        callback(null, canvas);
      }
    }, 350);

    return canvas;
  },

  _project: function(latitude, longitude, worldSize) {
    var
      x = longitude/360 + 0.5,
      y = Math.min(1, Math.max(0, 0.5 - (Math.log(Math.tan((Math.PI/4) + (Math.PI/2)*latitude/180))/Math.PI)/2));
    return { x: x*worldSize, y: y*worldSize };
  },

  _distance: function(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return dx*dx + dy*dy;
  },

  getTarget: function(latlng) {
    var
      options = this.options,
      zoom = this._map.getZoom();

    if (zoom > options.maxZoom || zoom < options.minZoom) {
      return;
    }

    var
      scale = Math.pow(1.2, zoom-18), // icons scale down with zoom but slower
      tileSize = this.options.tileSize,
      worldSize = tileSize<<zoom,
      pos = this._project(latlng.lat, latlng.lng, worldSize),
      minDistance = tileSize * tileSize / 2,
      closestFeature;

    this._collection.features.map(function(feature) {
      var
        radius = (feature.properties.radius || scope.options.radius) * scale,
        p = this._project(feature.geometry.coordinates[1], feature.geometry.coordinates[0], worldSize),
        threshold = radius*radius / 2,
        distance = this._distance(p, pos);

      if (distance <= threshold && distance < minDistance) {
        minDistance = distance;
        closestFeature = feature;
      }
    }.bind(this));

    return closestFeature;
  },

  getBounds: function() {
    var n = -90, e = -80, s = 90, w = 180;
    this._collection.features.map(function(feature) {
      n = Math.max(n, feature.geometry.coordinates[1]);
      e = Math.max(e, feature.geometry.coordinates[0]);
      s = Math.min(s, feature.geometry.coordinates[1]);
      w = Math.min(e, feature.geometry.coordinates[0]);
    });
    return L.latLngBounds(L.latLng(s, w), L.latLng(n, e));
  },

  getData: function() {
    return this._collection;
  }
});

L.CanvasPointLayer.getTarget = function(map, latlng) {
  var layers = [];
  map.eachLayer(function(layer) {
    if (layer instanceof L.CanvasPointLayer) {
      layers.push(layer);
    }
  });
  layers.sort(function(a, b) {
    return a.options.zIndex-b.options.zIndex;
  });

  var feature;
  for (var i = 0; i < layers.length; i++) {
    feature = layers[i].getTarget(latlng);
    if (feature !== undefined) {
      return feature;
    }
  }
};

L.canvasPointLayer = function(collection, options) {
  return new L.CanvasPointLayer(collection, options);
};
