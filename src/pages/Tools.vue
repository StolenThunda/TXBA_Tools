<template>
      <q-page class="
      fit
      row 
      flex 
      flex-center
      justify-around
      "
      >

     <q-btn
      icon="list"
        label=""
        size="2em"
        to="/tools/fretboard"
        class="bg-primary q-pa-xl"
        exact
        stack
        glossy
        >Fretboard <br />Tool</q-btn>

      <q-btn
        label=""
        size="2em"
        to="/tools/spider"
        class="bg-primary q-pa-xl"
        exact
        stack
        glossy
        disable
        title="Under Construction"
        icon="bug_report">Spider <br />Tool</q-btn>

     <q-btn
        label="Tuner"
        size="2.5em"
        icon="speed"
        stack
        glossy
        class="bg-primary q-pa-xl"
        to="/tools/tuner"
        exact></q-btn>
    </q-page>
</template>

<script>
export default {

}
</script>

<style>

</style>