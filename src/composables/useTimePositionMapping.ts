import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import { computed } from "vue"

import useDateTimeHelper from "./useDateTimeHelper.ts"
import provideConfig from "../provider/provideConfig.ts"

export default function useTimePositionMapping(config: GGanttChartConfig = provideConfig()) {
  const { chartSize } = config
  const { chartStartDateTime, chartEndDateTime, toDateTime, format } = useDateTimeHelper(config)

  const totalNumOfMinutes = computed(() => {
    return chartEndDateTime.value.diff(chartStartDateTime.value, "minutes").minutes
  })

  const mapTimeToPosition = (time: string) => {
    const width = !Number.isNaN(chartSize.width.value) ? chartSize.width.value : 0
    const diffFromStart = toDateTime(time).diff(chartStartDateTime.value, "minutes").minutes
    return diffFromStart && !Number.isNaN(diffFromStart) ? Math.ceil((diffFromStart / totalNumOfMinutes.value) * width) : 0
  }

  const mapPositionToTime = (xPos: number) => {
    const width = !Number.isNaN(chartSize.width.value) ? chartSize.width.value : 0
    const diffFromStart = (xPos / width) * totalNumOfMinutes.value

    return diffFromStart && !Number.isNaN(diffFromStart) ? format(chartStartDateTime.value.plus({ minutes: diffFromStart })) : ""
  }

  return {
    mapTimeToPosition,
    mapPositionToTime
  }
}
