
// requires Color.js
var Color=function(){function a(a,b,c){return 0>c&&(c+=1),c>1&&(c-=1),1/6>c?a+6*(b-a)*c:.5>c?b:2/3>c?a+(b-a)*(2/3-c)*6:a}function b(a,b){return void 0!==a?Math.min(b,Math.max(0,a||0)):void 0}var c={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},d=function(a,c,d,e){this.r=b(a,1),this.g=b(c,1),this.b=b(d,1),this.a=b(e,1)||1};return d.parse=function(a){if("string"==typeof a){a=a.toLowerCase(),a=c[a]||a;var b;if(b=a.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/))return 1===b[1].length&&(b[1]=b[1]+b[1]),1===b[2].length&&(b[2]=b[2]+b[2]),1===b[3].length&&(b[3]=b[3]+b[3]),new d(parseInt(b[1],16)/255,parseInt(b[2],16)/255,parseInt(b[3],16)/255);if(b=a.match(/rgba?\((\d+)\D+(\d+)\D+(\d+)(\D+([\d.]+))?\)/))return new d(parseFloat(b[1])/255,parseFloat(b[2])/255,parseFloat(b[3])/255,b[4]?parseFloat(b[5]):1)}return new d},d.fromHSL=function(b,c,e,f){if(0===c)return new d(e,e,e,f);var g=.5>e?e*(1+c):e+c-e*c,h=2*e-g;return b/=360,new d(a(h,g,b+1/3),a(h,g,b),a(h,g,b-1/3),f)},d.prototype={toHSL:function(){if(void 0!==this.r&&void 0!==this.g&&void 0!==this.b){var a,b,c=Math.max(this.r,this.g,this.b),d=Math.min(this.r,this.g,this.b),e=(c+d)/2,f=c-d;if(f){switch(b=e>.5?f/(2-c-d):f/(c+d),c){case this.r:a=(this.g-this.b)/f+(this.g<this.b?6:0);break;case this.g:a=(this.b-this.r)/f+2;break;case this.b:a=(this.r-this.g)/f+4}a*=60}else a=b=0;return{h:a,s:b,l:e,a:this.a}}},toString:function(){return void 0!==this.r&&void 0!==this.g&&void 0!==this.b?1===this.a?"#"+((1<<24)+(Math.round(255*this.r)<<16)+(Math.round(255*this.g)<<8)+Math.round(255*this.b)).toString(16).slice(1,7):"rgba("+[Math.round(255*this.r),Math.round(255*this.g),Math.round(255*this.b),this.a.toFixed(2)].join(",")+")":void 0},toArray:function(){return void 0!==this.r&&void 0!==this.g&&void 0!==this.b?[this.r,this.g,this.b]:void 0},hue:function(a){var b=this.toHSL();return d.fromHSL(b.h+a,b.s,b.l)},saturation:function(a){var b=this.toHSL();return d.fromHSL(b.h,b.s*a,b.l)},lightness:function(a){var b=this.toHSL();return d.fromHSL(b.h,b.s,b.l*a)},red:function(a){return new d(this.r*a,this.g,this.b,this.a)},green:function(a){return new d(this.r,this.g*a,this.b,this.a)},blue:function(a){return new d(this.r,this.g,this.b*a,this.a)},alpha:function(a){return new d(this.r,this.g,this.b,this.a*a)},copy:function(){return new d(this.r,this.g,this.b,this.a)}},d}();"object"==typeof module&&(module.exports=Color);
 
