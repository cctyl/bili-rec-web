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

export default {
  name: 'App',
  components: {
    Header
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    async checkLogin() {

      if (this.$route.path !== '/settings'){


        await this.$checkLogin();


      }

    }
  }
}
</script>

<style>

</style>
