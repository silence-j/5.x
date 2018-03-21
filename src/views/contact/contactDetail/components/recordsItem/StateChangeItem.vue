<template>
  <div class="timeline-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe633;</span>
    </span>
    <div class="timeline-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||data.linkAvatar" :onerror="'javascript:this.src='+data.linkAvatar">
        <img class="avatar" v-else :src="contactInfo.avatar ||data.compAvatar" :onerror="'javascript:this.src='+data.compAvatar">
        <span class="title-date">
          <div class="title">
            {{data.socialContent.contactName}}
            <span class="text-light">状态更改为</span>
            {{stageMap[data.socialContent.status]}}
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
    if (!this.$store.getters.stageList.length) {
      this.$store.dispatch('getStageList')
    }
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
    stageMap () {
      return this.$store.getters.stageMap
    }
  },
  components: {
    ShowMore
  },
  methods: {
    // setStageMap (val) {
    //   return this.stageMap[val]
    // }
  },
  filters: {
  }
}
</script>

