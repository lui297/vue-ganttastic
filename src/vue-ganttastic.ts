import type { Plugin } from "vue"

import type { GanttBarObject } from "./types.ts"
import type { ColorScheme } from "./color-schemes.ts"
import "./styles/index.scss"

import GGanttChart from "./components/GGanttChart.vue"
import GGanttRow from "./components/GGanttRow.vue"



export type { ColorScheme, GanttBarObject }
export { GGanttChart, GGanttRow }

export const ganttastic: Plugin = {
  install(app, options?) {
    app.component("GGanttChart", GGanttChart)
    app.component("GGanttRow", GGanttRow)
  }
}

export default ganttastic
