<template>
  <div class="info">
    <!--<router-link :to="{ name: 'Try'}">jump to</router-link>-->
    <el-select v-model="value" @change="change(value)">
      <el-option
        v-for="(items,index) in option"
        :label="items.label"
        :key="index"
        :value="items.value">
      </el-option>
    </el-select>
    <div v-if="!info.length">
      暂无数据
    </div>
    <div v-for="items in info" v-else>
      <!--海关数据-->
      <div class="port" v-if="items.platform == 3">
        <div class="one">
          <div class="img" @click="showDetail(items.socialAccountId)" style="width: 64px;height: 64px"><img :src="items.avatar" alt=""></div>
          <button @click="addCom(items)">添加联系</button>
          <div class="main">
            <h3>{{items.name}}</h3><span>海关</span>
            <p>{{items.desc}}</p>
          </div>
        </div>
      </div>
      <!--fb数据-->
      <div class="fb" style="border-bottom: 1px solid gray;margin-bottom: 10px" v-if="items.platform == 0">
        <div class="one">
          <div class="img" @click="showDetail(items.socialAccountId)"><img :src="items.avatar" alt=""></div>
          <button @click="addCom(items)">添加联系</button>
          <div class="main">
            <p>{{items.name}}</p>
            <p><span>链接</span><span>{{items.url}}</span></p>
            <p><span>主页类型</span><span>{{items.domain}}</span></p>
          </div>
        </div>
      </div>
      <!--twiter数据-->
      <div class="tw" v-if="items.platform == 1">
        <div class="one">
          <div class="img" @click="showDetail(items.socialAccountId)"><img :src="items.avatar" alt=""></div>
          <button @click="addCom(items)">添加联系</button>
          <div class="main">
            <p>{{items.name}}</p>
            <p><span>链接</span><span>{{items.url}}</span></p>
            <p><span>主页类型</span><span>{{items.domain}}</span></p>
            <p>被关注：<span>{{items.followCount}}</span></p>
            <p>被点赞：<span>{{items.likeCount}}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import exploreAPI from '@/api/exploreAPI'
  export default {
    name: 'info',
    data () {
      return {
        value: 0,
        option: [
          {label: '-全平台-', value: 0},
          {label: 'facebook', value: 1},
          {label: 'twitter', value: 2},
          {label: '海关', value: 3}
        ],
        info: {},
        port: [],
        fb: [],
        tw: [],
        ln: [],
        key: Number,
        words: '',
        params: {}
      }
    },
    created: function () {
      console.log('created')
    },
    mounted: function () {
      console.log('mounted')
//      this.$bus.$on('search', (data) => {
//        console.log('8989')
//      })
//      公司搜索结果
      this.words = this.$route.query.searchText
      this.params = {keywords: this.words, userId: window.localStorage.userId}
      // this.allInfo(this.params)
    },
    components: {
    },
    methods: {
//      公司搜索结果
      allInfo: function (params) {
        exploreAPI.companyList(params).then(res => {
          console.log(999)
          console.log(res.data)
          this.info = res.data.data.records
//          this.info = res.data
//          for (let i = 0; i < res.data.data.records.length; i++) {
//            if (this.info.records[i].platform === 3) {
//              console.log(res.data.data.records[i])
//              this.port.push(res.data.data.records[i])
//            }
//            if (this.info.records[i].platform === 0) {
//              this.fb.push(res.data.data.records[i])
//            }
//            if (this.info.records[i].platform === 1) {
//              this.tw.push(res.data.data.records[i])
//            }
//            if (this.info.records[i].platform === 2) {
//              this.ln.push(res.data.data.records[i])
//            }
//          }
        })
      },
      addCom: function (data) {
        console.log(data.socialAccountId)
        let params = {
          socialAccountId: data.socialAccountId,
          name: data.name,
          url: data.url,
          platform: data.platform,
          keywords: this.$route.query.searchText,
          avatar: data.avatar,
          location: data.location,
          mail: data.mail,
          telephone: data.telephone,
          homepageType: data.socialAccountType,
          product: data.product,
          desc: data.desc,
          industry: data.industry,
          domain: data.domain
        }
        console.log(params)
        exploreAPI.addCompany(params).then(res => {
          if (res.data.code === 0) {
            this.$message.success('添加成功')
          } else {
            this.$message.error('添加失败')
          }
        })
      },
      change: function (val) {
        if (val === 0) {
          this.allInfo(this.params)
        } else {
          if (val === 1) this.key = 0
          if (val === 2) this.key = 1
          if (val === 3) this.key = 3
          let params = {keywords: this.$route.query.searchText, userId: window.localStorage.userId, platform: this.key}
          console.log(val)
          exploreAPI.companyList(params).then(res => {
            this.info = res.data.data.records
          })
        }
      },
      showDetail: function (id) {
        console.log(11)
        console.log(id)
        this.$router.push({path: '/companyDetail', query: {companyId: id}})
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .info{
    .port{
      width: 100%;
      border: 1px solid #ccc;
      background: #fff;
      margin-bottom: 10px;
      padding-bottom: 20px;
      cursor: pointer;
      .one{
        width: 100%;
        margin: 0 auto;
      }
    }
  }

</style>
