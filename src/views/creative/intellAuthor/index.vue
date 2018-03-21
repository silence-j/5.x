<template>
  <div class="logistic-container intell-container">
    <div class="key2-box" v-if="keydata.length && !loading">
      <label>关键字：</label>
      <el-tag class="key-tag" v-for="key in keydata" :key="key" v-if="key.keyword">
        <p :title="key.keyword">{{ key.keyword }}</p>
      </el-tag>
      <router-link to="/setKeyword" v-if="isCanEditKey"><el-button class="btn-trans">编辑关键字</el-button></router-link>
    </div>
    <div class="intelist-box" v-if="keydata.length && !loading">

      <div class="intelist-item" v-for="(item, index) in keydata" v-if="item.keyword">
        <h6 class="tit-key"><em># {{item.keyword}} </em>
          <el-button class="btn-trans" :disabled="!item.canBuild" @click="createAgain(item)">再次创作</el-button>
          <el-tooltip class="item" effect="dark" content="每天对应关键字可进行一次重新创作，重新创作后将替换原有文章。" placement="top">
            <span class="icon-font">&#xe65b;</span>
          </el-tooltip>
        </h6>
        <div class="intelist-cont" v-for="(item2, index2) in item.list"
        v-if="item.list && item.list.length && item2.blogTitle.replace(/(^\r+)|(\r+$)/g, '').replace(/(^\n+)|(\n+$)/g, '').length">
          <div class="intelist-cont-inner" >
            <p class="tit">{{item2.blogTitle}}</p>
            <p class="desc" v-html="item2.blogContents"></p>
            <div class="btn-wrap">
              <router-link :to="'/editBlog/' + item2.id"><el-button type="primary" class="btn-blue">编辑</el-button></router-link>
              <el-button class="btn-trans" @click="publish(item2.id, item2.blogTitle)">发布</el-button>
            </div>
          </div>
          <hr class="line">
        </div>
        <p v-if="!item.list.length" class="no-blog">已获取关键字，智能作家正在创作中，创作结果会在凌晨24点提交。</p>

      </div>
    </div>
    <div class="nodata" v-if="!keydata.length && !loading">
      <div class="img1">
        <img src="./../../../assets/img/empty-contact.png" alt="">
      </div>
      <div class="tips">暂无数据，请先 <router-link to="/setKeyword" v-if="isCanEditKey"><span style="text-decoration: underline;color: #5488F9;">设置关键字</span></router-link></div>

    </div>
    <div v-if="loading" class="loading loading-circle"></div>
    <DialogBox :config="oconfig" @sure="confirmOk"></DialogBox>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import creativeApi from '../../../api/creativeApi'
