
<template>
  <div class="break-inside-avoid mb-6 rounded-lg p-6 bg-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-1  active:shadow-inner transition-all duration-200">
    <div class="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
      <div class="flex items-center justify-center mb-4">
        <i :class="img" class="w-16 h-16 rounded-full text-4xl"></i>
        
      </div>
      <h3 class="text-lg font-semibold text-center mb-2">{{title}}</h3>
      <p class="text-sm text-gray-400 text-center mb-4" v-html="desc">
      </p>
    </div>
    <div class="mt-4 flex justify-center">


      <button
          @click="trigger"
          class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fas fa-play mr-2"></i>
        <span>执行</span>
      </button>
    </div>
    <div class="mt-4 flex justify-center">
      <slot>
      </slot>
    </div>
    <div class="mt-4 pr-1" style="max-height: 350px;  overflow: auto">
      <slot name="other" >
      </slot>
    </div>

  </div>

</template>
<script >

export default {
  name: "simple-card-component",
  data() {
    return {

    };
  },
  props:{
    img: String,
    title:String,
    desc:String,
    trigger:Function,
  },
  mounted() {


  },
  methods: {

  }
};
</script>

<style scoped>

</style>