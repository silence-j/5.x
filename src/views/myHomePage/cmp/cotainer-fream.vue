<template>
  <div class="iframe-opration">
    <div class="menu-top">
      <div class="left">
        <p class="title">{{editorMenu | filterMenu}}</p>
        <a v-if="src" :href="src" target="_blank">
          {{src}}
          <em class="icon-font jump-oth">&#xe673;</em>
        </a>
      </div>
      <div class="right">
        <a href="javascript:;" @click="showTdk" v-if="pageTag != 3"><el-button type="primary" class="btn">TDK设置</el-button></a>
        <a :href="src" target="_blank"><el-button class="btn">查看</el-button></a>
        <el-button type="default" class="btn" @click="editor" v-if="editorMenu !== '/detail'">编辑</el-button>
      </div>
    </div>
    <iframe :src="frameUrl" name="seller-preview" id="iframe-wind"></iframe>
    <!-- TDK设置 -->
    <el-dialog title="TDK设置" top="10%" v-model="tdkModel" class="tdk-model">
      <el-form label-width='117px'>
        <el-form-item label="SEO标题：" id="seo-tit">
          <el-input :maxlength=2000 v-model="form.seoTitle" @focus="tdkinput(0)" placeholder="请输入标题">
            </el-input>
        </el-form-item>
        <el-form-item label="SEO关键词：" id="seo-key">
          <el-input :maxlength=2000 v-model="form.seoKeywords" @focus="tdkinput(1)" placeholder="请输入关键词，多个关键词之间用分号分隔">
            </el-input>
        </el-form-item>
        <el-form-item label="SEO描述：" id="seo-desc">
          <el-input :maxlength=2000 type="textarea" @focus="tdkinput(2)" :autosize="{ minRows: 4, maxRows: 5}" placeholder="请输入描述"
            v-model="form.seoDesc">
            </el-input>
        </el-form-item>
        <el-form-item label="特征词：">
          <a href="javascript:;" class="seo-feature" @click="setFeature(0)">Company Name</a>
          <a href="javascript:;" class="seo-feature" @click="setFeature(1)" v-if="editorMenu === '/products'">Product Group</a>
        </el-form-item>
        <el-form-item class="explain">
          <p class="explain-tit">说明</p>
          <p>1. 设置SEO信息可以帮您提高网站在Google的搜索排名</p>
          <p>2. 特征词使用场景：您频繁使用某个词组或词组内容有变动时，可帮助您减少输入次数</p>
          <p>3. 将光标停留在某个输入框内，点击特征词，即可将特征词拖入输入框中</p>
        </el-form-item>
      </el-form>
      <div class="confirm-btn">
        <el-button type="primary" @click="tdkOk" :disabled="!tdkSubmitBtnState">提交</el-button>
        <el-button class="close"  @click="tdkModel = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import myWebSiteApi from '../../../api/myWebSiteApi'
  export default{
    data () {
      return {
        title: '首页',
        shopId: window.localStorage.shopId,
        frameUrl: '',
        form: {
          seoTitle: '',
          seoKeywords: '',
          seoDesc: ''
        },
        seoFeature: '',
        tdkModel: false,
        pageTag: 1,
        isModify: false,
        subprefix: '',
        subsuffix: '',
        focusIndex: -1
      }
    },
    mounted () {
      window.setTimeout(() => { this.setIframeHeight() }, 2000)
    },
    watch: {
      frameUrl () {
        window.setTimeout(() => { this.setIframeHeight() }, 2000)
      }
    },
    methods: {
      // tdk弹窗
      showTdk () {
        this.form = {
          seoTitle: '',
          seoKeywords: '',
          seoDesc: ''
        }
        this.isModify = false
        this.tdkModel = true
        // this.setPrefix()
        myWebSiteApi.getTdk({pageTag: this.pageTag}).then(res => {
          if (!res.data.code) {
            Object.assign(this.form, res.data.data)
            if (res.data.data.id) {
              this.isModify = true
            }
          }
        })
      },
      // 保存TDK设置
      tdkOk () {
        Object.assign(this.form, {pageTag: this.pageTag})
        if (!this.isModify) {
          myWebSiteApi.saveTdk(this.form).then(res => {
            if (!res.data.code) {
              this.$message.success('保存成功')
              this.tdkModel = false
            }
          })
        } else {
          myWebSiteApi.updateTdk(this.form).then(res => {
            if (!res.data.code) {
              this.$message.success('编辑成功')
              this.tdkModel = false
            }
          })
        }
      },
      tdkinput (flag) {
        this.focusIndex = flag
      },
      // 插入特征词
      setFeature (flag) {
        if (this.focusIndex === -1) {
          return
        }
        let text = '$Company Name$'
        if (flag) {
          text = '$Product Group$'
        }
        this.setPrefix(text)
      },
      setPrefix (text) {
        let inputid = ''
        let model = null
        let subtext = null
        if (this.focusIndex === 0) {
          inputid = 'seo-tit'
          model = this.form.seoTitle
          subtext = document.getElementById(inputid).querySelector('input[type="text"]')
        } else if (this.focusIndex === 1) {
          inputid = 'seo-key'
          model = this.form.seoKeywords
          subtext = document.getElementById(inputid).querySelector('input[type="text"]')
        } else if (this.focusIndex === 2) {
          inputid = 'seo-desc'
          model = this.form.seoDesc
          subtext = document.getElementById(inputid).querySelector('textarea')
        }
        // if (this.form.seoTitle) {
        let cursurPosition = -1
        if (subtext.selectionStart || subtext.selectionStart === 0) { // 非IE浏览器
          cursurPosition = subtext.selectionStart
        } else { // IE
          var range = document.selection.createRange()
          range.moveStart('character', -subtext.value.length)
          cursurPosition = range.text.length
        }
        if (model) {
          this.subprefix = model.substring(0, cursurPosition)
          this.subsuffix = model.substring(cursurPosition, model.length)
        } else {
          this.subprefix = ''
          this.subsuffix = ''
        }
        let text2 = this.subprefix + text + this.subsuffix
        if (this.focusIndex === 0) {
          this.form.seoTitle = text2
        } else if (this.focusIndex === 1) {
          this.form.seoKeywords = text2
        } else if (this.focusIndex === 2) {
          this.form.seoDesc = text2
        }
        // }
      },
      editor () {
        this.$router.push({
          path: '/pagerEditor',
          query: {url: this.$store.getters.editorMenu}
        })
      },
      setIframeHeight () {
        let iframe = document.getElementById('iframe-wind')
        if (iframe) {
          // var bHeight = iframe.contentWindow.document.body.scrollHeight
          var dHeight = iframe.contentWindow.document.documentElement.scrollHeight
          iframe.style.height = dHeight + 'px'
        }
      }
    },
    computed: {
      src () {
        // let domainCompany = this.$store.getters.domainCompany
        let selectDimain = this.$store.getters.selectDimain
        let homepage = process.env.HOMEPAGE
        // this.frameUrl = `${process.env.HOMEPAGE}${this.$store.getters.editorMenu}?shopId=${this.shopId}`
        this.frameUrl = window.location.protocol + `//${process.env.HOMEPAGE_DOMAIN}${this.$store.getters.editorMenu}?shopId=${this.shopId}`
//        if (domainCompany !== '' && domainCompany !== null && domainCompany !== undefined) {
//          if (domainCompany.subdomain === '' || domainCompany.subdomain === null || domainCompany.subdomain === undefined) {    // 二级域名
//          } else {
//            homepage = 'http://' + domainCompany.subdomain + process.env.API_HOST
//          }
//        }
        if (selectDimain === '' || selectDimain === null) {
          /**
           * 二级域名没有返回的时候，返回空
           */
          return ''
        } else {
          homepage = selectDimain
        }
        let url = `${homepage}${this.$store.getters.editorMenu}`
        return url
      },
      editorMenu () {
        let menu = this.$store.getters.editorMenu
        switch (menu) {
          case '/':
            this.pageTag = 1
            break
          case '/products':
            this.pageTag = 2
            break
          case '/blog/' + window.localStorage.shopId:
            this.pageTag = 3
            break
          case '/profile':
            this.pageTag = 4
            break
          case '/detail':
            this.pageTag = 6
            break
          case '/contacts':
            this.pageTag = 5
            break
        }
        return this.$store.getters.editorMenu
      },
      tdkSubmitBtnState () {
        let title = this.form.seoTitle ? this.form.seoTitle.replace(/(^\s+)|(\s+$)/g, '').length : 0
        let keyword = this.form.seoKeywords ? this.form.seoKeywords.replace(/(^\s+)|(\s+$)/g, '').length : 0
        let desc = this.form.seoDesc ? this.form.seoDesc.replace(/(^\s+)|(\s+$)/g, '').length : 0
        return Boolean(title + keyword + desc)
      }
    },
    filters: {
      filterMenu (value) {
        let title = 'HOME'
        switch (value) {
          case '/':
            title = 'HOME'
            break
          case '/products':
            title = 'PRODUCTS'
            break
          case '/blog/' + window.localStorage.shopId:
            title = 'BLOG'
            break
          case '/profile':
            title = 'COMPANY PROFILE'
            break
          case '/detail':
            title = 'PRODUCT DETAIL'
            break
          case '/contacts':
            title = 'CONTACTS'
            break
        }
        return title
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../assets/style/variable";
  .iframe-opration{
    position: relative;
    float: right;
    width: calc(~"100% - 300px");
    .menu-top{
      border-radius: 4px;
      padding: 16px 29px 20px 28px;
      background: #fff;
      box-shadow: 0 0 8px rgba(0,0,0,.08);
      overflow:hidden;
      .left{
        display:inline-block;
        .title{
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
          line-height: 22px;
        }
        a{
          color: @link;
          margin-top: 10px;
          margin-right: 5px;
          text-decoration: underline;
          line-height: 15px;
        }
        .jump-oth{
          color: @link;
        }
      }
      .right{
        display:inline-block;
        float:right;
        margin-top: 8px;
        z-index:99;
        .btn{
          padding: 10px 25px;
        }
        .el-button{
          margin-left:4px;
        }
      }
    }
    #iframe-wind{
      margin-top: 20px;
      margin-bottom: 30px;
      position: absolute;
      left: 50%;
      /*transform: translateX(-50%);*/
      /*width: calc(~"100% - 100px");*/
      height:1953px;
      width: 2208px;
      transform: scale(0.39);
      transform-origin: -32% 0%;
    }
  }
  .seo-feature{
    display: inline-block;
    margin-right: 13px;
    padding: 0 7px;
    height: 28px;
    line-height: 28px;
    font-size: 13px;
    color: #00B8CC;
    background-color: rgba(204,240,244,.8);
    border-radius: 4px;
    &:hover{
      color: #fff;
      background-color: #00B8CC;
      box-shadow: 1px 1px 4px #00B8CC;
    }
  }
</style>
<style lang="less" rel="stylesheet/less">
  .tdk-model{
    .el-dialog{
      min-height: 695px;
      width: 460px;
    }
    .confirm-btn{
      margin-top: 38px;
      margin-left: 22px;
    }
    .el-dialog__header {
      padding: 18px 18px 18px 20px;
      border-bottom: 1px solid #DFE3EB;
    }
    .el-dialog__body{
      padding: 25px 30px 30px 10px;
    }
    .el-form-item{
      margin-bottom: 6px;
    }
    .el-form-item__label{
      display: block;
      float: none;
      margin-left: 20px;
      font-size: 13px;
      text-align: left;
    }
    .el-form-item__content{
      margin-left: 20px!important;
    }
    .el-input__inner{
      height: 34px;
    }
    .el-textarea__inner{
      height: 160px!important;
    }
    .explain{
      p{
        font-size: 12px;
        color: #7C98B6;
        line-height: 18px;
      }
      .explain-tit{
        margin-bottom: 10px;
        line-height: 35px;
        border-bottom: 1px solid #DFE3EB;
      }
    }
  }
</style>
