<template>
  <div>
    <sendEmailItem
    v-if="data.socialContent.emailType==1"
    :data="data"></sendEmailItem>
    <reciveEmailItem
    v-if="data.socialContent.emailType==0"
    :data="data"></reciveEmailItem>
  </div>
</template>
<script>
// 当socialType是1的时候，就是邮件模块,再根据emialType判断是收信还是发信
// 发送邮件给联系人item
import sendEmailItem from './sendEmailItem'
// 收到联系人邮件item
import reciveEmailItem from './reciveEmailItem'
export default {
  name: '',
  data () {
    return {}
  },
  mounted () {

  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {

  },
  components: {
    sendEmailItem,
    reciveEmailItem
  },
  methods: {

  }
}
</script>

