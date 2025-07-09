import { computed } from "vue"
import useDateTimeHelper from "./useDateTimeHelper.ts"
import provideConfig from "../provider/provideConfig.ts"
import { DateTime } from "luxon"

export default function useTimeaxisUnits() {
  const { precision } = provideConfig()
  const { chartStartDateTime, chartEndDateTime } = useDateTimeHelper()

  const upperPrecision = computed(() => {
    switch (precision?.value) {
      case "hour":
        return "day"
      case "day":
        return "month"
      case "date":
      case "week":
        return "month"
      case "month":
        return "year"
      default:
        throw new Error(
          "Precision prop incorrect. Must be one of the following: 'hour', 'day', 'date', 'week', 'month'"
        )
    }
  })

  const lowerPrecision = computed(() => {
    switch (precision.value) {
      case "date":
        return "day"
      case "week":
        return "isoWeek"
      default:
        return precision.value
    }
  })

  const displayFormats = {
    hour: "hh",
    date: "dd.MMM",
    day: "dd.MMM",
    week: "WW",
    month: "MMMM yyyy",
    year: "yyyy"
  }

  const timeaxisUnits = computed(() => {
    const upperUnits: { label: string; value?: string; date: Date; width?: string; dateTime: DateTime }[] = []
    const lowerUnits: { label: string; value?: string; date: Date; width?: string; dateTime: DateTime }[] = []
    const totalMinutes = chartEndDateTime.value.diff(chartStartDateTime.value, "minutes").minutes
    const upperUnit = upperPrecision.value
    const lowerUnit = lowerPrecision.value
    let currentUpperUnit = chartStartDateTime.value
    let currentLowerUnit = chartStartDateTime.value

    while (currentLowerUnit <= chartEndDateTime.value) {
      let endCurrentLowerUnit = currentLowerUnit.endOf("hour")
      if (lowerUnit === "month") {
        endCurrentLowerUnit = currentLowerUnit.endOf("month")
      }
      if (lowerUnit === "isoWeek") {
        endCurrentLowerUnit = currentLowerUnit.endOf("week")
      }
      if (lowerUnit === "day") {
        endCurrentLowerUnit = currentLowerUnit.endOf("day")
      }
      if (lowerUnit === "hour") {
        endCurrentLowerUnit = currentLowerUnit.endOf("hour")
      }
      const isLastItem = endCurrentLowerUnit > chartEndDateTime.value

      const lowerWidth = isLastItem
        ? (chartEndDateTime.value.diff(currentLowerUnit, "minutes").minutes / totalMinutes) * 100
        : (endCurrentLowerUnit.diff(currentLowerUnit, "minutes").minutes / totalMinutes) * 100

      lowerUnits.push({
        label: currentLowerUnit.toFormat(displayFormats[precision?.value]),
        value: String(currentLowerUnit),
        date: currentLowerUnit.toJSDate(),
        dateTime: currentLowerUnit,
        width: String(lowerWidth) + "%"
      })
      if (lowerUnit === "month") {
        currentLowerUnit = currentLowerUnit.plus({ month: 1 }).startOf("month")
      }
      if (lowerUnit === "isoWeek") {
        currentLowerUnit = currentLowerUnit.plus({ week: 1 }).startOf("week")
      }
      if (lowerUnit === "day") {
        currentLowerUnit = currentLowerUnit.plus({ day: 1 }).startOf("day")
      }
      if (lowerUnit === "hour") {
        currentLowerUnit = currentLowerUnit.plus({ hour: 1 }).startOf("hour")
      }

    }
    while (currentUpperUnit <= chartEndDateTime.value) {
      const endCurrentUpperUnit = currentUpperUnit.endOf(upperUnit)
      const isLastItem = endCurrentUpperUnit > chartEndDateTime.value

      const upperWidth = isLastItem
        ? (chartEndDateTime.value.diff(currentUpperUnit, "minutes").minutes / totalMinutes) * 100
        : (endCurrentUpperUnit.diff(currentUpperUnit, "minutes").minutes / totalMinutes) * 100

      upperUnits.push({
        label: currentUpperUnit.toFormat(displayFormats[upperUnit]),
        value: String(currentUpperUnit),
        date: currentUpperUnit.toJSDate(),
        dateTime: currentUpperUnit,
        width: String(upperWidth) + "%"
      })

      if (upperUnit === "year") {
        currentUpperUnit = currentUpperUnit.plus({ year: 1 }).startOf("year")
      }

      if (upperUnit === "month") {
        currentUpperUnit = currentUpperUnit.plus({ month: 1 }).startOf("month")
      }

      if (upperUnit === "day") {
        currentUpperUnit = currentUpperUnit.plus({ day: 1 }).startOf("day")
      }

    }
    return { upperUnits, lowerUnits }
  })

  return {
    timeaxisUnits
  }
}
