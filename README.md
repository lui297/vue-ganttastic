# Vue Ganttastic

<div style="display: flex; flex-direction: column; align-items:center;">
<img
    src="https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png" 
    style="margin: 10px;" height="150"
    alt="Vue Ganttastic logo"
/>



<b>Vue Ganttastic</b> is a simple, interactive and highly customizable Gantt chart component for Vue 3.
The original has been edited to support Luxon and custom format has been removed. 

## 📚 Documentation

For further guides and references from the original repo, check out the [official docs](https://zunnzunn.github.io/vue-ganttastic/getting-started.html).

## ✨ Key Features

### 🎯 Core Capabilities

- **📅 Advanced Time Management**: Multi-precision support (hours, days, weeks, months) with auto-scaling
- **🖱️ Drag & Drop**: Intuitive bar and row manipulation
- **🏷️ Simplicity**: Simple white label integration into custom projects

## 🚀 Quickstart

Install using

```
npm install @lui297/vue-ganttastic
```

Then, initalize the plugin in the starting point of your app (most likely src/main.js):

```js
import { createApp } from "vue"
import App from "./App.vue"
...
import ganttastic from ' @lui297/vue-ganttastic'
...
createApp(App)
  .use(ganttastic)
  .mount('#app')
```

This will globally register the components g-gantt-chart and g-gantt-row and you will be able to use those two components right away.

```html
<template>
  <g-gantt-chart
    :chart-start="new Date() || DateTime.now().minus({ days: 7 }).toISO()"
    :chart-end="new Date() || DateTime.now().plus({ days: 7 }).toISO()"
    precision="hour"
    bar-start="myBeginDate"
    bar-end="myEndDate"
  >
    <g-gantt-row label="My row 1" :bars="row1BarList" />
    <g-gantt-row label="My row 2" :bars="row2BarList" />
  </g-gantt-chart>
</template>

<script setup>
  import { ref } from "vue"

  const row1BarList = ref([
    {
      :myBeginDate: "DateTime.now().set({ day: 3 }).toISO()",
      :myEndDate: "DateTime.now().set({ day: 5 }).toISO()",
      ganttBarConfig: {
        // each bar must have a nested ganttBarConfig object ...
        id: "unique-id-1", // ... and a unique "id" property
        label: "Lorem ipsum dolor"
      }
    }
  ])
  const row2BarList = ref([
    {
      :myBeginDate: "DateTime.now().set({ month: 3 }).toISO()",
      :myEndDate: "DateTime.now().set({ month: 5 }).toISO()",
      ganttBarConfig: {
        id: "another-unique-id-2",
        hasHandles: true,
        label: "Hey, look at me",
        style: {
          // arbitrary CSS styling for your bar
          background: "#e09b69",
          borderRadius: "20px",
          color: "black"
        },
        class: "foo" // you can also add CSS classes to your bars!
      }
    }
  ])
</script>
```

## Contributing

Clone the project, make some changes, test your changes out, create a pull request with a short summary of what changes you made. Contributing is warmly welcomed!

To test your changes out before creating a pull request, create a build:

```
npm run build
```

To test out the build, you should create a tarball using:

```
npm pack
```

Then, place the tarball in some other test project and install the package from the tarball by using:

```
npm install <name_of_the_package>.tgz
```


## About

**License** [MIT](https://choosealicense.com/licenses/mit/)  
**Author**: Marko Žunić, BSc  
**Editor**: L. Arends (@lui297) 

[GitHub Origin](https://github.com/lui297/vue-ganttastic/)
[GitHub Upstream](https://github.com/zunnzunn/vue-ganttastic)

