<template>
  <div>
    <canvas class="frequency-bars"></canvas>
    <div class="meter">
      <div class="meter-dot"></div>
      <div class="meter-pointer"></div>
    </div>
    <div class="notes">
      <div class="notes-list"></div>
      <div class="frequency text-h5"><span></span>Hz</div>
      <div>
        <!-- <q-btn
          class="q-ma-xl"
          color="accent"
          @click="getFreq"
          label="Change Frequency"
        /> -->
       <q-btn
        class="q-ma-xl"
          color="accent"
          @click="getFreq"
          icon="graphic_eq"
          stacked 
          push
          glossy
          rounded
          >
          <div class="text-h4">
            A<sub>4</sub>=<span>{{ getA4 }} </span>
            Hz
          </div>
        </q-btn>
      </div>
    </div>
  </div>
</template>
<script>
import { Application } from "../../middleware/tools/tuner.js";

export default {
  name: "Tuner",
  data: () => ({
    app: null,
  }),
  computed: {
    getA4() {
      return this.app?.a4 || "440";
    },
  },
  mounted() {
    this.app =  new Application()
    this.app.start();
  },
  methods: {
    setFreq(freq) {
      this.app.a4 = freq;
      this.app.tuner.middleA = freq;
      this.app.notes.createNotes();
      this.app.update({
        name: "A",
        frequency: this.app.a4,
        octave: 4,
        value: 69,
        cents: 0,
      });
      localStorage.setItem("a4", freq);
    },
    getFreq() {
      this.$q
        .dialog({
          title: "Frequency",
          message: "What frequency would you like to tune to?",
          prompt: {
            model: this.app.a4 || 440,
            type: "number", // optional
          },
          cancel: true,
        })
        .onOk((data) => {
          console.log(">>>> OK, received", data);
          this.setFreq(data);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
  },
};
</script>

<style>
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
  color: #ef6c00;
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

/* .frequency {
  font-size: 32px;
} */

/* .frequency span {
  font-size: 50%;
  margin-left: 0.25em;
} */

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
</style>
