(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[29],{f171:function(e,r,t){"use strict";t.r(r);var a=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("q-layout",{attrs:{view:"hHh Lpr lff"}},[t("q-header",{attrs:{elevated:""}},[t("browser-toolbar",{on:{"toggle-drawer":e.toggleDrawer},scopedSlots:e._u([{key:"toggleDrawer",fn:function(){return[t("q-btn",{attrs:{label:"Add Filters",title:"Add Filters",color:"secondary","icon-right":"mdi-filter-plus-outline","aria-label":"Filters"},on:{click:e.toggleDrawer}})]},proxy:!0}])})],1),t("q-drawer",{attrs:{side:"left",bordered:""},model:{value:e.leftDrawerOpen,callback:function(r){e.leftDrawerOpen=r},expression:"leftDrawerOpen"}},[t("dynamic-tab",{attrs:{tabList:e.drawer},on:{changeCategory:e.catChange}})],1),t("q-page-container",[t("router-view",{attrs:{title:e.currentCategory}})],1)],1)},o=[],n=(t("e6cf"),t("ded3")),l=t.n(n),s=t("2f62");const{mapState:c,mapActions:i}=Object(s["a"])("browser");var d={name:"BrowserLayout",components:{DynamicTab:()=>Promise.all([t.e(0),t.e(1)]).then(t.bind(null,"3c48")),BrowserToolbar:()=>Promise.all([t.e(0),t.e(11)]).then(t.bind(null,"91fc"))},data:()=>({leftDrawerOpen:!1,category:null}),created(){this.$root.$on("toggle-drawer",this.toggleTruncate)},computed:l()({},c(["drawer","currentCategory"])),methods:l()({toggleDrawer(e){this.leftDrawerOpen="boolean"===typeof e?e:!this.leftDrawerOpen},catChange(e){this.category=e},removeDrawer(e){this.removeDrawer(e)}},i(["removeDrawer"]))},w=d,u=t("2877"),g=t("4d5a"),p=t("e359"),f=t("9c40"),b=t("9404"),h=t("09e3"),m=t("eebe"),D=t.n(m),y=Object(u["a"])(w,a,o,!1,null,null,null);r["default"]=y.exports;D()(y,"components",{QLayout:g["a"],QHeader:p["a"],QBtn:f["a"],QDrawer:b["a"],QPageContainer:h["a"]})}}]);