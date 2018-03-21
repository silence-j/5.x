<template>
<div>
  <div class="add-blog-container">
    <router-link to="/blog">
      <p class="back-title">
        <span><img src="../../../src/assets/img/left.png" alt="" class="left-back" /></span>
        返回Blog</p>
    </router-link>
  </div>
  <div class="logistic-container add-blog-container" style="overflow:unset;position:relative;margin-bottom:30px;">
    <div class="add-title">新增Blog</div>
    <div class="new-blog-item">
      <div class="left-title">
        <em style="color: red;">*</em>标题:
      </div>
      <div class="blog-right-content">
        <el-input v-model="blogTitle" class="input-xl b-title" :maxlength="160"></el-input>
      </div>
    </div>
    <div class="new-blog-item" style="margin-bottom:30px;margin-top:20px;">
      <div class="left-title">
        <em style="color: red;">*</em>详情介绍:
      </div>
      <div class="blog-right-content">
        <editor
          :content="blogDetail"
          :imgList="imgList"
          @showmaterial="materialOptions.show=true"
          @change="getContext"
          @errmessage="tipErr"
          @sucmessage="tipSuc"
          id="editor">
        </editor>
      </div>
    </div>
    <div class="add-title">SEO优化</div>
      <div class="new-blog-item">
        <div class="left-title">
          SEO标题:
        </div>
        <div class="blog-right-content">
          <el-input placeholder="默认与标题一致" v-model="seoTitle" id="seoTitle" class="input-xl b-title" @focus="focusInput('seoTitle')"></el-input>
        </div>
      </div>
      <div class="new-blog-item">
        <div class="left-title">
          SEO关键词:
        </div>
        <div class="blog-right-content">
          <el-input placeholder="请输入关键词,多个关键词之间有分号分隔" v-model="seoKeywords" id="seoKeywords" class="input-xl b-title"  @focus="focusInput('seoKeywords')"></el-input>
        </div>
      </div>
      <div class="new-blog-item" style="margin-top:16px;">
        <div class="left-title">
          SEO描述:
        </div>
        <div class="blog-right-content">
          <el-input type="textarea" id="seoDesc" resize="none" v-model="seoDesc" class="input-xl"  @focus="focusInput('seoDesc')"></el-input>
        </div>
      </div>
      <div class="new-blog-item" style="margin-bottom:30px;margin-top:16px;">
        <div class="left-title">
          特征词:
        </div>
        <div class="blog-right-content">
          <div class="blog-seo-feature" @click="insertFeature">Company Name</div>
        </div>
      </div>
      <div class="new-blog-item" style="margin-bottom:40px;margin-top:16px;">
        <div class="left-title">
          锚文本关键词:
        </div>
        <div class="blog-right-content">
          <el-input v-model="anchorTextKeywords"  class="input-xl mao-input" ></el-input>
        </div>
      </div>
      <div class="footer-wraper">
        <el-button class="footer-btn" @click="back" style="margin-left:134px;">返回</el-button>
        <el-button type="primary" class="footer-btn" @click="addBlog">提交</el-button>
      </div>
  </div>
    <!-- 素材库弹窗 -->
    <uploadMaterial
    :options="materialOptions"
    @confirmInsert="confirmInsert"
    @cancelInsert="materialOptions.show=false"></uploadMaterial>
</div>
</template>

