<template>
  <div class="timeline-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe637;</span>
    </span>
    <div class="timeline-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="avatar || '/static/img/default_avatar.jpg'" onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="avatar || '/static/img/default_comp.png'">
        <span class="title-date" onerror="javascript:this.src='/static/img/default_comp.png'">
          <div class="title">
            {{operName}}
            <!-- assignedUserId -->
            <span class="text-light">将{{contactType===0?'联系人':'公司'}}</span>
            {{data.socialContent.contactName}}
            <span class="text-light">分配给了</span>
            {{assignName}}
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
      operName: '',
      assignName: '',
      avatar: ''
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  created () {

  },
  mounted () {
    this.contactType = +this.$route.query.contactType
    this.getOperName()
  },
  computed: {
    contactInfo () {
      return this.$store.getters.desc
    }
  },
  components: {
  },
  methods: {
    getOperName () {
      let cont = this.data.socialContent
      let info = this.data.userInfoMap[cont.operUserId]
      if (info) {
        this.operName = info.name
        this.avatar = info.avatar
      } else {
        this.operName = cont.operUserId
      }
      let info2 = this.data.userInfoMap[cont.assignedUserId]
      if (info2) {
        this.assignName = info2.name
      } else {
        this.assignName = cont.assignedUserId
      }
    }
  }
}
</script>
