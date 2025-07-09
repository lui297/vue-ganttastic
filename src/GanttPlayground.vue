<template>
  <g-gantt-chart
    :chart-start="chartStart"
    :chart-end="chartEnd"
    precision="date"
    :row-height="40"
    grid
    current-time
    width="100%"
    bar-start="beginDate"
    bar-end="endDate"
    @click-bar="onClickBar($event.bar, $event.e, $event.datetime)"
    @mousedown-bar="onMousedownBar($event.bar, $event.e, $event.datetime)"
    @dblclick-bar="onMouseupBar($event.bar, $event.e, $event.datetime)"
    @mouseenter-bar="onMouseenterBar($event.bar, $event.e)"
    @mouseleave-bar="onMouseleaveBar($event.bar, $event.e)"
    @dragstart-bar="onDragstartBar($event.bar, $event.e)"
    @drag-bar="onDragBar($event.bar, $event.e)"
    @dragend-bar="onDragendBar($event.bar, $event.e, $event.movedBars)"
    @contextmenu-bar="onContextmenuBar($event.bar, $event.e, $event.datetime)"
  >
    <g-gantt-row label="My row to test" :bars="bars1" highlight-on-hover />
    <g-gantt-row label="My another new row to test" highlight-on-hover :bars="bars2" />
    <g-gantt-row label="just another row to test gantt" highlight-on-hover :bars="bars3" />
    <g-gantt-row
      label="errors teach us, and debugging makes us stronger!"
      highlight-on-hover
      :bars="bars4"
    />
  </g-gantt-chart>

  <button type="button" @click="addBar()">Add bar</button>
  <button type="button" @click="deleteBar()">Delete bar</button>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type { GanttBarObject, GanttDateType } from "./types"
import { DateTime } from "luxon"
import GGanttChart from "./components/GGanttChart.vue"
import GGanttRow from "./components/GGanttRow.vue"

const format = ref("yyyy LLL dd hh:mm")
const chartStart = ref(DateTime.now().set({ day: 1, month: 7, hour: 10 }).startOf("day").toJSDate())
const chartEnd = ref(DateTime.now().set({ day: 7, month: 7, hour: 10 }).toJSDate())

