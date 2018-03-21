<template>
  <div class="detial-show">
    <div class="loading-show" v-if="showOff">
      <div class="detial-title">
        <div class="loading-img"></div>
        <div class="loading-desc">
          <p></p>
          <p></p>
        </div>
        <div class="loading-count">
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="loading-body">
        <ul>
          <li>
            <span class="iconDes"></span>
            <span class="open"></span>
          </li>
        </ul>
        <ul>
          <li>
            <span class="iconDes"></span>
            <span class="open"></span>
          </li>
        </ul>
        <ul>
          <li>
            <span class="iconDes"></span>
            <span class="open"></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="detial-title" v-if="!showOff">
      <i class="el-icon-close" @click="closeDetail"></i>
      <img :src="detail.receiver.avatar || '/static/img/default.png'" alt="">
      <!--<img :src="'/static/img/default.png'" alt="">-->
      <p class="detail-name">{{detail.receiver.firstname}}{{detail.receiver.lastname}}</p>
      <p class="detail-contact">
        <span>{{detail.receiver.address}}</span>
        <span class="count-num">
          <em>阅读次数: <span>{{detail.receiver.readCount}}</span></em>
          <em>点击次数: <span>{{detail.receiver.hitCount}}</span></em>
        </span>
      </p>
    </div>
    <ul class="read-count" v-if="!showOff">
      <!--新改-->
      <li v-for="item in detail.logs">
        <span v-if="item.fromDevice === 'TABLET' || item.fromDevice === 'COMPUTER' || item.fromDevice === 'MOBILE'">
          <span class="records-read" v-if="item.fromDevice === 'TABLET'"><i class="icon-font icons ipad">&#xe610;</i></span>
          <span class="records-read" v-if="item.fromDevice === 'COMPUTER'"><i class="icon-font icons mac">&#xe611;</i></span>
          <span class="records-read" v-if="item.fromDevice === 'MOBILE'"><i class="icon-font icons ipone">&#xe60f;</i></span>
        </span>
        <span class="records-read" v-else="item.fromDevice === 'COMPUTER'"><i class="icon-font icons mac">&#xe611;</i></span>
        <div class="detail-desc">
          <span class="left-arr"></span>
          <span v-if="item.status === 2">点击邮件</span>
          <span v-if="item.status === 1">打开邮件</span>
          <span v-if="item.status === 0">邮件送达</span>
          <span class="time">{{item.createTime | time-formater-no-second}}</span>
        </div>
      </li>
    </ul>
    <div style="height: 100px"></div>
  </div>

</template>
<script>
  export default{
    props: {
      showOff: Boolean,
      detail: {
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
    },
    data () {
      return {
//        showDetialInfo: false
      }
    },
    mounted () {
    },
    methods: {
      closeDetail () {
        this.$emit('closeCount')
      },
      showOffIt () {
        console.log('LLLLLLL')
        console.log('LLLLLLL')
        console.log('LLLLLLL')
        console.log('LLLLLLL')
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .detial-show{
    position: absolute;
    right: 0;
    top:0;
    width:552px;
    min-height: 873px;
    background: #fff;
    margin-bottom: 20px;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.08);
    border-radius: 4px;
    .detial-title{
      padding: 60px 20px 16px;
      width:512px;
      height: 50px;
      position: relative;
      border-bottom: 1px solid #EAF0F6;
      .loading-img{
        display: inline-block;
        width:50px;
        height: 50px;
        background: #F5F8FA;
      }
      .loading-desc{
        height: 50px;
        display: inline-block;
        margin-left: 10px;
        p{
          width:150px;
          height: 20px;
          background: #F5F8FA;
        }
        p:first-child{
          margin-bottom: 10px;
        }
      }
      .loading-count{
        float: right;
        margin-top: 35px;
        span{
          display: inline-block;
          width:75px;
          height: 15px;
          float: left;
          margin-left: 20px;
          background: #F5F8FA;
        }
      }
      .el-icon-close{
        position: absolute;
        right: 25px;
        top:20px;
        color:#7C98B6;
        font-size: 18px;
      }
      img{
        display: inline-block;
        width:50px;
        height: 50px;
        border-radius: 50%;
        background: pink;
        position: absolute;
      }
      p{
        padding-left: 58px;
      }
      .detail-name{
        font-size: 18px;
        color: #33475B;
      }
      .detail-contact{
        color: #7C98B6;
        margin-top: 15px;
        span:first-child{
          font-size: 13px;

        }
        .count-num{
          float: right;
          em{
            font-size: 12px;
          }
          em:first-child{
            margin-right: 20px;
          }
          span{
            font-size: 18px;
            color: #33475B;
          }
        }

      }

    }
    .loading-body{
      ul{
        li{
          margin-top: 50px;
          margin-left: 30px;
          .iconDes{
            display: inline-block;
            width:30px;
            height: 30px;
            background: #F5F8FA;
          }
          .open{
            display: inline-block;
            width:235px;
            height: 40px;
            margin-left: 20px;
            background: #F5F8FA;
          }
        }
      }

    }
    .read-count{
      margin-left: 45px;
      border-left: 1px solid #B0C1D4;
      li{
        display: block;
        position: relative;
        padding-top: 60px;
        .records-read{
          display: inline-block;
          position: absolute;
          left: -15px;
          bottom: -28px;
          width:30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 50%;
          background: #86abfa;
          box-shadow: 0 2px 6px 0 rgba(84,136,249,0.50);
          .icons{
            color: #fff;
            font-size: 14px;
          }
        }
        .detail-desc{
          width:210px;
          height: 16px;
          padding: 12px;
          position: relative;
          bottom: -35px;
          left: 30px;
          background: #FFFFFF;
          border: 1px solid #CBD6E3;
          border-radius: 4px;
          .left-arr{
            width: 10px;
            height: 10px;
            position: absolute;
            display: block;
            z-index: 1;
            -webkit-transform: rotate(45deg) skew(0deg);
            transform: rotate(45deg) skew(0deg);
            background-color: #fff;
            position: absolute;
            top: 14px;
            left: -7px;
            border-bottom: 1px solid #CBD6E3;
            border-left: 1px solid #CBD6E3;
          }
          .time{
            float: right;
          }
        }
      }
    }

  }

</style>
