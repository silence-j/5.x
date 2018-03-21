<template>
  <div>
    <twitterAtMe
    v-if="data.socialContent.source===3&&(data.socialContent.bindingAccount === data.socialContent.receiverId)"
    :data="data"></twitterAtMe>
    <twitterMeAtOther
    v-if="data.socialContent.source===3&&(data.socialContent.bindingAccount === data.socialContent.senderId)&&(data.socialContent.senderId!==data.socialContent.receiverId)"
    :data="data"></twitterMeAtOther>
    <twitterChatMe
    v-if="data.socialContent.source===4&&(data.socialContent.bindingAccount === data.socialContent.receiverId)"
    :data="data"></twitterChatMe>
    <twitterMeChatOther
    v-if="data.socialContent.source===4&&(data.socialContent.bindingAccount === data.socialContent.senderId)"
    :data="data"></twitterMeChatOther>
    <facebookChatMeItem
    v-if="data.socialContent.actionType===2&&(data.socialContent.source===1||data.socialContent.source===2)"
    :data="data"></facebookChatMeItem>
  </div>
</template>
<script>
// Twitter上@我
// const twitterAtMe = r => require.ensure([], () => r(require('./twitterAtMe')), 'twitterAtMe')
// Twitter我@别人
// const twitterMeAtOther = r => require.ensure([], () => r(require('./twitterMeAtOther')), 'twitterMeAtOther')
// Twitter他人私信给我
// const twitterChatMe = r => require.ensure([], () => r(require('./twitterChatMe')), 'twitterChatMe')
// Twitter我私信他人
// const twitterMeChatOther = r => require.ensure([], () => r(require('./twitterMeChatOther')), 'twitterMeChatOther')
// facebook别人私信我
// const facebookChatMeItem = r => require.ensure([], () => r(require('./facebookChatMeItem')), 'facebookChatMeItem')
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
    twitterAtMe: () => import('./twitterAtMe'),
    twitterMeChatOther: () => import('./twitterMeChatOther'),
    twitterMeAtOther: () => import('./twitterMeAtOther'),
    twitterChatMe: () => import('./twitterChatMe'),
    facebookChatMeItem: () => import('./facebookChatMeItem')
  },
  methods: {

  }
}
</script>

