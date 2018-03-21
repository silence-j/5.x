<template>
  <div class="contact-tags">
    <el-collapse accordion :value="selectName">
      <el-collapse-item title="标签" name="contactTag">
        <div class="loading loading-circle" v-if="tagLoading"></div>
        <div v-else>
          <div class="op title">
            <span class="editor icon-font icon-edit" style="font-size: 16px;" @click="closable=true" v-show="contactTags.length"></span>
          </div>
          <div class="tag-container">
            <p v-show="!contactTags.length&&!closable">暂无标签</p>
            <el-tag
              @close="deleteTag(i, tag.tag)"
              v-show="i < maxLen"
              :closable="closable"
              type="primary"
              class="tag"
              v-for="(tag,i) in contactTags"
              :title="tag.tag"
              key="contactTags">
              {{tag.tag|tagFilter}}
            </el-tag>
          </div>
          <div class="btn" v-show="!closable">
            <el-button type="default" class="more gray-btn" @click="maxLen=contactTags.length" v-show="contactTags.length > maxLen">
              查看全部
            </el-button>
            <el-button type="default" class="more gray-btn" @click="closable=true" v-show="!contactTags.length">
              添加标签
            </el-button>
          </div>
          <div class="tag-editor-btn" v-show="closable">
            <el-input v-model.trim="tagText" placeholder="多个标签用“;”隔开"></el-input>
            <el-button class="tag-btn" :disabled="tagText.trim()===''||tagBtn" type="primary" @click="addTags">保存</el-button>
            <el-button type="text" class="tag-btn" @click="closable=false">取消</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import contactInfoApi from '../../../../../src/api/contactInfoApi'
  export default{
    data () {
      return {
        maxLen: 4,
        tagText: '',
        closable: false,
        selectName: 'contactTag',
        tagBtn: false
      }
    },
    watch: {
      tagText () {
        if (this.tagText) {
          this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: false})
        }
      }
    },
    methods: {
      deleteTag (i, tagName) {
        if (parseInt(this.$route.query.contactType)) {
          contactInfoApi.deleteCompanyTag({
            contactsId: this.$route.query.contactId,
            tagNames: tagName,
            contactsType: 1
          }).then(res => {
            if (!res.data.code) {
              this.$message.success('删除标签成功')
              this.contactTags.splice(i, 1)
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          contactInfoApi.deletePersonTags({
            contactId: this.$route.query.contactId,
            tagNames: tagName
          }).then(res => {
            if (!res.data.code) {
              this.$message.success('删除标签成功')
              this.contactTags.splice(i, 1)
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      addTags () {
        if (this.tagText === '') {
          this.$message.error('请输入标签内容！')
        } else {
          this.tagBtn = true
          let tags = this.tagText.split(';')
          let newTags = []
          tags.forEach((tag) => {
            if (tag.trim() !== '') {
              newTags.push(tag)
            }
          })
          if (parseInt(this.$route.query.contactType)) {
            contactInfoApi.companyTagAdd({
              contactsList: this.$route.query.contactId,
              tagList: newTags.join(';')
            }).then(res => {
              if (!res.data.code) {
                this.closable = false
                this.$message.success('添加标签成功')
                this.tagText = ''
                this.$store.commit('CONTACT_DETAIL_TAG_CHANGE', {tags: newTags})
                this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: true})
              } else {
                this.$message.error(res.data.message)
              }
              this.tagBtn = false
            })
          } else {
            contactInfoApi.addPersonTags({
              contactIds: this.$route.query.contactId,
              tagNames: newTags.join(';')
            }).then(res => {
              if (!res.data.code) {
                this.closable = false
                this.$message.success('添加标签成功')
                this.tagText = ''
                this.$store.commit('CONTACT_DETAIL_TAG_CHANGE', {tags: newTags})
                this.$store.commit('CONTACT_ISEDITOVER', {isEditOver: true})
              } else {
                this.$message.error(res.data.message)
              }
              this.tagBtn = false
            })
          }
        }
      }
    },
    computed: {
      contactTags () {
        return this.$store.getters.contactTags
      },
      tagLoading () {
        return this.$store.getters.tagLoading
      }
    },
    filters: {
      tagFilter (value) {
        if (value.length > 10) {
          return value.substring(0, 9) + '...'
        } else {
          return value
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .contact-tags{
    .op{
      position: absolute;
      top: 8px;
      right: 0;
    }
    .el-collapse{
      border: none;
      position: relative;
      .el-collapse-item__header{
        border: none;
        font-size: 18px;
        font-weight: bold;
        padding: 0;
        i{
          font-size: 16px;
          color: #02AAAA;
        }
      }
      .el-collapse-item__wrap{
        border: none;
        background: #fff;
        .el-collapse-item__content{
          background: #fff;
          padding: 0;
        }
      }
    }
    .loading{
      margin: 30px auto;
    }

  }
</style>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../../../assets/style/variable";
  // @import "../../../../assets/style/base";
  .contact-tags{
    width: 350px;
    padding: 9px 20px 30px;
    background: @white;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px #DFE3EB;
    .title{
      i{
        color: @textareaBorder;
        margin-right: 5px;
      }
      span{
        font-size: 18px;
        font-weight: bold;
      }
      .editor{
        font-weight: normal;
        float: right;
        color: #B0C1D4;
        cursor: pointer;
        &:hover{
          color: @textareaBorder;
        }
      }
    }
    .tag-container{
      margin-top: 20px;
      p{
        text-align: center;
        line-height: 30px;
      }
      .tag{
        border: none;
        padding: 0 10px;
        line-height: 28px;
        margin-right: 10px;
        color: #4F6D95;
        height: 28px;
        margin-bottom: 10px;
      }
    }
    .btn, .tag-editor-btn{
      width: 100%;
      text-align: center;
      margin-top: 20px;
      .tag-btn{
        margin-top: 20px;
        padding: 10px 30px;
      }
    }
    .tag-editor-btn{
      text-align: left;
    }
  }
</style>
