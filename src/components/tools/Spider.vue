<template>
  
    <q-page class="resting">
	    <div id="pageWrapper">
		    <div id="topbar" class="control-bar">
			    <div class="control-bar-button dropdown" id="combinationsToggle" data-toggle="sidebar-dropdown"><i class="fa fa-check-square-o"></i><span id="combinationCount"></span></div>
			    <div class="control-bar-input-wrapper">
					<label>BPM:</label>
					<input id="tempo" type="text" value="150" size="4" onChange="tempoChanged();"/>
			    </div>
				<button class="control-bar-button" id="play" onClick="toggleRun()" disabled><i class="fa fa-play"></i></button>
				<button class="control-bar-button" id="stop" onClick="stop();" disabled><i class="fa fa-stop"></i></button>
				<!-- <button class="control-bar-button" id="loop"><i class="fa fa-refresh"></i></button> -->
		    </div>
		    <q-dialog class="dropdown-pane dark large" id="sidebar-dropdown" data-close-on-click="true" data-close-on-click-inside="false" data-dropdown v-model="showCombos">
			    <div id="combinations">
				    <div id="combinationSelector">
					    <div class="row">
						    <div class="columns small-6 medium-3">
							    <div class="text-center">1st</div>
							    <div class="non-breaking">
								    <input class="checkbox comboCategoryCheckbox" type="checkbox" id="all-1" onchange="checkSet(1, this.checked);" /><label for="all-1">All</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-1" type="checkbox" id="combo-0" /><label for="combo-0">1 2 3 4</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-1" type="checkbox" id="combo-1" /><label for="combo-1">1 2 4 3</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-1" type="checkbox" id="combo-2" /><label for="combo-2">1 3 2 4</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-1" type="checkbox" id="combo-3" /><label for="combo-3">1 3 4 2</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-1" type="checkbox" id="combo-4" /><label for="combo-4">1 4 2 3</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-1" type="checkbox" id="combo-5" /><label for="combo-5">1 4 3 2</label>
								</div>
						    </div>
						    <div class="columns small-6 medium-3">
							    <div class="text-center">2nd</div>
							    <div class="non-breaking">
									<input class="checkbox comboCategoryCheckbox" type="checkbox" id="all-2" onchange="checkSet(2, this.checked);" /><label for="all-2">All</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-2" type="checkbox" id="combo-6" /><label for="combo-6">2 1 3 4</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-2" type="checkbox" id="combo-7" /><label for="combo-7">2 1 4 3</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-2" type="checkbox" id="combo-8" /><label for="combo-8">2 3 1 4</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-2" type="checkbox" id="combo-9" /><label for="combo-9">2 3 4 1</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-2" type="checkbox" id="combo-10" /><label for="combo-10">2 4 1 3</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-2" type="checkbox" id="combo-11" /><label for="combo-11">2 4 3 1</label>
								</div>
						    </div>
						    <div class="columns small-6 medium-3">
							    <div class="text-center">3rd</div>
								<div class="non-breaking">
									<input class="checkbox comboCategoryCheckbox" type="checkbox" id="all-3" onchange="checkSet(3, this.checked);" /><label for="all-3">All</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-3" type="checkbox" id="combo-12" /><label for="combo-12">3 1 2 4</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-3" type="checkbox" id="combo-13" /><label for="combo-13">3 1 4 2</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-3" type="checkbox" id="combo-14" /><label for="combo-14">3 2 1 4</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-3" type="checkbox" id="combo-15" /><label for="combo-15">3 2 4 1</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-3" type="checkbox" id="combo-16" /><label for="combo-16">3 4 1 2</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-3" type="checkbox" id="combo-17" /><label for="combo-17">3 4 2 1</label>
								</div>
						    </div>
							<div class="columns small-6 medium-3">
							    <div class="text-center">4th</div>
							   	<div class="non-breaking">
									<input class="checkbox comboCategoryCheckbox" type="checkbox" id="all-4" onchange="checkSet(4, this.checked);" /><label for="all-4">All</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-4" type="checkbox" id="combo-18" /><label for="combo-18">4 1 2 3</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-4" type="checkbox" id="combo-19" /><label for="combo-19">4 1 3 2</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-4" type="checkbox" id="combo-20" /><label for="combo-20">4 2 1 3</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-4" type="checkbox" id="combo-21" /><label for="combo-21">4 2 3 1</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-4" type="checkbox" id="combo-22" /><label for="combo-22">4 3 1 2</label>
							    </div>
								<div class="non-breaking">
									<input class="checkbox comboCheckbox finger-4" type="checkbox" id="combo-23" /><label for="combo-23">4 3 2 1</label>
								</div>
						    </div>
					    </div>
				    </div>
			    </div>
			    
		    </q-dialog>
		    <div id="main">
			    <div id="headerWrapper">
					<div id="message"></div>			    
			    </div>
				<div class="fretboard">
					<div class="fretboard-mask">
						<div class="string" id="string1"></div>
						<div class="string" id="string2"></div>
						<div class="string" id="string3"></div>
						<div class="string" id="string4"></div>
						<div class="string" id="string5"></div>
						<div class="string" id="string6"></div>
						<div class="fret" id="fret1"></div>
						<div class="fret" id="fret2"></div>
						<div class="fret" id="fret3"></div>
						<div class="fret" id="fret4"></div>
						<div class="fret" id="fret5"></div>
						<div class="fret" id="fret6"></div>
						<div class="fret" id="fret7"></div>			
						<div class="dot" id="dot1">1</div>
						<div class="dot" id="dot2">2</div>
						<div class="dot" id="dot3">3</div>
						<div class="dot" id="dot4">4</div>
					</div>
				</div>
				<div id="progressBarWrapper">
					<div id="progressBar" class="progress-wrapper">
						<div class="progress-indicator" id="progressIndicator"></div>
					</div>
				</div>

		    </div>
	    </div>
	
	</q-page>
