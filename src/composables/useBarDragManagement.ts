import type { GanttBarObject } from "../types.ts"

import createBarDrag from "./createBarDrag.ts"
import useDateTimeHelper from "./useDateTimeHelper.ts"
import provideConfig from "../provider/provideConfig.ts"
import provideGetChartRows from "../provider/provideGetChartRows.ts"
import provideEmitBarEvent from "../provider/provideEmitBarEvent.ts"
import { Interval } from "luxon"

export default function useBarDragManagement() {
  const config = provideConfig()
  const getChartRows = provideGetChartRows()
  const emitBarEvent = provideEmitBarEvent()
  const { pushOnOverlap, barStart, barEnd, noOverlap } = config

  const movedBarsInDrag = new Map<GanttBarObject, { oldStart: string; oldEnd: string }>()

  const { toDateTime, format } = useDateTimeHelper()

  const initDragOfBar = (bar: GanttBarObject, e: MouseEvent) => {
    const { initDrag } = createBarDrag(bar, onDrag, onEndDrag, config)
    emitBarEvent({ ...e, type: "dragstart" }, bar)
    initDrag(e)
    addBarToMovedBars(bar)
  }

  const initDragOfBundle = (mainBar: GanttBarObject, e: MouseEvent) => {
    const bundle = mainBar.ganttBarConfig.bundle
    if (bundle == null) {
      return
    }
    getChartRows().forEach((row) => {
      row.bars.forEach((bar) => {
        if (bar.ganttBarConfig.bundle === bundle) {
          const dragEndHandler = bar === mainBar ? onEndDrag : () => null
          const { initDrag } = createBarDrag(bar, onDrag, dragEndHandler, config)
          initDrag(e)
          addBarToMovedBars(bar)
        }
      })
    })
    emitBarEvent({ ...e, type: "dragstart" }, mainBar)
  }

  const onDrag = (e: MouseEvent, bar: GanttBarObject) => {
    emitBarEvent({ ...e, type: "drag" }, bar)
    fixOverlaps(bar)
  }

  const fixOverlaps = (ganttBar: GanttBarObject) => {
    if (!pushOnOverlap?.value) {
      return
    }
    let currentBar = ganttBar
    let { overlapBar, overlapType } = getOverlapBarAndType(currentBar)
    while (overlapBar) {
      addBarToMovedBars(overlapBar)
      const currentBarStart = toDateTime(currentBar[barStart.value])
      const currentBarEnd = toDateTime(currentBar[barEnd.value])
      const overlapBarStart = toDateTime(overlapBar[barStart.value])
      const overlapBarEnd = toDateTime(overlapBar[barEnd.value])
      let minuteDiff: number
      switch (overlapType) {
        case "left":
          minuteDiff = overlapBarEnd.diff(currentBarStart, "minutes").minutes
          overlapBar[barEnd.value] = format(currentBar[barStart.value])
          overlapBar[barStart.value] = format(
            overlapBarStart.minus({ minutes: minuteDiff })
          )
          break
        case "right":
          minuteDiff = currentBarEnd.diff(overlapBarStart, "minutes").minutes
          overlapBar[barStart.value] = format(currentBarEnd)
          overlapBar[barEnd.value] = format(
            overlapBarEnd.plus({ minutes: minuteDiff })
          )
          break
        default:
          console.warn(
            "Vue-Ganttastic: One bar is inside of the other one! This should never occur while push-on-overlap is active!"
          )
          return
      }

      if (overlapBar && (overlapType === "left" || overlapType === "right")) {
        moveBundleOfPushedBarByMinutes(overlapBar, minuteDiff, overlapType)
      }

      // Move to the next overlapping bar and check again
      currentBar = overlapBar
      const overlapResult = getOverlapBarAndType(overlapBar)
      overlapBar = overlapResult.overlapBar
      overlapType = overlapResult.overlapType
    }
  }

  const getOverlapBarAndType = (ganttBar: GanttBarObject) => {
    let overlapLeft = false,
      overlapRight = false,
      overlapInBetween = false

    const allBarsInRow = getChartRows().find((row) => row.bars.includes(ganttBar))?.bars ?? []
    const ganttBarStart = toDateTime(ganttBar[barStart.value])
    const ganttBarEnd = toDateTime(ganttBar[barEnd.value])
    const overlapBar = allBarsInRow.find((otherBar) => {
      if (otherBar === ganttBar) {
        return false
      }
      const otherBarStart = toDateTime(otherBar[barStart.value])
      const otherBarEnd = toDateTime(otherBar[barEnd.value])

      overlapLeft = Interval.fromDateTimes(otherBarStart, otherBarEnd).contains(ganttBarStart)
      overlapRight = Interval.fromDateTimes(otherBarStart, otherBarEnd).contains(ganttBarEnd)

      overlapInBetween = overlapLeft && overlapRight

      return overlapLeft || overlapRight || overlapInBetween
    })

    let overlapType: "left" | "right" | "between" | null = null
    if (overlapLeft) {
      overlapType = "left"
    } else if (overlapRight) {
      overlapType = "right"
    } else if (overlapInBetween) {
      overlapType = "between"
    }

    return { overlapBar, overlapType }
  }

  const moveBundleOfPushedBarByMinutes = (
    pushedBar: GanttBarObject,
    minutes: number,
    direction: "left" | "right"
  ) => {
    addBarToMovedBars(pushedBar)
    if (!pushedBar.ganttBarConfig.bundle) {
      return
    }
    getChartRows().forEach((row) => {
      row.bars.forEach((bar) => {
        if (bar.ganttBarConfig.bundle === pushedBar.ganttBarConfig.bundle && bar !== pushedBar) {
          addBarToMovedBars(bar)
          moveBarByMinutes(bar, minutes, direction)
        }
      })
    })
  }

  const moveBarByMinutes = (bar: GanttBarObject, minutes: number, direction: "left" | "right") => {
    switch (direction) {
      case "left":
        bar[barStart.value] = format(
          toDateTime(bar, "start").minus({ minutes: minutes })
        )
        bar[barEnd.value] = format(
          toDateTime(bar, "end").minus({ minutes: minutes })
        )
        break
      case "right":
        bar[barStart.value] = format(
          toDateTime(bar, "start").plus({ minutes: minutes })
        )
        bar[barEnd.value] = format(
          toDateTime(bar, "end").plus({ minutes: minutes }).toJSDate()
        )
    }
    fixOverlaps(bar)
  }

  const onEndDrag = (e: MouseEvent, bar: GanttBarObject) => {
    snapBackAllMovedBarsIfNeeded()
    const ev = {
      ...e,
      type: "dragend"
    }
    emitBarEvent(ev, bar, undefined, new Map(movedBarsInDrag))
    movedBarsInDrag.clear()
  }

  const addBarToMovedBars = (bar: GanttBarObject) => {
    if (!movedBarsInDrag.has(bar)) {
      const oldStart = bar[barStart.value]
      const oldEnd = bar[barEnd.value]
      movedBarsInDrag.set(bar, { oldStart, oldEnd })
    }
  }

  const snapBackAllMovedBarsIfNeeded = () => {
    if (pushOnOverlap.value || !noOverlap.value) {
      return
    }

    let isAnyOverlap = false
    movedBarsInDrag.forEach((_, bar) => {
      const { overlapBar } = getOverlapBarAndType(bar)
      if (overlapBar != null) {
        isAnyOverlap = true
      }
    })
    if (!isAnyOverlap) {
      return
    }
    movedBarsInDrag.forEach(({ oldStart, oldEnd }, bar) => {
      bar[barStart.value] = oldStart
      bar[barEnd.value] = oldEnd
    })
  }

  return {
    initDragOfBar,
    initDragOfBundle
  }
}
