<template>
  <div class="editor-contact">
    <div class="left">
      <editorDetail :editor="editor"></editorDetail>
      <showParams :editor="editor"></showParams>
    </div>
   <div class="right">
     <allParams :editor="editor"></allParams>
   </div>
  </div>
</template>

<script>
  import showParams from './showParams.vue'
  import allParams from './allParams.vue'
  import editorDetail from './editorDesc.vue'
  export default{
    props: {
      editor: ''
    },
    data () {
      return {
        msg: 'hello vue'
      }
    },
    mounted () {
      console.log(this.editor)
    },
    components: {
      showParams,
      allParams,
      editorDetail
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .editor-contact{
    .left{
      float: left;
    }
    .right{
      float: right;
    }
  }
</style>
