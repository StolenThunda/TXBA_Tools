var theDrawing;
var theFretboard;
var theHeadstock;
var theBody;
var theDots = [];
var theSideDots = [];
var theFrets = [];
var notes = [];
var fretMarkers = [];
var xoffsets = [];
var yoffsets = [];
var theStrings = [];
var theGuides = [];
var allShapes;
var allNotes;
var allMarkers;
var allStrings;
var allDots;
var allFrets;
var xScaleSlider;
var yScaleSlider;
var zScaleSlider;
var xRotationSlider;
var yRotationSlider;
var zRotationSlider;
var xTranslateSlider;
var yTranslateSlider;
var zTranslateSlider;
var xSkewSlider;
var ySkewSlider;
var perspectiveSlider;
var fretGradient;
var boxShadow;
var thePanZoom;
var CORNEROFFSET = 10;

const ESTRING1 = 0;
const BSTRING = 1;
const GSTRING = 2;
const DSTRING = 3;
const ASTRING = 4;
const ESTRING2 = 5;


var FRETWIDTH = 10;
var PAD = 25;
var NOTERADIUS = 15;
var NOTECOLOR = '#fff';
var NOTESTROKE = 'none';
var BOXPADDING = 20;
var MAJORNOTE = "#0FF";
var MINORNOTE = "#F55";

var CORNERRADIUS = "A20,20 0 0 1 ";
var SHAPEFILL = { color: '#777777', opacity: .3 };
var SHAPESTROKE = { color: '#aaaaaa', width: 2.0 };

var CHORDI = "#0099ff";
var CHORDIV = "#FFEF00";
var CHORDV = "#FF0000";
var MAJOR = "#3bc33b";
var MINOR = "#a01404";
var CHORDOPACITY = .4;

var STRINGFILL = "#555";
var FRETBOARDFILL = "https://txba-media.s3.us-east-1.amazonaws.com/misc/RosewoodTexture.jpg";//"#222";
var HEADSTOCKFILL = "https://txba-media.s3.us-east-1.amazonaws.com/misc/LayeredMaple.jpg";
var BODYFILL = "https://txba-media.s3.us-east-1.amazonaws.com/misc/DarkWood.jpg";


var keyLimits = [
  [4, 11, 3, 8], //E
  [4, 11, 3, 7], //F
  [4, 11, 2, 7], //Gb
  [3, 10, 2, 7], //G
  [3, 10, 2, 6], //Ab
  [2, 9, 1, 6], //A 
  [2, 9, 1, 5], //Bb
  [1, 8, 1, 5], //B
  [1, 8, 1, 5], //C
  [0, 11, 0, 4], //Db
  [0, 10, 0, 4], //D
  [0, 10, 0, 4] //Eb
];
$( document ).ready( function () {

  $( document ).foundation();
  new FastClick( document.body );

  theDrawing = SVG( '#fretboard-wrapper' );

  theBody = theDrawing.path( "M2832.6,721.7 C2744.0,725.3 2674.1,735.3 2623.1,751.7 C2546.6,776.2 2299.6,869.2 2178.5,877.7 C2060.6,886.0 1892.3,886.0 1821.0,786.2 C1783.5,733.7 1782.0,696.6 1806.0,670.1 C1830.0,643.6 1953.5,647.6 2025.5,624.6 C2097.5,601.6 2173.0,515.6 2186.5,451.1 C2200.0,386.6 2186.3,340.7 2145.0,309.5 C2078.0,258.8 2070.2,157.7 2121.5,15.9 C2203.8,12.3 2278.7,10.4 2346.1,10.4 C2379.6,10.4 2428.1,-109.1 2420.6,-167.6 C2413.1,-226.1 2386.6,-301.2 2306.1,-341.7 C2225.5,-382.2 2114.5,-352.2 2097.5,-437.2 C2083.9,-505.3 2161.0,-544.7 2248.1,-568.7 C2335.1,-592.7 2439.6,-571.2 2540.1,-539.2 C2640.6,-507.2 2751.5,-445.2 2828.6,-445.2 C2832.4,-445.2 2833.7,-56.2 2832.6,721.7 Z" );
  theBody.fill( BODYFILL );
  theBody.stroke( { width: 3, color: '#555' } );

  theHeadstock = theDrawing.path( "M1.0,50.5 C-65.5,45.2 -111.3,36.9 -136.2, 25.6 C-173.6, 8.6 -209.1, -25.5 -223.0, -52.0 C-232.4, -69.7 -240.3, -81.3 -247.0,-87.0 L -246.0,326.2 L -147.2, 356.2 C-134.6, 361.3 -121.4, 361.3 -107.8, 356.2 C-87.3, 348.7 -68.4, 312.4 -44.4, 291.7 C-28.4, 277.9 -13.3, 270.0 1.0, 268.0 L 1.0, 50.5 Z" );
  theHeadstock.fill( HEADSTOCKFILL );
  theHeadstock.stroke( { width: 3, color: '#555' } );

  theFretboard = theDrawing.path( 'M3,51.955	L2455.262,3	C2468.431,4.1024	2478.30815,7.96089385	2484.89264,14.575419	C2494.76938,24.4972067	2503,107.178771	2503,151	C2503,194.821229	2494.76938,275.849162	2484.89264,287.424581	C2478.30815,295.141527	2468.43141,299	2455.26243,299	L3.64612326,266.581006	L3,51.9553073	Z' );
  theFretboard.fill( FRETBOARDFILL );
  theFretboard.stroke( { width: 3, color: '#444' } );

  theFretboard.front();


  theFretboard.filterWith( function ( add ) {
    var blur = add.offset( 10, 10 ).in( add.sourceAlpha ).gaussianBlur( 15 )
    add.blend( add.source, blur )
    this.size( '200%', '200%' ).move( '-50%', '-50%' )
  } )


  fretGradient = theDrawing.gradient( 'linear', function ( add ) {
    add.stop( 0, '#333' )
    add.stop( .5, '#444' )
    add.stop( 1, '#222' )
  } );


  /*
  boxShadow = new SVG.Filter();
  boxShadow.offset(5, 5).gaussianBlur(3);
  boxShadow.blend(boxShadow.source, blur);
  boxShadow.size('200%','200%').move('-50%', '-50%');
  */



  createDots();
  createFrets();
  createFretMarkers();
  createStrings();
  createNotes();
  computeNoteBoxes();
  computeOffsets();
  //setupSliders();

  allDots.front();
  allMarkers.front();
  allStrings.front();
  allNotes.front();

  allShapes = theDrawing.group();

  resetFretboard();

  $( "select#keyFilter" ).change( function () { processKeyChange(); } );

  $( "input[type=checkbox]" ).change( function () { updateFretboard(); } );


  var area = document.querySelector( '#fretboard-zoom-wrapper' )
  // And pass it to panzoom
  thePanZoom = panzoom( area, {
    maxZoom: 1.5,
    minZoom: 0.3
  } );

  processKeyChange();
} );


function processKeyChange () {
  let theKey = $( 'select#keyFilter' ).val();
  let theLimits = keyLimits[theKey];

  let theBoxFilters = $( "#boxFilters input" );
  for ( let i = 0; i < theBoxFilters.length; i++ ) {
    if ( i < theLimits[0] || i > theLimits[1] ) {
      $( theBoxFilters[i] ).prop( 'checked', false );
      $( theBoxFilters[i] ).next().toggle( false );
    }
    else { $( theBoxFilters[i] ).next().toggle( true ); }
  }
  let thePatternFilters = $( "#patternFilters input" );

  for ( let i = 0; i < thePatternFilters.length; i++ ) {
    if ( i < theLimits[2] || i > theLimits[3] ) {
      $( thePatternFilters[i] ).prop( 'checked', false );
      $( thePatternFilters[i] ).next().toggle( false );
    }
    else { $( thePatternFilters[i] ).next().toggle( true ); }
  }
  updateFretboard();
}




