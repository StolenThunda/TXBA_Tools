<template>
  <q-layout view="hHh lpR fFf" style="height: 100vh">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-h5 text-weight-bolder"
          >Chromatic Tuner</q-toolbar-title
        >
        <q-space />

        <q-btn label="Back" color="accent" icon="close" to="/tools" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="q-mt-xl">
        <canvas class="frequency-bars"></canvas>
        <div class="meter">
          <div class="meter-dot"></div>
          <div class="meter-pointer"></div>
        </div>
        <div class="notes">
          <div class="notes-list"></div>
          <div class="frequency"><span>Hz</span></div>
        </div>
        <div class="a4">A<sub>4</sub> = <span>440</span> Hz</div>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script>


// import { Application } from "../../middleware/tools/tuner.js"
import swal from 'sweetalert2/dist/sweetalert2.js'
import aubio from "aubiojs"
export const Tuner = function ( a4 ) {
  this.middleA = a4 || 440
  this.semitone = 69
  this.bufferSize = 4096
  this.noteStrings = [
    'C',
    'C♯',
    'D',
    'D♯',
    'E',
    'F',
    'F♯',
    'G',
    'G♯',
    'A',
    'A♯',
    'B'
  ]

  this.initGetUserMedia()
}

Tuner.prototype.initGetUserMedia = function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext
  if (!window.AudioContext) {
    return alert('AudioContext not supported')
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        alert('getUserMedia is not implemented in this browser')
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }
}

Tuner.prototype.startRecord = function () {
  const self = this
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function(stream) {
      self.audioContext.createMediaStreamSource(stream).connect(self.analyser)
      self.analyser.connect(self.scriptProcessor)
      self.scriptProcessor.connect(self.audioContext.destination)
      self.scriptProcessor.addEventListener('audioprocess', function(event) {
        const frequency = self.pitchDetector.do(
          event.inputBuffer.getChannelData(0)
        )
        if (frequency && self.onNoteDetected) {
          const note = self.getNote(frequency)
          self.onNoteDetected({
            name: self.noteStrings[note % 12],
            value: note,
            cents: self.getCents(frequency, note),
            octave: parseInt(note / 12) - 1,
            frequency: frequency
          })
        }
      })
    })
    .catch(function(error) {
      alert(error.name + ': ' + error.message)
    })
}

Tuner.prototype.init = function() {
  this.audioContext = new window.AudioContext()
  this.analyser = this.audioContext.createAnalyser()
  this.scriptProcessor = this.audioContext.createScriptProcessor(
    this.bufferSize,
    1,
    1
  )

  const self = this

  aubio().then(function(aubio) {
    self.pitchDetector = new aubio.Pitch(
      'default',
      self.bufferSize,
      1,
      self.audioContext.sampleRate
    )
    self.startRecord()
  })
}

/**
 * get musical note from frequency
 *
 * @param {number} frequency
 * @returns {number}
 */
Tuner.prototype.getNote = function(frequency) {
  const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2))
  return Math.round(note) + this.semitone
}

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
Tuner.prototype.getStandardFrequency = function(note) {
  return this.middleA * Math.pow(2, (note - this.semitone) / 12)
}

/**
 * get cents difference between given frequency and musical note's standard frequency
 *
 * @param {number} frequency
 * @param {number} note
 * @returns {number}
 */
Tuner.prototype.getCents = function(frequency, note) {
  return Math.floor(
    (1200 * Math.log(frequency / this.getStandardFrequency(note))) / Math.log(2)
  )
}

/**
 * play the musical note
 *
 * @param {number} frequency
 */
Tuner.prototype.play = function(frequency) {
  if (!this.oscillator) {
    this.oscillator = this.audioContext.createOscillator()
    this.oscillator.connect(this.audioContext.destination)
    this.oscillator.start()
  }
  this.oscillator.frequency.value = frequency
}

Tuner.prototype.stop = function() {
  this.oscillator.stop()
  this.oscillator = null
}
export const Notes = function ( selector, tuner ) {
  this.tuner = tuner
  this.isAutoMode = true
  this.$root = document.querySelector(selector)
  this.$notesList = this.$root.querySelector('.notes-list')
  this.$frequency = this.$root.querySelector('.frequency')
  this.$notes = []
  this.$notesMap = {}
  this.createNotes()
}

