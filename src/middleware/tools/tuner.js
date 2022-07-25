import aubio from "aubiojs";
import { consoleMessage, getMicrophonePermission } from "./tunerLib.js";

export var DEBUG_INFO = null;
let audioinputInstalled = (window.audioinput !== undefined);
const ConsoleMessage = (...message) => {
  // console.trace(message);
  DEBUG_INFO += `\n ${message}`;
  consoleMessage(message);
};

const onAudioInput = (evt) => {
  // 'evt.data' is an integer array containing raw audio data
  
  ConsoleMessage("Audio data received: " + evt.data.length + " samples");
  // ... do something with the evt.data array ...
  ConsoleMessage( typeof evt );
};

const onAudioInputError = (error) => {
  alert("onAudioInputError event recieved: " + JSON.stringify(error));
};

// Listen to audioinput events
window.addEventListener("audioinput", onAudioInput, false);

// Listen to audioinputerror events
window.addEventListener("audioinputerror", onAudioInputError, false);

//#region Tuner
export const Tuner = function (a4, isIOS) {
  this.info = null;
  this.middleA = a4 || 440;
  this.semitone = 69;
  this.bufferSize = 4096;
  this.noteStrings = [
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "A♯",
    "B",
  ];
  this.isIOS = isIOS || false;
  if (this.isIOS) {
    ConsoleMessage("initialize IOS tuner");
    this.checkIOSPerms();
  } else {
    this.initGetUserMedia();
    ConsoleMessage("initialize WebAudio tuner");
  }
};

Tuner.prototype.initGetUserMedia = function () {
  this.audioContext = window.AudioContext || window.webkitAudioContext;
  if (!this.audioContext) {
    return alert("AudioContext not supported");
  }  

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert("getUserMedia is not implemented in this browser");
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function (resolve, reject) {
        getUserMedia?.call(navigator, constraints, resolve, reject);
      });
    };
  }
};

Tuner.prototype.startRecord = async function () {
  const self = this;
  if (self.isIOS || audioinputInstalled) {
    // ConsoleMessage("Microphone input starting...");
    window.audioinput.start();
    this.audioContext = window.audioinput.getAudioContext();
    let stream = window.audioinput.getStream();
    // ConsoleMessage(`stream: ${stream}`);
    await self.setup( stream )
    .then( () => {
      ConsoleMessage("Microphone input started!");
      } )
      .catch( ( err ) => {
        ConsoleMessage( `IsIOS / AI Installed Error: ${err}` );
      });
  } else {
    await navigator.mediaDevices
      .getUserMedia( { audio: true } )
      .then( ( stream ) => {
        ConsoleMessage("Microphone: " + stream);
        self.setup( stream );
      } )
      .catch((error) =>{
        alert(`mediadevices error: ${error.name} = ${error.message}`);
      } );
  }
};

Tuner.prototype.setup = async function (stream) {
  ConsoleMessage("setup", stream);
  const self = this;
  // self.audioContext = self.getAudioContext();
  // if (!stream && audioinputInstalled) stream = window.audioinput.getStream();
  let source = self.audioContext.createMediaStreamSource(stream);
  source
    .connect(self.analyser)
    .connect(self.workletNode)
    .connect(self.audioContext.destination);
  // ConsoleMessage("Microphone input started!");
};

Tuner.prototype.getWorkletNode = async function ( ctx ) {
  if ( ctx.audioWorklet ) {
    console.log( `ctx.audioWorklet: ${ctx.audioWorklet}` );
    return ctx.audioWorklet
      .addModule( "worklets/tuner.worklet.js" )
      .then( async () => {
        // ConsoleMessage("worklet loaded")
        let tunerNode = await new AudioWorkletNode(
          this.audioContext,
          "tuner-proc"
        );
        tunerNode.port.onmessage = ( e ) => {
          if ( e.data instanceof Float32Array ) {
            const audioData = e.data;
            // process pcm data
            const frequency = this.pitchDetector.do( audioData );
            ConsoleMessage( "worklet data: ", audioData );
            if ( frequency && this.onNoteDetected ) {
              const note = this.getNote( frequency );
              this.onNoteDetected( {
                name: this.noteStrings[note % 12],
                value: note,
                cents: this.getCents( frequency, note ),
                octave: parseInt( note / 12 ) - 1,
                frequency: frequency,
              } );
            }
          }
        };
        return tunerNode;
      } )
      .catch( ( err ) => {
        console.log( `worklet error: ${err}` );
      } );
  }
}



