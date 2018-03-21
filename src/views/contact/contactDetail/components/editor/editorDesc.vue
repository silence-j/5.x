<template>
  <div class="editorDesc">
    <img class="avatar"
         v-if="contactDetail.base.avatar!==''&&contactDetail.base.avatar"
         :src="contactDetail.base.avatar">
    <img class="avatar"
         v-if="(contactDetail.base.avatar===''||
         !contactDetail.base.avatar)&&
         editor!=='company'" src="../../../../../assets/img/default_avatar.png">
    <img class="avatar"
         v-if="(contactDetail.base.avatar===''||
         !contactDetail.base.avatar)&&
         editor==='company'"
         src="../../../../../assets/img/default_comp.png">
    <span class="desc-detail" v-if="editor==='company'">
      <span class="name">{{contactDetail.base.name}}</span>
      <a class="desc" :href="contactDetail.base.url" target="_blank">{{contactDetail.base.url}}</a>
    </span>
    <span class="desc-detail" v-else>
      <span class="name">{{contactDetail.base.firstName+(contactDetail.base.lastName||'')}}</span>
      <span class="desc">{{contactDetail.base.position}}</span>
    </span>
  </div>
</template>

<script>
  export default{
    props: {
      editor: ''
    },
    data () {
      return {}
    },
    computed: {
      contactDetail () {
        return this.editor === 'company'
          ? this.$store.getters.companyDetail
          : this.$store.getters.contactDetail
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .editorDesc{
    .el-dialog {
      width: 390px;
    }
    .el-dialog__header{
      border: none;
    }
    .el-dialog__body{
      padding: 0 27px 30px 27px;
    }
    .el-dialog__footer{
      text-align: left;
      padding: 0 27px 30px 27px;
      button{
        padding: 9px 28px;
      }
    }
  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  // @import "../../../../../assets/style/base";
  @import "../../../../../assets/style/variable";
  .editor-name{
    width: 155px;
    display: inline-block;
    margin-bottom: 20px;
  }
  .firstName {
    margin-right: 20px;
  }
  .dropdown-menu{
    margin: 5px 0;
    padding: 6px 0;
    .el-dropdown-menu__item{
      padding: 0 10px;
    }
  }
  .editorDesc{
    width: 350px;
    padding: 40px 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    background: @white;
    .avatar{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .desc-detail{
      width: 200px;
      display: inline-block;
      vertical-align: top;
      font-size: 13px;
      margin-left: 10px;
      .name{
        width: 200px;
        display: inline-block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        font-size: 18px;
        font-weight: bold;
      }
      .desc{
        width: 200px;
        display: inline-block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        margin-top: 5px;
      }
    }
    .editor{
      float: right;
      color: #B0C1D4;
      font-size: 16px;
      cursor: pointer;
    }
    .operate{
      margin-top: 25px;
      button{
        margin-left: 135px;
        padding: 10px 0;
        width: 80px;
        i{
          margin-left: 10px;
        }
      }
    }
  }
</style>
