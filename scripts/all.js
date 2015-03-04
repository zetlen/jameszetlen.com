"use strict";

var FontDetect=function(){function e(){if(!n){n=!0;var e=document.body,t=document.body.firstChild,i=document.createElement("div");i.id="fontdetectHelper",r=document.createElement("span"),r.innerText="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",i.appendChild(r),e.insertBefore(i,t),i.style.position="absolute",i.style.visibility="hidden",i.style.top="-200px",i.style.left="-100000px",i.style.width="100000px",i.style.height="200px",i.style.fontSize="100px"}}function t(e,t){return e instanceof Element?window.getComputedStyle(e).getPropertyValue(t):window.jQuery?$(e).css(t):""}var n=!1,i=["serif","sans-serif","monospace","cursive","fantasy"],r=null;return{onFontLoaded:function(t,i,r,o){if(t){var s=o&&o.msInterval?o.msInterval:100,a=o&&o.msTimeout?o.msTimeout:2e3;if(i||r){if(n||e(),this.isFontLoaded(t))return void(i&&i(t));var l=this,f=(new Date).getTime(),d=setInterval(function(){if(l.isFontLoaded(t))return clearInterval(d),void i(t);var e=(new Date).getTime();e-f>a&&(clearInterval(d),r&&r(t))},s)}}},isFontLoaded:function(t){var o=0,s=0;n||e();for(var a=0;a<i.length;++a){if(r.style.fontFamily='"'+t+'",'+i[a],o=r.offsetWidth,a>0&&o!=s)return!1;s=o}return!0},whichFont:function(e){for(var n=t(e,"font-family"),r=n.split(","),o=r.shift();o;){o=o.replace(/^\s*['"]?\s*([^'"]*)\s*['"]?\s*$/,"$1");for(var s=0;s<i.length;s++)if(o==i[s])return o;if(this.isFontLoaded(o))return o;o=r.shift()}return null}}}();

var drawBlivet = (function() {

  function probablyLow(n) {
    return n - Math.floor(Math.log(Math.random() * Math.pow(Math.E, n)));
  }

  function drawEnd(plan, height, width, x, y) {
    var rad = width / 2;
    plan.push(
      ['moveTo', x, y], ['bezierCurveTo', x + rad, y, x + rad, y + height, x, y + height], ['bezierCurveTo', x - rad, y + height, x - rad, y, x, y]
    );
  }

  function runPlan(plan, context, skipSome, ratio) {
    var planToRun = plan.slice(),
      numToRemove;
    if (skipSome) {
      numToRemove = probablyLow(planToRun.length);
      while (numToRemove--) {
        planToRun.splice(Math.floor(Math.random() * planToRun.length), 1);
      }
    }
    planToRun.forEach(function(instruction) {
      var method = instruction[0];
      context[method].apply(context, instruction.slice(1).map(function(v) {
        return v * ratio;
      }));
    });
  }

  var nativeSize = 400;

  var blivetPlan = [

    ['moveTo', 22, 95],
    ['lineTo', 297, 10],
    ['lineTo', 383, 63],
    ['lineTo', 383, 92],
    ['lineTo', 109, 181],

    ['moveTo', 109, 152],
    ['lineTo', 383, 63],

    ['moveTo', 22, 124],
    ['lineTo', 283, 39],
    ['lineTo', 327, 69],
    ['lineTo', 68, 154],

    ['moveTo', 67, 125],
    ['lineTo', 283, 58],
    ['lineTo', 307, 76],

    ['moveTo', 283, 58],
    ['lineTo', 283, 39]

  ];

  drawEnd(blivetPlan, 28.5, 24, 22, 95.5);
  drawEnd(blivetPlan, 28.5, 24, 67, 125.5);
  drawEnd(blivetPlan, 28.5, 24, 109, 152.5);

  return function drawBlivet(canvas, colors, skipSome) {

    var c = canvas.getContext('2d');

    var ratio = canvas.width / nativeSize;

    c.clearRect(0, 0, canvas.width, canvas.height);

    c.strokeStyle = colors.light;
    c.lineWidth = 2;

    c.beginPath();

    runPlan(blivetPlan, c, skipSome, ratio);

    c.stroke();

  };

}());