Tuner.prototype.getAudioContext = function () {
  let ctx;
  if (this.audioContext) ctx = this.audioContext;
  if (window.audioinput) ctx = window.audioinput.getAudioContext();
  // if ( navigator.mediaDevices instanceOf Object)
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
};

Tuner.prototype.init = async function () {
  this.audioContext = this.getAudioContext();
  this.analyser = this.audioContext.createAnalyser();
  this.workletNode = await this.getWorkletNode(this.audioContext);

  const self = this;

  aubio().then(function (aubio) {
    self.pitchDetector = new aubio.Pitch(
      "default",
      self.bufferSize,
      1,
      self.audioContext.sampleRate
    );
    self.startRecord();
  } );
  console.dir(this);
};

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Tuner.prototype.getNote = function (frequency) {
  const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
  return Math.round(note) + this.semitone;
};

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Tuner.prototype.getStandardFrequency = function (note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12);
};

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Tuner.prototype.getCents = function (frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
  );
};

/**
 * play the musical note
 *
 * @param {number} frequency
 */
Tuner.prototype.play = function (frequency) {
  this.audioContext = this.getAudioContext();
  // ConsoleMessage(`audioContext: ${this.audioContext}`);
  if (!this.oscillator) {
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.audioContext.destination);
    this.oscillator.start();
  }
  this.oscillator.frequency.value = frequency;
};

Tuner.prototype.stop = function () {
  if (this.oscillator) {
    this.oscillator.stop();
    this.oscillator = null;
  }

  // ConsoleMessage("Stopped!");
};

Tuner.prototype.checkIOSPerms = function () {
  try {
    if (window.audioinput && !window.audioinput.isCapturing()) {
      getMicrophonePermission(
        this.setup(window.audioinput.getStream()),
        ConsoleMessage,
        ConsoleMessage
      );
    } else {
      ConsoleMessage("Already capturing!");
    }
  } catch (ex) {
    ConsoleMessage("startCapture exception: " + ex);
  }
};
//#endregion

//#region Notes
export const Notes = function (selector, tuner) {
  this.tuner = tuner;
  this.isAutoMode = true;
  this.$root = document.querySelector(selector);
  this.$notesList = this.$root.querySelector(".notes-list");
  this.$frequency = this.$root.querySelector(".frequency");
  this.$notes = [];
  this.$notesMap = {};
  this.createNotes();
};

Notes.prototype.createNotes = function () {
  const minOctave = 2;
  const maxOctave = 5;
  for (var octave = minOctave; octave <= maxOctave; octave += 1) {
    for (var n = 0; n < 12; n += 1) {
      const $note = document.createElement("div");
      $note.className = "note";
      $note.dataset.name = this.tuner.noteStrings[n];
      $note.dataset.value = 12 * (octave + 1) + n;
      $note.dataset.octave = octave.toString();
      $note.dataset.frequency = this.tuner.getStandardFrequency(
        $note.dataset.value
      );
      $note.innerHTML =
        $note.dataset.name[0] +
        '<span class="note-sharp">' +
        ($note.dataset.name[1] || "") +
        "</span>" +
        '<span class="note-octave">' +
        $note.dataset.octave +
        "</span>";
      this.$notesList.appendChild($note);
      this.$notes.push($note);
      this.$notesMap[$note.dataset.value] = $note;
    }
  }

  const self = this;
  this.$notes.forEach(function ($note) {
    $note.addEventListener("click", function () {
      if (self.isAutoMode) {
        return;
      }

      const $active = self.$notesList.querySelector(".active");
      if ($active === this) {
        self.tuner.stop();
        $active.classList.remove("active");
      } else {
        self.tuner.play(this.dataset.frequency);
        self.update($note.dataset);
      }
    });
  });
};

Notes.prototype.active = function ($note) {
  // ConsoleMessage("active note:", $note);
  this.clearActive();
  $note.classList.add("active");
  this.$notesList.scrollLeft =
    $note.offsetLeft - (this.$notesList.clientWidth - $note.clientWidth) / 2;
};

