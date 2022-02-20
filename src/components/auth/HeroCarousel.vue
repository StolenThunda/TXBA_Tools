<template>
  <div class='column fit'>
   
    <!-- <q-carousel
      v-model="slide"
      height="95vh"
      ref="carousel"
      transition-prev="fade"
      transition-next="fade"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      infinite
      autoplay
      animated
      arrows
    >
      <q-carousel-slide
        v-for="(img, i) in images"
        :key="i"
        :name="i"
        class="column no-wrap"
      >
        <div
          class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
        >
          <q-img
            class="rounded-borders full-height"
            :src="img.src"
            :ratio="img.ratio"
            :contain="img.contain"
          />
        </div>
      </q-carousel-slide>
    </q-carousel> -->
     <q-tab-panel
      name="title"
      class="bg-none absolute-center text-weight-bold text-center text-h2"
      style="height: 130px; width: 250px"
    >
      <q-img 
      :src="images[0].src"
      :contain="images[0].contain"
      > 

      </q-img>
    </q-tab-panel>
    <q-dialog v-model="card">
      <q-card class="auth-tabs">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <login-register :tab="tab" />
          </q-tab-panel>

          <q-tab-panel name="register">
            <login-register :tab="tab" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
    <q-btn
      rounded
      glossy
      push
      icon-right="key"
      label="Enter"
      color="deep-orange"
      size="lg"
      class="q-mt-xl q-mr-lg absolute-top-right q-electron-drag--exception shadow-2"
      @click="card = !card"
    />
  </div>
</template>

<script>
import LoginRegister from "src/components/auth/LoginRegister.vue";
export default {
  name: "TXBA_Hero",
  data: () => ({
    fullscreen: false,
    slide: 1,
    tab: "login",
    dialog: true,
    card: false,
    autoplay: true,
    images: [
      {
        src: "https://cdn.texasbluesalley.com/styles/TXBALogo.svg",
        contain: true,
      },
      {
        src: "https://cdn.texasbluesalley.com/misc/locals-page/AllCourses-1600px.jpg",
      },
      {
        src: "https://txba-media.s3.amazonaws.com/woodshed/course-type-images/SRV-800.jpg",
      },
      {
        src: "https://txba-media.s3.amazonaws.com/woodshed/course-type-images/Influences-800.jpg",
      },
      {
        src: "https://cdn.texasbluesalley.com/styles/TXBA-Theme/banners/TXBA-Store-Banner.jpg",
      },
      {
        src: "https://cdn.texasbluesalley.com/products/3840/dsc00025__medium.jpg",
        contain: true,
      },
      {
        src: "https://cdn.texasbluesalley.com/styles/TXBA-Theme/banners/TXBA-Home-Banner.jpg",
        contain: true,
      },
    ],
  }),
  components: {
    LoginRegister,
  },
};
</script>
