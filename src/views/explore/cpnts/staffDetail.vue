<template>
  <div class="info">
    <div class="staff-detail">
      <img src="" alt="">
      <p>
      <div class=""><span>姓名：</span><span></span></div>
      <div class=""><span>所属公司：</span><span></span></div>
      <div class=""><span>邮件：</span><span></span></div>
      <div class=""><span>职位：</span><span></span></div>
      <div class=""><span>电话：</span><span></span></div>
      <div class=""><span>部门：</span><span></span></div>
      </p>
      <div>
        ‘简介’
      </div>
      <div>

      </div>
    </div>
  </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  export default {
    name: 'companyDetail',
    data () {
      return {
      }
    },
    created: function () {
      console.log('created')
    },
    mounted: function () {
      console.log('mounted')
    },
    components: {
    },
    methods: {
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>


</style>
