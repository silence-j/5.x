<template>
  <div class="left-menu">
    <el-menu default-active="/" class="el-menu-vertical-demo" @select="select" v-show="isSelect">
      <el-menu-item-group>
        <template slot="title"><span class="title">页面名称</span></template>
        <el-menu-item index="/" class="item">HOME</el-menu-item>
        <el-menu-item index="/products" class="item">PRODUCTS</el-menu-item>
        <el-menu-item :index="blogPath" class="item" v-if="serverLevel=='1'">BLOG</el-menu-item>
        <!--<el-menu-item index="/detail" class="item">PRODUCT DETAIL</el-menu-item>-->
        <el-menu-item index="/profile" class="item">COMPANY PROFILE</el-menu-item>
        <el-menu-item index="/contacts" class="item">CONTACTS US</el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        blogPath: '/blog/' + localStorage.shopId,
        isSelect: true,
        msg: 'hello vue',
        serverLevel: window.localStorage.serverLevel
      }
    },
    methods: {
      select (index) {
        this.$store.commit('EDITOR_MENU', {menu: index})
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../../../assets/style/variable";
  .left-menu{
    margin-right: 20px;
    float: left;
    width: 280px;
    .el-menu{
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(0,0,0,.08);
      .el-menu-item{
        font-size: 13px;
      }
    }
    .el-menu-item-group__title{
      background: #F5F8FA;
      padding-top: 11px;
    }
    .title{
      font-size: 16px;
      //line-height: 40px;
      display: inline-block;
      padding-bottom: 12px;
      color: @base-color;
    }
    .item{
      height: 70px;
      line-height: 70px;
      background: #fff;
      border-top: 1px solid #DFE3EB;
    }
    .item:hover{
      background: #F5F8FA;
    }
    .item.is-active {
      background: #F5F8FA;
    }
  }
  #logo-control{
    display: none;
  }
</style>
