<template>
  <div class="showParams">
    <div class="title">
      <span>提示</span>
      <p>你可以在这里自定义选择{{text}}属性显示在{{text}}详情页中。这里的设置会影响所有的{{text}}详情</p>
    </div>
    <draggable @sort="sort">
      <div class="paramsTag" v-for="(basic,i) in showParams" v-model="showParams" v-if="basic.descrption!='邮箱可用性状态'">
        <i class="icon-font icon-drag drag"></i>
        <span>{{basic.descrption}}</span>
        <i class="el-icon-close close" @click="deleteParams(basic, i)" v-show="showParams.length>1"></i>
      </div>
    </draggable>
  </div>
</template>
<script>
  import contactInfoApi from '../../../../../../src/api/contactInfoApi'
  import draggable from 'vuedraggable'
  export default{
    props: {
      editor: ''
    },
    data () {
      return {
        showParams: [],
        type: this.editor === 'company' ? 1 : 0,
        text: this.editor === 'company' ? '公司' : '联系人'
      }
    },
    mounted () {
      contactInfoApi.getBasicInfo({type: this.type}).then(res => {
        if (!res.data.code) {
          this.showParams = res.data.data
        }
      })
    },
    computed: {
      isAdded () {
        return this.$store.getters.isAdded
      }
    },
    watch: {
      isAdded () {
        contactInfoApi.getBasicInfo({type: this.type}).then(res => {
          if (!res.data.code) {
            this.showParams = res.data.data
          }
        })
      }
    },
    components: {
      draggable
    },
    methods: {
      /**
       * 排序属性
       * @param ev
       */
      sort (ev) {
        console.log(ev.newIndex)
        contactInfoApi.sortParams({
          group: this.showParams[ev.oldIndex].group,
          type: this.showParams[ev.oldIndex].type,
          attrName: this.showParams[ev.oldIndex].attrName,
          orderIndex: parseInt(this.showParams[ev.newIndex].orderIndex)
        }).then(res => {
          if (!res.data.code) {
            this.$message.success('排序属性成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      deleteParams (basic, i) {
        contactInfoApi.deleteParams(basic).then(res => {
          if (!res.data.code) {
            this.showParams.splice(i, 1)
            this.$message.success('删除属性成功')
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../../assets/style/variable";
  // @import "../../../../../assets/style/base";

  .showParams {
    width: 350px;
    padding: 20px;
    background: @white;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    .title {
      span {
        font-size: 18px;
        font-weight: bold;
      }
      p {
        color: #7C98B6;
        margin-top: 10px;
        margin-bottom: 20px;
        line-height: 20px;
      }
    }
    .paramsTag {
      margin-top: 10px;
      padding: 10px 0;
      color: #7C98B6;
      background: #F5F8FA;
      border: 1px solid #EAF0F6;
      .drag {
        cursor: pointer;
        font-size: 24px;
      }
      span {
        vertical-align: text-top;
      }
      .close {
        float: right;
        margin-right: 10px;
        line-height: 23px;
      }
    }
  }
</style>