</template>

<script>
import {Howl, Howler} from 'howler';
export default {
  name: 'SpiderTool',
  data:() => ({
    tempo: 200,
    stringSpacing: 18.8,
		stringOffset: -3.5,
    timerDelay: (60 / tempo) * 1000,		
		dotStrings: [1, 1, 1, 1],
		dotDirections: [1, 1, 1, 1],
		allCombinations: [],
		selectedCombinations: [],		
		nRestCycle: 7,
		bRestFinished: false,		
		bIsRunning: false,
		bIsPaused : false,
		bCountdownFinished: false,
		nCountdownCycle : 8,
		nCombinationIndex : 0,
		nCombinationDotIndex : -1,
		nStringIndex: 1,
		nTimerID: null,
		tickSound: null,
		tockSound: null,
  }),
	mounted(){
		 var FastClick = require("fastclick");
    FastClick.attach(document.body, {});

			this.tickSound = new Howl({
			  src: ['/assets/audio/tick-sound.mp3']
			});
			
			this.tockSound = new Howl({
			  src: ['/assets/audio/tock-sound.mp3']
			});

		allCombinations.push([1, 2, 3, 4]);
		allCombinations.push([1, 2, 4, 3]);
		allCombinations.push([1, 3, 2, 4]);
		allCombinations.push([1, 3, 4, 2]);
		allCombinations.push([1, 4, 2, 3]);
		allCombinations.push([1, 4, 3, 2]);
		
		allCombinations.push([2, 1, 3, 4]);
		allCombinations.push([2, 1, 4, 3]);
		allCombinations.push([2, 3, 1, 4]);
		allCombinations.push([2, 3, 4, 1]);
		allCombinations.push([2, 4, 1, 3]);
		allCombinations.push([2, 4, 3, 1]);
		
		allCombinations.push([3, 1, 2, 4]);
		allCombinations.push([3, 1, 4, 2]);
		allCombinations.push([3, 2, 1, 4]);
		allCombinations.push([3, 2, 4, 1]);
		allCombinations.push([3, 4, 1, 2]);
		allCombinations.push([3, 4, 2, 1]);
		
		allCombinations.push([4, 1, 2, 3]);
		allCombinations.push([4, 1, 3, 2]);
		allCombinations.push([4, 2, 1, 3]);
		allCombinations.push([4, 2, 3, 1]);
		allCombinations.push([4, 3, 1, 2]);
		allCombinations.push([4, 3, 2, 1]);
		
	},
	methods:{
		playClick( tickOrTock )
		{
			if(tickOrTock == 0)
			{this.tickSound.play();}
			else
			{this.tockSound.play();}
		}
	}
}
</script>

