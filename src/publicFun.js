exports.install = function(Vue,options){
    // 获取物料
    Vue.prototype.remoteMaterial = function(query){//获取当前日期字符串
        if (query !== '') {
            this.axios.post('/infor/material/getMaterialByCodeName', {
                token: localStorage.getItem("token"),
                mat_code: query
            }).then((res) => {
                this.mat_options = res;
            }).catch(() => {
                this.loading = false;
            })
        } else {
            this.mat_options = [];
        }
    }
} 
 
 