import DialogBox from '../../../components/box/dialogBox'
// import Vue from 'vue'
import Util from '@/common/Util'
export default {
  name: 'intellAuthor',
  // props: ['data'],
  data () {
    return {
      keydata: [],
      loading: true,
      // loading2: true,
      intellkeys: [], // 关键词
      oconfig: {
        visible: false,
        notice: '',
        sureText: '发布',
        cancelText: '取消',
        callback: null,
        flag: 0,
        popovercls: 'confirm-pop'
      },
      isCanEditKey: false
    }
  },
  components: {DialogBox},
  methods: {
    /**
     * 增加按钮权限
     */
    addBtnRight () {
      return Util.hasRightByCode('FA')
    },
    // 发布弹框
    publish (id, title) {
      this.oconfig.id = id
      Object.assign(this.oconfig, {visible: true, theme: 'red', notice: '确定将以下文章发布到博客吗？', message: title, flag: 0})
    },
    // 确认发布
    confirmOk () {
      let _this = this
      creativeApi.publish({blogId: this.oconfig.id}).then(res => {
        if (!res.data.code) {
          _this.oconfig.visible = false
          _this.$message.success('发布成功')
          setTimeout(() => {
            _this.renderList()
          }, 500)
          // window.location.reload()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 再次创作
    createAgain (item) {
      let _this = this
      item.canBuild = false
      creativeApi.createAgain({keyword: item.keyword}).then(res => {
        if (!res.data.code) {
          _this.$message.success('创作成功')
          setTimeout(() => {
            _this.renderList()
          }, 500)
          // window.location.reload()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    renderList () {
      this.loading = true
      creativeApi.getIntellList().then(res => {
        if (!res.data.code) {
          this.loading = false
          this.keydata = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  watch: {
    // fromIntellAuthor () {
    //   console.log('fromIntellAuthor', this.fromIntellAuthor)
    // }
  },
  // computed: mapGetters({
  //   fromIntellAuthor: 'fromIntellAuthor'
  // }),
  created () {
    this.$store.commit('FROMAUTHOR', true)
    this.renderList()
    // this.isCanEditKey = (window.localStorage.subUserId === window.localStorage.userId) && (window.localStorage.serverLevel === '1')
    this.isCanEditKey = Util.hasRightByCode('GA')
    // creativeApi.getIntellKey().then(res => {
    //   if (!res.data.code) {
    //     this.loading2 = false
    //     let keyw = res.data.data.blogKeywords
    //     // this.intellkeys = []
    //     if (keyw) {
    //       this.intellkeys = keyw.split(';')
    //       // for (let i = 0, len = arr.length; i < len; i++) {
    //       //   console.log(arr[i])
    //       //   this.intellkeys.push({name: arr[i]})
    //       // }
    //     }
    //   }
    // })
  },
  mounted () {
  }
}
</script>
<style lang='less' rel="stylesheet/less">
@import '../../../assets/style/variable';
// @textColor: #33475B;
.intell-container{
  margin-bottom: 16px;
  position: relative;
  padding: 0;
  &.logistic-container{
    min-height: calc(~'100vh - 207px');    
  }
  .btn-trans{
    font-size: 13px;
    // padding: 0;
    // height: 28px;
  }
  .btn-trans.el-button{
    &:hover{
      color: #5488F9;
      background-color: #fff;
      border-color: #5488F9;
    }
    // &[disabled]{
    //   color: rgb(191, 196, 217);
    // }
    // &[disabled]:hover{
    //   // color: rgb(191, 196, 217);
    //   background-color: rgb(238, 239, 246);
    //   border-color: rgb(209, 213, 229)
    // }
  }
  .no-blog{
    margin-top: 20px;
    padding-left: 18px;
    color: #7C98B6;
  }
  .nodata{
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px;
    width: 180px;
    .tips{
      margin: 15px 0;
      font-size: 14px;
      color: #4F6D95;
    }
    .img1{
      img{
        display: block;
        width: 88px;
        height: 88px;
        margin: 0 auto;
      }
    }
    .img{
      display: block;
      margin: 0 auto;
      width: 142px;
      height: 145px;
      background: url(../../../../src/assets/img/empty-contact.png)
    }
    .el-button{
      margin-top: 15px;
      padding: 9px 17px 8px 16px;
      font-size: 13px;
    }
  }
}
.text-ellipsis(){
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.key2-box{
  margin-bottom: -21px;
  padding: 13px 18px;
  label{
    // color: @textColor;
    font-size: 14px;
  }
  .btn-trans.el-button{
    float: right;
    margin-top: 0;
    padding: 10px 16px 9px 17px;
  }
}
.key-tag{
  margin: 0 9px;
  padding: 0 16px;
  height: 34px;
  line-height: 34px;
  color: #4F6D95;
  background-color: rgb(220, 231, 253);
  vertical-align: middle;
  p{
    max-width: 180px;
    font-size: 13px;
    color: inherit;
    .text-ellipsis()
  }
  &:hover {
    color: #5488F9;
    border: 1px solid #5488F9;
  }
}
.intelist-item{
  margin-top: 20px;
  .tit-key{
    padding-left: 18px;
    height: 40px;
    line-height: 40px;
    background-color: #F5F8FA;
    em{
      margin-right: 10px;
      font-size: 18px;
      font-weight: bold;
      vertical-align: middle;
    }
    .el-button{
      margin-top: 0;
    }
    .icon-font{
      margin-left: 8px;
      color: #7C98B6;
    }
  }
  .intelist-cont{
    position: relative;
    height: 133px;
    overflow: hidden;
    &:hover{
      background-color: #F5F8FA;
    }
    &:last-child{
      .line{
        border-bottom: 0;
      }
    }
    .line{
      margin: 0 18px;
      height: 0;
      border: 0;
      border-bottom: 1px solid #EAF0F6;
    }
  }
  .intelist-cont-inner{
    margin: 0 18px 20px 18px;
    height: 102px;
    padding: 10px 216px 0 0;
    overflow: hidden;
  }
  .tit{
    // padding: 10px 216px 0 18px;
    line-height: 47px;
    font-size: 16px;
    font-weight: bold;
    .text-ellipsis()
  }
  .desc{
    // padding: 0 216px 0 18px;
    line-height: 18px;
    font-size: 13px;
    color: #4F6D95;
    img{
      // max-width: 100%;
      display: none;
    }
  }
  .btn-wrap{
    position: absolute;
    right: 18px;
    top: 17px;
    .el-button{
      display: block;
    }
    .btn-trans{
      padding: 7px 11px 6px 11px;
    }
    // .btn-blue{
    //   padding: 0;
    //   height: 28px;
    // }
    .el-button + .el-button{
      margin-top: 8px;
      margin-left: 0;
    }
  }
}
</style>