function updateFretboard () {
  resetFretboard();
  rootFret = parseInt( $( 'select[name=key]' ).val() );


  let theInputs = $( 'input[type="checkbox"]:checked' );
  let theShapes = [];
  for ( let i = 0; i < theInputs.length; i++ ) {
    let newShape = {};
    newShape.shapeType = $( theInputs[i] ).data( 'shape-type' );
    newShape.rootOffset = $( theInputs[i] ).data( 'root-offset' );
    newShape.position = $( theInputs[i] ).data( 'position' );
    theShapes.push( newShape );
  }

  drawFretMarker( rootFret - 7, CHORDIV );
  drawFretMarker( rootFret - 5, CHORDV );
  drawFretMarker( rootFret, CHORDI );
  drawFretMarker( rootFret + 5, CHORDIV );
  drawFretMarker( rootFret + 7, CHORDV );
  drawFretMarker( rootFret + 12, CHORDI );
  drawFretMarker( rootFret + 17, CHORDIV );
  drawFretMarker( rootFret + 19, CHORDV );

  for ( let i = 0; i < theShapes.length; i++ ) {
    let theShape = theShapes[i];
    switch ( theShape.shapeType ) {
      case "box1":
        drawBox1( rootFret + theShape.rootOffset, theShape.position );
        break;
      case "box2":
        drawBox2( rootFret + theShape.rootOffset, theShape.position );
        break;
      case "box4":
        drawBox4( rootFret + theShape.rootOffset );
        break;
      case "backdoor1":
        drawBackdoorPattern1( rootFret + theShape.rootOffset, theShape.position );
        break;
      case "backdoor2":
        drawBackdoorPattern2( rootFret + theShape.rootOffset, theShape.position );
        break;
    }
  }



  if ( $( 'input#majorScale' ).prop( 'checked' ) ) {
    drawMajorScale( rootFret );
  }
  if ( $( 'input#majorPentatonic' ).prop( 'checked' ) ) {
    drawMajorPentatonic( rootFret );
  }
  if ( $( 'input#minorScale' ).prop( 'checked' ) ) {
    drawMinorScale( rootFret );
  }
  if ( $( 'input#minorPentatonic' ).prop( 'checked' ) ) {
    drawMinorPentatonic( rootFret );
  }


  if ( $( 'input#root1Notes' ).prop( 'checked' ) ) {
    drawRootNotes( rootFret, 1, false );
  }
  if ( $( 'input#root4Notes' ).prop( 'checked' ) ) {
    drawRootNotes( rootFret, 4, false );
  }
  if ( $( 'input#root5Notes' ).prop( 'checked' ) ) {
    drawRootNotes( rootFret, 5, false );
  }


  allShapes.filterWith( function ( add ) {
    var blur = add.offset( 5, 5 ).in( add.sourceAlpha ).gaussianBlur( 5 );
    add.blend( add.source, blur );
    this.size( '200%', '200%' ).move( '-50%', '-50%' )
  } );
  allNotes.front();

  allNotes.filterWith( function ( add ) {
    var blur = add.offset( 2, 2 ).in( add.sourceAlpha ).gaussianBlur( 2 );
    add.blend( add.source, blur );
    this.size( '200%', '200%' ).move( '-50%', '-50%' )
  } );

}


function resetSliders () {
  xRotationSlider.noUiSlider.set( 0 );
  yRotationSlider.noUiSlider.set( 0 );
  zRotationSlider.noUiSlider.set( 0 );
  xSkewSlider.noUiSlider.set( 0 );
  ySkewSlider.noUiSlider.set( 0 );

}



function drawBox1 ( fret, chordInterval ) {
  var theFret = parseInt( fret );

  if ( fret < 0 || fret > 18 ) { return; }

  showNote( theFret, ESTRING1 );
  showNote( theFret, BSTRING );
  showNote( theFret, GSTRING );
  showNote( theFret, DSTRING );
  showNote( theFret, ASTRING );
  showNote( theFret, ESTRING2 );
  showNote( theFret + 3, ESTRING1 );
  showNote( theFret + 3, BSTRING );
  showNote( theFret + 2, GSTRING );
  showNote( theFret + 2, DSTRING );
  showNote( theFret + 2, ASTRING );
  showNote( theFret + 3, ESTRING2 );

  var data = {
    name: 'Box 1',
    points: [['M', 0, 0, 1],
    ['L', 3, 0, 1],
    ['R', 3, 0, 3],
    ['L', 3, 1, 3],
    ['R', 3, 1, 5],
    ['L', 2, 2, 2],
    ['L', 2, 4, 4],
    ['L', 3, 5, 1],
    ['R', 3, 5, 3],
    ['R', 3, 5, 5],
    ['L', 0, 5, 5],
    ['R', 0, 5, 7],
    ['L', 0, 0, 7],
    ['R', 0, 0, 1]],
    extras: [{
      name: "Major Notes",
      class: "major",
      notes: [[2, 0],
      [2, 1],
      [1, 2]]
    },
    {
      name: "Minor Notes",
      class: "minor",
      notes: [[-1, 2],
      [1, 1]]
    }
    ]
  };

  drawShape( fret, data.points );



}
function drawBox2 ( fret, chordInterval ) {
  //	//console.log('Drawing box 2 at ' + fret );
  theFret = parseInt( fret );
  if ( fret < 0 || fret > 19 ) { return; }

  showNote( theFret, ESTRING1 );
  showNote( theFret, BSTRING );
  showNote( theFret + 1, GSTRING );
  showNote( theFret + 2, ESTRING1 );
  showNote( theFret + 2, BSTRING );


  var note1 = notes[theFret][ESTRING1];
  var note2 = notes[theFret + 2][ESTRING1];
  var note3 = notes[theFret + 2][BSTRING];
  var note4 = notes[theFret + 1][GSTRING];
  var note5 = notes[theFret][BSTRING];


  //Mark the start point
  var polygonString = "M" + addPointToString( note1.box[1].x, note1.box[1].y );
  polygonString += "L" + addPointToString( note2.box[1].x, note2.box[1].y );
  polygonString += CORNERRADIUS + addPointToString( note2.box[3].x, note2.box[3].y );
  polygonString += "L" + addPointToString( note3.box[3].x, note3.box[3].y );
  polygonString += CORNERRADIUS + addPointToString( note3.box[5].x, note3.box[5].y );
  polygonString += "L" + addPointToString( note4.box[2].x, note4.box[2].y );
  polygonString += "L" + addPointToString( note4.box[3].x, note4.box[3].y );
  polygonString += CORNERRADIUS + addPointToString( note4.box[5].x, note4.box[5].y );
  polygonString += CORNERRADIUS + addPointToString( note4.box[7].x, note4.box[7].y );
  polygonString += "L" + addPointToString( note4.box[0].x, note4.box[0].y );
  polygonString += "L" + addPointToString( note5.box[5].x, note5.box[5].y );
  polygonString += CORNERRADIUS + addPointToString( note5.box[7].x, note5.box[7].y );
  polygonString += "L" + addPointToString( note1.box[7].x, note1.box[7].y );
  polygonString += CORNERRADIUS + addPointToString( note1.box[1].x, note1.box[1].y );
  polygonString += "Z";

  var data = {
    name: 'Box 2',
    points: [['M', 0, 0, 1],
    ['L', 2, 0, 1],
    ['R', 2, 0, 3],
    ['L', 2, 1, 3],
    ['R', 2, 1, 5],
    ['L', 1, 2, 2],
    ['L', 1, 2, 3],
    ['R', 1, 2, 5],
    ['R', 1, 2, 7],
    ['L', 1, 2, 0],
    ['L', 0, 1, 5],
    ['R', 0, 1, 7],
    ['L', 0, 0, 7],
    ['R', 0, 0, 1]
    ]
  };

  drawShape( fret, data.points );

}

