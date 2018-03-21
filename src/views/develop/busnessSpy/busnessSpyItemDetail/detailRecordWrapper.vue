<template>
  <div class="record-wrapper" :class="localData.length > 0 ? 'high' : ''">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <div class="title">
        <span @click="changeTag('reslove')" class="relative-tag" :class="isRencent ? '' : 'active'">相关采购记录</span>
        <span @click="changeTag('recent')" class="recent-tag" :class="isRencent ? 'active' : ''">近期采购记录</span>
      </div>
      <div class="record-no-data" v-if="!localData.length">
        <img src="../../../../assets/img/empty-contact.png" alt="">
        <p>暂无数据</p>
      </div>
      <div>
        <component
        :is="haveDesPort ? 'recordItem' : 'recentItem'"
        v-for="(item, index) in localData"
        :key="index"
        :item="item"></component>
      </div>
    </div>
  </div>
</template>
<script>
import recordItem from './recordItem.vue'
import recentItem from './recentItem.vue'
import developAPI from '@/api/developAPI'
export default {
  name: '',
  data () {
    return {
      isLoading: true,
      localData: [],
      isRencent: false,
      haveDesPort: false
    }
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal.name !== oldVal.name) {
        this.getResolveRecord()
      }
    }
  },
  mounted () {
  },
  computed: {

  },
  props: {
    data: {
      type: Object
    }
  },
  components: {
    recordItem,
    recentItem
  },
  methods: {
    changeTag (val) {
      if (val === 'recent') {
        this.getRecentRecord()
      } else {
        this.getResolveRecord()
      }
      this.isRencent = !this.isRencent
    },
    getRecord () {
      let now = this.timeToString(new Date())
      let stratTime = Date.parse(new Date()) - 12 * 30 * 24 * 60 * 60 * 1000
      let startDate = this.timeToString(stratTime)
      let params = {
        companyCountry: this.data.baseInfo.address.country,
        companyName: this.data.name,
        startDate,
        endDate: now
      }
      developAPI.getTrendRecord(params).then(res => {
        if (!res.data.code) {
          this.isLoading = false
          this.localData = Array.from(res.data.data.data).slice(0, 5)
        }
      })
    },
    timeToString (val) {
      let time = new Date(val)
      let year = time.getFullYear()
      let month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
      let day = (time.getDate() < 10 ? '0' : '') + time.getDate()
      return `${year}-${month}-${day}`
    },
    getResolveRecord () {
      this.isLoading = true
      developAPI.getResolveRecord({
        companyName: this.data.name,
        countryName: this.data.baseInfo.address.country,
        keywords: localStorage.getItem('taskName')
      }).then(res => {
        if (!res.data.code) {
          this.isLoading = false
          this.$store.commit('DEVELOP_RECORDLENGTH', res.data.data.length)
          this.localData = Array.from(res.data.data).slice(0, 5)
          for (let item of res.data.data) {
            if (item.supplier || item.originPort) {
              this.haveDesPort = true
            }
          }
        }
      })
    },
    getRecentRecord () {
      this.isLoading = true
      developAPI.getRecentRecord({
        companyName: this.data.name,
        countryName: this.data.baseInfo.address.country
      }).then(res => {
        if (!res.data.code) {
          this.isLoading = false
          this.$store.commit('DEVELOP_RECORDLENGTH', res.data.data.length)
          this.localData = Array.from(res.data.data).slice(0, 5)
          for (let item of res.data.data) {
            if (item.supplier || item.originPort) {
              this.haveDesPort = true
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .record-wrapper{
    width: 100%;
    height: 613px;
    background-color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    &.high{
      min-height: 250px;
      height: auto;
    }
    .loading{
      position: relative;
      top: 100px;
      margin: 0 auto;
    }
    .title{
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #dfe3eb;
      text-indent: 30px;
      font-weight: 600;
      font-size: 18px;
      color: #7C98B6;
      cursor: pointer;
      .relative-tag{
        padding-right: 22px;
        border-right: 1px solid #7C98B6;
        margin-right: 22px;
      }
      .active{
        color: #33475B;
      }
    }
    .record-no-data{
      width: 100%;
      padding-top: 178px;
      height: 350px;
      img{
        display: block;
        width: 100px;
        height: auto;
        /*margin: 178px auto 0;*/
        margin: 0 auto 0;
      }
      p{
        text-align: center;
        font-size: 13px;
        line-height: 20px;
        color: #33475b;
      }
    }
  }
</style>
