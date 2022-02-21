<template>
  <q-page class="fit row flex flex-center justify-around">
    <q-btn
      v-for="(tool, i) in toolList"
      :key="i"
      v-bind="Object.assign({}, props, tool)"
    />
  </q-page>
</template>

<script>
export default {
  data: () => ({
    props: {
      size: "xl",
      stack: true,
      dense: true,
      glossy: true,
      push: true,
      rounded: true,
      class: "bg-accent q-pa-md",
      style: "min-width: 25vw; min-height: 25vh",
    },
    toolList: [
      {
        icon: "list",
        to: "/tools/fretboard",
        label: "Fretboard Tool",
      },
      {
        to: "/tools/spider",
        // title: "Under Construction",
        // disable: true,
        // glossy: false,
        icon: "bug_report",
        label: "Spider Tool",
      },
      {
        to: "/tools/tuner",
        label: "Chromatic Tuner",
        icon: "speed",
      },
    ],
  }),
};
</script>

<style></style>
