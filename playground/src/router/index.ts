import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/pages/Home.vue";
import ButtonPage from "@/pages/ButtonPage.vue";
import PasswordPage from "@/pages/PasswordPage.vue";
import InputPage from "@/pages/InputPage.vue";
import TextareaPage from "@/pages/TextareaPage.vue";
import BadgePage from "@/pages/BadgePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: "/", component: Home},
    {path: "/button", component: ButtonPage},
    {path: "/password", component: PasswordPage},
    {path: "/input", component: InputPage},
    {path: "/textarea", component: TextareaPage},
    {path: "/badge", component: BadgePage}
  ],
})

export default router