<script>
import BlogAPI from '@/api/blogAPI'
import VueHtml5Editor from 'longxi-vue-html5-editor'
import uploadMaterial from '@/components/uploadMaterial'
const editor = new VueHtml5Editor({
  name: 'vue-html5-editor',
  language: 'zh-cn',
  showModuleName: true,
  visibleModules: [
    'text',
    'color',
    'font',
    'align',
    'list',
    'link',
    'unlink',
    'tabulation',
    'hr',
    'eraser',
    'undo',
    'material'
  ],
  icons: {
    text: 'icon-edit',
    color: 'icon-Shape1',
    font: 'icon-wenzi',
    align: 'icon-alignleft',
    list: 'icon-list',
    link: 'icon-link',
    unlink: 'icon-unlink',
    tabulation: 'icon-table',
    hr: 'icon-hr',
    eraser: 'icon-delete',
    undo: 'icon-iconfresh',
    material: 'icon-pic'
  }
})
export default {
  name: 'addBlog',
  data () {
    return {
      ifBlogDirty: false,
      clickSubmitBtn: false,
      clickSubmitBtnTimes: 0,
      blogTitle: '',
      seoTitle: '',
      focusVm: '',
      seoKeywords: '',
      seoDesc: '',
      anchorTextKeywords: '',
      blogDetail: '',
      // 插入编辑器的img List
      imgList: [],
      materialOptions: {
        size: 10,
        show: false,
        multiple: true,
        type: 'img'
      },
      titleIsBind: true,
      detailIsBind: true
    }
  },
  beforeRouteLeave (to, from, next) {
    /**
     * 当内容被修改 并且不是通过点击 保存按钮离开的时候给予确认提示
     */
    if (this.ifBlogDirty && !this.clickSubmitBtn) {
      this.$confirm('你尚有未编辑完成的内容，确认放弃编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      })
    } else {
      next()
    }
  },
  methods: {
    /**
     * 插入特征词
     * @return {[type]} [description]
     */
    insertFeature () {
      if (this.focusVm === '') {
        return
      }
      /**
       * focus 的输入框 VM
       * this.focusVm 是字符串名字
       * @type {[type]}
       */
      let module = this[this.focusVm]
      let subtext = document.getElementById(this.focusVm).querySelector('input[type="text"]')
      if (this.focusVm === 'seoDesc') {
        subtext = document.getElementById(this.focusVm).querySelector('textarea')
      }
      let cursurPosition = -1
      if (subtext.selectionStart || subtext.selectionStart === 0) { // 非IE浏览器
        cursurPosition = subtext.selectionStart
      } else { // IE
        var range = document.selection.createRange()
        range.moveStart('character', -subtext.value.length)
        cursurPosition = range.text.length
      }
      if (module) {
        this.subprefix = module.substring(0, cursurPosition)
        this.subsuffix = module.substring(cursurPosition, module.length)
      } else {
        this.subprefix = ''
        this.subsuffix = ''
      }
      let text2 = this.subprefix + '$Company Name$' + this.subsuffix
      this[this.focusVm] = text2
      /**
       * 清空记录的 focusVM
       * @type {String}
       */
      this.focusVm = ''
    },
    /**
     * 输入框 focus
     * @param  {[type]} inputVm [description]
     * @return {[type]}         [description]
     */
    focusInput (inputVm) {
      this.focusVm = inputVm
    },
    /**
     * 提交
     */
    addBlog () {
      if (this.seoTitle === '' || this.seoTitle.match(/^[ ]+$/)) {
        this.seoTitle = this.blogTitle
      }
      let postObj = {
        blogTitle: this.blogTitle,
        seoTitle: this.seoTitle,
        blogContents: this.blogDetail,
        seoKeywords: this.seoKeywords,
        seoDesc: this.seoDesc,
        anchorTextKeywords: this.anchorTextKeywords
      }
      if (!this.blogTitle || !this.blogDetail || this.blogTitle.match(/^[ ]+$/)) {
        this.$message.error('请填写标题和详情介绍')
        return
      } else {
        let blogDetail = this.blogDetail.replace(/&nbsp;/g, ' ')
        if (blogDetail === null || blogDetail.match(/^[ ]+$/)) {
          this.$message.error('您输入的详情介绍不能全为空格')
          return
        }
      }
      if (this.blogTitle.length > 160) {
        this.$message.error('标题最多160个字符')
        return
      }
      if (this.blogDetail.search(this.anchorTextKeywords) === -1) {
        this.$message.error('您填写的锚文本关键词不包含在Blog正文内')
        return
      }
      if (this.clickSubmitBtnTimes > 0) {
        return
      }
      this.clickSubmitBtnTimes ++
      /**
       * 添加博客 接口
       * @param  {[type]} res [description]
       * @return {[type]}     [description]
       */
      BlogAPI.addBlog(postObj).then(res => {
        if (!res.data.code) {
          this.clickSubmitBtn = true
          this.$message.success('新增博文成功')
          this.back()
        } else {
          this.$message.error(res.data.message)
          /**
           * 回复提交按钮可点击
           * @type {Number}
           */
          this.clickSubmitBtnTimes = 0
        }
      })
    },
    /**
     * 回到列表页
     * @return {[type]} [description]
     */
    back () {
      this.$router.push('/blog')
    },
    /**
     * 富文本框文字变化
     * @param  {[type]} v [description]
     * @return {[type]}   [description]
     */
    getContext (v) {
      this.blogDetail = v
    },
    tipErr () {},
    tipSuc () {},
    confirmInsert (val) {
      for (let item of val) {
        this.imgList.push({
          url: item.src,
          name: item.name
        })
      }
      this.materialOptions.show = false
      setTimeout(() => {
        this.imgList = []
      }, 500)
    }
  },
  watch: {
    blogTitle: function () {
      this.ifBlogDirty = true
      if (this.titleIsBind) {
        let value = this.blogTitle
        if (value.length < 160) {
          this.seoTitle = value
        } else {
          this.seoTitle = value.substring(0, 160)
        }
      }
    },
    seoTitle: function () {
      let value = this.blogTitle
      if (this.seoTitle.length !== value.length) {
        this.titleIsBind = false
      }
      if (this.seoTitle.length < 160) {
        if (this.seoTitle !== value) {
          this.titleIsBind = false
        }
      } else {
        this.titleIsBind = false
      }
    },
    seoKeywords: function () {
      this.ifBlogDirty = true
    },
    seoDesc: function () {
      let value = this.blogDetail.replace(/<[^>]+>/g, '')
      value = value.replace(/&nbsp;/g, ' ')
      if (this.seoDesc.length < 160) {
        if (this.seoDesc !== value) {
          this.detailIsBind = false
        }
      } else if (this.seoDesc.length === 160) {
        if (this.seoDesc !== value.substring(0, 160)) {
          this.detailIsBind = false
        }
      } else {
        this.detailIsBind = false
      }
      this.ifBlogDirty = true
    },
    anchorTextKeywords: function () {
      this.ifBlogDirty = true
    },
    blogDetail: function () {
      if (this.detailIsBind) {
        let value = this.blogDetail.replace(/<[^>]+>/g, '')
        value = value.replace(/&nbsp;/g, ' ')
        if (value.length < 160) {
          this.seoDesc = value
        } else {
          this.seoDesc = value.substring(0, 160)
        }
      }
      this.ifBlogDirty = true
    }
    // blogTitle: '',
    // seoKeywords: '',
    // seoDesc: '',
    // anchorTextKeywords: '',
    // blogDetail: ''
  },
  mounted () {
  },
  components: {
    editor,
    uploadMaterial
  }
}
</script>
<style lang='less' rel="stylesheet/less">
  .back-title{
    font-size: 14px;
    color: #7C98B6;
    margin-bottom: 16px;
    margin-top: 30px;
  }
  .footer-wraper{
    margin:22px auto;
    display: flex;
    .footer-btn {
      padding: 10px 45px;
    }
  }
  .add-blog-container{
    width:1200px;
    max-width:1200px;
    margin:0 auto;
    .add-title{
      font-weight: 600;
      height: 44px;
      line-height: 44px;
      vertical-align: middle;
      background: #F5F8FA;
      padding-left:20px;
      color:#33475B;
      font-size: 16px;
      &:first-child{
        border:1px solid #DFE3EB;
      }
    }
    .new-blog-item{
      margin-top:24px;
      .left-title{
        margin-top:8px;
        vertical-align: top;
        text-align: right;
        display: inline-block;
        width:118px;
        color: #33475B;
        font-size: 14px;
      }
      .blog-right-content{
        display: inline-block;
        padding-left:16px;
        width:1038px;
        .vue-html5-editor{
          min-height: 370px;
        }
        .vue-html5-editor>.toolbar>ul>li .icon{
          display: inline;
        }
        .b-title{
          width:665px;
          height: 34px;
        }
        .mao-input{
          width:400px;
          height: 34px;
        }
        .el-textarea__inner{
          width:665px;
          height: 100px;
          border-radius: 4px;

        }
      }
    }
  }
#editor{
  .toolbar{
    ul{
      li{
        width: 101px;
        .icon{
          display: inline;
          vertical-align: top;
          font-size: 14px;
        }
      }
    }
    .el-upload-list--picture-card .el-upload-list__item{
        width: 95px;
        height: 95px;
    }
    .el-upload--picture-card{
        width: 95px;
        height: 95px;
        line-height: 95px;
        margin-bottom: 8px;
    }
    .el-progress--circle{
        width: 75px!important;
        height: 75px!important;
    }
    .el-progress-circle{
        width: 75px!important;
        height: 75px!important;
        svg{
          margin-left: 0;
          margin-top: 0;
          width: 75px;
          height: 75px;
        }
    }
  }
  .dashboard{
    .tip{
      display: block;
      margin: 0;
      margin-bottom: 6px;
    }
  }
}
</style>
