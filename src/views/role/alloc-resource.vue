
<template>
  <div class="alloc-resource">分配资源</div>
</template>

<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
  name: 'alloc-resource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  }
})
</script>

<style lang='scss' scoped>
</style>