var drawText = function(canvas, ctx, colors, label) {
  FontDetect.onFontLoaded('Cabin', d, d, 1000);
  function d() {
    ctx.font = label.font;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = colors.light;
    ctx.fillText(label.text, 1, canvas.height - 1);
  }
};

var drawRhombille = (function() {

  var hexHeight,
    hexRadius,
    hexRectangleHeight,
    hexRectangleWidth,
    hexagonAngle = 0.523598776, // 30 degrees in radians
    sideLength = 30;

  hexHeight = Math.sin(hexagonAngle) * sideLength;
  hexRadius = Math.cos(hexagonAngle) * sideLength;
  hexRectangleHeight = sideLength + 2 * hexHeight;
  hexRectangleWidth = 2 * hexRadius;

  function drawBoard(canvasContext, width, height, offsetY) {
    var i,
      j;

    for (i = 0; i < width; ++i) {
      for (j = 0; j < height; ++j) {
        drawHexagon(
          canvasContext,
          i * hexRectangleWidth + ((j % 2) * hexRadius), (j * (sideLength + hexHeight)) + (offsetY || 0)
        );
      }
    }
  }

  function drawHexagon(canvasContext, x, y) {

    canvasContext.beginPath();
    canvasContext.moveTo(x + hexRadius, y);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
    canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
    canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
    canvasContext.lineTo(x, y + sideLength + hexHeight);
    canvasContext.lineTo(x, y + hexHeight);
    canvasContext.closePath();

    canvasContext.stroke();

  }

  return function drawRhombille(canvas, colors, flip, label) {
    var ctx = canvas.getContext('2d');
    var boardWidth = canvas.width,
      boardHeight = canvas.height;
    ctx.lineWidth = 2;
    ctx.strokeStyle = flip ? colors.dark : colors.light;
    drawBoard(ctx, boardWidth, boardHeight);
    ctx.strokeStyle = flip ? colors.light : colors.dark;
    drawBoard(ctx, boardWidth, boardHeight, -sideLength);
    if (flip) drawText(canvas, ctx, colors, label);
  };

}());

var drawOrbison = function(canvas, colors, flip, label) {

  var c = canvas.getContext('2d');
  c.lineWidth = 3;

  var increment = 50;
  var slope = 500;

  var diamondRadius = 120;

    function chevron(c, w, x, h) {
      c.moveTo(x, 0);
      c.lineTo(x + w, h / 2);
      c.lineTo(x, h);
    }

  if (!flip) {
    c.strokeStyle = colors.light;

    c.beginPath();

    for (var i = -slope; i < canvas.width; i += increment) {
      chevron(c, slope, i, canvas.height);
    }

    c.stroke();
  }

  c.strokeStyle = colors.dark;
  c.beginPath();


  c.moveTo(canvas.width / 2, canvas.height / 2 - diamondRadius);
  c.lineTo(canvas.width / 2 + diamondRadius, canvas.height / 2);
  c.lineTo(canvas.width / 2, canvas.height / 2 + diamondRadius);
  c.lineTo(canvas.width / 2 - diamondRadius, canvas.height / 2);
  c.lineTo(canvas.width / 2, canvas.height / 2 - diamondRadius);

  c.stroke();

  if (flip) drawText(canvas, c, colors, label);
};

