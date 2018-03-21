<template>
  <div class="e-tmpl-bg">
    <ul v-if="tmplList && tmplList.length" class="e-tmpl-list">
      <li class="e-tmpl-item" :class="tmplId === item.id?'tmpl-active':''"
      v-for="(item,index) in tmplList"
      :key="index"
      :data-type="item.type">
        <span v-if="tmplId === item.id" class="check">
          <i class="icon-font right">&#xe626;</i>
        </span>
        <div class="cover">
          <span class="icon-font edit"
            title="查看"
            @click="preview(index)">&#xe60c;</span>
          <span class="icon-font edit"
            title="选择编辑"
            @click="save(index)">&#xe68a;</span>
        </div>
        <img class="item-img" :src="item.templateCoverUrl + '?x-oss-process=image/resize,w_206,mage/auto-orient,1/quality,q_60'" alt="">
        <h3 class="item-name">{{item.templateName}}</h3>
      </li>
    </ul>
    <ul v-else class="e-tmpl-list place-list">
      <li class="e-tmpl-item place-item loading-div"
      v-for="(item,index) in placeList"
      :key="index">
      </li>
    </ul>
    <el-dialog v-model="dialogVisible" size="tiny">
      <div class="delete-tip">
        <span class="icon-font">&#xe629;</span>
        <span class="tip-content">确定要更改模板吗？</span>
        <p class="tip-text">更改模板后已编辑的内容会被清空</p>
        <div class="btn-wrapper">
          <el-button type="primary" @click="confirmSelect">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import tmplLocalList from './emailTmplFolder'
  export default {
    name: 'quicklyEmailTmpl',
    props: {
      saveChoose: Function,
      previewTmpl: Function,
      tmplId: Number,
      show: Boolean,
      tmplName: String,
      tmplList: Array,
      tmplType: String
    },
    data () {
      return {
        activeIndex: 0,
        dialogVisible: false,
        selectIndex: null,
        placeList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    },
    methods: {
      save (i) {
        let content = '[]'
        if (this.tmplType === 'emailTmpl') {
          content = this.$store.state.develop.emailContentList || '[]'
        } else if (this.tmplType === 'activityTmpl') {
          content = this.$store.state.develop.activityContentList || '[]'
        }
        let list = JSON.parse(content)
        if (list && list.length) {
          this.dialogVisible = true
          this.selectIndex = i
        } else {
          let item = this.tmplList[i]
          this.saveChoose(item)
        }
      },
      preview (i) {
        let item = this.tmplList[i]
        // 输入json 字符串放到服务器
        // console.log(JSON.stringify(item))
        this.previewTmpl(item)
      },
      confirmSelect () {
        let item = this.tmplList[this.selectIndex]
        this.dialogVisible = false
        this.selectIndex = null
        this.saveChoose(item)
      }
    },
    mounted () {
    }
  }
</script>
<style lang="less">
  @import '../../assets/style/variable.less';
  @import '../../assets/style/base.less';
  @import "../../assets/style/chance";
  .e-tmpl-bg{
    background-color: #ffffff;
    margin: 0 auto;
    width: 1200px;
    margin-bottom: 20px;
    background: white;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    .el-dialog{
      width: 360px;
      height: 180px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      .el-dialog__header{
        border: 1px solid transparent;
        padding: 12px 12px 0;
      }
      .delete-tip{
        .icon-font{
          font-size: 27px;
          color: #FEA000;
          margin-right: 10px;
        }
        .tip-content{
          font-size: 14px;
          color: #33475b;
          font-weight: 600;
        }
        .tip-text{
          height: 40px;
          line-height: 24px;
          padding-left: 40px;
          font-size: 12px;
          color: rgba(51,71,91,0.60);
        }
        .btn-wrapper{
          margin-top: 16px;
          margin-left: 40px;
          .el-button--danger{
            background-color: #ff3b6e;
            padding: 9px 24px;
          }
          .el-button--default{
            border: none;
            padding: 0 9px;
            color: #4f6d95;
          }
        }
      }
    }
    .place-list{
      .place-item{
        background-color: @loadingColor;
        width: 204px;
        animation: loadingColor 1s infinite;
        -webkit-animation: loadingColor 1s infinite;
        -moz-animation: loadingColor 1s infinite;
        -ms-animation: loadingColor 1s infinite;
        -o-animation: loadingColor 1s infinite;
      }
    }
  }
  .e-tmpl-list{
    display: flex;
    min-height: 686px;
    padding: 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
    align-content: flex-start;
    .e-tmpl-item{
      height: 290px;
      position: relative;
      border-radius: 4px;
      margin: 20px 13px;
      text-align: center;
      box-sizing: border-box;
      &:hover{
        border-color: #5488F9;
        .item-name{
          color: #5488F9;
        }
        .item-img{
          box-shadow: #bdc1d3 0 0 5px;
        }
        .item-icon{
          color: #5488F9;
        }
        .cover{
          height: 242px;
          opacity: 1;
          .icon-font{
            margin-top: 100px;
            opacity: 1;
          }
        }
      }
      .cover{
        position: absolute;
        text-align: center;
        width: 100%;
        height: 0;
        top: 0;
        overflow: hidden;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0);
        transition: all linear 0.1s;
        .icon-font{
          transition: all linear 0.05s;
          cursor: pointer;
          opacity: 0;
          font-size: 22px;
          display: inline-block;
          padding: 10px;
          margin: 8px;
          margin-top: 0;
          border-radius: 50px;
          background-color: #5488F9;
          color: #ffffff;
        }
      }
      .item-img{
        width: 204px;
        height: 240px;
        display: inline-block;
        border: 1px solid #eee;
      }
      .item-icon{
        display: block;
        margin-top: 8px;
        font-size: 48px;
        color: #bdc1d3;
      }
      .item-name{
        font-size: 14px;
        color: #32475a;
        line-height: 28px;
        margin-top: 5px;
      }
    }
    .tmpl-active{
      border-color: #5488F9;
      .item-name{
        color: #5488F9;
      }
      .item-icon{
        color: #5488F9;
      }
      .item-img{
        border-color: #5488F9;
      }
      .check{
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border: 10px solid #5488F9;
        border-left-color: transparent;
        border-bottom-color: transparent;
        .right{
          color: #fff;
          position: absolute;
          top: -10px;
          left: -2px;
          font-size: 12px;
          transform: scale(0.8);
        }
      }
    }
  }

</style>
