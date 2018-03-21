<template>
  <div class="contact-info-add-wrapper" v-if="data.contactType==1">
    <span class="type-icon">
      <span class="icon-font">&#xe637;</span>
    </span>
    <div class="contact-info-add-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{updataStr}}
            <span style="color: #5488F9;font-weight: 500">——有更新数据</span>
          </div>
          <div class="date">{{data.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
        <ShowMore :maxHeight="0" showTip="查看详情" hidTip="隐藏">
          <div class="info-content">
            <table>
              <tr class="update-tr first-title">
                <td class="update-td"></td>
                <td class="update-td">原内容</td>
                <td class="update-td">更新内容</td>
              </tr>
            </table>
            <table>
              <tr class="update-tr" v-for="(value,key) in data.socialContent.originData" :key="key">
                <td class="update-td">{{i18List[key]}}</td>
                <td class="update-td">{{value ? value : '-'}}</td>
                <td class="update-td">{{data.socialContent.newData[key] ? data.socialContent.newData[key] : '-'}}</td>
              </tr>
            </table>
          </div>
        </ShowMore>
      </div>
    </div>
  </div>
</template>
<script>
import ShowMore from '@/components/newShowMore.vue'
export default {
  name: '',
  data () {
    return {
      contactType: 0,
      i18List: {
        'avatar': '头像',
        'name': '名称',
        'url': '公司主页',
        'telephone': '电话',
        'mail': '邮箱',
        'industry': '行业',
        'companySize': '员工数量',
        'mainProduct': '主要产品',
        'synopsis': '公司简介',
        'country': '国家',
        'state': '地区',
        'city': '城市',
        'address': 'Street Address',
        'postcode': '邮编',
        'facebookUrl': 'Facebook主页',
        'twitterUrl': 'Twitter主页',
        'linkedinUrl': 'Linkedin主页'
      }
    }
  },
  mounted () {
    this.contactType = parseInt(this.$route.query.contactType)
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    contactBase () {
      return this.$store.getters.contactDetail.base
    },
    contactInfo () {
      return this.$store.getters.desc
    },
    updataStr () {
      let desc = this.data.socialContent.toUpdateFields
      desc = desc.substring(0, desc.length - 1)
      let list = desc.split('，')
      return list.join('、')
    }
  },
  components: {
    ShowMore
  },
  methods: {
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .contact-info-add-wrapper{
    position: relative;
    margin-bottom: 50px;
    .type-icon{
      position: absolute;
      top: 10px;
      left: -15px;
      display: inline-block;
      text-align: center;
      line-height: 30px;
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #86abfa;
      box-shadow: 0 2px 6px rgba(84, 136, 249, 0.5);
    }
    .contact-info-add-container{
      position: relative;
      margin-left: 40px;
      background: #fff;
      padding: 21px 20px 20px 20px;
      border-radius: 4px;
      .header{
        position: relative;
        width: 100%;
        height: 59px;
        padding-bottom: 8px;
        font-size: 0;
        border-bottom: 1px solid #eaf0f6;
        .avatar{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 7px;
          vertical-align: top;
        }
        .title-date{
          display: inline-block;
          width: calc(~"100% - 50px");
          vertical-align: top;
          .title{
            line-height: 20px;
            font-size: 13px;
            color: #33475b;
            font-weight: 600;
            margin-bottom: 5px;
            word-break: break-all;
          }
          .date{
            font-size: 13px;
            color: #7c98b6;
          }
        }
      }
      .content{
        .info-content{
          border: 1px solid #EAF0F6;
          margin-top:20px;
          overflow: hidden;
          .first-title.update-tr{
            background: #F5F8FA;
            .update-td:nth-child(1){
              color: #33475B;
            }
            .update-td:nth-child(2){
              color: #33475B;
            }
            .update-td:nth-child(3){
               color: #33475B;
            }
          }
          .update-tr{
            border-top: 1px solid #EAF0F6;
            border-bottom:none;
            text-align: center;
            padding:0;
            .update-td{
              padding:11px 10px;
              border-left: 1px solid #EAF0F6;
              word-break: break-all;
              float: initial;
            }
            .update-td:nth-child(1){
              border-left:none;
              width:22.65%;
              font-size: 13px;
              line-height: 18px;
              color: #33475B;
            }
            .update-td:nth-child(2){
              width:38.7%;
              font-size: 13px;
              color: #7C98B6;
              line-height: 18px;
            }
            .update-td:nth-child(3){
              width:36%;
              font-size: 13px;
              color: #33475B;
              line-height: 18px;
            }
          }
          .update-tr:first-child{
            border-top:none;
          }
        }
      }
    }
  }
</style>
