import { computed } from "vue"

import type { GGanttChartConfig } from "../components/GGanttChart.vue"
import type { GanttBarObject } from "../types.ts"
import provideConfig from "../provider/provideConfig.ts"
import { DateTime } from "luxon"

export default function useDateTimeHelper(config: GGanttChartConfig = provideConfig()) {
  const { chartStart, chartEnd, barStart, barEnd } = config



  const computedChartStartDateTime = computed(() => chartStart.value ? toDateTime(chartStart.value) : null)
  const computedChartEndDateTime = computed(() => chartEnd.value ? toDateTime(chartEnd.value) : null)

  function toDateTime(input: string | Date | GanttBarObject | DateTime, startOrEnd?: "start" | "end") {
    let value: string | Date | GanttBarObject | DateTime | undefined = input

    if (startOrEnd !== undefined && typeof input === "object" && !(input instanceof Date)) {
      value = startOrEnd === "start" ? input[barStart.value] : input[barEnd.value]
    }

    if (DateTime.isDateTime(value)) {
      return value
    }

    if (value instanceof Date) {
      return DateTime.fromJSDate(value)
    } else if (typeof value === "string") {
      const dt = DateTime.fromISO(value)
      return dt.isValid ? dt : DateTime.invalid("Invalid ISO string")
    } else {
      return DateTime.invalid("Invalid input type")
    }
  }

  function format(input: string | Date | DateTime): DateTime | string {
    if (input instanceof Date) {
      return DateTime.fromJSDate(input)
    } else if (typeof input === "string") {
      return DateTime.fromISO(input)
    }

    return input.toISO()
  }

  return {
    chartStartDateTime: computedChartStartDateTime,
    chartEndDateTime: computedChartEndDateTime,
    toDateTime,
    format
  }
}
