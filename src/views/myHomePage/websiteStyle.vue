<template>
  <div class="website-style-list">
      <div class="website-style" v-if="websiteStyles.length>0 && !websiteStyle_load" v-for="(websiteStyle,index) in websiteStyles" :class="{'curr': websiteStyle.useTag==1}">
          <span class="special-note" v-if="websiteStyle.useTag==1"><i>当前风格</i></span>
          <div class="imgae">
            <img :src="websiteStyle.templateCoverUrlWhole" v-if="websiteStyle.templateCoverUrlWhole!='' && websiteStyle.templateCoverUrlWhole!=null" alt="">
            <img src="../../assets/img/def_style.png" v-else alt="">
          </div>
          <div class="website-style-desc">
            {{ websiteStyle.templateName }}
            <span class="free"> <em>*</em> 免费</span>
            <el-button type="primary" class="used using" v-if="websiteStyle.useTag==1" disabled="disabled">正在使用</el-button>
            <el-button type="primary" class="used toUse" @click="useWebStyle(index)" v-else>立即使用</el-button>
          </div>

      </div>
      <div class="website-style more-style" v-if="!websiteStyle_load">
        <div class="content">
          <p>更多模板</p>
          <p>敬请期待</p>
        </div>
      </div>
      <!--数据加载 start-->
      <div class="load-container sitestyle_load" v-if="websiteStyle_load">
        <div class="loading loading-circle"></div>
      </div>
      <!--数据加载 end-->
    <!--解绑确认弹框start-->
    <el-dialog title="提示" size="390px" v-model="bindWebStyle" custom-class="bindWebStyle-pop" style="text-transform: capitalize;">
      <div class="title-second">您即将使用新的模板，因为不同模板的尺寸不同，您需要</div>
      <ul class="prompt-list">
        <li><i>&bull;</i>重新上传LOGO图片</li>
        <li><i>&bull;</i>重新上传轮播图图片</li>
        <li><i>&bull;</i>重新上传广告位图片</li>
        <li><i>&bull;</i>重新上传背景图片</li>
      </ul>
      <div slot="footer" class="dialog-footer left-btn">
        <div v-if="!isload">
        <el-button type="primary" @click="templateSaveFunc">立即使用</el-button>
        <el-button @click="bindWebStyle=false">取 消</el-button>
        </div>
        <span class="btn-loaders" v-else>
          <div class="loaders">
            <div class="loader">
              <div class="loader-inner ball-pulse-sync">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import websiteStyleAPI from '../../../src/api/websiteStyleAPI'
  export default{
    data () {
      return {
        websiteStyles: [],
        bindWebStyle: false,
        websiteStyle_load: true,
        shopId: window.localStorage.shopId,
        isload: false // 是否正在报错模板
      }
    },
    components: {
    },
    methods: {
      useWebStyle (index) {
        console.log(index)
        this.bindWebStyle = true
        this.index = index
      },
      templateSaveFunc () {
        this.isload = true
        let websiteStyle = this.websiteStyles[this.index]
        let parame = {
          templateId: websiteStyle.id
        }
        websiteStyleAPI.templateSave(parame).then(res => {
          if (res.data.code === 0) {
            this.bindWebStyle = false
            this.$message.success('保存模板成功')
            this.templateListFunc()
          } else {
            this.$message.error(res.data.message)
          }
          this.isload = false
        })
      },
      templateListFunc () {
        websiteStyleAPI.getTemplateList().then(res => {
          if (res.data.code === 0) {
            this.websiteStyle_load = false
            if (this.shopId === '221977394372726873') {
              this.websiteStyles = res.data.data
            } else {
              this.websiteStyles = res.data.data.slice(0, 11)
            }
          }
        })
      }
    },
    mounted () {
      this.templateListFunc()
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  .sitestyle_load{
    margin-top:250px;
  }
  .curr.btn-loaders{
    border-radius: 0px 4px 4px 4px;
  }
  .btn-loaders{
    background-color: #5488F9;
    width:88px;
    height:36px;
    display:inline-block;
    border-radius: 4px;
    position: relative;
    vertical-align: bottom;
    cursor:pointer;
    opacity: 0.7;
    .loaders{
      position: relative;
      top: 11px;
      left: 25px;
      float: left;
    }
  }
.website-style-list{
  padding-bottom:30px;
  .website-style{
    width:360px;
    height:496px;
    display:inline-block;
    /*box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);*/
    border-radius: 5px;
    position: relative;
    /*margin-top:60px;*/
    float:left;
    .special-note{
      position: absolute;
      width: 92px;
      height: 0;
      border-top: none;
      border-bottom: 31px #FFA726 solid;
      /*border-right: transparent 10px solid;*/
      /*border-left: none;*/
      color:#fff;
      line-height: 18px;
      font-size: 13px;
      top:0;
      border-radius:4px 0 0 0;
      text-align: center;
      i{
        position: relative;
        top: 5px;
      }
    }
    .imgae{
      width:100%;
      height:385px;
      border-bottom: 1px solid #eaf0f6;
      img{
        width:100%;
        height:385px;
        border-radius: 4px 4px 0 0;
      }
    }
    .website-style-desc{
      font-size: 14px;
      color: #33475B;
      letter-spacing: 0;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 16px;
      /*margin-bottom: 40px;*/
      .free{
        font-size: 14px;
        color: #4F6D95;
        em{
          vertical-align: middle;
        }
      }
      .used{
        float: right;
        font-size: 12px;
        &:hover{
          background: #EAF0F6;
          border: 1px solid #DFE3EB;
          border-radius: 4px;
          color: #7C98B6;
        }
      }
      .btn{
        border-radius: 0px 0px 4px 4px;
        text-align: center;
        position: absolute;
        width: 100px;
        height: 32px;
        bottom: 0px;
        padding:0 0;
        span{
          display: block;
          font-size: 13px;
          color: #FFFFFF;
          line-height: 32px;
          /*padding:16px 0 17px 0;*/
        }
      }
    }
    .isselect.btn{
      background: #F5F8FA;
      border: 1px solid #EAF0F6;
      span{
        color: #CBD6E3;
      }
    }
  }
  .website-style:nth-child(3n+2){
    margin-left:58px;
    margin-right:58px;
  }
  .more-style{
    background: #DFE3EB;
    height: 405px;
    .content{
      text-align: center;
      font-size: 36px;
      color: #B0C1D4;
      line-height: 50px;
      position: relative;
      top:50%;
      margin-top:-50px;
    }
  }
}
.bindWebStyle-pop{
  width:520px;
  .el-dialog__header{
    border: 1px solid #DFE3EB;
    padding:14px 16px 13px 16px;
    .el-dialog__title{
      font-size: 14px;
      color: #33475B;
      line-height: 21px;
    }
  }
  .el-dialog__body{
    padding:24px 40px 22px 40px;
    .title-second{
      font-size: 13px;
      color: #33475B;
      line-height: 22px;
    }
    .prompt-list{
      font-size: 13px;
      color: #33475B;
      line-height: 22px;
      li i{
        margin-right:20px;
      }
    }
  }
  .el-dialog__footer{
    padding: 10px 46px 50px;
    text-align: left;
  }
}
</style>
