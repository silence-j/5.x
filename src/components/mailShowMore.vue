<template>
  <span class="describe">
    <span v-html="filterStr()"></span>
    <a class="showmore" @click="showMore($event)" v-text="showMoreText" v-if="isShowMore"></a>
  </span>
</template>
<script>
  export default{
    data () {
      return {
        isFilter: true,
        that: this,
        isShowMore: false,
        showMoreText: '展开'
      }
    },
    props: {
      text: String,
      type: {
        type: Number,
        default: -1
      },
      len: Number
    },
    methods: {
      replaceReg (reg, str) {
        return str.replace(reg, function (m) {
          return '<a href="' + m + '" target="_blank">' + m + '</a>'
        })
      },
      filterStr () {
        let returnText = ''
        if (this.text === null) {
          return ''
        } else {
          returnText = this.text
//           let strRegex = '((https|http)://)[A-Za-z0-9.-_]+\\.[A-Za-z0-9-_%&?/.=]+'
// //            let strRegex = '((https|http)://)[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+'
//           let regex = new RegExp(strRegex, 'gi')
//           returnText = this.replaceReg(regex, returnText)
        }
        if (this.text.length > this.len && this.isFilter) {
          this.isShowMore = true
          return returnText.substring(0, this.len) + '...'
        } else {
          return returnText
        }
      },
      showMore (event) {
        event.stopPropagation()
        if (this.showMoreText === '展开') {
          this.isFilter = false
          this.showMoreText = '收起'
        } else {
          this.isFilter = true
          this.showMoreText = '展开'
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  @import "../assets/style/variable";
  .describe{
    line-height: 1.5;
    .showmore{
      display: inline-block;
      color: @link;
      text-decoration: underline;
      cursor: pointer;
      margin-top: 16px;
    }
    img{
      max-width:100%;
      height: auto;
    }
    span{
      a{
        text-decoration: none;
      }
      i{
        font-style: italic;
      }
      h1{
        font-size: 2em;
      }
      h2{
        font-size: 1.5em;
      }
      h3{
        font-size: 1.17em;
      }
      h4{
        font-size: 1em;
      }
      h5{
        font-size: 0.83em;
      }
      h6{
        font-size: 0.67em;
      }
      i{
        font-style: italic;
      }
      ol{
        padding-left: 20px;
        li{
          list-style: decimal;
        }
      }
      ul{
        padding-left: 20px;
        li{
          list-style: disc;
        }
      } 
    }
  }
</style>