(function() {
 
  function createContext(size) {
    var canvas = document.createElement('CANVAS');
    canvas.width = size.x;
    canvas.height = size.y;
 
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    // context.mozImageSmoothingEnabled = false;
    // context.webkitImageSmoothingEnabled = false;
    // canvas.style.imageRendering = 'optimize-speed';
    // canvas.style.imageRendering = '-moz-crisp-edges';
    // canvas.style.imageRendering = '-webkit-optimize-contrast';
    canvas.style.imageRendering = 'pixelated';
    // canvas.style.imageRendering = 'nearest-neighbor'; // IE
 
    return context;
  }
 
  function getTranslation(map) {
    var str = map._mapPane.style.transform;
    str = str.replace(/^translate3d\(|\)$/g, '');
 
    var xyz = str.split(',');
    return [ parseFloat(xyz[0]), parseFloat(xyz[1]), parseFloat(xyz[2]) ];
  }
 
  L.GetImage = function(map, callback) {
    this.map = map;
    this.callback = callback;
    this.getAssets();
  };
 
  L.GetImage.prototype.getAssets = function() {
    this.mapOffset = this.map._container.getBoundingClientRect();
    this.mapTranslation = getTranslation(this.map);
    this.assets = [];
    this.sort = 0;
    this.remaining = 0;
 
    var layer;
    for (var layerId in this.map._layers) {
      layer = this.map._layers[layerId];

      if (layer._icon) {
        if (layer._icon.tagName === 'IMG'){
          if (layer._shadow) {
            this.loadImage(layer._shadow);
          }
          this.loadImage(layer._icon);
        } else if (layer._icon.tagName === 'DIV') {
          this.htmlToImage(layer._icon);
        }
      }
 
      if (layer._tiles) {
        var tiles = layer._tiles;
        for (var tileId in tiles) {
          if (tiles[tileId].nodeName === 'IMG') {
            this.loadImage(tiles[tileId]);
          }
 
          if (tiles[tileId].nodeName === 'CANVAS') {
            var sort = this.sort++;
            var bounds = tiles[tileId].getBoundingClientRect();
            var pos = {
              x: bounds.left - this.mapOffset.left,
              y: bounds.top - this.mapOffset.top,
              w: bounds.width,
              h: bounds.height
            };
            this.assets.push({ type: 'canvas', canvas: tiles[tileId], pos: pos, sort: sort });
          }
        }
      }
 
      if (layer._path) {
        // var svg = layer._path.ownerSVGElement;
        var strokeColor = Color.parse(layer.options.color);
        strokeColor.a = layer.options.opacity || 1;
 
        var fillColor = Color.parse(layer.options.fillColor || layer.options.color);
        fillColor.a = layer.options.fillOpacity || 1;
 
        var style = {};
 
        if (layer.options.stroke) {
          style.stroke = strokeColor.toString();
        }
 
        if (layer.options.fill) {
          style.fill = fillColor.toString();
        }
 
        style.lineWidth = layer.options.weight;
        // lineCap
        // lineJoin
 
        // circle marker
        if (layer._radius) {
          var center = [
            layer._point.x + this.mapTranslation[0],
            layer._point.y + this.mapTranslation[1]
          ];

          this.assets.push({
            type: 'geometry',
            geometry: { type: 'circle', center: center, radius: layer._radius },
            style: style,
            sort: this.sort++
          });
        }
 
        // polygon
        if (layer._parts) {
          var mapTranslation = this.mapTranslation;
          var polygon = layer._parts.map(function(ring) {
            return ring.map(function(point) {
              return [
                point.x + mapTranslation[0],
                point.y + mapTranslation[1]
              ]
            })
          });

          this.assets.push({
            type: 'geometry',
            geometry: { type: 'polygon', polygon: polygon },
            style: style,
            sort: this.sort++
          });
        }
      }
    }
  };
 
  L.GetImage.prototype.loadImage = function(item) {
    this.remaining++;
    var image = new Image;
    var sort = this.sort++;
 
    image.onload = function() {
      this.remaining--;
 
      var bounds = item.getBoundingClientRect();
      var pos = {
        x: bounds.left - this.mapOffset.left,
        y: bounds.top - this.mapOffset.top,
        w: bounds.width,
        h: bounds.height
      };
      this.assets.push({ type: 'image', image: image, pos: pos, sort: sort });
      if (this.remaining === 0) {
        this.complete();
      }
    }.bind(this);
 
    image.onerror = function() {
      this.remaining--;
      if (this.remaining === 0) {
        this.complete();
      }
    }.bind(this);
 
    image.crossOrigin = '';
    image.src = item.src;
  };

  L.GetImage.prototype.htmlToImage = function(item) {
    this.remaining++;
    var sort = this.sort++;

    var bounds = item.getBoundingClientRect();
    var pos = {
      x: bounds.left - this.mapOffset.left,
      y: bounds.top - this.mapOffset.top,
      w: bounds.width,
      h: bounds.height
    };

    html2canvas(item, { async: false }).then(function(canvas) {
      this.assets.push({ type: 'image', image: canvas, pos: pos, sort: sort });
      this.remaining--;
      if (this.remaining === 0) {
        this.complete();
      }
    }.bind(this));
  };

  L.GetImage.prototype.complete = function() {
    this.assets.sort(function(a, b) {
      return a.sort - b.sort;
    });
    this.draw();
  };
 
  L.GetImage.prototype.draw = function() {
    var context = createContext(this.map.getSize());
 
    this.assets.map(function(item) {
      if (item.type === 'image') {
        context.drawImage(item.image, item.pos.x, item.pos.y, item.pos.w, item.pos.h);
      }
 
      if (item.type === 'canvas') {
        context.drawImage(item.canvas, item.pos.x, item.pos.y, item.pos.w, item.pos.h);
      }
 
      if (item.type === 'svg') {
      }
 
      if (item.type === 'geometry' && item.style) {
        context.lineWidth = item.style.lineWidth || 1;
        context.lineJoin = 'round';
 
        // lineCap
        // lineJoin
 
        var radius = item.geometry.radius;
        var center = item.geometry.center;
 
        context.beginPath();
 
        if (item.geometry.type === 'circle') {
          // context.arc(center[0] - radius/2, center[1] - radius/2, radius, 0, Math.PI*2);
          context.arc(center[0], center[1], radius, 0, Math.PI*2);
        }
 
        if (item.geometry.type === 'polygon') {
          item.geometry.polygon.map(function(ring) {
            context.moveTo(ring[0][0], ring[0][1]);
            for (var i = 1; i<ring.length; i++) {
              context.lineTo(ring[i][0], ring[i][1]);
            }
          });
        }
 
        context.closePath();
 
        if (item.style.fill) {
          context.fillStyle = item.style.fill;
          context.fill();
        }
 
        if (item.style.stroke) {
          context.strokeStyle = item.style.stroke;
          context.stroke();
        }
      }
    });
 
    this.callback(context.canvas);
  };
}());
 
L.getImage = function(map, callback) {
  return new L.GetImage(map, callback);
};