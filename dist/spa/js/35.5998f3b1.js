(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[35],{cbff:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{width:"100%",height:"100%"}},[r("q-card",{staticClass:"my-card",attrs:{set:e.s=e.getCourseInfo},model:{value:e.currentCourse,callback:function(t){e.currentCourse=t},expression:"currentCourse"}},[r("div",{staticClass:"text-h6",domProps:{innerHTML:e._s(e.s.title)}}),r("q-img",{attrs:{ratio:16/9,contain:"",src:e.s.image},scopedSlots:e._u([{key:"loading",fn:function(){return[r("q-spinner-gears",{attrs:{color:"white"}})]},proxy:!0}])},[r("div",{staticClass:"text-bold text-center",domProps:{innerHTML:e._s(e.s.description)}}),r("div",{staticClass:"absolute-bottom"},[r("div",{staticClass:"text-body2",domProps:{innerHTML:e._s(e.s.overview)}})])])],1)],1)},o=[],n=r("ded3"),i=r.n(n),a=r("2f62"),c={name:"PackageInfo",computed:i()({getCourseInfo(){var e,t,r,s;return{title:null===(e=this.currentCourse)||void 0===e?void 0:e.packageTitle,image:null===(t=this.currentCourse)||void 0===t?void 0:t.packageImage,overview:null===(r=this.currentCourse)||void 0===r?void 0:r.packageOverview,description:null===(s=this.currentCourse)||void 0===s?void 0:s.packageDescription}}},Object(a["d"])("watch",["currentCourse"]))},u=c,d=r("2877"),l=r("f09f"),p=r("068f"),v=r("cf57"),f=r("eebe"),C=r.n(f),g=Object(d["a"])(u,s,o,!1,null,null,null);t["default"]=g.exports;C()(g,"components",{QCard:l["a"],QImg:p["a"],QSpinnerGears:v["a"]})}}]);