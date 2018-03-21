<template>
  <div class="account-statistics">
    <div class="back-title" @click="backAccountList">
      <i class="icon-font">&#xe600;</i>
      <span>返回账号列表</span>
    </div>
    <div class="sub-container">
      <div class="top">
        <div class="sub-cir">
          <!--暂无数据-->
          <div v-if="noData" class="no-list">
            <img src="../../../assets/img/monitor/no-post.png" alt="">
            <p>你还没添加过子账户</p>
          </div>
          <div class="title" v-if="!noData">
            <span class="name">使用统计</span>
            <span class="change">
            <span :class="{'active': setCount === 0}" @click="changeCount(0)">登录数统计</span>
            <span :class="{'active': setCount === 1}" @click="changeCount(1)">发帖数统计</span>
            <span :class="{'active': setCount === 2}" @click="changeCount(2)">新增产品统计</span>
          </span>
          </div>
          <div v-if="loginNo">
            <div class="l-nodata">
              <span>暂无数据</span>
            </div>
          </div>
          <div class="static-wraper">
            <div class="client-chart" id="client-chart"></div>
            <div class="forbid-legend">
              <div class="client-legend">
                <span v-for="(item,index) in subsetData"><i :class="'i'+index"></i>{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sub-table">
          <div class="no-table" v-if="tableList">
            <img src="../../../assets/img/monitor/no-post.png" alt="">
            <p>暂无数据</p>
          </div>
          <div v-if="!tableList">
            <p class="title">最近在线</p>
            <ul class="list-header">
              <li class="table-title name">姓名</li>
              <li class="table-title time">登录时间</li>
            </ul>
            <ul class="list-body" v-for="item in recentlyData">
              <li class="table-val name-val">
                <img :src="item.avatar || '/static/img/default_avatar.jpg'" alt="">
                <p class="person-name">{{item.name}}</p>
                <p class="mail-address">{{item.loginAccount}}</p>
              </li>
              <li class="table-val time-val" v-if="item.lastLoginTime !== null">{{item.lastLoginTime | time-formater-no-second}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="sub-card">
        <div class="card-info" v-for="item in subsetData">
          <div class="img">
            <img :src="item.avatar || '/static/img/default_avatar.jpg'" alt="">
          </div>
          <div class="person-info">
            <p class="name" :title="item.name">{{item.name}}</p>
            <p class="mail" :title="item.loginAccount">{{item.loginAccount}}</p>
          </div>
          <div class="person-bottom">
            <ul class="bottom-key">
              <li class="login b-key">登录</li>
              <li class="tie b-key">发帖</li>
              <li class="product b-key">新增产品</li>
            </ul>
            <ul class="bottom-val">
              <li class="b-val login-val">{{item.loginCount}}</li>
              <li class="b-val tie-val">{{item.messageSend}}</li>
              <li class="b-val product-val">{{item.productAdd}}</li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import mulAccountApi from '@/api/mulAccountApi'
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/tooltip'
  export default {
    name: 'accountStatistics',
    data () {
      return {
        loginNo: false,
        noData: false,
        tableList: false,
        isLoading: true,
        noSetAccount: false, // 保存是否添加子账号的Boolean值
        subsetData: [],
        setCount: 0,
        recentlyData: [],
//        登录统计
        loginData: [],
//        发帖统计
        postData: [],
//        新增产品统计
        newProData: [],
//        子账户姓名统计
        nameData: [],
        number: 0
      }
    },
    mounted () {
//      子账户统计
//      this.subsetCount()
//      最近在线
      this.subsetCount({isLatest: true})
      this.initPie(this.setCount)
    },
    computed: {
    },
    watch: {
    },
    methods: {
//      改变饼状图统计
      changeCount (val) {
        this.setCount = val
        this.initPie(this.setCount)
      },
//      饼状图统计
      initPie (count) {
        mulAccountApi.subsetCount(count).then((res) => {
          if (!res.data.code) {
            if (res.data.data.length > 0) {
              this.subsetData = res.data.data
              this.loginData = []
              this.number = 0
              for (var i = 0; i < this.subsetData.length; i++) {
                if (count === 0) {
                  if (this.subsetData[i].loginCount !== 0) {
                    this.loginData.push({value: this.subsetData[i].loginCount, name: this.subsetData[i].name})
                  } else {
                    this.number++
                    this.loginData.push({value: undefined, name: this.subsetData[i].name})
                  }
                }
                if (count === 1) {
                  if (this.subsetData[i].messageSend !== 0) {
                    this.loginData.push({value: this.subsetData[i].messageSend, name: this.subsetData[i].name})
                  } else {
                    this.number++
                    this.loginData.push({value: undefined, name: this.subsetData[i].name})
                  }
                }
                if (count === 2) {
                  if (this.subsetData[i].productAdd !== 0) {
                    this.loginData.push({value: this.subsetData[i].productAdd, name: this.subsetData[i].name})
                  } else {
                    this.number++
                    this.loginData.push({value: undefined, name: this.subsetData[i].name})
                  }
                }
              }
              let option = {
                tooltip: {
                  trigger: 'item',
//                  formatter: '{b} : {c} ({d}%)'
                  formatter: function (params) {
                    return params.name + ' : ' + params.value + ' (' + (params.percent - 0).toFixed(2) + '%)'
                  }
                },
                legend: {
                  orient: 'vertical',
                  x: 'left',
                  show: false
//                  data: ['Facebook', '其他', 'Twitter', '盈店通', '网站询盘', '手动添加']
                },
                toolbox: {
                  show: false
                },
                calculable: true,
                series: [
                  {
                    name: '',
                    type: 'pie',
                    radius: '76.8%',
                    center: ['47%', '52%'],
                    itemStyle: {
                      normal: {
                        label: {
                          // position: 'inner',
                          formatter: function (params) {
                            return (params.percent - 0).toFixed(2) + '%'
                          }
                        }
                      }
                    },
                    data: this.loginData,
//                    data: [
//                      {value: 100, name: 'Facebook'},
//                      {value: 200, name: '其他'},
//                      {value: 300, name: 'Twitter'},
//                      {value: 400, name: '盈店通'},
//                      {value: 500, name: '网站询盘'}
//                    ],
                    color: ['#5488F9', '#00B8CC', '#FB509F', '#FCA21D', '#B3D517'] // 饼图颜色
                  }
                ]
              }
              let myChart = echarts.init(document.getElementById('client-chart'))
              // 绘制图表
              myChart.setOption(option)
              if (this.loginData.length === this.number) {
                this.loginNo = true
              } else {
                this.loginNo = false
              }
            } else {
              this.noData = true
            }
          } else {
            this.noData = true
          }
        })
      },
//      子账号统计
      subsetCount (params) {
        mulAccountApi.subsetCount(params).then((res) => {
          if (!res.data.code) {
            if (params) {
              if (res.data.data.length > 0) {
                this.recentlyData = res.data.data
              } else {
                this.tableList = true
              }
            } else {
              if (res.data.data.length > 0) {
                this.subsetData = res.data.data
              } else {
                this.noSetAccount = true
              }
            }
          }
        })
      },
      /*
      * 跳转多账号列表页
      * */
      backAccountList () {
        this.$router.push({path: '/setMulAccount'})
      }
    }
  }

</script>
<style lang='less' rel="stylesheet/less" scoped>
  @import '../../../assets/style/list.less';
  @import '../../../assets/style/variable';
  .account-statistics{
    i,a{
      cursor: pointer;
    }
    width: 1200px;
    margin: 0 auto 30px;
    .back-title{
      padding: 30px 0 16px;
      line-height: 18px;
      font-size:14px;
      i{
        font-size: 18px;
        font-weight: bolder;
        vertical-align: text-top;
        color: @disabledColor;
      }
      span{
        margin-left: 6px;
        font-size: 13px;
        color: @detailTextColor;
        cursor: pointer;
      }
    }
    .sub-container{
      width:100%;
      .top{
        width:100%;
        height: 380px;
        .sub-cir{
          position: relative;
          display: inline-block;
          width:550px;
          height: 340px;
          margin-right: 16px;
          background: #fff;
          padding: 20px;
          box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
          border-radius: 4px;
          .l-nodata{
            position: absolute;
            top: 80px;
            left:190px;
            width:210px;
            height: 210px;
            border-radius: 50%;
            background: #EAF0F6;
            color: #7C98B6;
            font-size: 18px;
            margin: 0 auto;
            span{
              position: absolute;
              top:45%;
              left:32%;
            }
          }
          .no-list{
            img{
              margin-top: 100px;
              margin-left: 227px;
            }
            p{
              margin-top: 10px;
              text-align: center;
            }
          }
          .title{
            width: 100%;
            height: 25px;
            line-height: 25px;
            .name{
              font-weight: bold;
              font-size: 18px;
              color: #33475B;
            }
            .change{
              float: right;
              font-size: 13px;
              color: #7C98B6;
              span{
                margin-left: 20px;
                cursor: pointer;
                &:hover{
                  color: #5488F9;
                }
              }
              .active{
                color: #5488F9;
                border-bottom: 2px solid #5488F9;
              }
            }
          }
          .static-wraper{
            position: relative;
            width:100%;
            height: 325px;
            .client-chart{
              /*top:40px;*/
              width:100%;
              height: 295px;
            }
            .forbid-legend{
              .client-legend{
                text-align: center;
                margin: 0 auto;
                /*position: absolute;*/
                /*bottom:124px;*/
                /*left: 186px;*/
                span{
                  i{
                    display: inline-block;
                    width:8px;
                    height: 8px;
                    margin-right: 5px;
                    border-radius: 2px;
                  }
                  .i0{
                    background: #5488F9;
                  }
                  .i1{
                    background: #00B8CC;;
                  }
                  .i2{
                    background: #FB509F;
                  }
                  .i3{
                    background: #FCA21D;
                  }
                  .i4{
                    background: #B3D517;
                  }
                  margin-right: 10px;
                }
              }
            }
          }
        }
        .sub-table{
          display: inline-block;
          height: 100%;
          width:590px;
          background: #fff;
          box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
          border-radius: 4px;
          vertical-align: top;
          .no-table{
            img{
              margin-top: 130px;
              margin-left: 247px;
            }
            p{
              margin-top: 10px;
              text-align: center;
            }
          }
          .title{
            height: 62px;
            line-height: 62px;
            font-weight: bold;
            font-size: 18px;
            color: #33475B;
            padding-left: 20px;
          }
          .list-header{
            height: 36px;
            .table-title{
              float: left;
              height: 34px;
              line-height: 34px;
              font-size: 13px;
              color: #7C98B6;
              letter-spacing: 0;
              background: #F5F8FA;
              border-top: 1px solid #EAF0F6;
              border-bottom: 1px solid #EAF0F6;
            }
            .name{
              width: 446px;
              padding-left: 20px;
            }
            .time{
              width:124px;
            }
          }
          .list-body{
            .table-val{
              float: left;
              height: 45px;
              line-height: 45px;
              border-bottom: 1px solid #EAF0F6;
            }
            .name-val{
              width:446px;
              padding-left: 20px;
              p{
                display: inline-block;
              }
              img{
                width: 32px;
                height: 32px;
                overflow: hidden;
                border-radius: 50%;
                margin-top: 6px;
                margin-right: 5px;
              }
              .person-name{
                font-size: 13px;
                color: #33475B;
                margin-right: 5px;
                position: relative;
                top:-9px;
              }
              .mail-address{
                font-size: 13px;
                color: #7C98B6;
                position: relative;
                top:-9px;
              }
            }
            .time-val{
              width:124px;
            }
          }
        }
      }
      .sub-card{
        margin-top: 16px;
        .card-info{
          float: left;
          width:200px;
          height: 120px;
          padding: 20px 10px;
          background: #fff;
          box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
          border-radius: 4px;
          margin-right: 25px;
          .img{
            display: inline-block;
            width:40px;
            height: 40px;
            overflow: hidden;
            border-radius: 50%;
            position: absolute;
            img{
              width: 40px;
              height: 40px;
            }
          }
          .person-info{
            display: inline-block;
            width:150px;
            height: 37px;
            padding-left: 48px;
            font-size: 13px;
            padding-top: 3px;
            .name{
              width: 100%;
              color: #33475B;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .mail{
              width:100%;
              margin-top: 10px;
              color: #7C98B6;
              height: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .person-bottom{
            width:184px;
            height: 36px;
            margin-top: 20px;
            padding: 12px 8px;
            background: #F5F8FA;
            .bottom-key{
              .b-key{
                float: left;
                font-size: 13px;
                color: #7C98B6;
              }
              .login{
                margin-right: 38px;
              }
              .tie{
                margin-right: 38px;
              }
            }
            .bottom-val{
              .b-val{
                float: left;
                margin-top: 12px;
                font-size: 13px;
                color: #33475B;
              }
              .login-val{
                width:64px;
              }
              .tie-val{
                width:64px;
              }
              .product-val{
                width:52px;
              }
            }
          }
        }
      }
      .sub-card .card-info:last-child{
        margin-right: 0;
      }
    }
  }
</style>
