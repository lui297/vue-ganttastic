import { createApp } from "vue"
import Playground from "./GanttPlayground.vue"
import ganttastic from "./vue-ganttastic.ts"

createApp(Playground).use(ganttastic).mount("#app")