function drawBox3 ( fret ) {
  drawBox2( fret, 3 );
}


function drawBox4 ( fret ) {
  //console.log('Drawing box 4 at ' + fret );
  theFret = parseInt( fret );
  if ( fret < 0 || fret > 18 ) { return; }

  showNote( theFret, ESTRING1 );
  showNote( theFret + 3, ESTRING1 );
  showNote( theFret + 1, BSTRING );
  showNote( theFret + 3, BSTRING );
  showNote( theFret + 2, GSTRING );

  var data = {
    name: 'Box 2',
    points: [['M', 0, 0, 1],
    ['L', 3, 0, 1],
    ['R', 3, 0, 3],
    ['L', 3, 1, 3],
    ['R', 3, 1, 5],
    ['L', 2, 2, 2],
    ['L', 2, 2, 3],
    ['R', 2, 2, 5],
    ['R', 2, 2, 7],
    ['L', 2, 2, 0],
    ['L', 1, 1, 5],
    ['R', 1, 1, 7],
    ['L', 1, 1, 0],
    ['L', 0, 0, 5],
    ['R', 0, 0, 7],
    ['R', 0, 0, 1]
    ]
  };

  drawShape( fret, data.points );

}

function drawBox5 ( fret ) {
  //console.log('Drawing box 5 at ' + fret );
  drawBox1( fret );
}

function drawBackdoorPattern1 ( fret, shapePosition ) {
  theFret = parseInt( fret );
  if ( fret < 0 || fret > 14 ) { return; }
  showNote( theFret, ESTRING2 );
  showNote( theFret + 2, ESTRING2 );
  showNote( theFret + 4, ESTRING2 );
  showNote( theFret + 2, ASTRING );
  showNote( theFret + 4, ASTRING );
  showNote( theFret + 2, DSTRING );
  showNote( theFret + 4, DSTRING );
  showNote( theFret + 6, DSTRING );
  showNote( theFret + 4, GSTRING );
  showNote( theFret + 6, GSTRING );
  showNote( theFret + 5, BSTRING );

  var data = {
    name: 'Backdoor Pattern (1)',
    points: [['M', 0, 5, 1],
    ['L', 2, 5, 0],
    ['L', 2, 3, 7],
    ['R', 2, 3, 1],
    ['L', 4, 3, 0],
    ['L', 4, 2, 7],
    ['R', 4, 2, 1],
    ['L', 5, 1, 6],
    ['L', 5, 1, 7],
    ['R', 5, 1, 1],
    ['R', 5, 1, 3],
    ['L', 5, 1, 4],
    ['L', 6, 2, 1],
    ['R', 6, 2, 3],
    ['L', 6, 3, 3],
    ['R', 6, 3, 5],
    ['L', 4, 4, 2],
    ['L', 4, 5, 3],
    ['R', 4, 5, 5],
    ['L', 0, 5, 5],
    ['R', 0, 5, 7],
    ['R', 0, 5, 1]
    ]
  };

  drawShape( fret, data.points );


}

function drawBackdoorPattern2 ( fret, shapePosition ) {
  theFret = parseInt( fret );
  if ( fret < 0 || fret > 15 ) { return; }

  showNote( theFret, ESTRING2 );
  showNote( theFret + 2, ESTRING2 );
  showNote( theFret, ASTRING );
  showNote( theFret + 2, ASTRING );
  showNote( theFret + 4, ASTRING );
  showNote( theFret + 2, DSTRING );
  showNote( theFret + 4, DSTRING );
  showNote( theFret + 2, GSTRING );
  showNote( theFret + 4, GSTRING );
  showNote( theFret + 6, GSTRING );
  showNote( theFret + 5, BSTRING );


  var note1 = notes[theFret][ESTRING2];
  var note2 = notes[theFret][ASTRING];
  var note3 = notes[theFret + 2][DSTRING];
  var note4 = notes[theFret + 2][GSTRING];
  var note5 = notes[theFret + 5][BSTRING];
  var note6 = notes[theFret + 6][GSTRING];
  var note7 = notes[theFret + 4][DSTRING];
  var note8 = notes[theFret + 4][ASTRING];
  var note9 = notes[theFret + 2][ESTRING2];


  var polygonString = "M" + addPointToString( note1.box[7].x, note1.box[7].y );
  polygonString += "L" + addPointToString( note2.box[7].x, note2.box[7].y );
  polygonString += CORNERRADIUS + addPointToString( note2.box[1].x, note2.box[1].y );
  polygonString += "L" + addPointToString( note3.box[6].x, note3.box[6].y );
  polygonString += "L" + addPointToString( note4.box[7].x, note4.box[7].y );
  polygonString += CORNERRADIUS + addPointToString( note4.box[1].x, note4.box[1].y );
  polygonString += "L" + addPointToString( note5.box[6].x, note5.box[6].y );
  polygonString += "L" + addPointToString( note5.box[7].x, note5.box[7].y );
  polygonString += CORNERRADIUS + addPointToString( note5.box[1].x, note5.box[1].y );
  polygonString += CORNERRADIUS + addPointToString( note5.box[3].x, note5.box[3].y );
  polygonString += "L" + addPointToString( note5.box[4].x, note5.box[4].y );
  polygonString += "L" + addPointToString( note6.box[1].x, note6.box[1].y );
  polygonString += CORNERRADIUS + addPointToString( note6.box[3].x, note6.box[3].y );
  polygonString += CORNERRADIUS + addPointToString( note6.box[5].x, note6.box[5].y );

  polygonString += "L" + addPointToString( note7.box[2].x, note7.box[2].y );
  polygonString += "L" + addPointToString( note8.box[3].x, note8.box[3].y );
  polygonString += CORNERRADIUS + addPointToString( note8.box[5].x, note8.box[5].y );

  polygonString += "L" + addPointToString( note9.box[2].x, note9.box[2].y );
  polygonString += "L" + addPointToString( note9.box[3].x, note9.box[3].y );
  polygonString += CORNERRADIUS + addPointToString( note9.box[5].x, note9.box[5].y );

  polygonString += "L" + addPointToString( note1.box[5].x, note1.box[5].y );
  polygonString += CORNERRADIUS + addPointToString( note1.box[7].x, note1.box[7].y );

  polygonString += "Z";

  var theBox = allShapes.path( polygonString ).fill( SHAPEFILL ).stroke( SHAPESTROKE );

}


function showNote ( fret, string, strType ) {
  if ( fret < 0 || fret > 21 ) { return; }
  notes[fret][string].svgElement.show();

  if ( strType !== undefined ) { notes[fret][string].svgElement.fill( strType ); }
  else { notes[fret][string].svgElement.fill( NOTECOLOR ); }
}

function drawBoxes ( fret ) {
  drawBox1( fret );
  drawBox2( fret + 3 );
  drawBox3( fret + 5 );
  drawBox4( fret + 7 );
  drawBox5( fret + 9 );
}

