<template>
    <div class="ad-container">
      <div>
        <div :class="showDetail?'ad-title ad-title-before':'ad-title ad-title-after'">
          <span>显示内容:</span>
          <el-select v-model="showContent" class="show-source" @change="changeShowContent">
            <el-option v-for="item in showData"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="ad-search" v-if="showDetail">
            <el-input placeholder="请输入联系人姓名或Email" v-model="searchVal">
              <el-button slot="append" icon="search" @click="searchEmail"></el-button>
            </el-input>
          </div>
        </div>
        <div :class="showDetail?'topbg ad-title-before':'topbg ad-title-after'"></div>
        <!--表头部分-->
        <div :class="showDetail?'loading loading-circle loading-before':'loading loading-circle loading-after'" v-if="isLoading.addList"></div>
        <div :class="showDetail?'ad-table ad-table-before':'ad-table ad-table-after'" v-if="!isLoading.addList">
          <div>
            <div class="list-header">
              <ul class="ad-header">
                <li class="email">Email</li>
                <li class="name">姓名</li>
                <li class="read">阅读次数</li>
                <div v-if="showDetail">
                  <li class="last-time">最后一次阅读时间</li>
                  <li class="click-count">点击次数</li>
                  <li class="click-time">最后一次点击时间</li>
                  <li class="arrive-time">送达时间</li>
                  <li class="show-content">发送状态</li>
                </div>
              </ul>
            </div>
            <!--暂无数据-->
            <div class="no-data" v-if="receiversList.length === 0">
              <div class="no-info">
                <img src="../../../assets/img/monitor/no-post.png" alt="">
                <br>
                <br>
                <p>暂无数据</p>
              </div>
            </div>
            <div class="list-body" v-for="item in receiversList">
              <ul class="ad-body" @click="changeShowDetail(item.mailMarketingId, item.address)">
                <li class="email-val" :title="item.address">{{item.address}}</li>
                <li class="name-val">
                  <img :src="item.avatar || '/static/img/default.png'" alt="">
                  <span class="textSpan" :title="item.personalnpm ">{{item.personal}}</span>
                </li>
                <li class="read-val">
                  <span v-if="item.readCount !== null && item.readCount !== ''">{{item.readCount}}</span>
                  <span v-else="">—</span>
                </li>
                <div v-if="showDetail">
                  <li class="last-val">
                    <span v-if="item.readTime !== null && item.readTime !== ''">{{item.readTime | time-formater-no-second}}</span>
                    <span v-else="">—</span>
                  </li>
                  <li class="click-val">
                    <span v-if="item.hitCount !==null && item.hitCount !== ''">{{item.hitCount}}</span>
                    <span v-else="">—</span>
                  </li>
                  <li class="clickTime-val">
                    <span v-if="item.hitTime !== null && item.hitTime !== ''">{{item.hitTime | time-formater-no-second}}</span>
                    <span v-else="">—</span>
                    </li>
                  <li class="arrive-val">
                    <span v-if="item.arriveTime !== null && item.arriveTime !== ''">{{item.arriveTime | time-formater-no-second}}</span>
                    <span v-else="">—</span>
                  </li>
                  <li>
                    <span v-if="actStatus === ''">
                      <span v-if=" item.arriveTime > 0">已送达</span>
                      <span v-else-if="item.readCount > 0">已阅读</span>
                      <span v-else-if="item.hitCount > 0">已点击</span>
                      <span v-else="item.arriveTime === null">未送达</span>
                    </span>
                    <span v-if="actStatus === 1">
                      <span>已送达</span>
                    </span>
                    <span v-if="actStatus === 2">
                      <span>已阅读</span>
                    </span>
                    <span v-if="actStatus === 3">
                      <span>已点击</span>
                    </span>
                    <span v-if="actStatus === 0">
                      <span>未送达</span>
                    </span>

                  </li>
                </div>
              </ul>
            </div>
            <!--分页-->
            <div :class="showDetail?'ad-pageColumn':'ad-pageColumn-before'" v-if="addressPage.totalCount > 10 && receiversList.length > 0">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
                :current-page="addressPage.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="addressPage.pageSize"
                :total="addressPage.totalCount"
                :layout="adLayout">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <subDetail v-if="!showDetail" @closeCount="closeRight" :detail="detailData" :showOff="showDetailIt"></subDetail>
    </div>
