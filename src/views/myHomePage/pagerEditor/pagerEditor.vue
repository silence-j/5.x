<template>
  <div class="pagerEditor">
    <div class="top-container">
      <router-link to="/pageManagement">
        <span class="back">
          <!--<span class="icon-font" style="font-size:16px;">&#xe600;</span>-->
          <span><img src="../../../../src/assets/img/left.png" alt="" class="left-back" /></span>
          <span>返回页面管理</span>
        </span>
      </router-link>
      <div class="btn-container">
        <router-link to="/pagePreview"><el-button>预览</el-button></router-link>
        <el-button type="primary commit" @click="commit">提交</el-button>
      </div>
    </div>
    <div v-if="editorMenu === '/'">
      <leftOperation></leftOperation>
      <editorContainer></editorContainer>
    </div>
    <div v-if="editorMenu === '/products'">
      <leftProduct></leftProduct>
      <editorProduct></editorProduct>
    </div>
    <div v-if="editorMenu === '/contacts'">
      <leftContact></leftContact>
      <editorContact></editorContact>
    </div>
    <div v-if="editorMenu === '/profile'"><!--公司简介-->
      <leftProfile></leftProfile>
      <editorProfile></editorProfile>
    </div>
    <div v-if="editorMenu===blogPath">
      <leftBlog></leftBlog>
      <editorBlog></editorBlog>
    </div>
  </div>
</template>
<script>
  import myWebSiteApi from '../../../../src/api/myWebSiteApi'
  import '../previewControl'
  import '../homeEdit'
  import leftOperation from './left-operation.vue'
  import editorContainer from './editor-container.vue'
  import leftContact from './contacts/contacts-left-operation.vue'
  import editorContact from './contacts/contacts-editor-container.vue'
  import leftProduct from './products/products-left-container.vue'
  import editorProduct from './products/products-editor-container.vue'
  import leftProfile from './profile/profile-left-operation.vue'
  import editorProfile from './profile/profile-editor-container.vue'
  import leftBlog from './blog/blog-left-operation.vue'
  import editorBlog from './blog/blog-editor-container.vue'
  import { mapGetters } from 'vuex'

  export default{
    data () {
      return {
        blogPath: ('/blog/' + localStorage.shopId),
        /**
         * 点击提交 ，则没有弹框
         * @type {Boolean}
         */
        ifCommit: false
      }
    },
    methods: {
      commit () {
        this.ifCommit = true
        myWebSiteApi.commit().then((res) => {
          if (!res.data.code) {
            this.$message.success(res.data.message)
            this.$router.push('/pageManagement')
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    mounted () {
      this.$store.commit('EDITOR_MENU', {menu: this.$route.query.url})
      /**
       * 刷新页面时候进行提示
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      window.onbeforeunload = function (e) {
        var dialogText = '系统可能不会保存您所做的更改, 是否继续?'
        e.returnValue = dialogText
        return dialogText
      }
    },
    beforeDestroy () {
      /**
       * 注销刷新页面时候的提示
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */
      window.onbeforeunload = function (e) {
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.ifDirty) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        /**
         * 编辑页路由拦截
         * 如果是编辑页 ：1 编辑跳预览（放行）2.编辑跳nav链接或返回（弹框警告）
         * @param  {[type]} from.path !             [description]
         * @return {[type]}           [description]
         */
        if (from.path === '/pagerEditor') {
          if (to.path === '/pagePreview') {
            document.title = to.name
            next()
          } else {
            /**
             * 如果是点击提交按钮，则放行
             * @param  {[type]} this.ifCommit [description]
             * @return {[type]}               [description]
             */
            if (this.ifCommit) {
              this.$store.commit('SET_DIRTY', false)
              next()
            } else {
              this.$confirm('系统可能不会保存您所做的更改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                document.title = to.name
                /**
                 * 当没权限的时候，调用clean接口 ，会跳到login路由，这时候又会重复触发beforeRouteLeave钩子，造成死循环，所以此处判断直接放行
                 * @param  {[type]} to.path [description]
                 * @return {[type]}         [description]
                 */
                if (to.path === '/login') {
                  next()
                } else {
                  myWebSiteApi.clean().then((res) => {
                    if (!res.data.code) {
                      this.$store.commit('SET_DIRTY', false)
                      next()
                    } else {
                      this.$message.error(res.data.message)
                    }
                  })
                }
              }).catch(() => {
                next(false)
              })
            }
          }
        }
      } else {
        next()
      }
    },
    computed: {
      editorMenu () {
        return this.$store.getters.editorMenu
      },
      /**
       * vuex里取值
       * @type {String}
       */
      ...mapGetters({
        ifDirty: 'ifDirty'
      })
    },
    components: {
      leftOperation,
      editorContainer,
      leftContact,
      editorContact,
      leftProduct,
      editorProduct,
      leftProfile,
      editorProfile,
      leftBlog,
      editorBlog
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../assets/style/base";
  @import "../../../assets/style/variable";
  .commit{
    margin-left:16px;
  }
  .pagerEditor{
    padding: 20px;
    background: @bgColor;
    .back {
      line-height: 30px;
      margin-bottom: 16px;
      display: inline-block;
      font-size:14px;
      color:#7C98B6;
      i {
        font-size: 18px;
        margin-right: 5px;
      }
      span {
        display: inline-block;
      }
    }
    .btn-container{
      float: right;
      .el-button{
        padding: 7px 30px;
      }
    }
  }
</style>
