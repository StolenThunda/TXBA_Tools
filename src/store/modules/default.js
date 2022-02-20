import Vue from "vue";

export default {
  namespaced: true,
  state: {
    sidebarTabs: [],
    favorites: [],
    notifications: null
  },
  mutations: {
    RESET_SIDEBAR(ctx) {
      // console.log(`Resetting Sidebar to default: ${JSON.stringify(ctx)}`);
      ctx.sidebarTabs = [];
    },
    SET_FAVS(ctx, favs) {
      // console.log("SettingFAVS:", favs);
      Vue.set(ctx, "favorites", favs);
      // console.log('Set favs', ctx.favorites)
    },
    SET_NOTIFICATIONS(ctx, notes) {
      // console.log("SettingNotes:", notes);
      if (notes) ctx.notifications = notes;
    },
    ADD_SB_TABS(ctx, tabs) {
      // console.log(`Before adding tab: \n${JSON.stringify(ctx.sidebarTabs, null, 2)}`);
      if (tabs) {
        tabs.forEach((tab, idx) => {
          // console.log(`InspTab ${JSON.stringify(tab)}`);
          const tabIdx = ctx.sidebarTabs.findIndex(x => x.name === tab.name);
          // console.log(`Found: ${Boolean(tabIdx > -1)}`);
          if (tabIdx == -1) {
            tab.id = idx;
            // console.log(`adding new: ${JSON.stringify(tab)}`);
            ctx.sidebarTabs.unshift(tab);
            // console.log(`After adding tab: \n${JSON.stringify(ctx.sidebarTabs, null, 2)}`);
            console.log();
          }
        }, ctx);
      }
    },
    DELETE_SIDEBAR_TABS(state, arr_str_name) {
      // console.log(`Before Removing tab: \n${JSON.stringify(state.sidebarTabs, null, 2)}`);
      if (Array.isArray(arr_str_name)) {
        for (let i = 0; i < arr_str_name.length; i++) {
          let el = arr_str_name[i];
          let filterTabs = state.sidebarTabs.filter(tab => tab.name !== el);
          // console.log(`filtered ${el}`);
          Vue.set(state, "sidebarTabs", filterTabs);
        }
      } else {
        let filterTabs = state.sidebarTabs.filter(
          tab => tab.name !== arr_str_name
        );
        // console.log("filtered", filterTabs);
        Vue.set(state, "sidebarTabs", filterTabs);
      }
      // console.log(`After Removing tab: \n${JSON.stringify(state.sidebarTabs, null, 2)}`);

    },
    FAVORITE(state, objFav) {
      state.favorites.push(objFav);
    },
    UNFAVORITE(state, objFav) {
      // console.log(state.favorites);
      let filteredFavs = state.favorites.filter(el => el.id !== objFav.id);
      // console.log("filtered", filteredFavs);
      Vue.set(state, "favorites", filteredFavs);
      return false;
    }
  },
  actions: {
    resetSideBar(ctx) {
      ctx.commit("RESET_SIDEBAR", ctx);
      ctx.dispatch("setDefaultTabs");
    },
    setDefaultTabs(ctx) {
      const tabs = [
        {
          name: "Favorites",
          componentName: "FavList",
          icon: "favorite",
          iconOnly: true,
          cmp: () => import("components/base/FavoritesList.vue")
        }
      ];
      // console.log(`Adding Def Tab: ${JSON.stringify(tabs)}`);
      return ctx.commit("ADD_SB_TABS", tabs);
    },
    addSidebarTabs: {
      root: true,
      handler({ commit }, tabs) {
        // console.log(`ACT_ADD: ${JSON.stringify(tabs)}`);
        return commit("ADD_SB_TABS", tabs || []);
      }
    },
    removeSidebarTabs: {
      root: true,
      handler({ commit }, arr_str_name) {
        commit("DELETE_SIDEBAR_TABS", arr_str_name);
      }
    },
    fetchFavoritesData(ctx) {
      return ctx.rootState.TXBA_UTILS.getFavs();
    },
    fetchNotificationData(ctx) {
      return ctx.rootState.TXBA_UTILS.getNotification();
    },
    async fetchFavorites(ctx) {
      await ctx
        .dispatch("fetchFavoritesData")
        .then(data => ctx.commit("SET_FAVS", data));
    },
    async fetchNotifications(ctx) {
      await ctx
        .dispatch("fetchNotificationData")
        .then(data => ctx.commit("SET_NOTIFICATIONS", data));
    },
    toggleFavorite({ commit, getters }, fav) {
      const isFav = getters.isFavorite(fav);
      console.log("isFav", isFav, fav);
      if (isFav) {
        console.log("unfav", fav);
        commit("UNFAVORITE", fav);
      } else {
        console.log("fav", fav);
        commit("FAVORITE", fav);

      }
    },
    addFavorite({ commit }, fav) {
      commit("FAVORITE", fav);
    },
    removeFavorite({ commit }, fav) {
      commit("UNFAVORITE", fav);
    },
    initStore: ctx => {
      ctx.dispatch("fetchFavorites");
      ctx.dispatch("fetchNotifications");
      ctx.dispatch("resetSideBar");
    }
  },
  getters: {
    getRequest( { state, commit, rootState, rootGetters } ) {
      // console.dir( state )
      // console.dir( commit )
      // console.dir( rootState )
      // console.dir( rootGetters )
      return state
    },
    getFavsByType: state => {
      let collector = {};
      state.favorites.forEach(el => {
        if (Object.keys(collector).includes(el.src)) {
          collector[el.src].push(el);
        } else {
          collector[el.src] = [el];
        }
      });
      // console.log(collector);
      return collector;
    },
    isFavorite: state => favorite => {
      // favorite = JSON.parse(favorite);
      return state.favorites.filter(fav => fav.id === favorite.id).length > 0;
    },
    getAnnouncements: ctx => ctx.notifications?.announcements || [],
    getUpdates: ctx => ctx.notifications?.updates || [],
    loaded: ctx =>
      ctx.notifications?.announcements.length > 0 ||
      ctx.notifications?.updates ||
      false
  }
};
