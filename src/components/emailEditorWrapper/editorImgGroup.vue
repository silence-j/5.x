<template>
  <div class="edit-type">
    <div class="box-s">
      <div class="box-item" v-for="(item,i) in imgGroupList">
        <imgUpload :index="i" :defaultSrc="item.imgUrl" @imgChange="updateImg"></imgUpload>
        <div v-if="imgGroupList.length === 2"  @click="addImgCount" class="opreat-count add">+</div>
        <div v-else @click="cutImgCount" class="opreat-count cut"><span class="icon-font delete">&#xe679;</span>&nbsp;&nbsp;&nbsp;删除</div>
      </div>
    </div>
    <p class="upload-tip">建议图片宽度为400像素，高度为400像素，JPG，PNG图片格式，2M以内为最佳显示效果</p>
    <el-button type="primary" style="margin-left: 10px;" @click="save">保存</el-button>
  </div>
</template>
<script>
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'
  export default {
    name: 'editorimgGroupList',
    props: {
      editData: Object,
      editorSave: Function,
      editorChange: Function
    },
    components: {
      imgUpload
    },
    data () {
      return {
        imgCount: 0,
        imgGroupList: [],
        width: 50,
        countOptions: [
          {
            label: '两张',
            value: 2
          },
          {
            label: '三张',
            value: 3
          }
        ]
      }
    },
    beforeMount () {
      this.initData()
    },
    watch: {
      editData () {
        this.initData()
      },
      imgCount (newVal, oldVal) {
        if (oldVal === 0) return
        if (newVal > oldVal) {
          for (let i = 0; i < newVal - oldVal; i++) {
            this.imgGroupList.push({
              imgUrl: 'https://qiniu.onloon.co/maildefault.png'
            })
          }
        } else if (newVal < oldVal) {
          this.imgGroupList = this.imgGroupList.slice(0, newVal)
        }
        this.width = this.imgCount === 3 ? 33.3 : 50
        this.changeValue()
      }
    },
    methods: {
      initData () {
        if (!this.editData.e) {
          return
        }
        let arr = []
        let target = this.editData.e.target
        let wrapper = target.parentElement.nextElementSibling
        let imgGroupList = wrapper.querySelectorAll('.imgGroup img')
        this.imgCount = imgGroupList.length || 2
        this.width = this.imgCount === 3 ? 33.3 : 50
        for (let i = 0; i < imgGroupList.length; i++) {
          arr.push({
            imgUrl: imgGroupList[i].currentSrc
          })
        }
        this.imgGroupList = arr
      },
      cutImgCount () {
        this.imgCount = 2
      },
      addImgCount () {
        this.imgCount = 3
      },
      dragleave (e) {
        // console.log(e)
      },
      updateImg (val) {
        this.imgGroupList[val.index].imgUrl = val.urlWhole
        this.changeValue()
      },
      save () {
        this.editorSave()
      },
      changeValue () {
        let type = this.editData.item.type
        let content = getTmplContent(type, {
          imgGroupList: this.imgGroupList,
          width: this.width
        })
        let changeData = {
          item: {
            bottomShow: false,
            content: content,
            topShow: false,
            type: 'btn'
          },
          index: this.editData.index
        }
        this.editorChange(changeData, this.editData)
      }
    }
  }
</script>
<style lang="less" scoped>
  .edit-type{
    padding-left: 16px;
    max-height: 630px;
    overflow-y: auto;
    .title{
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      margin-top: 16px;
    }
  }
</style>
<style lang="less">
  .edit-type{
    .box-s{
      margin-right: 15px;
      margin-top:30px;
      background: #eeeeee;
      display: flex;
      position: relative;
      background: url(/static/img/mark.973c2ba.jpg);
      background-size: 8px 8px;
      &:hover{
        .add{
          display: block;
        }
      }
      .box-item{
        display: inline-block;
        width: 33.3%;
        &:hover{
          .cut{
            display: block;
          }
        }
      }
      .img-box{
        margin: 0 !important;
        width: 100% !important;
        height: 80px !important;
        &:hover{
          .change-img{
            text-align: center;
          }
        }
      }
      .opreat-count{
        font-size: 13px;
        position: absolute;
        right: 1px;
        top: 0;
        width: 119px;
        text-indent: 25px;
        cursor: pointer;
        display: none;
        color: #ffffff;
        background: rgba(80, 109, 149, 0.6);
      }
      .cut{
        height: 40px;
        line-height: 40px;
        border-radius: 4px 4px 0 0;
        .delete{
          font-size: 18px;
        }
      }
      .add{
        height: 80px;
        line-height: 80px;
        border-radius: 4px;
        background: rgba(80, 109, 149, 0.4);
      }
    }
    .upload-tip{
      padding: 0 15px;
    }
    .el-button{
      margin-left: 15px;
    }
  }
</style>
