<template>
  <div>
    <q-item v-if="toggleTones" dense class="q-mt-xl q-mr-lg absolute-top-right">
      <q-item-section>
        <q-icon name="notifications_active" color="accent" size="lg" />
      </q-item-section>
      <q-item-section class="text-accent text-subtitle1">
        Tones Enabled
      </q-item-section>
    </q-item>
    <q-fab class="q-ml-xl q-mt-xl absolute-top-left bg-accent" icon="settings">
      <template #label>
        <div class="text-weight-bold">
          <span>A<sub>4</sub></span>
          =
          <span>{{ getA4 }} </span>
          Hz
        </div>
      </template>
      <q-fab-action class="">
        <q-list dense class="q-mt-xl q-pt-xl">
          <q-item>
            <q-item-section>
              <q-btn-dropdown split class="glossy" @click="getFreq">
                <template v-slot:label>
                  <q-item color="accent">
                    <q-item-section avatar>
                      <q-icon name="graphic_eq" color="accent" />
                    </q-item-section>
                    <q-item-label class="text-accent"
                      >Change A<sub>4</sub> Frequency</q-item-label
                    >
                  </q-item>
                </template>
                <q-list v-close-popup separator dense bordered>
                  <q-item-label header>Presets</q-item-label>
                  <q-separator />
                  <q-item
                    :clickable="!is440"
                    :disable="is440"
                    @click="setFreq(440)"
                  >
                    <q-item-section>
                      <q-item-label>440 Hz</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    :clickable="!is432"
                    :disable="is432"
                    @click="setFreq(432)"
                  >
                    <q-item-section>
                      <q-item-label>432 Hz</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section></q-item-section> -->
            <q-item-section>
              <q-toggle
                v-model="toggleTones"
                class="text-accent q-pl-lg q-ml-xl"
                label="Enable Tones"
                color="accent"
                checked-icon="check"
                unchecked-icon="clear"
              />
              <q-tooltip>
                <span class="text-overline">Tones:</span>
                <p class="text-caption">
                  When enabled, select a note to hear it. (must be disabled to
                  enable to tuner)
                </p>
              </q-tooltip>
            </q-item-section>
            <!-- <q-item-section side></q-item-section> -->
          </q-item>
        </q-list>
      </q-fab-action>
    </q-fab>
  </div>
</template>
<script>
export default {
  name: "TunerMenuLG",
  props: {
    app: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    toggleTones: {
      get() {
        return !this.app?.notes.isAutoMode;
      },
      set(value) {
        this.app?.notes.toggleAutoMode();
        this.enableTones = !this.app.notes.isAutoMode || false;
      },
    },
    getA4() {
      return this.app?.a4;
    },
    is440() {
      return this.app?.notes.a4 === 440;
    },
    is432() {
      return this.app?.notes.a4 === 432;
    },
  },
  methods: { 
    getQ(obj) {
      return DEBUG_INFO;
    },
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
          standout: true,
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
  destroyed() {
    this.app?.stop();
  },
};
</script>