<style>
			
@font-face {
  font-family: 'Audiowide';
  font-style: normal;
  font-weight: 400;
  src: local('Audiowide'), local('Audiowide-Regular'), url(/includes/fonts/Audiowide/Audiowide.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}



html
{
	padding: 0;
	margin: 0;
	font-size: 100%;
}
body
{
	
	font-family: Helvetica, Verdana, Sans-serif;
	color: white;
	font-weight: 400;
	margin: 0;
	background: #222;
}
#pageWrapper
{
	float: left;
	width: 100%;
}

#main
{
	position: absolute;
	width: 100%;
	left: 0;
	top: 3rem;
	bottom: 0;
	background: #181818;
	z-index: -1;
}

.fretboard
{
	position: relative;
	background-color: #363636;
	width: 100%;
	left: 0;
	top: 0%;
	right: 0;
	height: 50%;
	border-top: 2px solid #777;
	border-bottom: 2px solid #777;
	box-shadow: 0px 5px 20px #222;
	transition: opacity .3s, background-color .5s;
}


.string
{
	position: absolute;
	z-index: 100;
	width: 100%;
	height: 1px;
	background: #ddd;
	box-shadow: 2px 0px 10px #000;
	min-height: 1px;
}

.string#string1
{
	top: 3%;
	height: .25vmin;
	min-height: 1px;
}
.string#string2
{
	top: 21.8%;
	height: .35vmin;
}
.string#string3
{
	top: 40.6%;
	height: .35vmin;
}
.string#string4
{
	top: 59.4%;
	height: .5vmin;
}
.string#string5
{
	top: 78.2%;
	height: .5vmin;
}
.string#string6
{
	top: 96%;
	height: .65vmin;
}

.fret
{
	z-index: 50;
	position: absolute;
	top: 0;
	height: 100%;
	width: 5px;
	background: #aaa;
	border-radius: 10px;
}

#fret1
{
	left: 2%;
}

#fret2
{
	left: 18%;
}

#fret3
{
	left: 34%;
}

#fret4
{
	left: 50%
}

#fret5
{
	left: 66%;
}

#fret6
{
	left: 82%;
}

#fret7
{
	left: 98%;
}
.dot
{
	position: absolute;
	width: 7vmin;
	height: 7vmin;
	background: #09f;
	border-radius: 4vmin;
	color: white;
	text-align: center;
	line-height: 7vmin;
	font-size: 3vmin;
	font-family: Audiowide;
	z-index: 150;
	top: -4%;
	box-shadow: 1px 1px 5px #222;
	border: none;
	display: none;
	transition: transform 1s, opacity .25s, top .1s, background-color 1s;
}

#dot1
{
	left: 24.5%;
	
}


#dot2
{
	left: 40.5%;
}


#dot3
{
	left: 56%;
}


#dot4
{
	left: 72.3%;
}		
		

.first
{
	background: #0066ff;
	border: 3px solid white;
	color: white;
	transform: scale( 1.2 );
}
.second
{
	background: #0066ff;
	color: #ddd;
	border: 2px solid #ddd;
	transform: scale( .9 );
}

.third
{
	background: #999;
	border: 3px solid white;
	color: white;
	transform: scale( 1.1 );
}

.fourth
{
	background: #999 !important;
	color: white;
	border: 2px solid #ddd;
	transform: scale( .8 );
}
	
	
label
{
  display: inline-block;
  color: white;
}


.non-breaking
{
  white-space: nowrap;
}
/* 
input[type=text]
{
	border: 1px solid white;
	line-height: 1.6em;
	font-size: .9rem;
	padding: 0 .25em;
	color: #333;
	border-radius: .25em;
	width: auto;
	display: inline-block;
}
input[type=text]:disabled
{
	background: #aaa;
	border: 1px solid #bbb;
	color: #777;
}
input[type=checkbox]
{
	border: none;
	background: white;
	display: inline-block;
	line-height: 1.2rem;
	margin: 0 .25rem 0 0;
	cursor: pointer;
}
input[type=checkbox]+label
{
	font-family: Helvetica, Arial, sans-serif;
	font-weight: bold;
	line-height: 1.2rem;
	font-size: .8rem;
	display: inline-block;
	cursor: pointer;
}


input[type=checkbox].comboCheckbox+label
{
}
input[type=checkbox]:disabled+label
{
	color: #999;
}
input[type=checkbox].comboCategoryCheckbox
{
}
input[type=checkbox].comboCategoryCheckbox+label
{
	text-transform: uppercase;
	font-weight: 900;
} */



#headerWrapper
{
	width: 100%;
	height: 25%;
	padding: 1rem;
	box-sizing: border-box;
	position: relative;
}
#message
{ 
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	font-size: 5.0vmin;
	text-align: center;
	line-height: 1em;
	font-family: Audiowide;

}

#message small
{
	font-size: 70%;
}
#indexCount
{
	text-align: right;
	font-size: 1.2rem;
	position: absolute;
	right: 1rem;
}

#nextUp
{
	display: none;
	font-size: 2.3vmin;
	color: #ccc;
	text-transform: uppercase;
	text-align: center;
	margin-top: 1rem;
}

button
{
	background: #999;
	border: none;
	line-height: 2.4em;
	cursor: pointer;
	font-size: .7rem;
	padding: 0 1em;;
	font-family: Helvetica;
	color: white;
	border-radius: 3px;
	border: 1px solid #999;
}		

button:disabled,
button:disabled:hover
{
	background: #999;
	color: #aaa;
	border-color: #656565;
	cursor: default;
}

button:hover
{
	border-color: #bbb;
	background: #a6a6a6;
	color: white;
}		

body.resting .string,
body.resting .fret,
body.resting .inlay
{
	opacity: .4;
}
body.resting .dot
{
	opacity: .95;
}
body.resting .fretboard
{
	background-color: #333;
	border-color: #444;
}

.inlay
{
	position: absolute;
	top: 0;
	width: 5vmin;
	height: 5vmin;
	border-radius: 50%;
	background: #ddd;
}

#inlay1
{
	left: 25%;
	top: 45.5%;
}

#inlay2, #inlay3
{
	left: 73%;
}

#inlay2
{
	top: 21%;
}

#inlay3
{
	top: 70%;
}

#progressBarWrapper
{
	position: absolute;
	top: 75%;
	left: 0px;
	bottom: 0px;
	height: 25%;
	width: 100%;
}
.progress-wrapper
{
	height: 2rem;
	border: 1px solid #555;
	position: relative;
	top: 50%;
	transform: translateY(-50%);
	width: 50%;
	left: 25%;
	border-radius: 1rem;
	background: #333;
	box-shadow: inset 0px -5px 20px #222;
	overflow: hidden;
}

.progress-wrapper .progress-indicator
{
	background: #0af;
	position: absolute;
	left: 0;
	width: 0%;
	height: 2rem;
	box-shadow: 2px 0px 15px #333, inset -5px 5px 10px #7bf;
	transition: width .25s;
}

#topbar
{
	position: absolute;
	top: 0;
	width: 100%;
	border-bottom: 1px solid #555;
	background: #444;
	z-index: 10;
	text-align: center;
	font-size: 0px;
}

#playbackControls
{
	margin: 0 auto;
	text-align: center;
	font-size: 0;
}


.control-bar-input-wrapper,
.control-bar-button
{
	display: inline-block;
	height: 3rem;
	line-height: 3rem;
	font-size: .9rem;
	padding: 0 1.5rem;
	border-radius: 0px;
	box-sizing: border-box;
	background: none;
	border: none;
	border-left: 1px solid #777;
}

.control-bar-button
{
	line-height: 3rem;
	font-size: 1.2rem;
	cursor: pointer;
}

.control-bar-button:last-child
{
	border-right: 1px solid #777;
}
.control-bar-button:hover
{
	background: #606060;
	border-color: #777;
}
.control-bar-button:focus
{
	outline: none;
}
.control-bar-button:disabled,
.control-bar-button:disabled:hover
{
	background: #363636;
	text-shadow: none;
	color: #555;
}

.control-bar-button.active
{
	background: #0af;
}


#combinationCount
{
	font-size: .8rem;
	vertical-align: top;
	margin-left: .25rem;
	margin-top: -.25rem;
	display: inline-block;
}



@media (min-width: 0px) 
{
	.control-bar-button
	{
		font-size: .9rem;
		padding: 0 1rem;
	}
		
}
</style>