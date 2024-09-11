<template>
  <!-- Echarts图表组件 -->
  <div>
     
      <div class="container">
          <div class="plugins-tips">使用Echarts开发的图表组件</div>
          <!-- 图表使用layout布局 ，分为上下两部分-->
          <!-- 上部分 -->
          <el-row :gutter="20">
              <!-- 柱形图8 -->
              <el-col :span="8">
                  <div class="content-title">柱状图</div>
                  <!-- card卡片，将信息聚合在卡片容器中展示 -->
                  <MyEcharts :options="options" :width="width"></MyEcharts>
              </el-col>
              <!-- 折线图16 -->
              <el-col :span="16">
                  <div class="content-title">折线图</div>
                  <MyEcharts :options="options1" :width="width"></MyEcharts>
              </el-col>
          </el-row>
          <!-- 下部分 -->
          <el-row :gutter="20">
              <!-- 饼状图 -->
              <el-col :span="8">
                  <div class="content-title">饼状图</div>
                  <MyEcharts :options="options2" :width="width"></MyEcharts>
              </el-col>
              <!-- 雷达图 -->
              <el-col :span="16">
                  <div class="content-title">雷达图</div>
                 
                  <MyEcharts :options="options3" :width="width"></MyEcharts>
              </el-col>
          </el-row>
      </div>
  </div>
</template>

<script>

import MyEcharts from '../common/MyEcharts.vue';
import {option3,option4,option5,option6} from '../../options'
export default {
  name: 'basecharts',
  components: {
      MyEcharts
  },
  data() {
  return {
    options: option3,
    options1: option4,
    options2: option5,
    options3: option6,
    width: '100%'
  }
}}
</script>
<style scoped>
.chart-box {
  display: inline-block;
  margin: 20px;
}

.chart-item {
  width: 100%;
  height: 400px;
}

.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>