Notes.prototype.clearActive = function () {
  const $active = this.$notesList.querySelector(".active");
  if ($active) {
    $active.classList.remove("active");
  }
};

Notes.prototype.update = function (note) {
  // ConsoleMessage("update note val", note.value);
  if (note.value in this.$notesMap) {
    this.active(this.$notesMap[note.value]);
    this.$frequency.childNodes[0].textContent = parseFloat(
      note.frequency
    ).toFixed(1);
  }
};

Notes.prototype.toggleAutoMode = function () {
  if (this.isAutoMode) {
    this.clearActive();
  } else {
    this.tuner.stop();
  }
  this.isAutoMode = !this.isAutoMode;
};
//#endregion

//#region Meter
/**
 * @param {string} selector
 * @constructor
 */
export const Meter = function (selector) {
  this.$root = document.querySelector(selector);
  this.$pointer = this.$root.querySelector(".meter-pointer");
  this.init();
};

Meter.prototype.init = function () {
  for (var i = 0; i <= 10; i += 1) {
    const $scale = document.createElement("div");
    $scale.className = "meter-scale";
    $scale.style.transform = "rotate(" + (i * 9 - 45) + "deg)";
    if (i % 5 === 0) {
      $scale.classList.add("meter-scale-strong");
    }
    this.$root.appendChild($scale);
  }
};

/**
 * @param {number} deg
 */
Meter.prototype.update = function (deg) {
  ConsoleMessage(`deg: ${deg}`);
  this.$pointer.style.transform = "rotate(" + deg + "deg)";
};
//#endregion

//#region Frequency Bars
/**
 * the frequency histogram
 *
 * @param {string} selector
 * @constructor
 */
export const FrequencyBars = function (selector) {
  this.$canvas = document.querySelector(selector);
  this.$canvas.width = document.body.clientWidth;
  this.$canvas.height = document.body.clientHeight / 2;
  this.canvasContext = this.$canvas.getContext("2d");
};

/**
 * @param {Uint8Array} data
 */
FrequencyBars.prototype.update = function ( data ) {
  // ConsoleMessage(`data: ${data}`);
  const length = 64; // low frequency only
  const width = this.$canvas.width / length - 0.5;
  this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  this.canvasContext.globalAlpha = 0.35;
  for (var i = 0; i < length; i += 1) {
    this.canvasContext.fillStyle = "#ef6c00";
    this.canvasContext.fillRect(
      i * (width + 0.5),
      this.$canvas.height - data[i],
      width,
      data[i]
    );
  }
};
//#endregion

//#region Application
export const Application = function (isIOS) {
  this.a4 = parseInt(localStorage.getItem("a4")) || 440;
  this.tuner = new Tuner(this.a4, isIOS);
  this.notes = new Notes(".notes", this.tuner);
  this.meter = new Meter(".meter");
  this.frequencyBars = new FrequencyBars(".frequency-bars");
  this.update({
    name: "A",
    frequency: this.a4,
    octave: 4,
    value: 69,
    cents: 0,
  });
};

Application.prototype.start = function () {
  const self = this;

  this.tuner.onNoteDetected = function (note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note);
      } else {
        self.lastNote = note.name;
      }
    }
  };
  this.updateFrequencyBars();
  this.tuner.init();
  this.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
};

Application.prototype.stop = function () {
  if (window.audioinput && window.audioinput.isCapturing()) {
    window.audioinput.stop();
  }
};

Application.prototype.updateFrequencyBars = function () {
  if (this.tuner.isIOS && this.frequencyData) {
    let data = Object.values(this.frequencyData);
    if (data.some((v) => v > 0)) {
      // ConsoleMessage(`freq obj update (${data.some((v) => v > 0)}): ${data}`);
      this.frequencyData = new Uint8Array(data);
    }
  }

  if (this.tuner.analyser) {
    let data = new Uint8Array(Object.values(this.frequencyData));
    this.tuner.analyser.getByteFrequencyData(data);

    this.frequencyBars.update(data);
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this));
};

Application.prototype.update = function (note) {
  // ConsoleMessage("app update", note.cents);
  this.notes.update(note);
  this.meter.update((note.cents / 50) * 45);
};

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function () {
  this.notes.toggleAutoMode();
};

Application.prototype.getQVAR = function (obj) {
  return JSON.stringify(window.audioinput, null, 2);
};
//#endregion
