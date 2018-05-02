
function loadA(callback) {
  Papa.parse({
    complete: function(resFromPapa) {
      callback(resFromPapa);
    }
  });
}

function loadB(callback) {
  Papa.parse({
    complete: function(resFromPapa) {
      callback(resFromPapa);
    }
  });
}

function loadC(callback) {
  Papa.parse({
    complete: function(resFromPapa) {
      callback(resFromPapa);
    }
  });
}

// wait for all
var remaining = 0;
var resAFromPapa, resBFromPapa, resCFromPapa;

remaining++;
loadA(function(resA) {
  resAFromPapa = resA;
  remaining--;
  if (!remaining) {
    mixData(resAFromPapa, resBFromPapa, resCFromPapa);
  }
});

remaining++;
loadB(function(resB) {
  resBFromPapa = resB;
  remaining--;
  if (!remaining) {
    mixData(resAFromPapa, resBFromPapa, resCFromPapa);
  }
});

remaining++;
loadC(function(resC) {
  resCFromPapa = resC;
  remaining--;
  if (!remaining) {
    mixData(resAFromPapa, resBFromPapa, resCFromPapa);
  }
});


function mixData(resAFromPapa, resBFromPapa, resCFromPapa) {
  // mix
}