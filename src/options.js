// 首页
// 饼状图
export const option2 = {
    title: {
        text: 'Stacked Area Chart'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'cross',
        label: {
            backgroundColor: '#6a7985'
        }
        }
    },
    legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    toolbox: {
        feature: {
        saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
    ],
    yAxis: [
        {
        type: 'value'
        }
    ],
    series: [
        {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
            show: true,
            position: 'top'
        },
        areaStyle: {},
        emphasis: {
            focus: 'series'
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};


// 首页折线图
export const option1 = {
    title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
// baseCharts页面
        // 柱状图
        export const option3={
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }
            ]
        };
         // 折线图，堆叠面积图
         export const option4 = {
            title: {//标题
                text: 'Stacked Area Chart'//标题
            },
            tooltip: {//提示框配置项，用于显示提示框
                trigger: 'axis',//指定触发类型
                axisPointer: {//指示线和文本标签配置项
                    type: 'cross',//指定指示线的类型
                    label: {//标签配置项
                        backgroundColor: '#6a7985'//标签背景颜色
                    }
                }
            },
            legend: {//图例配置项，用于设置图例，包括图例的样式和位置
                data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
            },
            toolbox: {// 工具箱配置项，用于配置工具箱，如保存图片
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {//直角坐标系内绘图网格配置项，用于设置网格的样式和位置
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true//表示坐标轴标签（axisLabel)是否和网格一起在一个容器内
                // 主要是为了让标签不超出网格容器，且坐标轴标签不会重叠，保证图像整体美观性
            },
            xAxis: [//直角坐标系中的横轴配置项，用于设置横轴的数据和样式
                {
                    type: 'category',//指定坐标轴类型
                    boundaryGap: false,//是否留白
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']//指定横轴的数据
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                // 图表系列配置项，包括多个数据系列，如这里包含 Email、Union Ads、Video Ads、Direct 和 Search Engine 五个系列。
                {
                    name: 'Email',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: 'Union Ads',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: 'Video Ads',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name: 'Direct',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name: 'Search Engine',
                    type: 'line',
                    stack: 'Total',
                    label: {
                        show: true,
                        position: 'top'
                    },
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };
          // 饼状图
          export const option5={
            title: {// 标题文本    
                text: 'Referer of a Website',// 标题文本
                subtext: 'Fake Data',// 副标题文本
                left: 'center'// 标题的水平距离
            },
            tooltip: {// 鼠标浮动在图表上时的提示框
                trigger: 'item'// trigger属性为item表示数据项触发
            },
            legend: {// 图例
                orient: 'vertical',// 垂直方向的图例
                left: 'left'// 图例在左边
            },
            series: [// 系列，这里是饼图的配置
                {
                    name: 'Access From',// 这个系列的名字
                    type: 'pie',// 图表类型
                    radius: '50%',// 饼图半径，这里相对的是Dom容器宽高中小的那一个的一半来计算
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ],
                    emphasis: {//对象，某个数据项被强调(即hover状态)时的样式
                        itemStyle: {//用于设置数据样式的对象，包括颜色，阴影等属性
                            shadowBlur: 10,//添加阴影模糊程度，数值越大，阴影越模糊
                            shadowOffsetX: 0,//阴影水平偏移量，可正可负
                            shadowColor: 'rgba(0, 0, 0, 0.5)'//阴影颜色，黑色半透明的阴影效果
                        }
                    }
                }
            ]
        };
        
        // 雷达图
        export const option6 = {
            title: {
                text: 'Basic Radar Chart'
            },
            legend: {
                data: ['Allocated Budget', 'Actual Spending']
            },
            radar: {
                // shape: 'circle',
                indicator: [
                    { name: 'Sales', max: 6500 },
                    { name: 'Administration', max: 16000 },
                    { name: 'Information Technology', max: 30000 },
                    { name: 'Customer Support', max: 38000 },
                    { name: 'Development', max: 52000 },
                    { name: 'Marketing', max: 25000 }
                ]
            },
            series: [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data: [
                        {
                            value: [4200, 3000, 20000, 35000, 50000, 18000],
                            name: 'Allocated Budget'
                        },
                        {
                            value: [5000, 14000, 28000, 26000, 42000, 21000],
                            name: 'Actual Spending'
                        }
                    ]
                }
            ]
        }