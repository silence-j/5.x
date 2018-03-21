<template>
  <div class="system-module">
    <headLeft></headLeft>
    <div class="right-content">
      <div class="u-right">
        <div class="systemsetting">
            <span>
              公司名称{{ companyInfo.shop.shopName }}
            </span>
          <span>设置</span>
        </div>
        <div class="systemsetting">
            <span>
              域名
            </span>
          <span>设置</span>
        </div>
        <div class="systemsetting">
            <span>
              公司地址{{ contactInfo.provinceName }}{{ contactInfo.cityName }}{{ contactInfo.address }}
            </span>
          <span>设置</span>
        </div>
        <div class="systemsetting">
            <span>
              公司联系人{{ contactInfo.contactName }}
            </span>
          <span>设置</span>
        </div>
        <div class="systemsetting">
            <span>
              公司联系电话
            </span>
          <span>设置</span>
        </div>
        <div class="systemsetting">
            <span>
              公司手机{{ contactInfo.contactPhone }}
            </span>
          <span>设置</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import systemSettingAPI from '@/api/systemSettingAPI'
import headLeft from './systemIndex'
export default {
  name: 'setCompany',
  data () {
    return {
      companyInfo: {
        shop: {}
      },
      contactInfo: {}
    }
  },
  components: {
    headLeft,
    systemSettingAPI
  },
  methods: {
  },
  created () {
    systemSettingAPI.selectCompanyDetails().then(res => {
      this.companyInfo = res.data.data
    })
    systemSettingAPI.selectContactInfo().then(res => {
      this.contactInfo = res.data.data
      console.log(this.contactInfo)
    })
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../assets/style/list.less';
</style>
