<template>
  <div class="info">
    <div class="detail-head">
      <img src="" alt="">
      <p>
        <div class=""><span>行业：</span><span></span></div>
        <div class=""><span>公司类型：</span><span></span></div>
        <div class=""><span>公司网址：</span><span></span></div>
        <div class=""><span>公司规模：</span><span></span></div>
        <div class=""><span>公司地址：</span><span></span></div>
        <div class=""><span>公司名称：</span><span></span></div>
        <div class=""><span>电话：</span><span></span></div>
        <div class=""><span>传真：</span><span></span></div>
      </p>
      <el-table style="width: 90%;">
        <el-table-column label="姓名" ></el-table-column>
        <el-table-column label="职位" ></el-table-column>
        <el-table-column label="岗位" ></el-table-column>
        <el-table-column label="邮箱" ></el-table-column>
        <el-table-column label="社交信息" ></el-table-column>
      </el-table>
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
      this.comDetail({companyId: this.$route.query.companyId})
    },
    components: {
    },
    methods: {
      comDetail: function (params) {
        exploreAPI.getCompanyDetail(params).then(res => function () {
          console.log(params)
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>


</style>
