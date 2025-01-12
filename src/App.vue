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
  }
}
</script>

<style>

</style>