function drawRootNotes ( nRootFret, nScaleDegree, bMinor ) {
  if ( !bMinor ) {
    switch ( nScaleDegree ) {
      case 1:

        showNote( nRootFret, ESTRING1, CHORDI );
        showNote( nRootFret + 12, ESTRING1, CHORDI );

        showNote( nRootFret + 5, BSTRING, CHORDI );
        showNote( nRootFret + 17, BSTRING, CHORDI );

        showNote( nRootFret + 9, GSTRING, CHORDI );
        showNote( nRootFret + 21, GSTRING, CHORDI );
        showNote( nRootFret - 3, GSTRING, CHORDI );

        showNote( nRootFret + 2, DSTRING, CHORDI );
        showNote( nRootFret + 14, DSTRING, CHORDI );
        showNote( nRootFret - 10, DSTRING, CHORDI );

        showNote( nRootFret + 7, ASTRING, CHORDI );
        showNote( nRootFret + 19, ASTRING, CHORDI );
        showNote( nRootFret - 5, ASTRING, CHORDI );

        showNote( nRootFret, ESTRING2, CHORDI );
        showNote( nRootFret + 12, ESTRING2, CHORDI );

        break;
      case 4:

        showNote( nRootFret + 5, ESTRING1, CHORDIV );
        showNote( nRootFret + 17, ESTRING1, CHORDIV );
        showNote( nRootFret - 7, ESTRING1, CHORDIV );

        showNote( nRootFret + 10, BSTRING, CHORDIV );
        showNote( nRootFret + 22, BSTRING, CHORDIV );
        showNote( nRootFret - 2, BSTRING, CHORDIV );

        showNote( nRootFret + 2, GSTRING, CHORDIV );
        showNote( nRootFret + 14, GSTRING, CHORDIV );
        showNote( nRootFret - 10, GSTRING, CHORDIV );

        showNote( nRootFret + 7, DSTRING, CHORDIV );
        showNote( nRootFret + 19, DSTRING, CHORDIV );
        showNote( nRootFret - 5, DSTRING, CHORDIV );

        showNote( nRootFret, ASTRING, CHORDIV );
        showNote( nRootFret + 12, ASTRING, CHORDIV );

        showNote( nRootFret + 5, ESTRING2, CHORDIV );
        showNote( nRootFret + 17, ESTRING2, CHORDIV );
        showNote( nRootFret - 7, ESTRING2, CHORDIV );

        break;
      case 5:


        showNote( nRootFret + 7, ESTRING1, CHORDV );
        showNote( nRootFret + 19, ESTRING1, CHORDV );
        showNote( nRootFret - 5, ESTRING1, CHORDV );

        showNote( nRootFret, BSTRING, CHORDV );
        showNote( nRootFret + 12, BSTRING, CHORDV );

        showNote( nRootFret + 4, GSTRING, CHORDV );
        showNote( nRootFret + 16, GSTRING, CHORDV );
        showNote( nRootFret - 8, GSTRING, CHORDV );

        showNote( nRootFret - 3, DSTRING, CHORDV );
        showNote( nRootFret + 9, DSTRING, CHORDV );
        showNote( nRootFret + 21, DSTRING, CHORDV );

        showNote( nRootFret + 2, ASTRING, CHORDV );
        showNote( nRootFret + 14, ASTRING, CHORDV );
        showNote( nRootFret - 10, ASTRING, CHORDV );

        showNote( nRootFret + 7, ESTRING2, CHORDV );
        showNote( nRootFret + 19, ESTRING2, CHORDV );
        showNote( nRootFret - 5, ESTRING2, CHORDV );

        break;
    }
  }
}
function resetFretboard () {
  for ( let i = 0; i < notes.length; i++ ) {
    for ( j = 0; j < notes[i].length; j++ ) { notes[i][j].svgElement.hide(); }

  }

  for ( let i = 0; i < fretMarkers.length; i++ ) { fretMarkers[i].hide(); }

  allShapes.clear();
}

function resetFilters () {
  $( 'input[type=radio]' ).prop( 'checked', false );
  $( 'input[type=checkbox]' ).prop( 'checked', false );
}
function getDotID ( fret, offset, string ) {
  return '#Dot-' + ( fret + offset ) + '-' + string;
}


function drawFretMarker ( fret, chord ) {
  if ( fret >= 0 && fret < 22 ) {
    fretMarkers[fret].fill( { color: chord, opacity: CHORDOPACITY } );
    fretMarkers[fret].show();
  }
}

function computeOffsets () {
  for ( i = 0; i < theFrets.length; i++ ) {
    yoffsets.push( ( notes[i][BSTRING].y - notes[i][ESTRING1].y ) / 2.0 );
    if ( i < theFrets.length - 1 ) {
      xoffsets.push( ( theFrets[i + 1].pt1.x - theFrets[i].pt1.x ) / 4.0 );
    }
  }
}


function createFrets () {
  allFrets = theDrawing.group();
  theFrets.push( { pt1: { x: 47.33, y: 54.20 }, pt2: { x: 47.33, y: 264.50 } } );
  theFrets.push( { pt1: { x: 241.33, y: 48 }, pt2: { x: 241.33, y: 265 } } );
  theFrets.push( { pt1: { x: 417.33, y: 46 }, pt2: { x: 417.33, y: 270 } } );
  theFrets.push( { pt1: { x: 583.33, y: 41 }, pt2: { x: 583.33, y: 273 } } );
  theFrets.push( { pt1: { x: 743.33, y: 37.36 }, pt2: { x: 743.33, y: 276.49 } } );
  theFrets.push( { pt1: { x: 892.33, y: 35 }, pt2: { x: 892.33, y: 279.49 } } );
  theFrets.push( { pt1: { x: 1036.33, y: 31 }, pt2: { x: 1036.33, y: 281.49 } } );
  theFrets.push( { pt1: { x: 1171.33, y: 29 }, pt2: { x: 1171.33, y: 282.49 } } );
  theFrets.push( { pt1: { x: 1298.33, y: 27 }, pt2: { x: 1298.33, y: 283.49 } } );
  theFrets.push( { pt1: { x: 1417.33, y: 23 }, pt2: { x: 1417.33, y: 284.49 } } );
  theFrets.push( { pt1: { x: 1531.33, y: 22 }, pt2: { x: 1531.33, y: 287.49 } } );
  theFrets.push( { pt1: { x: 1640.33, y: 19 }, pt2: { x: 1640.33, y: 287.49 } } );
  theFrets.push( { pt1: { x: 1740.33, y: 18.41 }, pt2: { x: 1740.33, y: 290.49 } } );
  theFrets.push( { pt1: { x: 1836.33, y: 16 }, pt2: { x: 1836.33, y: 291.49 } } );
  theFrets.push( { pt1: { x: 1926.33, y: 14 }, pt2: { x: 1926.33, y: 292.49 } } );
  theFrets.push( { pt1: { x: 2012.33, y: 12 }, pt2: { x: 2012.33, y: 293.49 } } );
  theFrets.push( { pt1: { x: 2093.33, y: 10 }, pt2: { x: 2093.33, y: 294.49 } } );
  theFrets.push( { pt1: { x: 2168.33, y: 9 }, pt2: { x: 2168.33, y: 296.49 } } );
  theFrets.push( { pt1: { x: 2241.33, y: 5 }, pt2: { x: 2241.33, y: 297.49 } } );
  theFrets.push( { pt1: { x: 2308.33, y: 6 }, pt2: { x: 2308.33, y: 297.49 } } );
  theFrets.push( { pt1: { x: 2372.33, y: 6 }, pt2: { x: 2372.33, y: 299.49 } } );
  theFrets.push( { pt1: { x: 2433.33, y: 5 }, pt2: { x: 2433.33, y: 299.49 } } );

  for ( i = 0; i < theFrets.length; i++ ) {
    //var theFret = allFrets.line( theFrets[i].pt1.x, theFrets[i].pt1.y, theFrets[i].pt2.x, theFrets[i].pt2.y );
    var theFret;
    if ( i == 0 ) {
      theFret = allFrets.rect( FRETWIDTH * 1.5, theFrets[i].pt2.y - theFrets[i].pt1.y );
      theFret.move( theFrets[i].pt1.x - ( FRETWIDTH / 2.0 ), theFrets[i].pt1.y );
      theFret.fill( '#555' );
    }
    else {
      theFret = allFrets.rect( FRETWIDTH, theFrets[i].pt2.y - theFrets[i].pt1.y );
      theFret.radius( FRETWIDTH / 4 );
      theFret.move( theFrets[i].pt1.x - ( FRETWIDTH / 2.0 ), theFrets[i].pt1.y );
      theFret.fill( fretGradient );
    }

    theFrets[i].svgElement = theFret;
  }

}

