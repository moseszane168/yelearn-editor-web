<template>
    <el-card shadow="hover">
      <div :id="uuid" class="main-chart" :style="style"></div>
      
    </el-card>
  </template>
  
  <script>
  import bus from '../../utils/bus';
  import * as echarts from 'echarts/core';
  import { TooltipComponent, LegendComponent, TitleComponent, ToolboxComponent, GridComponent } from 'echarts/components';
  import { PieChart, BarChart, RadarChart } from 'echarts/charts';
  import { LabelLayout } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';
  import { UniversalTransition } from 'echarts/features';
  import { LineChart } from 'echarts/charts';
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    BarChart,
    RadarChart,
    CanvasRenderer,
    LabelLayout,
    GridComponent,
    ToolboxComponent,
    LineChart,
    UniversalTransition
  ]);
  
  const idGen = () => {
    return new Date().getTime()
  }
  
  export default {
  
    props: {
  
      height: {
        type: String,
        default: '400px'
      },
      width: {
        type: String,
        default: '600px'
      },
  
      options: {
        type: Object,
        default: null
      }
  
    },
  
    data() {
      return {
        uuid: null,
        myChart: null
      }
    },
  
    computed: {
  
      style() {
        return {
          height: this.height,
          width: this.width
        }
      }
  
    },
  
    created() {
      this.uuid = idGen();
      this.handleListener();
    },
  
    mounted() {
      this.renderChart();
      // 初始化
    }
    ,
    activated() {
      this.handleListener();
    },
    deactivated() {
      window.removeEventListener('resize', this.renderChart);
      bus.$off('collapse', this.handleBus);
    },
    methods: {
      handleListener() {
        bus.$on('collapse', this.resizeHandle);
        // 调用renderChart方法对图表进行重新渲染
        window.addEventListener('resize', this.resizeHandle);
      },
      // this.函数名访问函数，this.函数名()调用该函数
      resizeHandle() {
        this.myChart.resize();
      },
      handleBus(msg) {
        setTimeout(() => {
          this.renderChart();
        }, 300);
      },
      renderChart() {
        // 准备实例
        this.myChart = echarts.init(document.getElementById(this.uuid));
        // this.myChart = echarts.init(document.getElementById('main'));
        // 应用配置项
        this.myChart.setOption(this.options, true);
      },
  
    }
  }
  </script>