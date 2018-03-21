<template>
  <div class="item-detail-wrapper">
    <div class="back-btn">
      <a href="javascript:;" @click="backToBus">
       <span><img src="../../../../assets/img/left.png" alt="" class="left-back" /></span>
       返回 外贸侦探 - {{taskName}}
      </a>
    </div>
    <detailHeader :data="companyInfo"></detailHeader>
    <left :data="companyInfo"></left>
    <right :data="companyInfo"></right>
  </div>
</template>
<script>
import detailHeader from './detailHeader'
import left from './detailLeftWrapper'
import right from './detailRightWrapper'
import developAPI from '@/api/developAPI'
export default {
  name: '',
  data () {
    return {
      companyInfo: {},
      getCount: 0,
      taskName: ''
    }
  },
  mounted () {
    let id = this.$route.query.companyId
    this.getDetail(id)
    this.taskName = localStorage.getItem('taskName')
  },
  computed: {

  },
  components: {
    detailHeader,
    left,
    right
  },
  methods: {
    backToBus () {
      this.$router.go(-1)
    },
    getDetail (id) {
      developAPI.getCompanyDetail({ id }).then((res) => {
        this.companyInfo = res.data.data
        if (res.data.data.added) {
          this.$store.commit('ADD_ORNOT', {type: true})
          this.$store.commit('ADD_COMPANYID', {id: res.data.data.contactsId})
        } else {
          this.$store.commit('ADD_ORNOT', {type: false})
        }
        if (res.data.data.fillStatus !== 2) {
          setTimeout(() => {
            this.getDetail(id)
          }, 10000)
        }
      })
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .item-detail-wrapper{
    width: 1200px;
    margin: 0 auto;
    padding-top: 20px;
    font-size: 0px;
    .back-btn{
      line-height: 17px;
      margin-bottom: 20px;
      a{
        color: #7c98b6;
        font-size: 13px;
      }
    }
  }
</style>
