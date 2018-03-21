<template>
  <div class="timeline-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe637;</span>
    </span>
    <div class="timeline-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="avatar || '/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="avatar|| '/static/img/default_comp.png'" onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date">
          <div class="title">
            {{operName}}
            <span class="text-light">修改了</span>
            {{data.socialContent.contactName}}
            <span class="text-light">详情</span>
          </div>
          <div class="date">{{data.socialContent.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
// import contactInfoApi from '@/api/contactInfoApi'
export default {
  name: '',
  data () {
    return {
      contactType: 0,
      avatar: '',
      operName: ''
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  mounted () {
    this.contactType = +this.$route.query.contactType
    this.getOperName()
  },
  computed: {
  },
  components: {
  },
  methods: {
    getOperName () {
      let operId = this.data.socialContent.operUserId
      let info = this.data.userInfoMap[operId]
      if (info) {
        this.operName = info.name
        this.avatar = info.avatar
      } else {
        this.operName = operId
      }
    }
  }
}
</script>

