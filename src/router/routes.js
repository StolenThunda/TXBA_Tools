const routes = [
  {
    path: "/auth",
    component: () => import("src/pages/AuthPage.vue")
  },
  {
    path: "/",
    component: () => import("src/layouts/Tools.vue"),
    // beforeEnter: authGuard,
    children: [
      {
        path: "",
        component: () => import("pages/Tools")
      },
      {
        name: "tuner",
        path: "/tools/tuner",
        component: () => import("components/tools/Tuner"),
        meta: {
          src: "/dev/tuner",
          name: "Tuner"
        }
      },
      {
        name: "spider",
        path: "/tools/spider",
        component: () => import("components/tools/Spider"),
        meta: {
          src: "/dev/spider",
          name: "Spider Drills"
        }
      },
      {
        name: "fretboard",
        path: "/tools/fretboard",
        component: () => import("components/tools/Fretboard"),
        meta: {
          src: "/dev/fretboard",
          name: "Fretboard"
        }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
