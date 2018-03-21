<template>
  <div class="merage-contact-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe630;</span>
    </span>
    <div class="merage-contact-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{data.socialContent.newName}}
            <span style="color: #7C98B6;font-weight: 500">与</span>
            {{data.socialContent.oldName}}（{{data.socialContent.oldEmail}}）
            <span style="color: #7C98B6;font-weight: 500">合并</span>
          </div>
          <div class="date">{{data.socialContent.createTime|time-formater-has-hour}}</div>
        </span>
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
      contactType: 0
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
  .merage-contact-wrapper{
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
    .merage-contact-container{
      position: relative;
      margin-left: 40px;
      background: #fff;
      padding: 21px 20px 20px 20px;
      border-radius: 4px;
      .header{
        position: relative;
        width: 100%;
        font-size: 0;
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
    }
  }
</style>
