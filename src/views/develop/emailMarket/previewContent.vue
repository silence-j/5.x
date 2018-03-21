<template>
  <div class="preview-wrapper">
    <div class="nav">
      <span class="nav-item icon-font mac" :class="btnType==='mac'?'active':''" @click="changeView" data-type="mac">&#xe611;</span>
      <span class="nav-item icon-font pad" :class="btnType==='pad'?'active':''" @click="changeView" data-type="pad">&#xe610;</span>
      <span class="nav-item icon-font phone" :class="btnType==='phone'?'active':''" @click="changeView" data-type="phone">&#xe60f;</span>
    </div>
    <div class="preview-window" :class="contentType">
      <div v-if="btnType==='phone'" class="preview-main phone-main">
        <div class="phone-table" v-html="tableContent"></div>
      </div>
      <div v-else class="preview-main" v-html="tableContent"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      tmplType: String
    },
    data () {
      return {
        // 用来标记哪个按钮被点击
        btnType: 'phone',
        // 标记view的class
        contentType: 'phonewindow',
        // 从内容编辑页面存储的DOM数组，在这个页面重新渲染
        tableContent: ''
      }
    },
    computed: {
      activityTable () {
        return this.$store.state.develop.activitySendInfo.second
      },
      emailTable () {
        return this.$store.state.develop.sendInfo.third
      },
      previewTable () {
        return this.$store.getters.previewTable
      }
    },
    mounted: function () {
      // activityTmpl: 活动table; previewTmpl: 模版预览;  其他邮件
      if (this.tmplType === 'activityTmpl') {
        this.tableContent = this.activityTable
      } else if (this.tmplType === 'previewTmpl') {
        this.tableContent = this.previewTable
      } else {
        this.tableContent = this.emailTable
      }
    },
    methods: {
      changeView (e) {
        this.btnType = e.target.dataset.type
        this.contentType = `${e.target.dataset.type}window`
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .preview-wrapper{
    position: relative;
    left: calc(~"-50vw + 600px");
    width: 99.6vw;
    min-height: calc(~"100vh - 116px");
    background-color: #fff;
    text-align: center;
    .nav{
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: space-around;
      width: 182px;
      height: 34px;
      padding: 0 15px;
      margin-top: 30px;
      margin-bottom: 25px;
      box-sizing: border-box;
      border-left: 1px solid #b0c1d3;
      border-right: 1px solid #b0c1d3;
      .nav-item{
        color: #1d98b6;
        cursor: pointer;
      }
      .mac{
        font-size: 26px;
        padding-top: 3.5px;
      }
      .pad{
        font-size: 21px;
        padding-top: 5px;
      }
      .phone{
        font-size: 19px;
        padding-top: 6.5px;
      }
      .active{
        color: #5488f9;
      }
    }
    .preview-window{
      i{
        font-style: italic;
      }
      h1{
        font-size: 2em;
      }
      h2{
        font-size: 1.5em;
      }
      h3{
        font-size: 1.17em;
      }
      h4{
        font-size: 1em;
      }
      h5{
        font-size: 0.83em;
      }
      h6{
        font-size: 0.67em;
      }
      ol{
        padding-left: 20px;
        li{
          list-style: decimal;
        }
      }
      ul{
        padding-left: 20px;
        li{
          list-style: disc;
        }
      }
    }
    .phonewindow{
      position: relative;
      margin: 0 auto;
      width: 420px;
      height: 884px;
      background: url(../../../assets/img/develop/iphone.png) no-repeat;
      background-size: 100%;
      padding-bottom: 220px;
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
      .preview-main{
        width: 100%;
        overflow-y: scroll;
        position: absolute;
        width: calc(~"100% - 62px");
        top: 101px;
        left: 33px;
        max-height: 668px;
        ::-webkit-scrollbar{
          width: 3px;
          height: 3px;
        }
      }
      .phone-main{
        max-height: 980px;
        height: 980px;
        width: 550px;
        -webkit-transform: scale(0.8);
        transform: scale(0.65);
        top: -68px;
        left: -63px;
      }
    }
    .padwindow{
      position: relative;
      margin: 0 auto;
      width: 640px;
      height: 1172px;
      background: url(../../../assets/img/develop/ipad.png) no-repeat;
      background-size: 100%;
      padding-bottom: 167px;
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
      .preview-main{
        width: 100%;
        overflow-y: scroll;
        position: absolute;
        width: calc(~"100% - 92px");
        top: 101px;
        left: 49.5px;
        max-height: 700px;
      }
    }
    .macwindow{
      position: relative;
      margin: 0 auto;
      width: 1200px;
      padding-bottom: 30px;
      background-color: #ffffff;
      padding: 40px 0;
      .preview-main{
        position: static;
        width: 100%;
      }
    }
  }
</style>