</template>
<script>
  import subDetail from './../subExtension/subDetail.vue'
  import emailMarketApi from '@/api/emailMarketApi'
  export default {
    props: {
      mailId: 0,
      searchtype: Number
    },
    data () {
      return {
        typeCount: 4,
        actStatus: '',
        keyword: '',
        showDetailIt: true,
        searchVal: '',
        showData: [
          {
            value: 4,
            label: '全部'
          }, {
            value: 1,
            label: '已送达'
          },
          {
            value: 2,
            label: '已阅读'
          },
          {
            value: 3,
            label: '已点击'
          },
          {
            value: 5,
            label: '未送达'
          }],
        isLoading: {
          addList: true
        },
        showContent: this.searchtype || 4,
        addressPage: {
          page: 1,
          pageSize: 10,
          totalCount: 20
        },
        adLayout: 'prev, pager, next, sizes, jumper, ->',
        showDetail: true,
        receiversList: [],
        detailData: {
          receiver: {
            firstname: String,
            lastname: String,
            readCount: Number,
            hitCount: Number,
            address: String,
            avatar: String
          },
          logs: [
            {
              status: Number,
              createTime: Number,
              fromDevice: String
            }
          ]
        }
      }
    },
    mounted () {
      if (this.searchtype === 2) {
        this.actStatus = 2
      } else if (this.searchtype === 3) {
        this.actStatus = 3
      } else if (this.searchtype === 5) {
        this.actStatus = 0
      } else if (this.searchtype === 4) {
        this.actStatus = ''
      }
      this.emailReceivers()
    },
    methods: {
//      搜索联系人姓名或emial
      searchEmail () {
        this.isLoading.addList = true
        this.emailReceivers()
      },
//      邮件收件人数据
      emailReceivers () {
        let obj = {
          'mailMarketingId': this.mailId,
          'page': this.addressPage.page,
          'size': this.addressPage.pageSize,
          'actStatus': this.actStatus,
          'keyword': this.searchVal
        }
        emailMarketApi.getEmailReceivers(obj).then((res) => {
          if (!res.data.code) {
            this.isLoading.addList = false
            this.receiversList = res.data.data.records
            this.addressPage.totalCount = res.data.data.totalCount
          }
        })
      },
//      改变筛选条件
      changeShowContent (val) {
        this.isLoading.addList = true
        this.typeCount = val
        if (val === 4) {
          this.actStatus = ''
          this.emailReceivers()
        } else if (val === 5) {
          this.actStatus = 0
          this.emailReceivers()
        } else {
          this.actStatus = val
          this.emailReceivers()
        }
      },
//      表页数改变回调
      handlePageChange (val) {
        this.isLoading.addList = true
        this.addressPage.page = val
        this.emailReceivers()
      },
      handleSizeChange (val) {
        this.isLoading.addList = true
        this.addressPage.pageSize = val
        this.emailReceivers()
      },
//      收件人详情展示
      changeShowDetail (id, address) {
        this.showDetail = false
        this.showDetailIt = true
        let obj = {
          'mailMarketingId': id,
          'address': address
        }
        emailMarketApi.getEmailReceiversDetail(obj).then((res) => {
          if (!res.data.code) {
            this.detailData = res.data.data
            this.showDetailIt = false
          }
        })
      },
//      子组件响应父组件关闭右侧详情
      closeRight () {
        this.showDetail = true
      }
    },
    components: {
      subDetail
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .ad-container{
    width:1200px;
    height: 775px;
    margin-top: 16px;
    margin-bottom: 30px;
    position: relative;
    /*background: #FFFFFF;*/
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    .ad-title-before{
      width:1200px;
    }
    .ad-title-after{
      width:52.9%;
      transition: width 0.02s;
    }
    .topbg{
      /*padding: 0 20px;*/
      background: #fff;
      height: 16px;
    }
    .ad-title{
      /*width:1160px;*/
      /*padding: 0 20px;*/
      height: 66px;
      line-height: 66px;
      /*margin-bottom: 20px;*/
      background: #fff;
      border-bottom: 1px solid #DFE3EB;
      span{
        font-size: 16px;
        color: #33475B;
        font-weight: bold;
        padding-left: 20px;
      }
      .show-source{
        margin-left: 8px;
        .el-input{
          .el-input__inner{
            width: 160px;
            height: 34px;
          }
        }
      }
      .ad-search{
        width:240px;
        float: right;
        padding-right: 20px;
        .el-input{
          width:100%;
          .el-input-group__append{
            .el-button:active{
              border-color: #fff;
            }
          }
        }
      }
    }
    .ad-table-before{
      width:100%;
    }
    .ad-table-after{
      width:52.9%;
      transition: width 0.02s;
    }
    .loading-before{
      position: relative;
      top:50px;
    }
    .loading-after{
      position: relative;
      top:50px;
      left:-330px;
    }
    .ad-table{
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      min-height: 790px;
      margin-bottom: 40px;
      .list-header{
        .ad-header{
          /*width:1200px;*/
          height: 44px;
          background: #F5F8FA;
          border: 1px solid #DFE3EB;
          li{
            height: 44px;
            line-height: 44px;
            float: left;
            font-size: 13px;
            color: #4F6D95;
            background: #F5F8FA;
          }
          .email{
            width:200px;
            padding-left: 20px;
          }
          .name{
            width:204px;
          }
          .read{
            width:100px;
          }
          .last-time{
            width:154px;
          }
          .click-count{
            width:102px;
          }
          .click-time{
            width:174px;
          }
          .arrive-time{
            width:120px;
            /*padding-right: 20px;*/
          }
          .show-content{
            width:124px;
          }
        }
      }
      .list-body{
        .ad-body{
          height: 72px;
          border-bottom: 1px solid #DFE3EB;
          &:hover{
            background: #F5F8FA;
          }
          li{
            height: 72px;
            line-height: 72px;
            float: left;
          }
          .email-val{
            width:200px;
            padding-left: 20px;
            cursor: pointer;
          }
          .name-val{
            width:204px;
            position: relative;
            img{
              width:28px;
              height: 28px;
              border-radius: 50%;
              display: inline-block;
              vertical-align: middle;
              margin-right: 8px;
              /*background: pink;*/
              position: absolute;
              top:20px;
            }
            .textSpan{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding-left: 30px;
              width: 82%;
              display: inline-block;
            }
          }
          .read-val{
            width:102px;
          }
          .last-val{
            width:154px;
          }
          .click-val{
            width:102px;
          }
          .clickTime-val{
            width:174px;
          }
          .arrive-val{
            width:120px;
            /*padding-right: 20px;*/
          }
        }
      }
    }
    .ad-pageColumn-before{
      width:640px;
    }
    .ad-pageColumn{
      width:1180px;
      height: 60px;
      padding-top: 16px;
      padding-right: 20px;
      background: #fff;
      .el-pagination{
        float: right;
      }
    }
  }

</style>
