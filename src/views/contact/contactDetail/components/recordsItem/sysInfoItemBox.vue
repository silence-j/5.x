<template>
  <div>
    <modifyItem
    v-if="data.socialContent.isUpdate"
    :data="data"></modifyItem>
    <createDoneItem
    v-else-if="!data.socialContent.commercialOpportunityFlag"
    :data="data"></createDoneItem>
    <enquiryCreateItem
    v-else-if="data.socialContent.commercialOpportunityFlag"
    :data="data"></enquiryCreateItem>
  </div>
</template>
<script>
import createDoneItem from './CreateDoneItem'
import enquiryCreateItem from './enquiryCreateItem'
import modifyItem from './modifyItem'
export default {
  name: '',
  data () {
    return {}
  },
  props: {
    data: {
      type: Object
    }
  },
  mounted () {

  },
  computed: {

  },
  components: {
    createDoneItem,
    enquiryCreateItem,
    modifyItem
  },
  methods: {

  }
}
</script>
