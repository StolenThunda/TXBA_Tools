(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[30],{ccbb:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-layout",{attrs:{view:"lHh Lpr lff"}},[a("q-header",{attrs:{reveal:"",elevated:""}},[a("watch-tool-bar",{scopedSlots:e._u([{key:"toggle",fn:function(){return[a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"menu"},on:{click:function(t){e.leftDrawer=!e.leftDrawer}}})]},proxy:!0},{key:"auth",fn:function(){return[a("auth-button")]},proxy:!0}])})],1),a("q-drawer",{attrs:{width:300,breakpoint:500,"show-if-above":""},model:{value:e.leftDrawer,callback:function(t){e.leftDrawer=t},expression:"leftDrawer"}},[a("q-scroll-area",{staticClass:"fit q-pa-sm",staticStyle:{height:"90vh","max-width":"300px"},attrs:{delay:1200,"thumb-style":e.thumbStyle}},[a("dynamic-tab",{attrs:{tabList:this.tabs}})],1)],1),a("q-page-container",[a("router-view",{key:e.$route.fullPath})],1)],1)},n=[],o=(a("e6cf"),a("c973")),l=a.n(o),c=a("ded3"),s=a.n(c),i=a("2f62"),u={name:"WatchLayout",components:{DynamicTab:()=>Promise.all([a.e(0),a.e(1)]).then(a.bind(null,"3c48")),WatchToolBar:()=>Promise.all([a.e(0),a.e(26)]).then(a.bind(null,"9dde")),AuthButton:()=>Promise.all([a.e(0),a.e(3)]).then(a.bind(null,"ad8b"))},data:()=>({leftDrawer:!1,currentTab:null,favs:!1,thumbStyle:{right:"5px",borderRadius:"5px",backgroundColor:"#027be3",width:"10px",opacity:.35}}),created(){this.getSegmentData(),this.addSidebarTabs([{name:"Segments",componentName:"Segments",icon:"mdi-segment",cmp:()=>Promise.all([a.e(0),a.e(25)]).then(a.bind(null,"a7fe")),menu:()=>Promise.all([a.e(0),a.e(24)]).then(a.bind(null,"3f64"))}])},computed:s()(s()({},Object(i["d"])("default",{tabs:"sidebarTabs"})),Object(i["d"])("watch",{sections:"sections",currentCourse:"currentCourse"})),methods:s()(s()({showTab(e){this.currentTab=e},goBack(){window.history.length>1?this.$router.go(-1):this.$router.push("/")},getSegmentData(){var e=this;return l()((function*(){return yield e.fetchPackage(e.$route.params.packageID)}))()}},Object(i["c"])("default",["addSidebarTabs"])),Object(i["c"])("watch",["fetchPackage"]))},d=u,h=a("2877"),b=a("4d5a"),f=a("e359"),m=a("9c40"),p=a("9404"),w=a("4983"),g=a("09e3"),y=a("eebe"),k=a.n(y),v=Object(h["a"])(d,r,n,!1,null,null,null);t["default"]=v.exports;k()(v,"components",{QLayout:b["a"],QHeader:f["a"],QBtn:m["a"],QDrawer:p["a"],QScrollArea:w["a"],QPageContainer:g["a"]})}}]);