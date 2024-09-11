import Vue from 'vue';

//定义一个时间过滤器
Vue.filter('formatDate', function (value) {
    if (value) {
      let oDate = new Date(value);
      let year = oDate.getFullYear();
      let month = oDate.getMonth() + 1;
      let date = oDate.getDate();
      let hour = oDate.getHours();
      let minute = oDate.getMinutes();
      let second = oDate.getSeconds();
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    }
  })


//创建一个filter.js
// 
const globalFilters = {
    addHollow : (...arg) => {
        var  argLength = arg.length;
        if(argLength == 1){
             return arg[0] + 'hollow';
        }else{
            let res = '';
            arg.forEach((val,index) => { 
                res += val;
            })
            return res;
        }
    },
    reverseVal : (val) => {
        return val.split('').reverse().join('');
    }
}
export default {
    install(Vue){
        Object.keys(globalFilters).forEach((key) => {
            Vue.filter(key,globalFilters[key]);
        })
    }
}

//在main.js中
// import myFilter from './plugins/filter/filter.js';
// Vue.use(myFilter);


//组件内部应用：
//  {{msg | addHollow}}                     管道符
//  {{val | reverseVal}}                    管道符