function createFretMarkers () {
  allMarkers = theDrawing.group();

  let markerOffset = FRETWIDTH / 2;
  let markerVOffset = 60;
  let theMarkers = theFrets;

  theMarkers = [];
  theMarkers.push( { pt1: { x: -17, y: 54 }, pt2: { x: -17, y: 264 } } );

  for ( let i = 0; i < theFrets.length; i++ ) { theMarkers.push( theFrets[i] ); }
  for ( i = 1; i < theMarkers.length; i++ ) {
    var polygonString = ( theMarkers[i - 1].pt1.x + markerOffset ) + "," + ( theMarkers[i - 1].pt1.y - markerVOffset ) + " ";
    polygonString += ( theMarkers[i - 1].pt2.x + markerOffset ) + "," + ( theMarkers[i - 1].pt2.y + markerVOffset ) + " ";
    polygonString += ( theMarkers[i].pt2.x - markerOffset ) + "," + ( theMarkers[i].pt2.y + markerVOffset ) + " ";
    polygonString += ( theMarkers[i].pt1.x - markerOffset ) + "," + ( theMarkers[i].pt1.y - markerVOffset );
    var theFretMarker = allMarkers.polygon( polygonString );
    theFretMarker.fill( 'none' );
    theFretMarker.stroke( 'none' );
    fretMarkers.push( theFretMarker );
  }
}

function createDots () {
  allDots = theDrawing.group();
  theDots.push( { x: 502.5, y: 160.5 } );
  theDots.push( { x: 820.5, y: 158.5 } );
  theDots.push( { x: 1103.5, y: 158.5 } );
  theDots.push( { x: 1359.5, y: 157.5 } );
  theDots.push( { x: 1689.5, y: 97.5 } );
  theDots.push( { x: 1969.5, y: 155.5 } );
  theDots.push( { x: 2131.5, y: 155.5 } );
  theDots.push( { x: 2274.5, y: 153.5 } );
  theDots.push( { x: 2402.5, y: 153.5 } );
  theDots.push( { x: 1689.5, y: 214.5 } );


  theSideDots.push( { x: 502.5, y: 300 } );
  theSideDots.push( { x: 820.5, y: 303 } );
  theSideDots.push( { x: 1103.5, y: 305 } );
  theSideDots.push( { x: 1359.5, y: 310 } );
  theSideDots.push( { x: 1670, y: 314 } );
  theSideDots.push( { x: 1969.5, y: 320 } );
  theSideDots.push( { x: 2131.5, y: 322 } );
  theSideDots.push( { x: 2274.5, y: 325 } );
  theSideDots.push( { x: 2402.5, y: 328 } );
  theSideDots.push( { x: 1700, y: 315 } );

  for ( i = 0; i < theDots.length; i++ ) {
    allDots.circle( 30 ).move( theDots[i].x - 15, theDots[i].y - 15 ).fill( "#333" );
  }

  for ( i = 0; i < theSideDots.length; i++ ) {
    allDots.circle( 10 ).move( theSideDots[i].x - 5, theSideDots[i].y - 5 ).fill( "#FFF" );
  }
}



