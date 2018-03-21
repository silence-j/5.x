<template>
  <div class="right-wrapper" :class="recordLength > 0 ? 'high' : ''">
    <div v-if="isLoading" class="loading loading-circle"></div>
    <div v-else>
      <h1 class="title">联系人</h1>
      <div id="key-contact">
        <el-button v-if="data.website && !data.hasMininged && !localHasDiged" type="primary" class="dig-contact-btn" @click="digDepthContact">联系人深度挖掘</el-button>
        <div class="keycontact-scroll">
          <depthCard
          v-for="(item, index) in keyContactList"
          :key="index"
          :data="item"
          :company="data"></depthCard>
        </div>
        <div class="show-more-contact" v-if="showKeyListBtn && localKeyList.length > 3" @click="showAllKeyContact">查看更多</div>
      </div>
      <div class="contact-scroll" id="contact-scroll">
        <card
        v-for="(item, index) in contactList"
        :key="index"
        :data="item"
        :company="data"></card>
      </div>
      <div class="show-more-contact" v-if="showMoreBtn && localList.length > 5" @click="showAllContact">查看全部</div>
      <div class="no-data" v-if="localList && !localList.length">
        <div class="img"></div>
        <div class="tips">暂无联系人</div>
      </div>
    </div>
  </div>
</template>
<script>
import card from './contactCard'
import depthCard from './depthContact'
import developAPI from '@/api/developAPI'
import { mapGetters } from 'vuex'
export default {
  name: '',
  data () {
    return {
      localList: [],
      localKeyList: [],
      contactList: [],
      keyContactList: [],
      isLoading: true,
      depthCardState: false,
      showMoreBtn: true,
      localHasDiged: false,
      showKeyListBtn: true,
      keyContactCount: 5
    }
  },
  watch: {
    data (newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        let flag1 = false
        let flag2 = true
        developAPI.getReleContactList({ id: this.data.id }).then((res) => {
          if (!res.data.code) {
            flag1 = true
            if (flag2) {
              this.isLoading = false
            }
            this.localList = res.data.data
            this.contactList = res.data.data.slice(0, 5)
          }
        })
        developAPI.getPivotalContact({ id: this.data.id }).then(res => {
          if (!res.data.code) {
            flag2 = true
            if (flag1) {
              this.isLoading = false
            }
            this.localKeyList = res.data.data
            this.keyContactList = res.data.data.slice(0, 3)
          }
        })
      }
    },
    recordLength (newVal, oldVal) {
      if ((newVal * oldVal) === 0) {
        this.contactListHeight()
      }
    }
  },
  mounted () {
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['recordLength'])
  },
  components: {
    card,
    depthCard
  },
  methods: {
    digDepthContact () {
      let params = {
        id: this.data.id,
        website: this.data.website
      }
      developAPI.digDepthContact(params).then((res) => {
        if (res.data.data) {
          developAPI.getPivotalContact({ id: this.data.id }).then(res => {
            if (!res.data.code) {
              this.localKeyList = res.data.data
              this.localHasDiged = true
              this.showAllKeyContact()
            }
          })
        }
      })
    },
    showAllContact () {
      this.contactList = this.localList
      this.showMoreBtn = false
      this.contactListHeight()
    },
    showAllKeyContact () {
      if ((this.keyContactCount - 5) > this.localKeyList.length) {
        this.$message.success('没有更多数据了')
        this.showKeyListBtn = false
        return
      }
      this.keyContactList = this.localKeyList.slice(0, this.keyContactCount)
      this.keyContactCount += 5
      this.$nextTick(() => {
        this.contactListHeight()
      })
    },
    contactListHeight () {
      let height = this.recordLength > 0 ? 1800 : 1393
      let keyHeight = document.getElementById('key-contact').clientHeight
      document.getElementById('contact-scroll').style.maxHeight = `${height - keyHeight}px`
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .no-data{
    .img{
      background: url(../../../../../src/assets/img/no_linker.png) center no-repeat;
    }
  }
  .right-wrapper{
    display: inline-block;
    vertical-align: top;
    width: calc(~"100% - 800px");
    min-height: 1551px;
    padding: 20px 30px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    &.high{
      min-height: 1700px;
    }
    .title{
      font-size: 18px;
      color: #33475b;
      font-weight: 500;
      margin-bottom: 40px;
    }
    .loading{
      position: relative;
      top: 280px;
      margin: 0 auto;
    }
    .keycontact-scroll{
      width: 102%;
      padding-right: 2%;
      box-sizing: border-box;
      max-height: 340px;
      overflow-y: scroll;
      margin-bottom: 15px;
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
    }
    .contact-scroll{
      width: 102%;
      padding-right: 2%;
      box-sizing: border-box;
      max-height: 880px;
      overflow-y: auto;
      margin-bottom: 15px;
      ::-webkit-scrollbar{
        width: 3px;
        height: 3px;
      }
    }
    .show-more-contact{
      width: 100%;
      height: 30px;
      border: 1px solid #cbd6e3;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      color: #7c98b6;
      cursor: pointer;
      margin-bottom: 35px;
      &:hover{
        border-color: #5488f9;
        color: #5488f9;
      }
    }
    .dig-contact-btn{
      padding: 12px 80px;
      margin: 0 40px 40px;
    }
  }
</style>
