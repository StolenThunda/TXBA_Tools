import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import TXBA_Utilities from "../middleware/txba_helpers";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    _spinnerState: false,
    TXBA_UTILS:  new TXBA_Utilities()
  },
  getters: {
    req: state => state.TXBA_UTILS.getAsyncData
  },
  actions: {
    loadModules() {
      // auto init namespaced stores if the have an "initStore" action
      for (const moduleName of Object.keys(modules)) {
        if (
          modules[moduleName].actions &&
          modules[moduleName].actions.initStore
        ) {
          store.dispatch(`${moduleName}/initStore`);
        }
      }
    },
    initStore() {
      store.dispatch("loadModules");
    }
  },
  
  modules
});

store.dispatch("initStore");
export default store;
