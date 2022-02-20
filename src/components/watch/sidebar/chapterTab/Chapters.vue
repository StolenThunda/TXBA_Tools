<template>
  <div>
    <q-toolbar class="bg-primary shadow-2 tab-title">
      <q-toolbar-title class="text-capitalize text-caption">
        Chapters
      </q-toolbar-title>
    </q-toolbar>
    <chapter-list v-bind="chapterData" />
  </div>
</template>

<script>
import ChapterList from "./ChapterList";
import { mapState } from "vuex";
export default {
  name: "Chapters",
  components: {
    ChapterList
  },
  computed: {
    chapterData() {
      return {
        altMessage: "This segment does not have any chapter markers.",
        chapterArray: this.ProPlayer.theSegment.getChaptersArray() || []
      };
    },
    ...mapState("watch", ["ProPlayer"])
  }
};
</script>

<style lang="scss" scoped></style>
