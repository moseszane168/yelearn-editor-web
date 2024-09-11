<!-- 父组件 -->
<template>
    <div>
      <child-component v-on:closeDialog="handleClose"></child-component>
    </div>
  </template>
   
  <script>
  import ChildComponent from "./ChildComponent.vue";
   
  export default {
    components: {
      ChildComponent
    },
    methods: {
      handleClose() {
        // 在这里编写关闭父页面对话框的代码
        console.log("关闭父页面对话框");
      }
    }
  };
  </script>