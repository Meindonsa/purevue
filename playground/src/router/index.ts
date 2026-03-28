import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/pages/Home.vue";
import ButtonPage from "@/pages/ButtonPage.vue";
import PasswordPage from "@/pages/PasswordPage.vue";
import InputPage from "@/pages/InputPage.vue";
import TextareaPage from "@/pages/TextareaPage.vue";
import BadgePage from "@/pages/BadgePage.vue";
import AvatarPage from "@/pages/AvatarPage.vue";
import SpinnerPage from "@/pages/SpinnerPage.vue";
import SkeletonPage from "@/pages/SkeletonPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", component: Home},
    {path: "/input", component: InputPage},
    {path: "/badge", component: BadgePage},
    {path: "/button", component: ButtonPage},
    {path: "/avatar", component: AvatarPage},
    {path: "/spinner", component: SpinnerPage},
    {path: "/skeleton", component: SkeletonPage},
    {path: "/password", component: PasswordPage},
    {path: "/textarea", component: TextareaPage},
  ],
})

export default router
