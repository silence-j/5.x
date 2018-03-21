<template>
  <div>
    <contact-Header></contact-Header>
    <div class="newsxx-dqwz w-1200">
      <a href="../../index.html">首页</a>&gt;
      <router-link :to="{ path: '/newsList'}" class="bt">小学堂</router-link>
      &gt;<a href="#" class="curr">正文</a>
    </div>
    <div class="news-list w-1200"><div class="newxx-tit"> {{ reqResult.title }}</div>
      <div class="newxx-data">   {{ reqResult.createTime | time-formater-no-hour }}
        <b>作者：<span>{{ reqResult.nickname }}</span></b>
        <b>阅读：<span>{{ reqResult.viewCount }}</span>次</b>
      </div>
      <div class="newxx-zhaiyao"><a class="tt">内容摘要：</a>{{ reqResult.summary }}</div>
      <div class="newxx-content"><p v-html="reqResult.content"></p><p v-html="reqResult.videoUrl"></p></div>
    </div>
  </div>
</template>
<script>
import ContactHeader from './cpnts/newsHeader'
import schoolAPI from '@/api/schoolAPI'
export default {
  name: 'newinfo',
  data () {
    return {
      reqResult: '',
      Id: this.$route.params.Id
    }
  },
  components: {
    ContactHeader,
    schoolAPI
  },
  methods: {
  },
  created () {
    schoolAPI.selArticleDetail({ id: this.Id }).then((res) => {
      this.reqResult = res.data.data
      console.log(res.data)
    })
  }
}
</script>
<style lang='less'>
  @import '../../assets/style/school/school.less';
</style>
