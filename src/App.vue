<template>
  <div class="flex h-screen">
    <!-- 左侧导航栏 -->
    <Header></Header>

    <!-- 右侧内容区 -->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "@/components/Nav.vue";
import api from "@/api";
export default {
  name: 'App',
  components: {
    Header
  },
  mounted() {
    this.checkLogin();
  },
  methods:{
  async  checkLogin(){
      try {
        const response = await api.checkAccessKey();
        if(response.message.indexOf("未登录/登录失效")!==-1){
          this.$message(response.message,'error');
        }

      } catch (error) {
        console.error('获取用户数据失败:', error);
      }
    }
  }
}
</script>

<style>

</style>
