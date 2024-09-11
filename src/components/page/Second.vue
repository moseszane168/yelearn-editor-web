<!-- 接受信息 -->
<template>
  <div class="wrapper">
    <hr />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import Bus from '../../utils/bus';
export default {
    data(){
        return {
            message:'',
        };
    },
    mounted(){
        let self = this;
        Bus.$on('msg',(e)=>{
            self.message = e;
        });
    },
};
</script>

<style>

</style>