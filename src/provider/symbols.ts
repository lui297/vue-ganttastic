import type { InjectionKey, Ref } from "vue"

import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import type { GanttBarObject, GanttDateType } from "../types.ts"

export type ChartRow = { label: string; bars: GanttBarObject[] }
export type GetChartRows = () => ChartRow[]
export type EmitBarEvent = (
  e: MouseEvent,
  bar: GanttBarObject,
  datetime?: GanttDateType,
  movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
) => void

export const CHART_ROWS_KEY = Symbol("CHART_ROWS_KEY") as InjectionKey<GetChartRows>
export const CONFIG_KEY = Symbol("CONFIG_KEY") as InjectionKey<GGanttChartConfig>
export const EMIT_BAR_EVENT_KEY = Symbol("EMIT_BAR_EVENT_KEY") as InjectionKey<EmitBarEvent>
export const BAR_CONTAINER_KEY = Symbol("BAR_CONTAINER_KEY") as InjectionKey<
  Ref<HTMLElement | null>
>