function createStrings () {
  allStrings = theDrawing.group();

  theStrings.push( { pt1: { x: 0, y: 67.5 }, pt2: { x: 2489, y: 26 } },
    { pt1: { x: 0, y: 104 }, pt2: { x: 2498, y: 78 } },
    { pt1: { x: 0, y: 140 }, pt2: { x: 2503, y: 127 } },
    { pt1: { x: 0, y: 177.5 }, pt2: { x: 2502, y: 177.5 } },
    { pt1: { x: 0, y: 216 }, pt2: { x: 2498, y: 230 } },
    { pt1: { x: 0, y: 251.5 }, pt2: { x: 2489, y: 279 } } );

  //Guide above E String
  theGuides.push( {
    pt1: { x: theStrings[0].pt1.x, y: ( theStrings[0].pt1.y - ( ( theStrings[1].pt1.y - theStrings[0].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[0].pt2.x, y: ( theStrings[0].pt2.y - ( ( theStrings[1].pt2.y - theStrings[0].pt2.y ) / 2.0 ) ) }
  } );

  //Guide between E & B
  theGuides.push( {
    pt1: { x: theStrings[1].pt1.x, y: ( theStrings[0].pt1.y + ( ( theStrings[1].pt1.y - theStrings[0].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[1].pt2.x, y: ( theStrings[0].pt2.y + ( ( theStrings[1].pt2.y - theStrings[0].pt2.y ) / 2.0 ) ) }
  } );

  //Guide between G & B
  theGuides.push( {
    pt1: { x: theStrings[2].pt1.x, y: ( theStrings[1].pt1.y + ( ( theStrings[2].pt1.y - theStrings[1].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[2].pt2.x, y: ( theStrings[1].pt2.y + ( ( theStrings[2].pt2.y - theStrings[1].pt2.y ) / 2.0 ) ) }
  } );

  //Guide between D & G
  theGuides.push( {
    pt1: { x: theStrings[3].pt1.x, y: ( theStrings[2].pt1.y + ( ( theStrings[3].pt1.y - theStrings[2].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[3].pt2.x, y: ( theStrings[2].pt2.y + ( ( theStrings[3].pt2.y - theStrings[2].pt2.y ) / 2.0 ) ) }
  } );


  //Guide between A & D
  theGuides.push( {
    pt1: { x: theStrings[4].pt1.x, y: ( theStrings[3].pt1.y + ( ( theStrings[4].pt1.y - theStrings[3].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[4].pt2.x, y: ( theStrings[3].pt2.y + ( ( theStrings[4].pt2.y - theStrings[3].pt2.y ) / 2.0 ) ) }
  } );


  //Guide between E & A
  theGuides.push( {
    pt1: { x: theStrings[5].pt1.x, y: ( theStrings[4].pt1.y + ( ( theStrings[5].pt1.y - theStrings[4].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[5].pt2.x, y: ( theStrings[4].pt2.y + ( ( theStrings[5].pt2.y - theStrings[4].pt2.y ) / 2.0 ) ) }
  } );


  //Guide past E string
  theGuides.push( {
    pt1: { x: theStrings[5].pt1.x, y: ( theStrings[5].pt1.y + ( ( theStrings[5].pt1.y - theStrings[4].pt1.y ) / 2.0 ) ) },
    pt2: { x: theStrings[5].pt2.x, y: ( theStrings[5].pt2.y + ( ( theStrings[5].pt2.y - theStrings[4].pt2.y ) / 2.0 ) ) }
  } );


  var stringWidths = [3, 4, 5, 6, 7, 8];

  for ( i = 0; i < theStrings.length; i++ ) {
    var stringString = theStrings[i].pt1.x + "," + ( theStrings[i].pt1.y - ( stringWidths[i] / 2.0 ) ) + " ";
    stringString += theStrings[i].pt2.x + "," + ( theStrings[i].pt2.y - ( stringWidths[i] / 2.0 ) ) + " ";
    stringString += theStrings[i].pt2.x + "," + ( theStrings[i].pt2.y + ( stringWidths[i] / 2.0 ) ) + " ";
    stringString += theStrings[i].pt1.x + "," + ( theStrings[i].pt1.y + ( stringWidths[i] / 2.0 ) ) + " ";


    var theString = allStrings.polygon( stringString );

    theString.fill( STRINGFILL );


    theStrings[i].svgElement = theString;
  }
  allStrings.filterWith( function ( add ) {
    var blur = add.offset( 5, 5 ).in( add.sourceAlpha ).gaussianBlur( 5 );
    add.blend( add.source, blur );
    this.size( '200%', '200%' ).move( '-50%', '-50%' )
  } );


  /*
  for(i = 0; i < theGuides.length; i++)
  {
    var theGuide = allStrings.line(theGuides[i].pt1.x, theGuides[i].pt1.y,
                     theGuides[i].pt2.x, theGuides[i].pt2.y );
                     
    theGuide.stroke({width: 2, color: '#555'});
    theGuides[i].svgElement	 = theGuide;
  }
  */


}
function createNotes () {
  allNotes = theDrawing.group();
  var fretNotes = [];
  fretNotes.push( { x: 18.5, y: 66.5 } );
  fretNotes.push( { x: 18.5, y: 104.5 } );
  fretNotes.push( { x: 18.5, y: 140.5 } );
  fretNotes.push( { x: 18.5, y: 178.5 } );
  fretNotes.push( { x: 18.5, y: 214.5 } );
  fretNotes.push( { x: 18.5, y: 252.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 139.5, y: 63.5 } );
  fretNotes.push( { x: 139.5, y: 102.5 } );
  fretNotes.push( { x: 139.5, y: 139.5 } );
  fretNotes.push( { x: 139.5, y: 178.5 } );
  fretNotes.push( { x: 139.5, y: 215.5 } );
  fretNotes.push( { x: 139.5, y: 253.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 327.5, y: 60.5 } );
  fretNotes.push( { x: 327.5, y: 100.5 } );
  fretNotes.push( { x: 327.5, y: 138.5 } );
  fretNotes.push( { x: 327.5, y: 177.5 } );
  fretNotes.push( { x: 327.5, y: 216.5 } );
  fretNotes.push( { x: 327.5, y: 255.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 499.5, y: 58.5 } );
  fretNotes.push( { x: 499.5, y: 98.5 } );
  fretNotes.push( { x: 499.5, y: 137.5 } );
  fretNotes.push( { x: 499.5, y: 177.5 } );
  fretNotes.push( { x: 499.5, y: 218.5 } );
  fretNotes.push( { x: 499.5, y: 257.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 660.5, y: 55.5 } );
  fretNotes.push( { x: 660.5, y: 96.5 } );
  fretNotes.push( { x: 660.5, y: 136.5 } );
  fretNotes.push( { x: 660.5, y: 177.5 } );
  fretNotes.push( { x: 660.5, y: 218.5 } );
  fretNotes.push( { x: 660.5, y: 258.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 815.5, y: 52.5 } );
  fretNotes.push( { x: 815.5, y: 94.5 } );
  fretNotes.push( { x: 815.5, y: 135.5 } );
  fretNotes.push( { x: 815.5, y: 177.5 } );
  fretNotes.push( { x: 815.5, y: 218.5 } );
  fretNotes.push( { x: 815.5, y: 260.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 964.5, y: 49.5 } );
  fretNotes.push( { x: 964.5, y: 92.5 } );
  fretNotes.push( { x: 964.5, y: 134.5 } );
  fretNotes.push( { x: 964.5, y: 177.5 } );
  fretNotes.push( { x: 964.5, y: 219.5 } );
  fretNotes.push( { x: 964.5, y: 262.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1102.5, y: 48.5 } );
  fretNotes.push( { x: 1102.5, y: 90.5 } );
  fretNotes.push( { x: 1102.5, y: 134.5 } );
  fretNotes.push( { x: 1102.5, y: 177.5 } );
  fretNotes.push( { x: 1102.5, y: 221.5 } );
  fretNotes.push( { x: 1102.5, y: 263.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1234.5, y: 45.5 } );
  fretNotes.push( { x: 1234.5, y: 90.5 } );
  fretNotes.push( { x: 1234.5, y: 133.5 } );
  fretNotes.push( { x: 1234.5, y: 178.5 } );
  fretNotes.push( { x: 1234.5, y: 221.5 } );
  fretNotes.push( { x: 1234.5, y: 263.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1358.5, y: 43.5 } );
  fretNotes.push( { x: 1358.5, y: 89.5 } );
  fretNotes.push( { x: 1358.5, y: 132.5 } );
  fretNotes.push( { x: 1358.5, y: 178.5 } );
  fretNotes.push( { x: 1358.5, y: 222.5 } );
  fretNotes.push( { x: 1358.5, y: 266.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1474.5, y: 41.5 } );
  fretNotes.push( { x: 1474.5, y: 89.5 } );
  fretNotes.push( { x: 1474.5, y: 132.5 } );
  fretNotes.push( { x: 1474.5, y: 178.5 } );
  fretNotes.push( { x: 1474.5, y: 223.5 } );
  fretNotes.push( { x: 1474.5, y: 268.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1586.5, y: 38.5 } );
  fretNotes.push( { x: 1586.5, y: 86.5 } );
  fretNotes.push( { x: 1586.5, y: 131.5 } );
  fretNotes.push( { x: 1586.5, y: 178.5 } );
  fretNotes.push( { x: 1586.5, y: 224.5 } );
  fretNotes.push( { x: 1586.5, y: 269.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1689.5, y: 38.5 } );
  fretNotes.push( { x: 1689.5, y: 87.5 } );
  fretNotes.push( { x: 1689.5, y: 131.5 } );
  fretNotes.push( { x: 1689.5, y: 178.5 } );
  fretNotes.push( { x: 1689.5, y: 224.5 } );
  fretNotes.push( { x: 1689.5, y: 270.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1786.5, y: 36.5 } );
  fretNotes.push( { x: 1786.5, y: 84.5 } );
  fretNotes.push( { x: 1786.5, y: 130.5 } );
  fretNotes.push( { x: 1786.5, y: 178.5 } );
  fretNotes.push( { x: 1786.5, y: 224.5 } );
  fretNotes.push( { x: 1786.5, y: 270.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1879.5, y: 35.5 } );
  fretNotes.push( { x: 1879.5, y: 83.5 } );
  fretNotes.push( { x: 1879.5, y: 129.5 } );
  fretNotes.push( { x: 1879.5, y: 178.5 } );
  fretNotes.push( { x: 1879.5, y: 225.5 } );
  fretNotes.push( { x: 1879.5, y: 271.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 1968.5, y: 34.5 } );
  fretNotes.push( { x: 1968.5, y: 82.5 } );
  fretNotes.push( { x: 1968.5, y: 129.5 } );
  fretNotes.push( { x: 1968.5, y: 177.5 } );
  fretNotes.push( { x: 1968.5, y: 225.5 } );
  fretNotes.push( { x: 1968.5, y: 273.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 2052.5, y: 32.5 } );
  fretNotes.push( { x: 2052.5, y: 81.5 } );
  fretNotes.push( { x: 2052.5, y: 128.5 } );
  fretNotes.push( { x: 2052.5, y: 178.5 } );
  fretNotes.push( { x: 2052.5, y: 226.5 } );
  fretNotes.push( { x: 2052.5, y: 273.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 2130.5, y: 31.5 } );
  fretNotes.push( { x: 2130.5, y: 80.5 } );
  fretNotes.push( { x: 2130.5, y: 128.5 } );
  fretNotes.push( { x: 2130.5, y: 178.5 } );
  fretNotes.push( { x: 2130.5, y: 226.5 } );
  fretNotes.push( { x: 2130.5, y: 274.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 2204.5, y: 30.5 } );
  fretNotes.push( { x: 2204.5, y: 79.5 } );
  fretNotes.push( { x: 2204.5, y: 128.5 } );
  fretNotes.push( { x: 2204.5, y: 178.5 } );
  fretNotes.push( { x: 2204.5, y: 227.5 } );
  fretNotes.push( { x: 2204.5, y: 275.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 2273.5, y: 29.5 } );
  fretNotes.push( { x: 2273.5, y: 79.5 } );
  fretNotes.push( { x: 2273.5, y: 128.5 } );
  fretNotes.push( { x: 2273.5, y: 178.5 } );
  fretNotes.push( { x: 2273.5, y: 227.5 } );
  fretNotes.push( { x: 2273.5, y: 275.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 2341.5, y: 27.5 } );
  fretNotes.push( { x: 2341.5, y: 78.5 } );
  fretNotes.push( { x: 2341.5, y: 128.5 } );
  fretNotes.push( { x: 2341.5, y: 178.5 } );
  fretNotes.push( { x: 2341.5, y: 227.5 } );
  fretNotes.push( { x: 2341.5, y: 276.5 } );
  notes.push( fretNotes );

  fretNotes = [];
  fretNotes.push( { x: 2402.5, y: 27.5 } );
  fretNotes.push( { x: 2402.5, y: 78.5 } );
  fretNotes.push( { x: 2402.5, y: 128.5 } );
  fretNotes.push( { x: 2402.5, y: 178.5 } );
  fretNotes.push( { x: 2402.5, y: 229.5 } );
  fretNotes.push( { x: 2402.5, y: 277.5 } );
  notes.push( fretNotes );


  for ( i = 0; i < notes.length; i++ ) {
    for ( j = 0; j < notes[i].length; j++ ) {
      var theNote = allNotes.circle( NOTERADIUS * 2 ).move( notes[i][j].x - NOTERADIUS, notes[i][j].y - NOTERADIUS );
      theNote.fill( NOTECOLOR );
      theNote.stroke( NOTESTROKE );
      notes[i][j].svgElement = theNote;
    }

  }

  allNotes.front();
}



function computeYOnGuide ( guideIndex, xLength ) {
  var i = guideIndex;
  var adjLength = theGuides[i].pt2.x - theGuides[i].pt1.x;
  var oppHeight = theGuides[i].pt2.y - theGuides[i].pt1.y;


  var yIncrease = xLength * ( oppHeight / adjLength );
  return theGuides[i].pt1.y + yIncrease;
}

function computeYOnString ( stringIndex, xLength ) {
  var i = stringIndex;
  var adjLength = theStrings[i].pt2.x - theStrings[i].pt1.x;
  var oppHeight = theStrings[i].pt2.y - theStrings[i].pt1.y;


  var yIncrease = xLength * ( oppHeight / adjLength );
  return theStrings[i].pt1.y + yIncrease;
}


function toDegrees ( radians ) {
  var pi = Math.PI;
  return radians * ( 180 / pi );
}

function computeNoteBoxes () {
  for ( i = 0; i < notes.length; i++ ) {
    for ( j = 0; j < notes[i].length; j++ ) {
      // J is for strings
      var stringIndex = j;
      var theBox = [];
      var xCenter = notes[i][j].x;
      var yCenter = notes[i][j].y;
      var boxOffset = BOXPADDING;


      /*  0---1---2
        |		|
        7		3
        |		|
        6---5---4
      */
      // pt1 - Top Left
      ptX = xCenter - boxOffset;
      ptY = computeYOnGuide( stringIndex, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt2 - Top Center
      ptX = xCenter;
      ptY = computeYOnGuide( stringIndex, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt3 - Top Right;
      ptX = xCenter + boxOffset;
      ptY = computeYOnGuide( stringIndex, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt4 - Right Center;
      ptX = xCenter + boxOffset;
      ptY = computeYOnString( stringIndex, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt5 - Bottom Right
      ptX = xCenter + boxOffset;
      ptY = computeYOnGuide( stringIndex + 1, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt6 - Bottom Center
      ptX = xCenter;
      ptY = computeYOnGuide( stringIndex + 1, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt7 - Bottom Left
      ptX = xCenter - boxOffset;
      ptY = computeYOnGuide( stringIndex + 1, ptX );
      theBox.push( { x: ptX, y: ptY } );

      // pt8 - Center Left
      ptX = xCenter - boxOffset;
      ptY = computeYOnString( stringIndex, ptX );
      theBox.push( { x: ptX, y: ptY } );

      notes[i][j].box = theBox;

    }
  }
}

function drawBoundingBox ( fret, string ) {
  var theBox = notes[fret][string].box;

  for ( i = 0; i < theBox.length; i++ ) {
    theDrawing.circle( 10 ).move( theBox[i].x - 5, theBox[i].y - 5 ).fill( '#fff' );
  }
}

function addPointToString ( x, y ) {
  return x + "," + y + " ";
}

function setSharedNote ( fret, string ) { notes[fret][string].svgElement.fill( '#ffff00' ); }


function drawShape ( fret, data ) {
  var polygonString = '';
  for ( i = 0; i < data.length; i++ ) {
    if ( data[i][0] != 'R' ) {
      polygonString += data[i][0];
    }
    else {
      polygonString += CORNERRADIUS;
    }
    polygonString += addPointToString( notes[( fret + data[i][1] )][data[i][2]].box[data[i][3]].x, notes[fret + data[i][1]][data[i][2]].box[data[i][3]].y );
  }
  polygonString += "Z";
  //console.log(polygonString);
  var theBox = allShapes.path( polygonString ).fill( SHAPEFILL ).stroke( SHAPESTROKE );

}


function calculateBoundaryPoint ( nFret, nString, nPosition ) {
  var ptX = 0;
  var ptY = 0;
  var theNote = notes[nFret][nString];
  var noteX = theNote.x;
  var noteY = theNote.y;

  /*
  
     0,1---2----3,4
    15        	 5
     |             |
    14     C       6
     |             |
    13             7
    12,11--10---9,8   
    
  */
  switch ( nPosition ) {
    case 0:
      ptX = noteX - BOXPADDDING;
      ptY = computeYOnGuide( nString, ptX );
      break;
    case 1:
      ptX = noteX - BOXPADDDING + CORNEROFFSET;
      ptY = computeYOnGuide( nString, ptX );
      break;
    case 2:
      ptX = noteX;
      ptY = computeYOnGuide( nString, ptX );
      break;
    case 3:
      ptX = noteX + BOXPADDDING - CORNEROFFSET
      ptY = computeYOnGuide( nString, ptX );
      break;
    case 4:
      ptX = noteX + BOXPADDDING;
      ptY = computeYOnGuide( nString, ptX );
      break;
    case 5:
      ptX = noteX + BOXPADDDING;
      ptY = computeYOnGuide( nString, ptX ) + CORNEROFFSET;
      break;
    case 6:
      ptX = noteX + BOXPADDDING;
      ptY = computeYOnString( nString, ptX );
      break;
    case 7:
      ptX = noteX + BOXPADDDING;
      ptY = computeYOnGuide( nString, ptX ) - CORNEROFFSET;
      break;
    case 8:
      ptX = noteX + BOXPADDDING;
      ptY = computeYOnGuide( nString + 1, ptX );
      break;
    case 9:
      ptX = noteX + BOXPADDDING - CORNEROFFSET;
      ptY = computeYOnGuide( nString + 1, ptX );
      break;
    case 10:
      ptX = noteX;
      ptY = computeYOnGuide( nString + 1, ptX );
      break;
    case 11:
      ptX = noteX - BOXPADDDING + CORNEROFFSET;
      ptY = computeYOnGuide( nString + 1, ptX );
      break;
    case 12:
      ptX = noteX - BOXPADDDING;
      ptY = computeYOnGuide( nString + 1, ptX );
      break;
    case 13:
      ptX = noteX - BOXPADDDING;
      ptY = computeYOnGuide( nString + 1, ptX ) - CORNEROFFSET;
      break;
    case 14:
      ptX = noteX - BOXPADDDING;
      ptY = computeYOnString( nString, ptX );
      break;
    case 15:
      ptX = noteX - BOXPADDDING;
      ptY = computeYOnGuide( nString, ptX ) + CORNEROFFSET;
      break;
  }

}


function drawMinorPentatonic ( theFret ) {
  drawPentatonic( theFret, MINOR );

}

function drawMajorPentatonic ( theFret ) {
  drawPentatonic( theFret - 3, MAJOR );
}

function drawPentatonic ( theFret, strType ) {
  showNote( theFret, ESTRING1, strType );
  showNote( theFret, BSTRING, strType );
  showNote( theFret, GSTRING, strType );
  showNote( theFret, DSTRING, strType );
  showNote( theFret, ASTRING, strType );
  showNote( theFret, ESTRING2, strType );
  showNote( theFret + 3, ESTRING1, strType );
  showNote( theFret + 3, BSTRING, strType );
  showNote( theFret + 2, GSTRING, strType );
  showNote( theFret + 2, DSTRING, strType );
  showNote( theFret + 2, ASTRING, strType );
  showNote( theFret + 3, ESTRING2, strType );

  //Position 2
  showNote( theFret + 5, ESTRING2, strType );
  showNote( theFret + 5, BSTRING, strType );
  showNote( theFret + 4, GSTRING, strType );
  showNote( theFret + 5, DSTRING, strType );
  showNote( theFret + 5, ASTRING, strType );
  showNote( theFret + 5, ESTRING1, strType );

  //Position 3
  showNote( theFret + 7, ESTRING2, strType );
  showNote( theFret + 8, BSTRING, strType );
  showNote( theFret + 7, GSTRING, strType );
  showNote( theFret + 7, DSTRING, strType );
  showNote( theFret + 7, ASTRING, strType );
  showNote( theFret + 7, ESTRING1, strType );

  // Position 4
  showNote( theFret + 10, ESTRING2, strType );
  showNote( theFret + 10, BSTRING, strType );
  showNote( theFret + 9, GSTRING, strType );
  showNote( theFret + 9, DSTRING, strType );
  showNote( theFret + 10, ASTRING, strType );
  showNote( theFret + 10, ESTRING1, strType );


  showNote( theFret + 12, ESTRING2, strType );
  showNote( theFret + 12, BSTRING, strType );
  showNote( theFret + 12, GSTRING, strType );
  showNote( theFret + 12, DSTRING, strType );
  showNote( theFret + 12, ASTRING, strType );
  showNote( theFret + 12, ESTRING1, strType );

  if ( theFret < 7 ) {
    showNote( theFret + 15, ESTRING1, strType );
    showNote( theFret + 15, BSTRING, strType );
    showNote( theFret + 14, GSTRING, strType );
    showNote( theFret + 14, DSTRING, strType );
    showNote( theFret + 14, ASTRING, strType );
    showNote( theFret + 15, ESTRING2, strType );

  }
  if ( theFret < 5 ) {
    showNote( theFret + 17, ESTRING2, strType );
    showNote( theFret + 17, BSTRING, strType );
    showNote( theFret + 16, GSTRING, strType );
    showNote( theFret + 17, DSTRING, strType );
    showNote( theFret + 17, ASTRING, strType );
    showNote( theFret + 17, ESTRING1, strType );
  }


  if ( theFret < 3 ) {
    //Position 3
    showNote( theFret + 19, ESTRING2, strType );
    showNote( theFret + 20, BSTRING, strType );
    showNote( theFret + 19, GSTRING, strType );
    showNote( theFret + 19, DSTRING, strType );
    showNote( theFret + 19, ASTRING, strType );
    showNote( theFret + 19, ESTRING1, strType );
  }


}
      /*
function setupSliders()
{
  
  xRotationSlider = $('#xrotation').get(0);
  yRotationSlider = $('#yrotation').get(0);
  zRotationSlider = $('#zrotation').get(0);
  xSkewSlider = $('#xskew').get(0);
  ySkewSlider = $('#yskew').get(0);
  
  
  
  noUiSlider.create(xRotationSlider, { start: 0, range: { 'min': -180, 'max': 180 }, steps: 720 });
  noUiSlider.create(yRotationSlider, { start: 0, range: { 'min': -180, 'max': 180 }, steps: 720 });
  noUiSlider.create(zRotationSlider, {start: 0,range: {'min': -180,'max': 180}, steps: 720});
  noUiSlider.create(xSkewSlider, {start: 0,range: {'min': -180,'max': 180},steps: 720});
  noUiSlider.create(ySkewSlider, {start: 0,range: {'min': -180,'max': 180},steps: 720});
 
  xRotationSlider.noUiSlider.on('update', function(){updateRotations();});
  yRotationSlider.noUiSlider.on('update', function(){updateRotations();});
  zRotationSlider.noUiSlider.on('update', function(){updateRotations();});
  xSkewSlider.noUiSlider.on('update', function(){updateRotations();});
  ySkewSlider.noUiSlider.on('update', function(){updateRotations();});
  
  xScaleSlider.noUiSlider.set(1.14);
  yScaleSlider.noUiSlider.set(1.14);
  zScaleSlider.noUiSlider.set(1.14);
  xRotationSlider.noUiSlider.set(36.98);
  yRotationSlider.noUiSlider.set(8.35);
  zRotationSlider.noUiSlider.set(27.44);
  xTranslateSlider.noUiSlider.set(-211.83);
  yTranslateSlider.noUiSlider.set(-51.7);
  zTranslateSlider.noUiSlider.set(109.36);
  xSkewSlider.noUiSlider.set(-19.75);
  ySkewSlider.noUiSlider.set(-7.16); 
 
}
 
function updateRotations()
{
  var xRot = xRotationSlider.noUiSlider.get();
  var yRot = yRotationSlider.noUiSlider.get();
  var zRot = zRotationSlider.noUiSlider.get();
  var xSkew = xSkewSlider.noUiSlider.get();
  var ySkew = ySkewSlider.noUiSlider.get();
  
  var transformString = "rotateX(" + xRot + "deg) ";
  transformString += "rotateY(" + yRot + "deg) ";
  transformString += "rotateZ(" + zRot + "deg) ";
  transformString += "skew(" + xSkew + "deg," + ySkew + "deg)";
  
  //console.log(transformString);
  $('#fretboard-wrapper').css('transform', transformString);
 
  //console.log('Perspective ' + perspectiveVal);
  //$('#fretboard-wrapper').css('perspective', perspectiveVal + "px");
  
}
*/	