var drawMullerLyer = function(canvas, colors, flip, label) {
  var c = canvas.getContext('2d');
  c.lineWidth = 3;

  var light = colors.light;
  var dark = colors.dark;

  var lineMargins = [0.3, 0.15];

  var numLines = 3;

  var leading = (canvas.height - (canvas.height * lineMargins[0] * 2)) / (numLines - 1);

  var lineWidth = canvas.width - (canvas.width * lineMargins[1] * 2);

  var arrowLength = (lineWidth * 0.1) / Math.sqrt(2);

  var arrowPatterns = [
    [true, false],
    [false, true],
    [false, false]
  ];

  var x, y;
  for (var i = 0; i < numLines; i++) {
    c.strokeStyle = dark;
    c.beginPath();
    x = canvas.width * lineMargins[1];
    y = canvas.height * lineMargins[0] + (leading * i) - c.lineWidth;
    c.moveTo(x, y);
    c.lineTo(canvas.width - x, y);
    c.closePath();
    c.stroke();

    if (!flip) {
      c.strokeStyle = light;
      c.beginPath();
      drawArrow(arrowPatterns[i][0], x, y);
      drawArrow(arrowPatterns[i][1], canvas.width - x, y);
      c.stroke();
    }

  }

  function drawArrow(left, x, y) {
    var tail = left ? x + arrowLength : x - arrowLength;
    c.moveTo(tail, y - arrowLength);
    c.lineTo(x, y);
    c.lineTo(tail, y + arrowLength);
  }

  if (flip) drawText(canvas, c, colors, label);
};

var drawSander = function(canvas, colors, flip, label) {
  var c = canvas.getContext('2d');
  c.lineWidth = 3;

  var lean = 60;
  var height = 80;

  var length = canvas.width - lean * 2;

  var canvasHeight = (canvas.height + height) / 2;

  c.strokeStyle = colors.dark;
  c.moveTo(lean, canvasHeight - height);
  c.lineTo(length, canvasHeight);
  c.lineTo(canvas.width, canvasHeight - height);
  c.stroke();

  if (!flip) {
    c.strokeStyle = colors.light;
    c.beginPath();
    c.moveTo(1, canvasHeight);
    c.lineTo(lean, canvasHeight - height);
    c.lineTo(canvas.width, canvasHeight - height);
    c.lineTo(canvas.width - lean, canvasHeight);
    c.lineTo(1, canvasHeight);
    c.moveTo(length, canvasHeight);
    c.lineTo(length + lean, canvasHeight - height);
    c.stroke();
  }

  if (flip) drawText(canvas, c, colors, label);

};

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var colors = {
  dark: '#510f00',
  light: '#956233',
  verylight: '#fff9ed'
};

function getCanvasLoader(canvas) {
  return ({
    'orbison': drawOrbison,
    'rhombille': drawRhombille,
    'muller-lyer': drawMullerLyer,
    'sander': drawSander
  })[canvas.id];
}

ready(function() {

  var computedStyle = window.getComputedStyle(document.querySelector('h1'));
  var font = computedStyle.fontSize + " " + computedStyle.fontFamily;

  var blivetCanvas = document.getElementById('blivet');

  function wiggleBlivet() {
    drawBlivet(blivetCanvas, colors, true);
  }

  function unwiggleBlivet() {
    drawBlivet(blivetCanvas, colors, false);
  }

  [].slice.call(document.querySelectorAll('a')).forEach(function(anchor) {
    anchor.addEventListener('mouseover', wiggleBlivet);
    anchor.addEventListener('mouseout', unwiggleBlivet);
  });

  unwiggleBlivet();

  [].slice.call(document.querySelectorAll('.treachery > ul > li > a')).forEach(function(anchor) {
    var text = anchor.querySelector('span').textContent.toUpperCase();
    var canvas = anchor.querySelector('canvas');
    var loadCanvas = getCanvasLoader(canvas);


    loadCanvas(canvas, colors, false, {
      font: font,
      text: text
    });

    var flippedCanvas = canvas.cloneNode();
    flippedCanvas.id = canvas.id + '_flipped';
    flippedCanvas.style.display = "none";
    canvas.parentNode.appendChild(flippedCanvas);
    loadCanvas(flippedCanvas, colors, true, {
      font: font,
      text: text
    });

    anchor.addEventListener('mouseover', function() {
      canvas.style.display = "none";
      flippedCanvas.style.display = "block";
    });

    anchor.addEventListener('mouseout', function() {
      canvas.style.display = "block";
      flippedCanvas.style.display = "none";
    });

  });

});