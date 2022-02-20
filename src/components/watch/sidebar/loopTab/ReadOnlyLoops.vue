<template>
  <div v-if="ProPlayer.theSegment">
    <loop-list v-bind="loopData" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import LoopList from "components/watch/sidebar/loopTab/LoopList";
export default {
  name: "ReadOnlyLoops",
  components: { LoopList },
  mounted() {
    this.ProPlayer.loopsManager.createNewCollection(
      "loopList",
      "system",
      false
    );
    this.ProPlayer.loopsManager.addListToCollectionFromArray(
      this.ProPlayer.theSegment.getLoopsArray(),
      "system"
    );
  },
  computed: {
    loopData() {
      const msg = "This item does not have any instant loops.";
      const loops = this.ProPlayer.theSegment.getLoopsArray() || [];
      console.info("setting loopdata", loops);
      return {
        altMessage: msg,
        loopArray: loops,
        collectionID: this.TXBALoops ? 0 : 2
      };
    },
    ...mapState("watch", ["ProPlayer"])
  }
};
</script>
