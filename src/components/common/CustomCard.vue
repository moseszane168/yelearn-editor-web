<template>
  <el-card :shadow="shadow" :body-style="{ padding: '0px' }" >
  <div class="grid-content">
    <!-- 字符串拼接 -->
    <i :class="icon + ' grid-con-icon'" :style="{ backgroundColor: color }"></i>
    <div class="grid-cont-right">
      <div class="grid-num">{{ number }}</div>
      <div>{{ title }}</div>
    </div>
  </div>
</el-card>
</template>

<script>
export default {
props: {
 icon: String,
 color: String,
 title: String,
 shadow: {
   type: String,
   default: 'hover',
 },
 number: {
   type: Number,
   default: 0,
 },
},
};
</script>

<style>
.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}
.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}
</style>