Notes.prototype.createNotes = function() {
  const minOctave = 2
  const maxOctave = 5
  for (var octave = minOctave; octave <= maxOctave; octave += 1) {
    for (var n = 0; n < 12; n += 1) {
      const $note = document.createElement('div')
      $note.className = 'note'
      $note.dataset.name = this.tuner.noteStrings[n]
      $note.dataset.value = 12 * (octave + 1) + n
      $note.dataset.octave = octave.toString()
      $note.dataset.frequency = this.tuner.getStandardFrequency(
        $note.dataset.value
      )
      $note.innerHTML =
        $note.dataset.name[0] +
        '<span class="note-sharp">' +
        ($note.dataset.name[1] || '') +
        '</span>' +
        '<span class="note-octave">' +
        $note.dataset.octave +
        '</span>'
      this.$notesList.appendChild($note)
      this.$notes.push($note)
      this.$notesMap[$note.dataset.value] = $note
    }
  }

  const self = this
  this.$notes.forEach(function($note) {
    $note.addEventListener('click', function() {
      if (self.isAutoMode) {
        return
      }

      const $active = self.$notesList.querySelector('.active')
      if ($active === this) {
        self.tuner.stop()
        $active.classList.remove('active')
      } else {
        self.tuner.play(this.dataset.frequency)
        self.update($note.dataset)
      }
    })
  })
}

Notes.prototype.active = function($note) {
  this.clearActive()
  $note.classList.add('active')
  this.$notesList.scrollLeft =
    $note.offsetLeft - (this.$notesList.clientWidth - $note.clientWidth) / 2
}

Notes.prototype.clearActive = function() {
  const $active = this.$notesList.querySelector('.active')
  if ($active) {
    $active.classList.remove('active')
  }
}

Notes.prototype.update = function(note) {
  if (note.value in this.$notesMap) {
    this.active(this.$notesMap[note.value])
    this.$frequency.childNodes[0].textContent = parseFloat(
      note.frequency
    ).toFixed(1)
  }
}

Notes.prototype.toggleAutoMode = function() {
  if (this.isAutoMode) {
    this.clearActive()
  }
  this.isAutoMode = !this.isAutoMode
}

/**
 * @param {string} selector
 * @constructor
 */
export const Meter = function(selector) {
  this.$root = document.querySelector(selector)
  this.$pointer = this.$root.querySelector('.meter-pointer')
  this.init()
}

Meter.prototype.init = function() {
  for (var i = 0; i <= 10; i += 1) {
    const $scale = document.createElement('div')
    $scale.className = 'meter-scale'
    $scale.style.transform = 'rotate(' + (i * 9 - 45) + 'deg)'
    if (i % 5 === 0) {
      $scale.classList.add('meter-scale-strong')
    }
    this.$root.appendChild($scale)
  }
}

/**
 * @param {number} deg
 */
Meter.prototype.update = function(deg) {
  this.$pointer.style.transform = 'rotate(' + deg + 'deg)'
}

/**
 * the frequency histogram
 *
 * @param {string} selector
 * @constructor
 */
export const FrequencyBars = function(selector) {
  this.$canvas = document.querySelector(selector)
  this.$canvas.width = document.body.clientWidth
  this.$canvas.height = document.body.clientHeight / 2
  this.canvasContext = this.$canvas.getContext('2d')
}

/**
 * @param {Uint8Array} data
 */
FrequencyBars.prototype.update = function(data) {
  const length = 64 // low frequency only
  const width = this.$canvas.width / length - 0.5
  this.canvasContext.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
  for (var i = 0; i < length; i += 1) {
    this.canvasContext.fillStyle = '#ecf0f1'
    this.canvasContext.fillRect(
      i * (width + 0.5),
      this.$canvas.height - data[i],
      width,
      data[i]
    )
  }
}

export const Application = function () {
  this.initA4()
  this.tuner = new Tuner(this.a4)
  this.notes = new Notes('.notes', this.tuner)
  this.meter = new Meter('.meter')
  this.frequencyBars = new FrequencyBars('.frequency-bars')
  this.update({ name: 'A', frequency: this.a4, octave: 4, value: 69, cents: 0 })
}

