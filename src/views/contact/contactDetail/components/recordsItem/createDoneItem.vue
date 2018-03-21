<template>
  <div class="timeline-wrapper">
    <span class="type-icon">
      <span class="icon-font">&#xe637;</span>
    </span>
    <div class="timeline-container">
      <div class="header">
        <img class="avatar" v-if="contactType===0" :src="contactInfo.avatar ||'/static/img/default_avatar.jpg'"  onerror="javascript:this.src='/static/img/default_avatar.jpg'">
        <img class="avatar" v-else :src="contactInfo.avatar ||'/static/img/default_comp.png'"  onerror="javascript:this.src='/static/img/default_comp.png'">
        <span class="title-date" v-if="">
          <div class="title">
            {{contactInfo.name}}
            <span class="text-light" v-if="data.socialContent.createSource">通过</span>
            {{data.socialContent.createSource}}
            <span class="text-light">被创建</span>
          </div>
          <div class="date">{{data.socialContent.createTime|time-formater-has-hour}}</div>
        </span>
      </div>
      <div class="content">
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
