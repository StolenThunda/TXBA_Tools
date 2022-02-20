<template>
  <div>
    <div  
      v-if="memberLoops.memberLoopCollections.length >= 1">
      <q-expansion-item
        v-for="memberLoop in memberLoops.memberLoopCollections"
        :label="getMember(memberLoop)"
        :key="getMember(memberLoop)"
        :id="memberLoop"
        header-class="bg-accent text-white"
        dense-toggle
        dense
        popup
      >
        <!-- <pre>{{ memberLoop }}</pre> -->
        <loop-list
          :loopArray="memberLoop.memberLoops"
          :altMessage="altMessage"
          :collectionID="collectionID"
        />
      </q-expansion-item>
    </div>
    <!-- <div v-else>
      {{ altMessage }}
    </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex"
import LoopList from "./LoopList"
export default {
  name: "MemberLoopList",
  data: () => ({
    altMessage: "There are no community loops for this item.",
    idx: 0,
    collectionID: 2
  }),
  components: {
    LoopList
  },
  computed: {
    ...mapState("watch", ["memberLoops"])
  },
  methods: {
    getMember(objLoop) {
      return objLoop?.memberName || "";
    }
  }
};
</script>

<style lang="scss" scoped></style>