const bars1 = ref<GanttBarObject[]>([
  {
    beginDate: DateTime.now().set({ day: 2, hour: 13 }).startOf("hour").toISO(),
    endDate: DateTime.now().set({ day: 3, hour: 19 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "8621987329",
      label: "I'm in a bundle",
      bundle: "bundle2"
    }
  }
])

const bars2 = ref<GanttBarObject[]>([
  {
    beginDate: DateTime.now().set({ hour: 13 }).startOf("hour").toISO({ extendedZone: true }),
    endDate: DateTime.now().set({ hour: 19 }).startOf("hour").toISO({ extendedZone: true }),
    ganttBarConfig: {
      id: "1592311887",
      label: "I'm in a bundle",
      bundle: "bundle2",
      style: {
        background: "magenta"
      }
    }
  },
  {
    beginDate: DateTime.now().plus({ days: 2 }).set({ hour: 13 }).startOf("hour").toISO(),
    endDate: DateTime.now().plus({ days: 2 }).set({ hour: 19 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "7716981641",
      label: "Lorem ipsum dolor",
      hasHandles: true,
      style: {
        background: "#b74b52"
      }
    }
  },
  {
    beginDate: DateTime.now().plus({ days: 1 }).set({ hour: 4 }).startOf("hour").toISO(),
    endDate: DateTime.now().plus({ days: 1 }).set({ hour: 16 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "9716981641",
      label: "Oh hey",
      style: {
        background: "#69e064",
        borderRadius: "15px",
        color: "blue",
        fontSize: "10px"
      }
    }
  }
])

const bars3 = [
  {
    beginDate: DateTime.now().set({ day: 20, month: 7, hour: 10 }).startOf("hour").toISO(),
    endDate: DateTime.now().set({ day: 25, month: 7, hour: 15 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "9876543210",
      label: "Updated Bundle",
      bundle: "bundle3",
      style: {
        background: "cyan"
      }
    }
  },
  {
    beginDate: DateTime.now().set({ day: 8, month: 7, hour: 10 }).startOf("hour").toISO(),
    endDate: DateTime.now().set({ day: 20, month: 7, hour: 10 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "1234567890",
      label: "New Task",
      hasHandles: true,
      style: {
        background: "#f79466"
      }
    }
  },
  {
    beginDate: DateTime.now().set({ day: 10, month: 7, hour: 10 }).startOf("hour").toISO(),
    endDate: DateTime.now().set({ day: 25, month: 7, hour: 10 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "2468135790",
      label: "Greetings",
      style: {
        background: "#aabbcc",
        borderRadius: "8px",
        color: "white",
        fontSize: "12px"
      }
    }
  }
]

const bars4 = [
  {
    beginDate: DateTime.now().plus({ months: 1 }).set({ hour: 10 }).startOf("hour").toISO(),
    endDate: DateTime.now()
      .plus({ months: 1 })
      .set({ hour: 19, minute: 15 })
      .startOf("hour")
      .toISO(),
    ganttBarConfig: {
      id: "9876543210",
      label: "Novo Pacote",
      bundle: "pacote3",
      style: {
        background: "pink"
      }
    }
  },
  {
    beginDate: DateTime.now().plus({ months: -3 }).set({ hour: 10 }).startOf("hour").toISO(),
    endDate: DateTime.now()
      .plus({ months: -3 })
      .set({ hour: 19, minute: 15 })
      .startOf("hour")
      .toISO(),
    ganttBarConfig: {
      id: "2468135790",
      label: "hello folks",
      style: {
        background: "#ffd700",
        borderRadius: "10px",
        color: "black",
        fontSize: "14px"
      }
    }
  }
]

const addBar = () => {
  if (bars1.value.some((bar) => bar.ganttBarConfig.id === "test1")) {
    return
  }
  const bar = {
    beginDate: DateTime.now().set({ day: 1, month: 7, hour: 10 }).startOf("hour").toISO(),
    endDate: DateTime.now().set({ day: 3, month: 7, hour: 10 }).startOf("hour").toISO(),
    ganttBarConfig: {
      id: "test1",
      hasHandles: true,
      label: "Hello!",
      style: {
        background: "#5484b7",
        borderRadius: "20px"
      }
    }
  }
  bars1.value.push(bar)
}

const deleteBar = () => {
  const idx = bars1.value.findIndex((b) => b.ganttBarConfig.id === "test1")
  if (idx !== -1) {
    bars1.value.splice(idx, 1)
  }
}

const onClickBar = (bar: GanttBarObject, e: MouseEvent, datetime?: GanttDateType) => {
  console.log("click-bar", bar, e, datetime)
}

const onMousedownBar = (bar: GanttBarObject, e: MouseEvent, datetime?: GanttDateType) => {
  console.log("mousedown-bar", bar, e, datetime)
}

const onMouseupBar = (bar: GanttBarObject, e: MouseEvent, datetime?: GanttDateType) => {
  console.log("mouseup-bar", bar, e, datetime)
}

const onMouseenterBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("mouseenter-bar", bar, e)
}

const onMouseleaveBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("mouseleave-bar", bar, e)
}

const onDragstartBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("dragstart-bar", bar, e)
}

const onDragBar = (bar: GanttBarObject, e: MouseEvent) => {
  console.log("drag-bar", bar, e)
}

const onDragendBar = (
  bar: GanttBarObject,
  e: MouseEvent,
  movedBars?: Map<GanttBarObject, { oldStart: string; oldEnd: string }>
) => {
  console.log("dragend-bar", bar, e, movedBars)
}

const onContextmenuBar = (bar: GanttBarObject, e: MouseEvent, datetime?: GanttDateType) => {
  console.log("contextmenu-bar", bar, e, datetime)
}
</script>
