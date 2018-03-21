<template>
    <ul class="email-left-menu">
      <li v-for="(menu,index) in menuList" @click="chooseMenu(menu,index)" :class="activeMenu == index?'active':''">
        <!-- <el-tooltip effect="dark" :content="menu.label" placement="right" v-if="!expansion">
          <i :class="menu.class" class="icon-font"></i>
        </el-tooltip>
        <i :class="menu.class" class="icon-font" v-else></i> -->
        <span v-if="expansion">{{ menu.label }}</span>
      </li>
      <!-- <i class="icon-zhankaishouqi menu-shrink" @click="expansionFunc" v-if="expansion"></i>
      <i class="icon-right-arrow menu-shrink" @click="expansionFunc" v-else></i> -->
    </ul>
</template>

<script>
  export default{
    name: 'extension',
    data () {
      return {
        maxLength: 280,
        menuList: [{
          class: 'icon-all',
          label: '全部'
        },
        {
          class: 'icon-sended',
          label: '已发送'
        },
        {
          class: 'icon-planing',
          label: '计划中'
        },
        {
          class: 'icon-draft',
          label: '草稿箱'
        }],
        activeMenu: 0,
        expansion: true
      }
    },
    computed: {
    },
    watch: {
    },
    mounted () {
    },
    methods: {
      /**
       * 菜单选择
       */
      chooseMenu (menu, index) {
        this.activeMenu = index
        this.$emit('statusChange', this.activeMenu)
      },
      /**
       * 菜单展开或者关闭
       */
      expansionFunc () {
        if (this.expansion) {
          this.expansion = false
          document.getElementsByClassName('email-left-menu')[0].style.width = '38px'
        } else {
          this.expansion = true
          document.getElementsByClassName('email-left-menu')[0].style.width = '208px'
        }
        this.$emit('spreadSure', this.expansion)
      }
    },
    components: {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  div.el-tooltip__popper.is-dark{
    .popper__arrow::after{
        border-top-color: transparent;
    }
  }
</style>
