<template>
  <q-item
    clickable
    v-ripple
    active-class="bg-accent text-white"
    :key="index"
    @click.stop.prevent="$root.$emit('toggle-active', loop)"
    :active="active"
  >
    <q-item-section avatar>
      <q-icon name="mdi-autorenew" />
    </q-item-section>
    <q-item-section class="text-center">
      <q-item-label>
        {{ loop[0] }}
      </q-item-label>
    </q-item-section>
    <q-item-section side avatar>
      <q-icon name="mdi-plus-circle" v-show="!active" />
      <q-icon name="mdi-check-circle" v-show="active" />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: ["loop", "index", "active"]
};
</script>

<style lang="scss" scoped></style>