Application.prototype.initA4 = function () {
  this.$a4 = document.querySelector('.a4 span')
  this.a4 = parseInt(localStorage.getItem('a4')) || 440
  this.$a4.innerHTML = this.a4
}

Application.prototype.start = function() {
  const self = this

  this.tuner.onNoteDetected = function(note) {
    if (self.notes.isAutoMode) {
      if (self.lastNote === note.name) {
        self.update(note)
      } else {
        self.lastNote = note.name
      }
    }
  }

  swal.fire('Welcome online tuner!').then(function() {
    self.tuner.init()
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount)
  })

  this.$a4.addEventListener('click', function () {
    swal.fire({
      input: 'number',
      inputValue: self.a4,
    }).then(function ({ value: a4 }) {
      if (!parseInt(a4) || a4 === self.a4) {
        return
      }
      self.a4 = a4
      self.$a4.innerHTML = a4
      self.tuner.middleA = a4
      self.notes.createNotes()
      self.update({ name: 'A', frequency: self.a4, octave: 4, value: 69, cents: 0 })
      localStorage.setItem('a4', a4)
    })
  })

  this.updateFrequencyBars()
}

Application.prototype.updateFrequencyBars = function() {
  if (this.tuner.analyser) {
    this.tuner.analyser.getByteFrequencyData(this.frequencyData)
    this.frequencyBars.update(this.frequencyData)
  }
  requestAnimationFrame(this.updateFrequencyBars.bind(this))
}

Application.prototype.update = function(note) {
  this.notes.update(note)
  this.meter.update((note.cents / 50) * 45)
}

// noinspection JSUnusedGlobalSymbols
Application.prototype.toggleAutoMode = function() {
  this.notes.toggleAutoMode()
}

export default {
  mounted(){

    const app = new Application();
    app.start()
  }
}
</script>

<style>
@import "*sweetalert2/src/sweetalert2.scss";
html {
  height: 100%;
}

body {
  position: fixed;
  font-family: sans-serif;
  color: #2c3e50;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.notes {
  margin: auto;
  width: 400px;
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
}

.note {
  font-size: 90px;
  font-weight: bold;
  position: relative;
  display: inline-block;
  padding-right: 30px;
  padding-left: 10px;
}

.note.active {
  color: #e74c3c;
}

.notes-list {
  overflow: auto;
  overflow: -moz-scrollbars-none;
  white-space: nowrap;
  -ms-overflow-style: none;
  -webkit-mask-image: -webkit-linear-gradient(
    left,
    rgba(255, 255, 255, 0),
    #fff,
    rgba(255, 255, 255, 0)
  );
}

.notes-list::-webkit-scrollbar {
  display: none;
}

.note {
  -webkit-tap-highlight-color: transparent;
}

.note span {
  position: absolute;
  right: 0.25em;
  font-size: 40%;
  font-weight: normal;
}

.note-sharp {
  top: 0.3em;
}

.note-octave {
  bottom: 0.3em;
}

.frequency {
  font-size: 32px;
}

.frequency span {
  font-size: 50%;
  margin-left: 0.25em;
}

.meter {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50%;
  width: 400px;
  height: 33%;
  margin: 0 auto 5vh auto;
}

.meter-pointer {
  width: 2px;
  height: 100%;
  background: #2c3e50;
  transform: rotate(45deg);
  transform-origin: bottom;
  transition: transform 0.5s;
  position: absolute;
  right: 50%;
}

.meter-dot {
  width: 10px;
  height: 10px;
  background: #2c3e50;
  border-radius: 50%;
  position: absolute;
  bottom: -5px;
  right: 50%;
  margin-right: -4px;
}

.meter-scale {
  width: 1px;
  height: 100%;
  transform-origin: bottom;
  transition: transform 0.2s;
  box-sizing: border-box;
  border-top: 10px solid;
  position: absolute;
  right: 50%;
}

.meter-scale-strong {
  width: 2px;
  border-top-width: 20px;
}

.frequency-bars {
  position: fixed;
  bottom: 0;
}

@media (max-width: 768px) {
  .meter {
    width: 100%;
  }

  .notes {
    width: 100%;
  }
}

.swal-button {
  background: #2c3e50;
}

.a4 {
  position: absolute;
  top: 16px;
  left: 16px;
}

.a4 span {
  color: #e74c3c;
}
</style>
