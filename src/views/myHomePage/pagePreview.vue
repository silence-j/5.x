<template>
  <div class="preview">
    <div class="head">
      <div class="title">
        <router-link to="/PageManagement"><span class="rePage">
          <!--<span class="icon-font" style="font-size:16px;">&#xe600;</span>-->
          <span><img src="../../../src/assets/img/left.png" alt="" class="left-back" /></span>
          返回页面管理</span></router-link>
        <div class="pic-computer">
          <em class="icon-font computer" @click="changeComputer" :class="computerShow?'':'computer-after'">&#xe611;</em>
          <em class="icon-font ipad" @click="changeIpad" :class="ipadShow?'ipad-after':''">&#xe610;</em>
          <em class="icon-font phone" @click="changePhone" :class="phoneShow?'phone-after':''">&#xe60f;</em>
        </div>
        <div class="rePreview" @click="reback">退出预览</div>
      </div>
    </div>
    <iframe :src="src" frameborder="0" name="buyer-preview-pc" class="computer-iframe" v-show="computerShow"></iframe>
    <div class="ipad-preview" v-show="ipadShow">
      <div class="ipad-border">
        <div class="top-circle"></div>
        <div class="box">
          <iframe :src="src" frameborder="0" name="buyer-preview-pad" class="ipad-iframe"></iframe>
        </div>
        <div class="foot-circle"></div>
      </div>
    </div>
    <div class="phone-preview" v-show="phoneShow">
      <div class="bg-img">
        <iframe :src="src" frameborder="0" name="buyer-preview-mobile" class="phone-iframe"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
  import myWebSiteApi from '../../../src/api/myWebSiteApi'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        shopId: window.localStorage.shopId,
        computerShow: true,
        ipadShow: false,
        phoneShow: false,
        ifCommit: false
      }
    },
    computed: {
      src () {
        return `${process.env.HOMEPAGE}${this.$store.getters.editorMenu}?shopId=${this.shopId}`
      },
      /**
       * vuex里取值
       * @type {String}
       */
      ...mapGetters({
        ifDirty: 'ifDirty'
      })
    },
    methods: {
      changeComputer () {
        this.ipadShow = false
        this.computerShow = true
        this.phoneShow = false
      },
      changeIpad () {
        this.ipadShow = true
        this.computerShow = false
        this.phoneShow = false
      },
      changePhone () {
        this.ipadShow = false
        this.computerShow = false
        this.phoneShow = true
      },
      reback () {
        window.history.back()
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
        if (from.path === '/pagePreview') {
          if (to.path === '/pagerEditor') {
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
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/style/base";
  @import "../../assets/style/variable";
  body{
    background: #CAD6E2;
    .preview{
      .head{
        width:100%;
        height: 65px;
        background: #F0F1F2;
        .title{
          width:1200px;
          height: inherit;
          margin: 0 auto;
          /*background: pink;*/
          font-size: 13px;
          color: #7C98B6;
          position: relative;
          .rePage{
            position: absolute;
            left: 0;
            top:30px;
            color: #7C98B6;
            em{
              font-size: 16px;
            }
          }
        }
        .pic-computer{
          position: absolute;
          right: 42%;
          top:15px;
          width:183px;
          height: 36px;
          border-right:1px solid #DFE3EB;
          border-left:1px solid #DFE3EB;
          em{
            cursor: pointer;
          }
          .computer{
            font-size: 32px;
            color: #5488F9;
            margin-left: 34px;
            margin-right: 20px;
            &:hover{
              color: #5488F9;
            }
          }
          .computer-after{
            font-size: 32px;
            color: #B0C1D4;
            margin-left: 34px;
            margin-right: 20px;
            &:hover{
              color: #5488F9;
            }
          }
          .ipad{
            font-size: 22px;
            color:#B0C1D4;
            margin-right: 20px;
            &:hover{
              color: #5488F9;
            }
          }
          .ipad-after{
            font-size: 22px;
            color:#5488F9;
            margin-right: 20px;
            &:hover{
              color: #5488F9;
            }
          }
          .phone{
            font-size: 18px;
            color:#B0C1D4;
            &:hover{
              color: #5488F9;
            }
          }
          .phone-after{
            font-size: 18px;
            color:#5488F9;
            &:hover{
              color: #5488F9;
            }
          }
        }
        .rePreview{
          width:80px;
          height: 28px;
          line-height: 28px;
          background: #5488F9;
          border-radius: 4px;
          color: #fff;
          text-align: center;
          position: absolute;
          right:0;
          top:18px;
          cursor: pointer;
        }

      }
      .computer-iframe{
        width:100%;
        height: 800px;
      }
      .ipad-preview{
        width:100%;
        height: 1250px;
        position: relative;
        background: #CAD6E2;
        .ipad-border{
          width:845px;
          height: 1180px;
          position: absolute;
          top:16px;
          left:50%;
          border-radius: 35px;
          margin-left: -422px;
          background: #F4F8FB;
          .top-circle{
            width:8px;
            height: 8px;
            border-radius: 50%;
            background: #B0C1D3;
            position: absolute;
            top: 40px;
            right: 50%;
            margin-right: -4px;
          }
          .foot-circle{
            width:30px;
            height: 30px;
            border-radius: 50%;
            background: #B0C1D3;
            position: absolute;
            bottom: 20px;
            left: 50%;
            margin-left: -15px;
          }
          .box{
            width:753px;
            height: 974px;
            background: #fff;
            position: absolute;
            top:110px;
            left:48px;
            .ipad-iframe{
              width:753px;
              height: 974px;
            }
          }

        }
      }
      .phone-preview{
        width:100%;
        height: 1250px;
        position: relative;
        background: #CAD6E2;
        .bg-img{
          width:434px;
          height: 884px;
          background: pink;
          position: absolute;
          top:42px;
          left:50%;
          margin-left: -217px;
          background: url('../../assets/img/phoneborder.png');
          .phone-iframe{
            position: absolute;
            top: 102px;
            left: 30px;
            width: 378px;
            height: 672px;
          }
        }
      }
    }
  }
</style>
