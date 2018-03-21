<template>
  <div>
  <div class="channel_data_List bottom_filter_result">
    <div class="channel_data" v-for="record in channelChildObj.records" :key="record">
      <a :href="record.link" target="_blank">
        <p class="nick">{{record.title | isNullDisplay}}</p>
        <p class="second_desc" v-html="record.position" :title="record.position"></p>
        <p class="desc" v-html="record.intro" :title="record.intro"></p>
      </a>
    </div>
    <!--暂无数据-->
    <div class="no-data" v-if="channelChildObj.records.length==0">
      <div class="no-info">
        <img src="../../../assets/img/monitor/no-post.png" alt="">
        <p style="margin-top: 10px;" v-if="filterTypeChild=='1'">linkedin暂无数据</p>
        <p style="margin-top: 10px;" v-else>facebook暂无数据</p>
      </div>
    </div>
    <div class="loading loading-circle loading-top" v-if="isMore"></div>
  </div>
  </div>
</template>

<script>
  import DevelopAPI from '@/api/developAPI'
  export default{
    name: 'ChannelDataPage',
    props: {
      channelChildObj: {
        records: Array,
        size: Number,
        totalCount: Number,
        totalPages: Number
      },
      companyIdChild: String,
      filterTypeChild: String
    },
    data () {
      return {
        isMore: false,
        isLoadIng: false,
        page: 1,
        taskId: this.$route.query.taskId,
        pageSize: 10
      }
    },
    computed: {
    },
    mounted () {
      if (this.page < this.channelChildObj.totalPages) {
        this.isMore = true
      }
      this.page = 1
      let _this = this
      let obj = document.getElementsByClassName('channel_data_List')[0]
      if (obj !== null && obj !== undefined) {
        obj.addEventListener('scroll', (event) => {
          if ((obj.scrollTop + obj.clientHeight) >= (obj.scrollHeight)) {
            if (_this.page === _this.channelChildObj.totalPages) {
              this.isMore = false
              return
            }
            if (!_this.isLoadIng && _this.isMore) {
              console.log('load....')
              _this.page = _this.page + 1
              if (_this.filterTypeChild === '1') {    // 类型为linkedin
                _this.getLinkedinListFunc()
              } else {    // 类型为facebook
                _this.getFacebookListFunc()
              }
            }
          }
        })
      }
    },
    methods: {
      // 获取linkedin员工列表
      getLinkedinListFunc () {
        if (this.companyIdChild !== '') {
          this.isLoadIng = true  // 正在加载数据
          let params = {
            taskId: this.taskId,
            companyId: this.companyIdChild,
            page: this.page,
            pageSize: this.pageSize
          }
          DevelopAPI.getLinkedinList(params).then(res => {
            if (res.data.code === 0) {
              let records = res.data.data.records
              let oldrecords = this.channelChildObj.records
              this.channelChildObj.records = oldrecords.concat(records)
              this.isLoadIng = false
            } else {
              this.isLoadIng = false
            }
          })
        }
      },
      // 获取facebook员工列表
      getFacebookListFunc () {
        if (this.companyIdChild !== '') {
          this.isLoadIng = true  // 正在加载数据
          let params = {
            taskId: this.taskId,
            companyId: this.companyIdChild,
            page: this.page,
            pageSize: this.pageSize
          }
          DevelopAPI.getLinkedinList(params).then(res => {
            if (res.data.code === 0) {
              let records = res.data.data.records
              let oldrecords = this.channelChildObj.records
              this.channelChildObj.records = oldrecords.concat(records)
              this.isLoadIng = false
            } else {
              this.isLoadIng = false
            }
          })
        }
      }
    },
    filters: {
      isNullDisplay (value) {
        if (value === '' || value === null) {
          return '-'
        } else {
          return value
        }
      }
    }
  }
</script>
