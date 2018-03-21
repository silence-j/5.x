<template>
  <div class="edit-type">
    <div style="padding-left: 30px;height: 110px;">
      <h3 class="title">您可以推荐2个产品&nbsp;&nbsp;&nbsp;</h3>
      <div class="product-select">
        <el-select style="width:100%" size="small" v-model="selectedPro"
              ref="selectInputa"
              placeholder="请输入商品名称选择商品"
              :remote-method="getSearchList"
              @change="onSelectedPa"
              :clearable="true"
              filterable
              multiple
              :multiple-limit="2"
              remote>
          <el-option
            class="option-tag"
            v-for="item in searchList"
            :key="item.id"
            :label="item.productName"
            :value="item.id">
            <div class="recycle-box">
              <img :src="item.productFirstPicWhole">
              <span>{{item.productName}}</span>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>
    
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>
<script>
  import imgUpload from '@/components/imgUpload'
  // 获取各类型content @hansin
  import { getTmplContent } from '@/common/TmplContent'
  import productApi from '@/api/productApi'
  export default {
    name: 'editorProduct',
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
        productList: [],
        producta: null,
        productb: null,
        searchList: [],
        selectedPro: [],
        homepage: process.env.HOMEPAGE,
        proCount: 2,
        proOptions: [
          {
            value: 1,
            label: '一个'
          },
          {
            value: 2,
            label: '两个'
          }
        ],
        isInit: true
      }
    },
    computed: {
    },
    watch: {
      'editData.index' () {
        this.initData()
      },
      proCount () {
        this.changeValue()
      }
    },
    beforeMount () {
      this.initData()
    },
    methods: {
      getSearchList (query) {
        let postObj = {
          page: 1,
          size: 100,
          productName: query
        }
        productApi.getList(postObj).then((res) => {
          if (!res.data.code) {
            this.searchList = res.data.data.records
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      /**
       * 选择商品后回调
       */
      onSelectedPa (idList) {
        console.log(this.selectedPro)
        if (idList.length === 0) {
          this.proCount = 2
          return
        } else {
          this.proCount = idList.length
          for (let i = 0; i < idList.length; i++) {
            this.searchList.map((item) => {
              if (item.id === idList[i]) {
                if (i === 0) {
                  this.producta = item
                } else {
                  this.productb = item
                }
              }
            })
          }
          this.changeValue('a')
          this.$refs.selectInputa.visible = false
        }
        this.$refs.selectInputa.query = ''
      },
      onSelectedPb (idList) {
        if (idList.length === 0) {
          return
        } else {
          let id = idList[0]
          this.searchList.map((item) => {
            if (item.id === id) {
              this.productb = item
              return
            }
          })
          this.changeValue('b')
          this.$refs.selectInputb.visible = false
        }
        this.$refs.selectInputb.query = ''
        // console.log(this.selectedP2)
      },
      initData () {
        if (!this.editData.e) {
          return
        }
        this.productList = []
        this.searchList = []
        this.selectedPro = []
        this.producta = null
        this.productb = null
        let target = this.editData.e.target
        let wrapper = target.parentElement.nextElementSibling
        let product = wrapper.querySelectorAll('div .content')
        this.proCount = product.length || 2
        let pro1 = product[0]
        let pro2 = product[1]
        this.producta = {
          productName: pro1.querySelector('p').innerHTML,
          shopId: (pro1.querySelector('a').href + '').split('shopId=')[1] || '',
          id: (pro1.querySelector('a').href + '').split('&shopId=')[0].split('productId=')[1] || '',
          productFirstPicWhole: pro1.querySelector('img').currentSrc
        }
        if (pro2) {
          this.productb = {
            productName: pro2.querySelector('p').innerHTML,
            shopId: (pro2.querySelector('a').href + '').split('shopId=')[1] || '',
            id: (pro2.querySelector('a').href + '').split('&shopId=')[0].split('productId=')[1] || '',
            productFirstPicWhole: pro2.querySelector('img').currentSrc
          }
        }
        if (this.producta && this.producta.id) {
          this.searchList.push(this.producta)
          this.selectedPro.push(this.producta.id)
        }
        if (this.productb && this.productb.id) {
          this.searchList.push(this.productb)
          this.selectedPro.push(this.productb.id)
        }
        this.isInit = false
      },
      save () {
        this.editorSave()
      },
      changeValue (type) {
        let obj1 = {
          name: this.producta ? this.producta.productName : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis commodi distinctio labore luptatibus adipisci.',
          link: this.producta ? (this.homepage + '/detail?productId=' + this.producta.id + '&shopId=' + this.producta.shopId) : '#',
          imgUrl: this.producta ? this.producta.productFirstPicWhole : 'https://qiniu.onloon.co/maildefault.png'
        }
        let obj2 = {
          name: this.productb ? this.productb.productName : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis commodi distinctio labore luptatibus adipisci.',
          link: this.productb ? (this.homepage + '/detail?productId=' + this.productb.id + '&shopId=' + this.productb.shopId) : '#',
          imgUrl: this.productb ? this.productb.productFirstPicWhole : 'https://qiniu.onloon.co/maildefault.png'
        }
        if (this.proCount === 1) {
          this.productList = [obj1]
        } else if (this.proCount === 2) {
          this.productList = [obj1, obj2]
        }
        let content = getTmplContent('product', {
          productList: this.productList
        })
        let changeData = {
          item: {
            bottomShow: false,
            content: content,
            topShow: false,
            type: 'product'
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
    max-height: 630px;
    overflow-y: auto;
    .title{
      font-size: 16px;
      height: 30px;
      line-height: 30px;
    }
  }
  .product-select{
    .el-select{
      width:300px;
    }
  }
  .option-tag{
    height: 35px;
    width:420px;
    &.selected.hover{
      background-color: #F5F8FA;;
    }
    &.hover{
      background-color: #F5F8FA;;
    }
    &.selected::after{
      bottom: 7px;
    }
    .recycle-box{
      img{
        width: 25px;
        height: 25px;
        margin-right: 16px;
        vertical-align: top;
      }
    }
  }
</style>
<style>
.product-select .el-select__tags .el-tag  .el-select__tags-text{
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 18px;
    height: 18px;
}

.product-select .el-select__tags .el-tag .el-tag__close{
    top:-4px;
  }
</style>
