<template>
  <div>
    <q-list v-if="chapterArray.length"  bordered separator dense
      class="q-mr-xs">
      <template v-for="[index, chapter] in chapterArray.entries()">
        <q-item
          clickable
          v-ripple
          active-class="text-orange"
          :id="getItemName(chapter)"
          :key="getItemName(chapter) + collectionID + componentKey + index"
          @click.prevent="setSeekToTime(chapter[1])"
        >
          <q-item-section avatar>
            <q-icon name="mdi-bookmark" />
          </q-item-section>
          <q-item-section class="text-center">
            <q-item-label>
              {{ chapter[0] }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <p v-else>{{ altMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ChapterList",
  props: {
    chapterArray: {
      type: Array,
      default: () => []
    },
    altMessage: {
      type: String,
      default: "No Alt Message or Data"
    },
    collectionID: {
      type: Number,
      default: () => 0
    }
  },
  data: () => ({ activeList: {}, componentKey: 0 }),
  created() {
    if (this.chapterArray.length) {
      this.chapterArray.map(chapter => {
        const key = this.getActiveItemName(chapter);
        this.activeList[key] = false;
        Object.assign({}, this, this.activeList);
      });
    }
  },
  methods: {
    loopSelected(idx) {
      const selection = {
        nCollectionID: this.collectionID,
        nListIndex: 0,
        nLoopIndex: idx
      };
      console.log('chap selection', selection)
      this.setLoopSelected(selection);
    },
    getActiveItemName(val) {
      return this.getItemName(val) + "_active";
    },
    getItemName(val) {
      const name = val[0].replace(/\s/g, "") || "";
      // console.log("getIName", name);
      return name;
    },
    ...mapActions("watch", ["setSeekToTime", "setLoopSelected"])
  }
};
</script>
