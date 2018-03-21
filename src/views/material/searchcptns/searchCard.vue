<template>
  <div>
    <div class="staticList" v-show="this.recordLess === '0'">
      <div class="searchList">
        <searchImg class="item_result" v-for="se in staticFirstList" :imgData="se" :key="se"></searchImg>
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in staticSecondList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in staticThirdList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in staticFourthList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in staticFifthList" :imgData="se" :key="se"></searchImg>        
      </div>
    </div>
    <div class="gifList" v-show="this.recordLess === '1'">
      <div class="searchList">
        <searchImg class="item_result" v-for="se in gifFirstList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in gifSecondList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in gifThirdList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in gifFourthList" :imgData="se" :key="se"></searchImg>        
      </div>
      <div class="searchList">
        <searchImg class="item_result" v-for="se in gifFifthList" :imgData="se" :key="se"></searchImg>        
      </div>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import searchImg from './searchImg'
  export default {
    data () {
      return {
        keyword: '',
        staticFirstList: [],
        staticSecondList: [],
        staticThirdList: [],
        staticFourthList: [],
        staticFifthList: [],
        gifFirstList: [],
        gifSecondList: [],
        gifThirdList: [],
        gifFourthList: [],
        gifFifthList: [],
        total1: 0,
        total2: 0,
        total3: 0,
        total4: 0,
        total5: 0
      }
    },
    props: [
      'recordLess',
      'socialSearchLoad'
    ],
    components: {
      searchImg
    },
    methods: {
      staticRemove () {
        this.staticFirstList = []
        this.staticSecondList = []
        this.staticThirdList = []
        this.staticFourthList = []
        this.staticFifthList = []
      },
      gifRemove () {
        this.gifFirstList = []
        this.gifSecondList = []
        this.gifThirdList = []
        this.gifFourthList = []
        this.gifFifthList = []
      },
      searchSet (ParentList, type) {
        this.total1 = 0
        this.total2 = 0
        this.total3 = 0
        this.total4 = 0
        this.total5 = 0
        let total1 = Number(this.total1)
        let total2 = Number(this.total2)
        let total3 = Number(this.total3)
        let total4 = Number(this.total4)
        let total5 = Number(this.total5)
        if (type === 'static') {
          for (let se of ParentList) {
            let heightMin = Math.min(total1, total2, total3, total4, total5)
            let seHeight = se.webformatHeight * 216 / se.webformatWidth
            if (heightMin === total1) {
              this.staticFirstList.push(se)
              total1 = total1 + seHeight
            } else if (heightMin === total2) {
              this.staticSecondList.push(se)
              total2 = total2 + seHeight
            } else if (heightMin === total3) {
              this.staticThirdList.push(se)
              total3 = total3 + seHeight
            } else if (heightMin === total4) {
              this.staticFourthList.push(se)
              total4 = total4 + seHeight
            } else if (heightMin === total5) {
              this.staticFifthList.push(se)
              total5 = total5 + seHeight
            }
          }
        } else {
          for (let se of ParentList) {
            let heightMin = Math.min(total1, total2, total3, total4, total5)
            let seHeight = se.webformatHeight * 216 / se.webformatWidth
            if (heightMin === total1) {
              this.gifFirstList.push(se)
              total1 = total1 + seHeight
            } else if (heightMin === total2) {
              this.gifSecondList.push(se)
              total2 = total2 + seHeight
            } else if (heightMin === total3) {
              this.gifThirdList.push(se)
              total3 = total3 + seHeight
            } else if (heightMin === total4) {
              this.gifFourthList.push(se)
              total4 = total4 + seHeight
            } else if (heightMin === total5) {
              this.gifFifthList.push(se)
              total5 = total5 + seHeight
            }
          }
          // Vue.nextTick(() => {
          //   this.$emit('changeLoad', false)
          // })
        }
        this.total1 = total1
        this.total2 = total2
        this.total3 = total3
        this.total4 = total4
        this.total5 = total5
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
.item_result {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  width: 100%;
  margin-bottom: 20px;
}
</style>
