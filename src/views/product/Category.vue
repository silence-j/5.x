<template>
  <section class="container-1200">
    <div class="inner-top">
      <a href="javascript:;" @click="backToList">
      <!--<i class="icon-font icon-left"></i>-->
       <span><img src="../../../src/assets/img/left.png" alt="" class="left-back" /></span>
      返回产品列表</a>
    </div>
    <div class="logistic-container">
      <ul class="steps clearfix">
        <li class="active"><i class="arrow-blue"></i>1、选择类目</li>
        <li>2、填写产品信息</li>
      </ul>
      <section class="cate-box">
        <div class="cate-list">
          <ul>
            <li class="cate-item" v-for="(data, index) in cateone">
              <a href="javascript:;" @click="chose(0, data.id, data.name)" :class="{'selected': cateoneId==data.id}">
                {{data.name}}
                <i class="icon-arright"></i>
              </a>
            </li>
          </ul>
        </div>
        <div class="cate-list">
          <ul>
            <li class="cate-item" v-for="(data, index) in catetwo">
              <a href="javascript:;" @click="chose(1, data.id, data.name)" :class="{'selected': catetwoId==data.id}">
                {{data.name}}
                <i class="icon-arright"></i>
              </a>
            </li>
          </ul>
        </div>
        <div class="cate-list">
          <ul v-if="choseOne">
            <li class="cate-item" v-for="(data, index) in catethree">
              <a href="javascript:;" @click="chose(2, data.id, data.name)" :class="{'selected': catethreeId==data.id}">
                {{data.name}}
              </a>
            </li>
          </ul>
        </div>
      </section>
      <el-button type="primary" class="size-l" @click="next">下一步</el-button>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProductCategory',
  props: {
  },
  data () {
    return {
      selectedSubNav: 2,
      cateoneId: '',
      catetwoId: '',
      catethreeId: '',
      catename: [],
      choseOne: false, // 三个选好 重新选第一个要清空第三个
      isBack: false
      // backOne: ''
    }
  },
  components: {},
  methods: {
    backToList () {
      this.$router.push({path: '/product'})
    },
    chose (index, parentId, name) {
      if (index === 0) {
        this.$store.dispatch('getCate2', {parentId: parentId})
        this.cateoneId = parentId
        this.catename[0] = name
        this.choseOne = false
        // 清空剩余2级
        this.catetwoId = ''
        this.catename.splice(1, 1)
        this.catethreeId = ''
        this.catename.splice(2, 1)
      } else if (index === 1) {
        this.$store.dispatch('getCate3', {parentId: parentId})
        this.catetwoId = parentId
        this.catename[1] = name
        this.choseOne = true
        // 清空剩余1级
        this.catethreeId = ''
        this.catename.splice(2, 1)
      } else {
        this.catethreeId = parentId
        this.catename[2] = name
      }
    },
    next () {
      // 三个等级类目全选
      let catelen = this.catename.length
      if (catelen > 1) {
        let ids = [this.cateoneId, this.catetwoId, this.catethreeId]
        if (catelen === 2) {
          if (this.catethree.length) {
            this.$message({
              type: 'info',
              message: '请选择类目'
            })
            return
          }
          ids = [this.cateoneId, this.catetwoId]
        }
        ids = ids.join('>')
        for (let i = 0; i < catelen; i++) {
          if (this.catename[i]) {
            this.catename[i] = this.catename[i].split('/').join('-')
          }
        }
        let isModify = '0'
        if (this.isBack) {
          isModify = JSON.parse(localStorage.getItem('modProdOther' + localStorage.getItem('userId'))).isModify
        }
        // 分类id, 分类名, 新增/编辑,是否是修改分类返回
        let rout = ['/ProductModify', ids, this.catename.join('>'), isModify, this.isBack].join('/')
        this.$router.push({path: rout})
      } else {
        if (catelen === 1 && !this.catetwo.length) {
          let isModify = '0'
          if (this.isBack) {
            isModify = JSON.parse(localStorage.getItem('modProdOther' + localStorage.getItem('userId'))).isModify
          }
          let rout = ['/ProductModify', this.cateoneId, this.catename[0], isModify, this.isBack].join('/')
          this.$router.push({path: rout})
          return
        }
        this.$message({
          type: 'info',
          message: '请选择类目'
        })
        return
      }
    }
  },
  watch: {
  },
  computed: mapGetters({
    cateone: 'cateone',
    catetwo: 'catetwo',
    catethree: 'catethree'
  }),
  mounted () {
    this.$store.dispatch('getCate')
    let itemId = this.$route.params.itemId
    let names = this.$route.params.name
    if (itemId !== 'false') { // 商品页返回的
      this.isBack = true
      let arr = itemId.split('>')
      this.$store.dispatch('getCate2', {parentId: arr[0]})
      this.cateoneId = arr[0]
      // 处理名字中/转成-的
      this.catename = names.split('>')
      for (let i = 0, len = this.catename.length; i < len; i++) {
        this.catename[i] = this.catename[i].split('-').join('/')
      }
      if (arr.length > 1) {
        this.catetwoId = arr[1]
        this.$store.dispatch('getCate3', {parentId: arr[1]})
        if (arr.length === 3) {
          this.choseOne = true
          this.catethreeId = arr[2]
        }
      }
    } else {
      this.catetwo.splice(0, this.catetwo.length)
      this.catethree.splice(0, this.catethree.length)
    }
  },
  created () {
  }
}
</script>
<style lang='less'>
@import '../../assets/style/variable.less';
/*@import '../../assets/style/product.less';*/
@lightblue: #edf3fe;
.steps{
  margin-bottom: 20px;
  li{
    position: relative;
    float: left;
    width: 50%;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    background-color: @lightblue;
    color: @mainFontColor;
    text-align: center;
  }
  .active{
    background-color: @activeBlue;
    color: @white;
    border-radius: 5px;
  }
  .arrow-blue, .arrow-light{
    position: absolute;
    right: 0;
    width: 13px;
    height: 100%;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAsCAMAAACJxcLdAAAAYFBMVEVUiPnt8/7o8P7////y9/+CqPtjk/rj7P7I2f6vyPyfvfyZuftvnPtZi/n6/P/f6v64zvx+pvt3ofpXivpdj/na5v7U4f7N3f2/0/2lwfyPsvuIrfuHrPpgkfpZjfpolvl7+x4aAAAAgUlEQVQoz33SOxKDMBADUNnENmAcSCBffve/JcxQIBVmq30zW60EVxbF/WaOAfDY91NoLAtRtAQWapG3LFSiRoSv6CnCRzSK+hcLUTQEFn4ib1noRJPIi5Kov7h0ooo1BFZtSKll/Q3rzXKGVeY/2LHWfCqzzaaZWlbMNETao83aAMK5A/P0eypdAAAAAElFTkSuQmCC);
    z-index: 99;
  }
  .arrow-light{
    right: -4px;
    width: 10px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAsCAMAAABrGdmkAAAAXVBMVEVUiPnt8/5djvp2oPvm7/7k7P7f6v6qxfyevPtZi/r////7/f/X5P7U4v6jwPyVtvuQs/tvm/pikvppl/nc5/7Q3/3H2P3C1f260Pyzy/yaufuMr/uCqPp9pfpsmPmpR9qeAAAAdElEQVQY023RNxaDQBAE0Z51LAiPvAT3PyYBb7sJqOjnhabzNY5uDqUEZotYidGR9hXvov3Eh2ir+BJtEj9imEnrxehIG8RWtEkcxSz24iB6MoHMZJjJCuRCvkF68gnyT3YgRzLVZEZhcFcDNjJS54VNW8buX3oDbhO6zoAAAAAASUVORK5CYII=);
  }
}
.cate-box{
  display: box;
  display: -webkit-box;
  border-bottom: 1px solid #DFE3EB;
  border-top: 1px solid #DFE3EB;
}
.cate-list{
  height: 600px;
  box-flex: 1;
  -webkit-box-flex: 1;
  border-right: 1px solid #DFE3EB;
  overflow-y: auto;
  ul{
    margin: 10px 0;
  }
}
.cate-item{
  position: relative;
  height: 32px;
  line-height: 32px;
  .icon-arright{
    position: absolute;
    right: 10px;
    top: 1px;
  }
  a{
    display: block;
    padding-left: 10px;
    color: @textColor;
    &:hover{
      /*background-color: #EAF0F6;*/
      background-color: #e5f7f9;
    }
    &.selected{
      /*border-left: 2px solid @activeBlue;*/
      /*background-color: #dde7fe;*/
      font-weight: bold;
      color: #00B8CC;
      background-color: #e5f7f9;
    }
  }
}
.logistic-container{
  button.size-l{
    float: right;
    margin: 20px;
  }
}
</style>
