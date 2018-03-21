<template>
  <div class="timeline-wrapper remark-wrapper" v-if="!isDelete">
    <span class="type-icon">
      <span class="icon-font">&#xe634;</span>
    </span>
    <div class="timeline-container remark-container">
      <div class="header">
        <img :src="data.accInfo.avatar || '/static/img/default_avatar.jpg'" alt="" class="avatar"  onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <span class="title-date">
          <div class="title">
            {{data.accInfo.name}}
            <span style="color: #7C98B6;font-weight: 500;">记录了一份关于 </span>
            {{data.socialContent.contactName}}
             的备注
          </div>
          <div class="date">{{data.socialContent.createTime|time-formater-has-hour}}</div>
        </span>
        <el-dropdown trigger="click" class="record-operate" @command="editorRemark($event)">
          <span class="el-dropdown-link">
            操作
            <span class="icon-font" style="margin-left:8px;font-size:8px;">&#xe608;</span>
          </span>
          <el-dropdown-menu slot="dropdown" class="set-about-operate-items">
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
            <el-dropdown-item command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="content">
        <el-input
          class="edit-content"
          v-model="content"
          :autosize="false" type="textarea" :rows="4" :disabled="editorDisable"></el-input>
      </div>
    </div>
    <transition name="slide">
      <div class="btn-container" v-show="!editorDisable">
        <el-button @click="saveEditor" type="primary" :disabled="editDisableBtn" class="btn">保存</el-button>
        <el-button @click="cancel" type="default" class="btn">取消</el-button>
      </div>
    </transition>
  </div>
</template>
<script>
import ShowMore from '@/components/newShowMore.vue'
import contactInfoApi from '@/api/contactInfoApi'
export default {
  name: '',
  data () {
    return {
      editorDisable: true,
      content: '',
      originContent: '',
      isDelete: false,
      editDisableBtn: false
      // operName: ''
    }
  },
  mounted () {
    this.content = this.data.socialContent.content
    this.originContent = this.content
    // let info = this.data.userInfoMap[this.data.userId]
    // if (info) {
    //   this.operName = info.name
    // }
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    // userInfoMap () {
    //   return this.$store.getters.userInfoMap
    // }
  },
  components: {
    ShowMore
  },
  methods: {
    editorRemark (type) {
      if (type === 'edit') {
        this.editorDisable = false
      } else if (type === 'delete') {
        this.$confirm('确定删除备注?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          contactInfoApi.commentDelete({ id: this.data.id }).then(res => {
            if (!res.data.code) {
              this.$message.success('删除备注成功')
              this.isDelete = true
            } else {
              this.$message.error('删除备注失败')
            }
          })
        }).catch(() => {})
      }
    },
    saveEditor () {
      if (this.content.length > 1000) {
        this.$message.error('备注限制字符为0-1000字符')
        return
      }
      this.editDisableBtn = true
      contactInfoApi.commentUpdate({
        id: this.data.id,
        content: this.content
      }).then(res => {
        if (!res.data.code) {
          this.editorDisable = true
          this.originContent = this.content
          this.$message.success('修改备注成功')
        } else {
          this.$message.error('修改备注失败')
        }
        this.editDisableBtn = false
      })
    },
    cancel () {
      this.editorDisable = true
      this.content = this.originContent
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
  // @import "../../../../../assets/style/timeline";
  .set-about-operate-items {
    padding: 0;
  }
  .remark-wrapper{
    // position: relative;
    // margin-bottom: 50px;
    // .type-icon{
    //   position: absolute;
    //   top: 10px;
    //   left: -15px;
    //   display: inline-block;
    //   text-align: center;
    //   line-height: 30px;
    //   color: #fff;
    //   width: 30px;
    //   height: 30px;
    //   border-radius: 50%;
    //   background-color: #86abfa;
    //   box-shadow: 0 2px 6px rgba(84, 136, 249, 0.5);
    // }
    .remark-container{
      // position: relative;
      // margin-left: 40px;
      // background: #fff;
      // padding: 21px 20px 20px 20px;
      // border-radius: 4px;
      .header{
        // position: relative;
        // width: 100%;
        height: 59px;
        // font-size: 0;
        border-bottom: 1px solid #eaf0f6;
        // .avatar{
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 50%;
        //   margin-right: 7px;
        //   vertical-align: top;
        // }
        .title-date{
          // display: inline-block;
          // vertical-align: top;
          // .title{
          //   line-height: 20px;
          //   font-size: 13px;
          //   color: #33475b;
          //   font-weight: 600;
          //   margin-bottom: 5px;
          //   word-break: break-all;
          // }
          // .date{
          //   font-size: 13px;
          //   color: #7c98b6;
          // }
        }
        .record-operate{
          position: absolute;
          top: 0px;
          right: 0px;
        }
      }
      .content{
      }
      .edit-content{
        textarea{
          background-color: #fff;
          resize: none;
          border: none;
        }
      }
    }
    .slide-enter-active {
      transition: all .3s ease;
    }
    .slide-enter {
      transform: translateY(-100%);
    }
    .btn-container{
      width: 669px;
      z-index: 9;
      border-radius: 4px;
      margin-top: 8px;
      margin-left: 40px;
      padding: 20px;
      background: #F5F8FA;
      box-shadow: 0 0 20px #DFE3EB;
      .el-button{
        padding: 9px 30px;
      }
    }
  }
</style>
