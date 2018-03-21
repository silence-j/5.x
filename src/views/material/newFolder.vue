<template>
  <div class="new-folder-wrapper">
    <div class="layout">
      <img src="/static/img/material/folder.png" alt="文件夹" class="pic">
      <div class="name-folder">
        <input type="text" v-model="newName" class="name-input" @keyup.enter="createDone(newName)">
        <el-button icon="check" @click="createDone(newName)"></el-button>
        <el-button icon="close" @click="createDone(false)"></el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      newName: '新建文件夹'
    }
  },
  mounted () {

  },
  computed: {

  },
  components: {
  },
  methods: {
    createDone (val) {
      this.$emit('createDone', val)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .new-folder-wrapper{
    display: inline-block;
    position: relative;
    width: 124px;
    height: 115px;
    margin: 0 3px;
    margin-bottom: 8px;
    background-color: #fff;
    border-radius: 8px;
    text-align: center;
    vertical-align: top;
    .layout{
      position: absolute;
      bottom: 9px;
      left: -20px;
      .pic{
        width: 66px;
        height: auto;
        margin-left: -2px;
        margin-bottom: 5px;
      }
      .name-folder{
        width: 166px;
        .name-input{
          width: 90px;
          appearance: button;
          height: 22px;
          padding: 0 10px;
          line-height: 22px;
          border-radius: 4px;
          border: 1px solid #02aaaa;
          box-sizing: border-box;
        }
        .el-button{
          width: 22px;
          padding: 3px 2px;
          margin-left: 3px;
          font-size: 12px;
          color: #b0c1d4;
          &:hover{
            color: #5488f9;
          }
        }
      }
    }
  }
</style>
