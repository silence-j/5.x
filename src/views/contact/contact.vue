<template>
  <div class="logistic-container person-list" v-loading.fullscreen="fullscreenLoading">
    <div class="filter-contact">
      <div class="left">
        <span :class="filterType === -1 ? 'active': ''" @click="changeFilter(-1)">全部</span>
        <span class="down-line">|</span>
        <span :class="filterType === 1 ? 'active': ''" @click="changeFilter(1)">重要{{text}}</span>
      </div>
      <div class="operate-container">
        <span class="tags-btn" @click="showTags=showTags?false:true">
          <i class="icon-font icon-menu"></i>
          {{showTags?'隐藏标签':'显示标签'}}
          <div class="arrow-up1 arrow" v-if="showTags"></div>
          <div class="arrow-up2 arrow" v-if="showTags"></div>
        </span>
        <<!-- el-input :placeholder="placeholdDisplay(text)" v-model.trim="searchText" @keyup.enter.native="search" class="search-two">
          <el-button slot="append" icon="search" @click="search" class="contact-list-search"></el-button>
        </el-input> -->
        <el-input
          class="search-two"
          :placeholder="placeholdDisplay(text)"
          icon="search"
          v-model.trim="searchText"
          @keyup.enter.native="search"
          :on-icon-click="search">
        </el-input>
        <el-select v-model="searchStep" class="short-select" placeholder="全部阶段" @change="search">
          <el-option label="全部阶段" value=""></el-option>
          <el-option
            v-for="item in stageList"
            :key="item.dictItemCode"
            :label="item.dictItemName"
            :value="item.dictItemCode"></el-option>
        </el-select>
        <el-select v-model="searchGroup" v-if="!type" placeholder="全部分组" @change="search">
          <el-option label="全部分组" value=""></el-option>
          <el-option
            v-for="group in groupList"
            :key="group.groupId"
            :label="group.groupName"
            :value="group.groupId">{{group.groupName}}
          </el-option>
        </el-select>
        <el-button type="default" class="btn" @click="leadJump" v-if="importRight">导入</el-button>
        <el-button type="default" class="btn" @click="exportData" v-if="outRight">导出</el-button>
        <!--<el-button type="default" class="btn" @click="groupManage" v-if="groupIsShow()">分组管理</el-button>-->
        <el-button type="primary" class="btn" @click="type? dialogAddComp= true:dialogAddPerson=true">新增</el-button>
      </div>
    </div>
    <div class="hidden-tags" v-show="showTags">
      <p v-show="!tags.length">您还未添加标签</p>
      <button
        @click="filterByTag(tag.id, i)"
        type="gray" class="tag"
        v-for="(tag,i) in tags"
        :class="tag.active?'active':''"
        :key="tags">{{tag.tag}}</button>
    </div>
    <div class="contact-table">

      <!--分组筛选start-->
      <!-- <el-dropdown @command="changeGroup" class="group_dropdownt" v-if="!loadingTable  && type === 0" menu-align="start">
           <span class="el-dropdown-link">
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
           </span>
        <el-dropdown-menu v-bind:class="{vscroll:isscroll}" slot="dropdown">
          <el-dropdown-item v-for="(item, index) in groupList" :key="item" :command="returnCommand(item.groupId)" :title="item.groupName">{{item.groupName | str10Display}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!--分组筛选end-->

      <!--联系人列表已有国家筛选start-->
      <!-- <el-dropdown @command="changeCountry" class="country_dropdownt position-one" v-if="!loadingTable && type === 0" menu-align="start">
         <span class="el-dropdown-link">
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
         </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in filterCountryList" :key="item" :command="returnCommand(item.id)" :title="item.name"><img v-if="item.nameEn!='' && item.nameEn!=null" :src="'../../../static/img/ImageFlag/'+item.nameEn+'.png'" alt="" class="filter_country_logo" />{{item.name | str4Display}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <!--联系人列表已有国家筛选end-->

      <!--公司列表已有国家筛选start-->
      <!-- <el-dropdown @command="changeCountry" class="country_dropdownt position-two" v-if="!loadingTable && type === 1" menu-align="start">
         <span class="el-dropdown-link">
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right" style="font-size:10px;"></i>
         </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in filterCountryListTwo" :key="item" :command="returnCommand(item.id)" :title="item.name"><img v-if="item.nameEn!='' && item.nameEn!=null" :src="'../../../static/img/ImageFlag/'+item.nameEn+'.png'" alt="" class="filter_country_logo" />{{item.name | str4Display}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
      <!--公司列表已有国家筛选end-->
      <div class="hidden-select" v-show="selected">
        <span class="select-table">已选中 {{selected}} 个项目</span>
        <el-popover ref="tag" v-model="addTag" popper-class="tag-pop addTag" placement="bottom-start" title="添加标签" width="183" trigger="click">
          <el-input v-model.trim="addTags" placeholder="多个标签用“;”隔开"></el-input>
          <div class="tag-btn">
            <el-button type="text" size="small" @click="addTag=false">取消</el-button>
            <el-button type="primary" size="small" @click="contactsTagAdd">确定</el-button>
          </div>
        </el-popover>
        <div class="operate">
          <span class="icon-buttons">
            <el-dropdown trigger="click" @command="major" menu-align="start">
              <span class="el-dropdown-link">
                <span>重要</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">标记为重要</el-dropdown-item>
                <el-dropdown-item command="0">取消标记为重要</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" @command="stepConfirm" menu-align="start">
              <span class="el-dropdown-link">
                <span>阶段</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in stageList" :key="item.dictItemCode" :command="item.dictItemName+'/'+item.dictItemCode">{{item.dictItemName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="icon-button" v-popover:tag>标签</span>
            <span v-if="!type && groupIsShow()" @click="contactGroupPop" class="icon-button">分组</span>
          </span>
        </div>
        <div class="operate" v-if="isMainAccount || (!type && hasMailRight)">
          <span class="icon-buttons">
            <span v-if="isMainAccount" class="icon-button" @click="dialogDistr=true">{{type?'公司':'联系人'}}分配</span>
            <span v-if="!type && hasMailRight"class="icon-button menu-after" @click="sendMail">发送营销邮件</span>
          </span>
        </div>
        <div class="operate"  v-if="delRight">
          <span class="icon-buttons">
            <!-- <span class="icon-button" @click="" v-if="outRight">导出</span> -->
            <span class="icon-button" @click="delLink">删除</span>
          </span>
        </div>
        <!-- <span class="icon-button" v-if="false" @click="dialogMerge=selection.length===2?true:false">合并</span> -->
        <!-- <i class="icon-font icon-real-start"></i>icon-label icon-merge icon-remove icon-grouping-->
      </div>
      <el-table
        ref="tableBox"
        v-if="!loadingTable"
        class="person-table"
        :class="type?'comp-table': ''"
        :data="contactList"
        @select="selectContact"
        @select-all="selectAll"
        @sort-change="sortChange"
        style="width: 100%">
        <!--
        @filter-change="doFilter"
        @header-click="sort" -->
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column :label="type?'公司名称':'姓名'" class="hello" inline-template fixed width="200">
          <div class="info-msg">
          <span>
            <img v-if="row.avatar && type === 0" :onerror="linkAvatar.error"  :src="`${row.avatar}?x-oss-process=image/resize,h_40`">
            <img v-if="row.avatar && type === 1" :onerror="compAvatar.error"  :src="`${row.avatar}?x-oss-process=image/resize,h_40`">
            <img v-if="!row.avatar && type === 0" :src="linkAvatar.pic">
            <img v-if="!row.avatar && type === 1" :src="compAvatar.pic">
            <!--公司-->
            <span class="name no-company" :class="{'canClick':selCompanyInfo==true}" v-show="row.contactsType" :title="row.name" @click="showDetail(row, 1)">{{row.name}}</span>
            <!-- <span class="autoComplete" v-show="row.contactsType && row.completionStatus==2">更新</span> -->
            <!--联系人-->
            <span
              v-show="!row.contactsType"
              :title="row.firstName+(row.lastName!=null?row.lastName:'')"
              class="name"
              :class="{'canClick':selPersonInfo==true,'no-company': !row.companyName}"
              @click="showDetail(row, 0)">
              {{row.firstName}} {{row.lastName!=null?row.lastName:''}}
            </span>
            <span class="autoComplete" v-show="!row.contactsType && row.completionStatus==1">new</span>
            <span v-show="!row.contactsType" :title="row.companyName" class="companyName" :class="{'canClick':selCompanyInfo==true}" @click="showDetail(row, 1)" :style="row.companyId && (row.companyBelongtoCurrentUser || isMainAccount)?'color:#5488F9;':'cursor: auto;'">{{row.companyName}}</span>
          </span>
          </div>
        </el-table-column>
        <el-table-column label="最新动态" v-if="!type" inline-template width="174">
          <div class="info-msg info-nopic" v-if="row.latestActionTimeLine">
            <span class="name" :class="row.latestActionTimeLine.readFlag === 0 ? 'textBold cell-tips' : 'cell-tips'" :title="returnDynamics(row).title" v-html="returnDynamics(row).html" >
            </span>
            <span class="companyName" v-if="!row.latestActionTime">—</span>
            <span :title="row.latestActionTime | time-formater-no-second" class="companyName" v-else>{{row.latestActionTime | time-formater-no-second}}</span>
          </div>
        </el-table-column>
        <el-table-column label="联系方式" width="168" inline-template>
        <span class="socialAccounts cell-tips">
          <a target="_blank" v-if="row.mail"><i class="icon-font icon-message icon-blue"></i></a>
          <a v-if="!row.mail"><i class="icon-font icon-message icon-gray"></i></a>
          <a target="_blank" v-if="row.fbUrl" :href="getHomePageUrl(row.fbUrl)"><i class="icon-font icon-facebook"></i></a>
          <a v-if="!row.fbUrl"><i class="icon-font icon-contact-facebook"></i></a>
          <a target="_blank" v-if="row.twUrl" :href="getHomePageUrl(row.twUrl)"><i class="icon-font icon-twitter"></i></a>
          <a v-if="!row.twUrl"><i class="icon-font icon-contact-twitter"></i></a>
          <a target="_blank" v-if="row.linkedUrl" :href="getHomePageUrl(row.linkedUrl)"><i class="icon-font icon-linkedin"></i></a>
          <a v-if="!row.linkedUrl"><i class="icon-font icon-contact-linkedin"></i></a>
        </span>
        </el-table-column>

        <el-table-column label="阶段"
        prop="stageValue"
        inline-template
        width="120">
        <!-- :filters="stageFilterList"
        :filter-multiple="false"
        class-name="stage-filter" -->
          <span>{{(row.stageValue==null ? '—' : row.stageValue)}}</span>
        </el-table-column>
        <el-table-column  label="评分" sortable="custom" prop="score" inline-template width="100">
          <div class="circle-score" v-if="row.score">
            <div class="circle-left" :class="row.score >=80 ? 'step5' : (row.score >=60? 'step4': (row.score >=40? 'step3' : ''))">
              <div class="clip-left"></div>
            </div>
            <div class="circle-right" :class="row.score >=80 ? 'step5' : (row.score >=60? 'step4': (row.score >=50? 'step3' : 'stepbg'))" v-bind:style="{ 'transform': 'rotate('+row.scoreDeg + 'deg)'}">
              <div class="clip-right"></div>
            </div>
            <div class="circle-360">
            </div>
            <div class="circle-mask">
              <span>{{row.score}}</span>
            </div>
          </div>
          <!--<div class="score-box">
            <el-progress type="circle" :status="row.score>80 ? '':(row.score>60 ? 'success': 'exception')" :percentage="+row.score" :width="34">
            </el-progress>
            <span class="score-text">{{row.score}}</span>
          </div>-->
        </el-table-column>
         <el-table-column  label="沟通次数" v-if="!type" prop="contactCount" inline-template width="120">
          <span v-text="row.contactCount" :title="row.contactCount"></span>
        </el-table-column>
        <!------------公司-->
        <el-table-column label="联系人数量" v-if="type" inline-template width="120">
          <span v-if="row.companySize==null || !row.companySize">—</span>
          <router-link v-else :to="{ path: '/contact', query: { type: 0, companyId: row.companyId}}">
            <span :title="row.companySize" class="cell-tips" style="color: #5488F9;">{{row.companySize}}</span>
          </router-link >
        </el-table-column>
        <el-table-column  label="来源" prop="sourceValue" inline-template width="100">
          <span v-text="row.sourceValue" :title="row.sourceValue"></span>
        </el-table-column>
        <!------------公司-->
        <el-table-column align='center'  label="网址" v-if="type" prop="companyDomain" inline-template width="260">
          <span v-text="row.url " :title="row.url "></span>
        </el-table-column>
        <el-table-column  label="所属人" prop="ownerUserName" inline-template width="120">
          <span v-text="row.ownerUserName" :title="row.ownerUserName"></span>
        </el-table-column>
        <!------------联系人-->
        <el-table-column label="职位" v-if="!type" width="125" prop="position" inline-template>
          <span class="cell-tips" v-text="(row.position=='' || row.position==null)? '—' : row.position" :title="row.position"></span>
        </el-table-column>
        <el-table-column  label="类型"  prop="typeValue" inline-template width="100">
          <span v-text="row.typeValue" :title="row.typeValue"></span>
        </el-table-column>
        <el-table-column align='center' label="标签" inline-template width="330">
          <div class="contact-tag-list cell-tips">
            <a v-show="row.showMore" @click="showMoreTag(row.userId)">显示更多</a>
            <el-tag class="tag" v-for="(t,index) in row.tagList" key="tagList" v-show="index<more">
              <span :title="t.tag">{{t.tag}}</span>
            </el-tag>
            <el-button type="text" v-show="row.tagList&&row.tagList.length>more" @click="showMore(row)">显示更多</el-button>
          </div>
        </el-table-column>
        <el-table-column label="分组"
          v-if="!type"
          prop="groupName"
          inline-template
          width="118">
          <!-- :filters="groupFilterList"
          :filter-multiple="false"
          class-name="group-filter" -->
          <span :title="row.groupName" class="cell-tips">{{(row.groupName==null ? '—' : row.groupName)}}</span>
        </el-table-column>
        <el-table-column label="国家"  inline-template width="127">
          <span :title="row.countryName" class="cell-tips"><img v-if="row.countryNameEn!='' && row.countryNameEn!=null" :src="'../../../static/img/ImageFlag/'+row.countryNameEn+'.png'" alt="" class="nationalflag" />{{(row.countryName==null ? '—' : row.countryName)}}</span>
        </el-table-column>
        <!------------公司-->
        <el-table-column label="行业" v-if="type"  inline-template width="130">
          <span :title="row.industry" class="cell-tips">{{(row.industry==null ? '—' : row.industry)}}</span>
        </el-table-column>
         <el-table-column  label="重要标记" prop="isMajor" inline-template width="100">
          <div>
            <a href="javascript:;" class="follow icon-font icon-empty-start" v-if="!row.isMajor" @click="majorContact(row)"></a>
            <a href="javascript:;" class="follow on icon-font icon-real-start" v-else @click="majorContact(row)"></a>
          </div>
        </el-table-column>

        <el-table-column label="创建时间"  prop="createTime" inline-template :width="type?130:150">
          <span v-if="row.createTime" :title="row.createTime">{{row.createTime | time-formater-no-second}}</span>
          <!-- <span v-else>--</span> -->
        </el-table-column>

        <!--<el-table-column label="阶段" v-if="!type" sortable inline-template width="100">
          <span>{{(row.stageValue==null ? '—' : row.stageValue)}}</span>
        </el-table-column>
        <el-table-column label="邮箱" inline-template width="200">
          <span v-text="(row.mail=='' || row.mail==null)? '—' : row.mail" :title="row.mail"></span>
        </el-table-column>-->
        <!-- <el-table-column label="最近动态发生时间" v-if="!type" inline-template width="154">
          <span v-if="row.latestActionTime==null">{{'—'}}</span>
          <span :title="row.latestActionTime | time-formater-no-second" class="cell-tips" v-else>{{row.latestActionTime | time-formater-no-second}}</span>
        </el-table-column>
        <el-table-column label="分组" v-if="!type" inline-template width="118">
          <span :title="row.groupName" class="cell-tips">{{(row.groupName==null ? '—' : row.groupName)}}</span>
        </el-table-column>
        <el-table-column v-if="!type" label="所在地" inline-template>
          <span v-text="(row.region=='' || row.region==null)? '—' : row.region" :title="row.region"></span>
        </el-table-column>-->
        <!--<el-table-column label="行业" v-if="type" inline-template width="124">
          <span :title="row.industry" class="cell-tips">{{(row.industry==null ? '—' : row.industry)}}</span>
        </el-table-column> -->
        <!-- <el-table-column label="电话" width="134" v-if="type" inline-template>
          <span :title="row.telephone" class="cell-tips" v-text="(row.telephone=='' || row.telephone==null)?'—' : row.telephone"></span>
        </el-table-column> -->
      </el-table>
      <div class="no-data contact-no-data" v-show="!contactList.length&&!loadingTable">
        <div class="img"></div>
        <p>暂无数据</p>
      </div>
    </div>
    <div class="loading loading-circle" v-if="loadingTable"></div>
    <el-pagination
      v-show="contactList.length && !loadingTable && contactTotalCount > 10"
      class="list-pagination"
      @current-change="listCurrentChange"
      :current-page="currentPage"
      :page-size="size"
      layout="prev, pager, next, jumper"
      :total="contactTotalCount">
    </el-pagination>

    <!--分组管理start-->
    <el-dialog title="分组管理" v-model="groupManagementPop" class="group">
      <div class="loading loading-circle loading-group" v-if="groupDataIsLoad"></div>
      <ul class="group-list" v-if="groupList.length>0 && !groupDataIsLoad">
        <li class="group-info" v-for="(item, index) in groupList" :key="item" :class="{selected:index==currId}" @click="selectGroup(index)">
          <span class="desc" v-if="!item.edit">{{item.groupName}}</span>
          <div class="group-edit-box" v-if="item.edit">
            <el-input class="edit-input" v-model="groupList[index].editname" @keyup.enter.native="addGroupFunc(index)" :maxlength="20"></el-input>
            <span class="opt" @click="addGroupFunc(index)"><i class="icon-font submit">&#xe6d1;</i></span>
            <span class="opt" @click="cancelAddGroupFunc(index)"><i class="icon-font remove">&#xe602;</i></span>
          </div>
          <div class="group-option" v-if="!item.edit">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <a href="javascript:;" @click.stop="editGroup(index)"><i class="icon-pen"></i></a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <a href="javascript:;" @click.stop="deleteGroupFunc(index)"><i class="icon-trash"></i></a>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <div class="no-data-group textCenter" v-else-if="!groupDataIsLoad">
        <span class="info">
          暂无分组
        </span>
        <div class="uploader-container">
          <el-button type="primary" class="uploader" @click="addGroup"><i class="icon-font add">&#xe6ad;</i>新增分组</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" class="addgroup" @click="addGroup"><i class="icon-font add-icon">&#xe6ad;</i>新建分组</el-button>
        <el-button type="primary" class="sure" :disabled="importing" @click="contactGroupFunc" v-if="groupEditType=='2'">确定</el-button>
        <el-button type="default" class="cancel" @click="groupManagementPop = false">取消</el-button>
      </span>
    </el-dialog>
    <!--分组管理end-->

    <el-dialog title="新增联系人" v-model="dialogAddPerson" class="add-dialog">
      <el-form label-position="top" :model="rulePersonForm" :rules="rules" ref="rulePersonForm">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model.trim="rulePersonForm.firstName" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model.trim="rulePersonForm.lastName" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model.trim="rulePersonForm.position" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model.trim="rulePersonForm.email" :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="addPerson" class="add-btn" :disabled="!rulePersonForm.firstName||personError||addPersonBtn">新增</el-button>
        <el-button @click="dialogAddPerson = false" class="add-btn">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增公司" v-model="dialogAddComp" class="add-dialog">
      <el-form label-position="top" :model="ruleCompForm" :rules="rules" ref="ruleCompForm">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model.trim="ruleCompForm.name" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="公司官网" prop="url">
          <el-input v-model.trim="ruleCompForm.url" :maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="add-dialog-footer">
        <el-button type="primary" @click="addComp" class="add-btn" :disabled="!ruleCompForm.name||compError||addCompBtn">新增</el-button>
        <el-button @click="dialogAddComp = false" class="add-btn">取 消</el-button>
      </span>
    </el-dialog>

    <!--<el-dialog :title="'导入'+text" v-model="dialogImport" class="import-person">
      <span class="info">
        <i class="icon-font icon-warn warning"></i>
        上传{{text}}列表导入{{text}}，每个文件{{text}}数量不超过10000条
      </span>
      <div class="uploader-container">
        <el-button type="primary" class="uploader" :disabled="uploading">{{uploading?'正在上传文件':'导入'+text}}</el-button>
        <input class="file" type="file" ref="importInput" @change="changeFile($event)">
      </div>
      <a class="download" :href="type?
      'http://onloonnet.oss-cn-shanghai.aliyuncs.com/ops/%E5%85%AC%E5%8F%B8%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.csv':
      'http://onloonnet.oss-cn-shanghai.aliyuncs.com/ops/%E8%81%94%E7%B3%BB%E4%BA%BA%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.csv'">
        下载导入模板
      </a>
      <div class="file-container" v-show="importFile.length">
        <div class="files" v-for="(file,i) in importFile">
          <i class="type icon-font icon-excel"></i>
          <span class="fileName">{{file}}</span>
          <i class="close el-icon-close" @click="removeFile(i)"></i>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-show="importFile.length">
        <el-button type="primary" :disabled="importing" @click="importContact">导入</el-button>
        <el-button type="text" @click="dialogImport = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="阶段选择" v-model="dialogStep" class="dialog-normal">
      <el-select v-model="selStep" placeholder="全部阶段">
        <el-option
          v-for="item in stageList"
          :key="item.dictItemCode" :label="item.dictItemName" :value="item.dictItemCode"></el-option>
      </el-select>
      <span slot="footer" class="confirm-btn">
        <el-button type="primary" @click="stepConfirm" class="confirm">确定</el-button>
        <el-button @click="dialogStep = false" class="close">取消</el-button>
      </span>
    </el-dialog>-->

    <el-dialog :title="type?'公司分配':'联系人分配'" v-model="dialogDistr" class="dialog-normal" >
      <el-select v-model="selAcc" placeholder="请选择目标账号">
        <el-option :label="logUser.name||logUser.loginAccount" :value="logUser.userId"></el-option>
        <el-option
          v-for="item in subUserList"
          :key="item.id"
          :label="item.name||item.loginAccount"
          :value="item.id">
        </el-option>
      </el-select>
      <el-checkbox class="check-text" v-model="isSync" v-if="type">同步分配公司在所有账号下的联系人</el-checkbox>
      <span slot="footer" class="confirm-btn">
        <el-button type="primary" @click="distrOk" class="confirm" :disabled="distrBtn">确定</el-button>
        <el-button @click="dialogDistr = false" class="close">取消</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog v-model="dialogMerge" class="merge-dialog">
      <span>
        <i class="warning el-icon-warning"></i>
        <span class="text">合并操作无法还原，请确认后执行！</span>
      </span>
      <div class="content">
        <span class="info-text">确定合并以下2个{{text}}:</span>
        <p v-for="contact in selection" :title="contact.firstName+contact.lastName" key="selectContacts">{{contact.firstName+contact.lastName}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="merge">合并</el-button>
        <el-button type="text" @click="dialogMerge = false">取消</el-button>
      </span>
    </el-dialog> -->
    <!-- <el-dialog v-model="dialogDelete" class="delete-dialog">
      <span v-if="!dialog">
        <i class="warning el-icon-warning"></i>
        <span class="text" v-show="selection.length===1">确定删除以下{{text}}:</span>
        <span class="text" v-show="selection.length>1">确定删除{{selection.length}}个{{text}}？</span>
      </span>
      <div class="content" v-show="selection.length===1" v-if="!dialog">
        <p v-for="contact in selection" :title="contact.firstName ? (contact.firstName+(contact.lastName||'')) : contact.name" key="selectContacts">{{contact.firstName ? (contact.firstName+(contact.lastName||'')) : contact.name}}</p>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!dialog">
        <el-button type="primary" @click="del">删除</el-button>
        <el-button type="text" @click="dialogDelete = false">取消</el-button>
      </span>
      <span style="display: block;idth: 420px;height: 120px;" v-if="dialog">
        <div class="loading loading-circle loading-top" style="margin: 50px auto"></div>
      </span>
    </el-dialog> -->
    <!--删除分组-->
    <DialogBox :config="oconfig" @sure="confirmOk" @close="popClose"></DialogBox>
    <!--删除联系人/公司-->
    <DialogBox :config="lcconfig" @sure="del"></DialogBox>
    <!--阶段确认-->
    <DialogBox :config="stepconfig" @sure="stepOk"></DialogBox>
    <!--发送营销邮件-->
    <DialogBox :config="mailconfig"></DialogBox>

  </div>
</template>

<script>
  import contactInfoApi from '@/api/contactInfoApi'
  import DialogBox from '@/components/box/dialogBox'
  import Util from '@/common/Util'
  import compAvatar from '@/assets/img/default_comp.png'
  import linkAvatar from '@/assets/img/default_avatar.png'
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  export default {
    name: 'contact',
    data () {
      let validEmail = (rule, value, callback) => {
        let rule1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        if (value === '') {
          this.personError = false
          callback()
        } else if (!rule1.test(value)) {
          // this.$refs.rulePersonForm.validateField('email')
          this.personError = true
          callback(new Error('请输入正确邮箱'))
        } else {
          this.personError = false
          callback()
        }
      }
      let validUrl = (rule, value, callback) => {
        let rule2 = /^(http|https):\/\/([a-zA-Z\d][a-zA-Z\d-_]+\.)+[a-zA-Z\d-_][^ ]*$/
        if (value === '') {
          this.compError = false
          callback()
        } else if (!rule2.test(value)) {
          this.compError = true
          callback(new Error('请输入正确官网地址'))
        } else {
          this.compError = false
          callback()
        }
      }
      let validateFristName = (rule, value, callback) => {
        if (value.trim() === '') {
          this.personError = false
          callback(new Error('firstName 不能为空'))
          callback()
        } else {
          this.personError = false
          callback()
        }
      }
      return {
        compAvatar: {error: 'this.src="' + compAvatar + '"', pic: compAvatar},
        linkAvatar: {error: 'this.src="' + linkAvatar + '"', pic: linkAvatar},
        isscroll: false,
        fullscreenLoading: false,
        more: 3,
        importing: false,
        // importFile: [],
        companyId: '',
        // uploading: false,
        text: '',
        showTags: false,
        addTags: '',
        personError: false,
        compError: false,
        rulePersonForm: {
          firstName: '',
          lastName: '',
          position: '',
          email: ''
        },
        ruleCompForm: {
          name: '',
          url: ''
        },
        rules: {
          firstName: [
            { required: true, message: '请输入firstName', trigger: 'blur' },
            { validator: validateFristName, trigger: 'blur' }
          ],
          email: [{validator: validEmail, trigger: 'blur'}],
          name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' }
          ],
          url: [{validator: validUrl, trigger: 'blur'}]
        },
        dialogAddPerson: false,
        dialogAddComp: false,
        dialogDistr: false,
        // dialogMerge: false,
        // dialogDelete: false,
        // dialogImport: false,
        // dialog: false,
        selected: 0,
        type: 0, // 当前属性 0: 联系人 1：公司
        currentPage: 1,
        filter: -1,
        size: 10,
        searchText: '',
        searchGroup: '',
        searchStep: '',
        latestDays: '',
        queryUserId: '',
        countType: '',
        sortBy: {},
        totalCount: 0,
        contactSearch: [], // 搜索结果
        selectContacts: [], // 选择的联系信息
        selection: [], // 选择的联系
        addTag: false, // 添加标签功能是否显示
        selectTags: [],
        curTimer: null,
        groupManagementPop: false,
        groupList: [],
        currId: -1,
        groupIsEdit: false,
        // dqGroupName: '',
        groupDataIsLoad: true,
        groupEditType: '1',   // 1分组编辑2联系人分组选择
        // filterCountryList: [],  // 联系人筛选国家列表
        // filterCountryListTwo: [], // 公司筛选国家列表
        // filterGroupId: '',
        // filterCountryId: '',
        editGroupindex: '',
        oconfig: {
          sureText: '确定',
          cancelText: '取消',
          visible: false
        },
        lcconfig: {
          sureText: '确定',
          cancelText: '取消',
          visible: false,
          showclosebtn: true
        },
        mailconfig: {
          theme: 'width416',
          visible: false,
          notice: '所选联系人都未关联邮箱，请重新选择',
          sureText: '知道了',
          showclosebtn: false
        },
        stepconfig: {
          visible: false,
          sureText: '确定',
          cancelText: '取消',
          showclosebtn: true
        },
        deleteIndex: '',  // 删除分组索引
        isGroupCommit: false,  // 接口是否正在提交
        selPersonInfo: false,  // 联系人是否有权限查看
        selCompanyInfo: false,   // 公司是否有权限查看
        importRight: false, // 导入权限
        // groupIds: '',
        isMainAccount: false, // 是否是主账号
        delRight: false,
        outRight: false,
        hasMailRight: false,
        selAcc: '',
        stepId: '',
        isSync: false,
        subUserList: [],
        // stageFilterList: [],
        // groupFilterList: [],
        logUser: JSON.parse(localStorage.user), // 登陆主账号
        addPersonBtn: false,
        addCompBtn: false,
        distrBtn: false
      }
    },
    mounted () {
      // type/contactType 1公司 0联系人
      this.selPersonInfo = Util.hasRightByCode('DAA')
      this.selCompanyInfo = Util.hasRightByCode('DBA')
      // this.getAllCountryFunc()  // 获取联系人（公司）存在国家列表
      this.getSubList() // 子账号列表
      this.init()
      this.$store.commit('CONTACT_DETAIL_PARAMS', {contactType: +this.type, detailType: +this.type})
      this.getGroupListFunc()
    },
    components: {DialogBox},
    computed: mapGetters([
      'contactList',
      'contactTotalCount',
      'tags',
      'loadingTable',
      'filterType',
      'mindex',
      'stageList',
      'stageMap',
      'userInfoMap'
    ]),
    watch: {
      /**
       * 监听联系人和公司切换tab
       */
      $route () {
        console.log('router')
        this.currentPage = 1
        this.filter = -1
        this.size = 10
        this.searchText = ''
        this.searchStep = ''
        this.totalCount = 0
        this.selectTags = []
        this.selected = 0
        this.init()
      }
      // stageList () {
      //   this.stageFilterList = []
      //   this.stageList.forEach(item => {
      //     this.stageFilterList.push({text: item.dictItemName, value: item.dictItemCode})
      //   })
      // }
    },
    methods: {
      init () {
        this.type = +this.$route.query.type || 0
        this.text = this.type ? '公司' : '联系人'
        this.importRight = this.type ? Util.hasRightByCode('DBC') : Util.hasRightByCode('DAD')
        this.isMainAccount = this.distrIsShow()
        this.delRight = this.deleteRight()
        this.outRight = this.outputRight()
        this.hasMailRight = this.mailRight()
        this.$store.commit('CONTACT_TYPE', {contactType: +this.type})
        let query = this.$route.query
        query.stage ? this.searchStep = '' + query.stage : null
        this.$store.dispatch('getTags')
        this.$store.dispatch('getUserMap')
        // this.stageList.forEach(item => {
        //   this.stageFilterList.push({text: item.dictItemName, value: item.dictItemCode})
        // })
        this.latestDays = query.days
        this.countType = query.countType
        this.queryUserId = query.id
        let compId = query.companyId
        if (!query.stage) { // 搜索自己会搜的
          this.$store.dispatch('getContactList', {companyId: compId || '', size: 10, page: 1, filter: -1, countType: this.countType, latestDays: this.latestDays, queryUserId: this.queryUserId})
        }
      },
      // 是否显示 分配按钮
      distrIsShow () {
        if (localStorage.isMainAccount === 'true') {
          return true
        } else {
          return false
        }
      },
      // 主账号 获取子账号列表
      getSubList () {
        // this.logUser = JSON.parse(localStorage.user)
        if (localStorage.isMainAccount) {
          // this.logUser = {userId: user.userId, name: user.name, loginAccount: user.loginAccount}
          this.subUserList = this.logUser.subUserList
        }
      },
      // doFilter (column, event) {
      //   let _this = this
      //   let key = Object.keys(column)
      //   let obj = document.querySelector('.' + key).getAttribute('class')
      //   if (obj.indexOf('stage-filter') !== -1) {
      //     _this.searchStep = column[key][0]
      //   }
      //   if (obj.indexOf('group-filter') !== -1) {
      //     _this.searchGroup = column[key][0]
      //   }
      //   _this.freshList()
      // },
      getHomePageUrl (url) {
        return Util.checkUrl(url)
      },
      // 分组权限判断
      groupIsShow () {
        return Util.hasRightByCode('DAC') && (parseInt(this.type) === 0)
      },
      // 最近动态返回
      returnDynamics (row) {
        let lastName = row.lastName || ''
        let name = row.firstName + lastName
        let obj = row.latestActionTimeLine
        let resName = {
          html: '—',
          title: ''
        }

        if (!obj) {
          return resName
        } else {
          let socialCont = JSON.parse(obj.socialContent)
          let stype = obj.socialType
          let cont = ''
          if (stype === 0) {
            if (socialCont.mailMarketingFlag) {  // 营销邮件
              if (socialCont.trackType === 0) { // 打开
                cont = name + '打开了营销邮件“' + socialCont.emailTitle + '”'
              } else {  // 点击
                cont = name + '点击了营销邮件中的链接“' + socialCont.emailTitle + '”'
              }
            } else { // 普通邮件
              if (socialCont.trackType === 0) { // 打开
                cont = name + '打开了邮件“' + socialCont.emailTitle + '”'
              } else {  // 点击
                cont = name + '点击了邮件链接“' + socialCont.emailTitle + '”'
              }
            }
          } else if (stype === 2) {
            let accname = this.userInfoMap[obj.userId].name || obj.userId
            if (socialCont.source === 2) { // facebook
              resName.title = name + '<@' + socialCont.senderAccountName + '>在Facebook上给' + accname + '<@' + socialCont.receiverAccountName + '>发了一条信息'
              resName.html = '<i class="icon-facebook logo"></i>' + resName.title
            }
            if (socialCont.source === 3) { // Twitter  我 @提到 别人
              if ((socialCont.bindingAccount === socialCont.senderId) && (socialCont.senderId !== socialCont.receiverId)) {
                resName.title = accname + '<@' + socialCont.senderAccountName + '>在Twitter上@了' + name + '<@' + socialCont.receiverAccountName + '>'
                resName.html = '<i class="icon-twitter-two"></i>' + resName.title
              }
              if ((socialCont.bindingAccount === socialCont.receiverId)) { // Twitter@提到
                resName.title = name + '<@' + socialCont.senderAccountName + '>在Twitter上@了' + accname + '<@' + socialCont.receiverAccountName + '>'
                resName.html = '<i class="icon-twitter-two logo"></i>' + resName.title
              }
            } else if (socialCont.source === 4) {
              if (socialCont.bindingAccount === socialCont.receiverId) {  // Twitter私信 对方发我
                resName.title = name + '<@' + socialCont.senderAccountName + '>在Twitter上给' + accname + '<@' + socialCont.receiverAccountName + '>发了一条私信'
                resName.html = '<i class="icon-twitter-two logo"></i>' + resName.title
              }
              if (socialCont.bindingAccount === socialCont.senderId) {  // Twitter私信 我发对方
                resName.title = accname + '<@' + socialCont.senderAccountName + '>在Twitter上给' + name + '<@' + socialCont.receiverAccountName + '>发了一条私信'
                resName.html = '<i class="icon-twitter-two logo"></i>' + resName.title
              }
            }
          } else if (stype === 3) { // 询盘信息
            cont = socialCont.detail.firstName + socialCont.detail.lastName + '在' + socialCont.source + '所在的页面提交了一份询盘'
          } else if (stype === 4) { // 备注
            cont = (this.userInfoMap[obj.userId].name || obj.userId) + '记录了一份关于' + socialCont.contactName + '的备注'
          } else if (stype === 5) {  // 合并阶段
            cont = socialCont.newName + '与' + socialCont.oldName + '（' + socialCont.oldEmail + '）合并'
          } else if (stype === 6) {  // 阶段变更
            // let statusobj = {
            //   following: '跟进',
            //   won: '成功',
            //   potential: '潜在',
            //   intention: '意向',
            //   failed: '失败',
            //   demo: '样品'
            // }
            let statusobj = this.stageMap || {}
            //  || this.userInfoMap[obj.contactId].name
            cont = socialCont.contactName + '状态变更为' + statusobj[socialCont.status]
          } else if (stype === 7) { // 系统信息
            if (!socialCont.isUpdate) {
              if (socialCont.commercialOpportunityFlag === '' || socialCont.commercialOpportunityFlag === null) {
                cont = name + '通过 商机推荐 被创建'
              } else {
                cont = name + '通过' + socialCont.createSource + '被创建'
              }
            } else {
              // cont = `${name}通过${socialCont.createSource}被更新`
              let info = this.userInfoMap[socialCont.operUserId]
              cont = `${info ? info.name : socialCont.operUserId}修改了${name}详情`
            }
          } else if (stype === 8) { // 海关信息
            cont = name + '有一条海关数据'
          } else if (stype === 1) {
            let id = socialCont.operUserId || obj.userId
            let info = this.userInfoMap[id]
            if (socialCont.emailType === 1) { // 发邮件
              cont = `${info ? info.name : id}发送了一份邮件给${socialCont.contactName}(${socialCont.contactEmail})`
            } else { // 收到邮件
              cont = `${info ? info.name : id}收到了一封邮件来自${socialCont.contactName}(${socialCont.contactEmail})`
            }
          } else if (stype === 9) { // 联系人待补全消息
            cont = '多个数据字段有更新数据'
          } else if (stype === 10) {  // 联系已补全消息
            cont = '多个数据字段补充完成'
          } else if (stype === 11) {  // 联系已补全消息
            cont = name + '访问了官网'
          } else if (stype === 12) { // 分配
            let info = this.userInfoMap[socialCont.operUserId]
            let info2 = this.userInfoMap[socialCont.assignedUserId]
            cont = `${info ? info.name : socialCont.operUserId}将${name}分配给了${info2 ? info2.name : socialCont.assignedUserId}`
          } else if (stype === 13) { // 修改
            let info = this.userInfoMap[socialCont.operUserId]
            cont = `${info ? info.name : socialCont.operUserId}修改了${name}详情`
          }
          if (stype !== 2) {
            resName.html = resName.title = cont
          }
          return resName
        }
      },
      // 查询联系人所有国家
      /* getAllCountryFunc () { ${contactType===0?'联系人':'公司'}
        contactInfoApi.getAllCountry().then(res => {
          if (res.data.code === 0) {
            this.filterCountryList = res.data.data
          }
        })
      }, */
      // 查询公司所有国家
      /* getAllCountryTwoFunc () {
        contactInfoApi.getAllCountryTwo().then(res => {
          if (res.data.code === 0) {
            this.filterCountryListTwo = res.data.data
          }
        })
      },
      returnCommand (groupId) {
        return '' + groupId
      }, */
      // 选择分组筛选
      /* changeGroup (command) {
        this.filterGroupId = command
        let params = {companyId: this.companyId, size: this.size, page: this.currentPage, filter: this.filter}
        if (command !== '' && command !== '0') {
          this.groupIds = command
          params.groupIds = this.groupIds
        }
        this.$store.dispatch('getContactList', params)
      }, */
      // 选择国家筛选
      /* changeCountry (command) {
        this.filterCountryId = command
        let params = {companyId: this.companyId, size: this.size, page: this.currentPage, filter: this.filter}
        if (command !== '' && command !== '0') {
          params.countryId = command
        }
        this.$store.dispatch('getContactList', params)
      }, */
      // 联系人划分分组弹框
      contactGroupPop () {
        this.groupEditType = '2'
        this.groupManagementPop = true
        this.groupDataIsLoad = false
        this.currId = -1
        this.resetGroupEdit()
      },
      // 联系人分组归类
      contactGroupFunc () {
        if (this.currId !== -1) {
          let groupId = this.groupList[this.currId].groupId
          let params = {
            contactsId: this.selectContacts.join(','),
            groupId: groupId
          }
          contactInfoApi.updateContactGroup(params).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '联系人分组成功'
              })
              let contactsCount = this.groupList[this.currId].contactsCount
              contactsCount = contactsCount + 1
              this.groupList[this.currId].contactsCount = contactsCount
              this.freshList()
            }
          })
        }
        this.groupManagementPop = false
      },
      // 重置分组
      resetGroupEdit () {
        let p = this.groupList
        if (this.editGroupindex !== '') {
          let index = parseInt(this.editGroupindex)
          if (p[index] !== '' && p[index] !== null && p[index] !== undefined) {
            if (p[index].edit && p[index].isNew) {    // 当前是新分组并且在编辑状态,删除
              p.splice(index, 1)
            } else { // 否则去除编辑状态
              p[index].editname = p[index].groupName
              p[index].edit = false
            }
          }
        }
        this.groupIsEdit = false
      },
      // 分组管理
      groupManage () {
        this.groupEditType = '1'
        this.groupManagementPop = true
        // this.groupDataIsLoad = false
        this.groupIsEdit = false
        this.resetGroupEdit()
        this.currId = -1
      },
      // 添加或者修改分组
      addGroupFunc (index) {
        let groupname = this.groupList[index].editname
        let isNew = this.groupList[index].isNew
        if (!this.isGroupCommit) {
          this.isGroupCommit = true
          if (groupname === '' || groupname === null) {
            this.$message.error('分组名称不能为空')
            return
          } else {
            if (isNew) {  // 如果是新分组，点击确认调用新增
              let params = {
                name: groupname
              }
              contactInfoApi.addGroup(params).then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增分组成功'
                  })
                  this.getGroupListFunc()
                }
                this.isGroupCommit = false
                this.groupIsEdit = false
              })
            } else {  // 如果是旧分组，点击确认调用修改
              let groupId = this.groupList[index].groupId
              let params = {
                groupId: groupId,
                name: groupname
              }
              contactInfoApi.updateGroup(params).then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改分组成功'
                  })
                  this.getGroupListFunc()
                }
                this.groupIsEdit = false
                this.isGroupCommit = false
              })
            }
          }
        }
      },
      // 取消添加分组
      cancelAddGroupFunc (index) {
        let p = this.groupList
        p[this.editGroupindex].edit = true
        if (p[index].edit && p[index].isNew) {    // 当前是新分组并且在编辑状态,删除
          p.splice(index, 1)
        } else { // 否则去除编辑状态
          p[index].editname = p[index].groupName
          p[index].edit = false
        }
        this.groupIsEdit = false
      },
      // 获取分组列表
      getGroupListFunc () {
        contactInfoApi.getGroupList().then(res => {
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              // this.groupList = res.data.data
              let dataList = res.data.data
              // let groupFilterList = []
              dataList.forEach((item) => {
                item.editname = item.groupName
                item.edit = false
                item.isNew = false
                // groupFilterList.push({text: item.groupName, value: item.groupId})
              })
              this.groupList = dataList
              // this.groupFilterList = groupFilterList
              if (this.groupList.length > 10) {
                this.isscroll = true
              } else {
                this.isscroll = false
              }
            }
          }
          this.groupDataIsLoad = false
          this.isGroupCommit = false
        })
      },
      // 选中当前分组
      selectGroup (index) {
        this.currId = index
      },
      // 删除分组验证
      deleteGroupFunc (index) {
        if (!this.groupIsEdit) {
          let p = this.groupList
          let contactsCount = p[index].contactsCount  // 分组内联系人数量
          if (contactsCount === 0) {    // 如果数量为空直接删除
            this.deleteGroup(index)
          } else {
            let notice = '确定删除“' + p[index].groupName + '”分组'
            let pname = '该分组包含' + contactsCount + '个联系人'
            this.deleteIndex = index
            this.groupManagementPop = false
            Object.assign(this.oconfig, {visible: true, notice: notice, message: pname, flag: 0})
          }
        } else {
          this.$message.error('请先保存编辑分组')
        }
      },
      // 删除分组
      deleteGroup (index) {
        let p = this.groupList
        let groupId = p[index].groupId
        let params = {
          groupId: groupId
        }
        contactInfoApi.deleteGroup(params).then(res => {
          if (res.data.code === 0) {
            p.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除分组成功'
            })
            // this.getGroupListFunc()
          }
        })
      },
      // 确定删除
      confirmOk () {
        this.deleteGroup(this.deleteIndex)
      },
      // 确认弹框关闭
      popClose () {
        this.groupManagementPop = true
      },
      // 编辑分组
      editGroup (index) {
        if (!this.groupIsEdit) {
          this.groupIsEdit = true
          let p = this.groupList
          p[index].edit = true
          this.editGroupindex = index
          console.log(p[index])
        } else {
          this.$message.error('请先保存编辑分组')
        }
      },
      // 新增分组
      addGroup () {
        if (!this.groupIsEdit) {
          let p = this.groupList
          this.groupIsEdit = true
          this.editGroupindex = p.length
          p.push({groupName: '', editname: 'New Category', edit: true, isNew: true})
          if (p.length > 6) {
            Vue.nextTick(() => {
              document.getElementsByClassName('el-dialog__body')[0].scrollTop = document.getElementsByClassName('el-dialog__body')[0].scrollHeight
            })
          }
        } else {
          this.$message.error('请先保存编辑分组')
        }
      },
      // 阶段弹框确认
      stepConfirm (comd) {
        let comdd = comd.split('/')
        this.stepId = comdd[1]
        let notice = `确定将${this.selected}个联系人阶段更改为:`
        Object.assign(this.stepconfig, {visible: true, notice: notice, message: comdd[0]})
      },
      // 阶段提交
      stepOk () {
        let _this = this
        contactInfoApi.stageModify({stage: this.stepId, contactsId: this.selectContacts.join(','), contactsType: this.type}).then(res => {
          if (!res.data.code) {
            _this.$message.success('阶段修改成功')
            Object.assign(_this.stepconfig, {visible: false})
            _this.freshList()
          } else {
            _this.$message.error(res.data.message + '')
          }
        })
      },
      // 分配联系人/公司
      distrOk () {
        let _this = this
        _this.distrBtn = true
        if (this.selAcc) {
          if (this.type) {
            let isSync2 = this.isSync ? 1 : 0
            contactInfoApi.distribCompany({assignedUserId: this.selAcc, contactsId: this.selectContacts.join(','), othersAssigned: isSync2}).then(res => {
              if (!res.data.code) {
                _this.$message.success('分配成功')
                _this.dialogDistr = false
                _this.selAcc = ''
                _this.freshList()
              } else {
                _this.$message.error(res.data.message)
              }
              _this.distrBtn = false
            })
          } else {
            contactInfoApi.distribLinker({assignedUserId: this.selAcc, contactsId: this.selectContacts.join(',')}).then(res => {
              if (!res.data.code) {
                _this.$message.success('分配成功')
                _this.dialogDistr = false
                _this.freshList()
                _this.selAcc = ''
              } else {
                _this.$message.error(res.data.message)
              }
              _this.distrBtn = false
            })
          }
        } else {
          _this.$message.error('请选择目标账号')
          _this.distrBtn = false
        }
      },
      // 导入跳转
      leadJump () {
        this.$router.push(
          {
            path: '/uploadAttachment',
            query: {'importType': this.type}
          }
        )
      },
      // 导出
      exportData () {
        let params = `?size=1000&page=${this.currentPage}&keyword=${this.searchText}&filter=${this.filter}&tagIds=${this.selectTags.join(';')}&groupIds=${this.searchGroup}&stage=${this.searchStep}&orderByClause=${JSON.stringify(this.sortBy)}&latestDays=${this.latestDays || ''}&countType=${this.countType || ''}&queryUserId=${this.queryUserId || ''}`
        if (this.type) { // 公司
          contactInfoApi.exportComp(params)
        } else {
          contactInfoApi.exportLinker(params)
        }
      },
      /**
       * 查看权限
       */
      viewRight () {
        if (+this.type === 0) {  // 查看联系人
          return this.selPersonInfo
        } else {  // 查看公司
          return this.selCompanyInfo
        }
      },
      /**
       * 删除权限
       */
      deleteRight () {
        if (+this.type === 0) {  // 联系人删除
          return Util.hasRightByCode('DAB')
        } else {  // 公司删除
          return Util.hasRightByCode('DBB')
        }
      },
      // 导出权限
      outputRight () {
        if (+this.type === 0) {
          return Util.hasRightByCode('DAE')
        } else {
          return Util.hasRightByCode('DBD')
        }
      },
      // 营销邮件权限
      mailRight () {
        if (+this.type === 0) {
          // 普通版/没绑定邮箱的 没权限
          return Util.hasRightByCode('BC') && +window.localStorage.serverLevel !== 0 && this.logUser.channelBindingVO.MAIL
        } else {
          return true
        }
      },
      placeholdDisplay (text) {
        if (text === '联系人') {
          return '请输入联系人姓名'
        } else {
          return '请输入公司名称'
        }
      },
      /* onScroll () {
        let scrollEl = this.$refs.tableBox
        let scrollLeft = scrollEl.bodyWrapper.scrollLeft
        let fixedTable = document.querySelector('.el-table__fixed')
        if (scrollLeft > 0) {
          fixedTable.className = 'el-table__fixed hasShadow'
        } else {
          fixedTable.className = 'el-table__fixed'
        }
      }, */
      // 评分排序
      sortChange (column, event) {
        this.sortBy[column.prop] = column.order === 'descending' ? 0 : 1
        this.freshList()
      },
      /**
       * 显示更多
       * @param row
       */
      showMore (row) {
        let contactId = this.type ? row.companyId : row.personId
        this.$router.push({path: '/contactDetail', query: {contactId, contactType: this.type}})
      },
      /**
       * 新增标签
       */
      contactsTagAdd () {
        if (this.addTags.trim() === '') {
          this.$message.error('请输入标签内容！')
          return
        }
        if (!this.type) {   // 联系人
          contactInfoApi.personTagAdd({
            contactIds: this.selectContacts.join(';'),
            tagNames: this.addTags
          }).then(res => {
            if (!res.data.code) {
              this.addTag = false
              this.$message.success('添加标签成功')
              this.$store.dispatch('getTags')
              this.showTags = false
              this.freshList()
              this.addTags = ''
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {   // 公司
          contactInfoApi.companyTagAdd({
            contactsList: this.selectContacts.join(';'),
            tagList: this.addTags
          }).then(res => {
            if (!res.data.code) {
              this.addTag = false
              this.$message.success('添加标签成功')
              this.$store.dispatch('getTags')
              this.showTags = false
              this.freshList()
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      filterByTag (tagId, index) {
        if (!this.tags[index].active) {
          this.selectTags.push(tagId)
          this.$store.commit('CONTACT_TAGS_CHANGE', {index, active: true})
        } else {
          this.selectTags.splice(this.selectTags.indexOf(tagId), 1)
          this.$store.commit('CONTACT_TAGS_CHANGE', {index, active: false})
        }
        this.currentPage = 1
        this.freshList()
      },
      /**
       * 搜索
       */
      search () {
        console.log('search')
        this.currentPage = 1
        this.freshList()
      },
      /**
       * 分页数目改变
       * @param size
       */
      // listSizeChange (size) {
      //   this.size = size
      //   this.currentPage = 1
      //   this.freshList()
      // },
      /**
       * 刷新列表
       */
      freshList () {
        this.selected = 0
        this.$store.dispatch('getContactList', {
          size: this.size,
          page: this.currentPage,
          keyword: this.searchText,
          filter: this.filter,
          tagIds: this.selectTags.join(';'),
          groupIds: this.searchGroup,
          stage: this.searchStep,
          orderByClause: this.sortBy,
          latestDays: this.latestDays,
          countType: this.countType,
          queryUserId: this.queryUserId
        })
      },
      /**
       * 当前页改变
       * @param page
       */
      listCurrentChange (page) {
        this.currentPage = page
        this.freshList()
      },
      /**
       * 全部或者重要
       * @param value -1全部 1重要
       */
      changeFilter (value) {
        if (this.filter === value) {
          return
        }
        this.$store.commit('FILTER_TYPE', {filterType: value})
        /* setTimeout(() => {
          document.querySelector('.el-table__body-wrapper').addEventListener('scroll', (event) => {
            _this.onScroll()
          })
        }, 1500) */
        this.filter = value
        this.currentPage = 1
        this.freshList()
      },
      /**
       * 联系人/公司 标记为重要
       * @param row
       */
      majorContact (row) {
        // update by shaohuan 5.11
        let params = {
          majorFlag: row.isMajor ? 0 : 1,
          contactIds: row.contactsType ? row.companyId : row.personId
        }
        if (!row.contactsType) {
          contactInfoApi.updatePersonMajor(params).then(res => {
            if (!res.data.code) {
              this.selected = 0
              row.isMajor = row.isMajor ? 0 : 1
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          contactInfoApi.updateCompanyMajor(params).then(res => {
            if (!res.data.code) {
              this.selected = 0
              row.isMajor = row.isMajor ? 0 : 1
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      /**
       * 跳转到相对应的详情页
       * @param row
       * @param contactType
       */
      showDetail (row, contactType) {
        /**
         * [如果没有权限，并且是 联系人个人 ，则不跳转]
         * @param  {[type]} this.viewRight() &&            !contactType [description]
         * @return {[type]}                  [description]
         */
        // 在联系人的列表 看公司
        if (contactType === 1 && !this.type && !row.companyBelongtoCurrentUser && !this.isMainAccount) {
          return
        }
        if (contactType === 1 && !this.selCompanyInfo) { // 查看公司详情
          return
        }
        if (contactType === 0 && !this.selPersonInfo) { // 查看联系人详情
          return
        }
        let contactId = contactType ? row.companyId : row.personId
        if (contactId === '' || contactId === null) {
          return
        } else {
          this.$store.commit('CONTACT_TIME_LINE', {timeLine: []})
          this.fullscreenLoading = true
          this.$router.push({path: '/contactDetail', query: {contactId, contactType}})
        }
      },
      /**
       * 选中表格一行
       * @param selection
       * @param row
       */
      selectContact (selection, row) {
        this.selectContacts = []
        this.selected = selection.length
        this.selection = selection
        selection.forEach((item) => {
          if (!this.type) {
            this.selectContacts.push(item.personId)
          } else {
            this.selectContacts.push(item.companyId)
          }
        })
      },
      /**
       * 全选
       * @param selection
       */
      selectAll (selection) {
        this.selectContacts = []
        this.selected = selection.length
        this.selection = selection
        selection.forEach((item) => {
          if (!this.type) {
            this.selectContacts.push(item.personId)
          } else {
            this.selectContacts.push(item.companyId)
          }
        })
      },
      major (command) {
        if (!this.type) {
          contactInfoApi.updatePersonMajor({contactIds: this.selectContacts.join(';'), majorFlag: parseInt(command)}).then(res => {
            if (!res.data.code) {
              this.freshList()
              parseInt(command) ? this.$message.success('标记为重要成功') : this.$message.success('取消标记为重要成功')
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          contactInfoApi.updateCompanyMajor({contactIds: this.selectContacts.join(';'), majorFlag: parseInt(command)}).then(res => {
            if (!res.data.code) {
              this.freshList()
              parseInt(command) ? this.$message.success('标记为重要成功') : this.$message.success('取消标记为重要成功')
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      },
      /**
       * 合并联系人
       */
      /* merge () {
        contactInfoApi.mergePerson({
          contactId: this.selectContacts[0],
          mergedContactId: this.selectContacts[1]
        }).then(res => {
          if (!res.data.code) {
            this.$message.success('合并联系人成功')
            this.selected = 0
            this.dialogMerge = false
            this.freshList()
          } else {
            this.$message.error(res.data.message)
          }
        })
      }, */
      /**
       * 新增联系人
       */
      addPerson () {
        this.addPersonBtn = true
        let _this = this
        this.$refs.rulePersonForm.validate((valid) => {
          if (valid) {
            this.rulePersonForm.mails = JSON.stringify([{'type': 0, 'mail': this.rulePersonForm.email}])
            contactInfoApi.addPerson(this.rulePersonForm).then(res => {
              if (!res.data.code) {
                this.dialogAddPerson = false
                _this.$message.success('新增联系人成功')
                this.freshList()
              } else {
                _this.$message.error(res.data.message)
              }
              this.addPersonBtn = false
            })
          } else {
            return false
          }
        })
      },
      /**
       * 新增公司
       */
      addComp () {
        this.addCompBtn = true
        contactInfoApi.addComp(this.ruleCompForm).then(res => {
          if (!res.data.code) {
            this.dialogAddComp = false
            this.$message.success('新增公司成功')
            this.freshList()
          } else {
            this.$message.error(res.data.message)
          }
          this.addCompBtn = false
        })
      },
      /**
       * 发送营销邮件
       */
      sendMail () {
        let num = 0
        let selectArr = []
        this.selection.forEach((item) => {
          if (item.mail) {
            num++
            selectArr.push(item)
          }
        })
        if (!num) {
          Object.assign(this.mailconfig, {visible: true})
          return
        }
        this.$store.commit('LINKER_TO_MAIL', {linkerToMail: true})
        // this.$store.commit('LINKER_TO_MAIL', { linkers: this.selection })
        this.$store.commit('DEVELOP_SENDINFO', { first: {}, second: {contactsIds: selectArr, contactsGroupIds: []}, third: {}, four: {} })
        this.$router.push({path: '/emailTopMenu'})
      },
      /**
       * 删除联系人/公司弹框
       */
      delLink () {
        let pname = null
        let notice = `确定删除以下${this.text}:`
        if (this.selection.length > 1) { // 批量
          notice = `确定删除${this.selection.length}个${this.text}`
        } else if (this.selection.length === 1) {
          let contact = this.selection[0]
          pname = contact.firstName ? (contact.firstName + (contact.lastName || '')) : contact.name
        }
        Object.assign(this.lcconfig, {visible: true, notice: notice, message: pname})
      },
      /**
       * 删除联系人/公司
       */
      del () {
        // this.dialog = true
        let deal = (res, name) => {
          if (!res.data.code) {
            this.selected = 0
            // this.dialogDelete = false
            Object.assign(this.lcconfig, {visible: false})
            this.$message.success('删除' + name + '成功')
            this.freshList()
          } else {
            this.$message.error(res.data.message)
          }
        }
        if (this.type) { // 公司
          let arr = []
          this.selectContacts.forEach(item => {
            arr.push({'contactsId': item, 'contactsType': 1})
          })
          let params = {'contactses': JSON.stringify(arr)}
          contactInfoApi.deleteCompanyList(params).then(res => {
            // this.dialog = false
            deal(res, '公司')
          })
        } else {
          let params = {contactIds: this.selectContacts.join(';')}
          contactInfoApi.deletePersonList(params).then(res => {
            // this.dialog = false
            deal(res, '联系人')
          })
        }
      }
    },
    filters: {
    },
    destroyed () {
      this.fullscreenLoading = false
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/style/variable";
  .arrow{
    position: absolute;
    width: 0;
    height: 0;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    top: 32px;
    left: 33px;
  }
  .arrow-up1 {
    border-bottom:10px solid #dfe2ec;
  }
  .arrow-up2 {
    border-bottom:10px solid #F5F8FA;
    top: 33px;
    z-index: 1;
  }
  .el-dropdown-menu{
    border-radius: 4px;
  }
  .el-dropdown-menu__item{
    padding: 0 15px;
    font-size: 13px;
    &:not(.is-disabled):hover{
      background-color: #F4F6F8;
    }
  }
  .person-list{
    position: relative;
    min-height: calc(~'100vh - 211px');
    padding-bottom: 20px;
    background: #fff;
    margin-bottom: 20px;
    .socialAccounts{
      a{
        margin-right: 5px;
      }
      i{
        font-size: 14px;
      }
      .icon-gray{
        color: #ddd;
      }
      .icon-blue{
        color: #5488F9;
      }
      .icon-message{
        transform: scale(0.81);
        display: inline-block;
      }
    }
    .textBold{
      font-weight: bold;
    }
    .contact-table{
      position: relative;
      .group_dropdownt{
        position: absolute;
        top: 20px;
        left: 81%;
        z-index: 99;
      }
      .group_dropdownt:hover{
        top:18px;
        .el-icon-caret-bottom{
          transform: rotate(180deg);
        }
      }
      .position-one{
        left: 90.6%;
      }
      .position-two{
        left: 77.1%;
      }
      .country_dropdownt{
        position: absolute;
        top: 20px;
        z-index: 99;
      }
      .country_dropdownt:hover{
        top:18px;
        .el-icon-caret-bottom{
          transform: rotate(180deg);
        }
      }
      .el-table tr{
        height: 48px;
      }
    }
    .tag{
      padding: 0 5px;
      color: #4F6D95;
      border: 1px solid rgb(228,236,254);
      background: rgb(228,236,254);
      border-radius: 4px;
      outline: none;
      cursor:pointer;
      &:hover{
        cursor:pointer;
        border: 1px solid #5488F9;
        color: #5488F9;
      }
    }
    .hidden-tags{
      position: relative;
      padding: 16px 10px 20px 10px;
      background: #F5F8FA;
      width: calc(~'100% - 20px');
      min-height: 66px;
      line-height: 28px;
      border-top: 1px solid rgb(223, 226, 236);
      border-bottom: 1px solid rgb(223, 226, 236);
      p{
        color: #7C98B6;
        font-size: 13px;
        text-align: center;
        margin-top: 20px;
      }
      .tag{
        // margin: 0 20px 0 10px;
        margin: 5px 4px;
        height: 28px;
        line-height: 28px;
      }
      .tag.active{
        border: 1px solid @activeBlue;
        color: @activeBlue;
      }
    }
    .empty-contact{
      padding: 110px 0;
      text-align: center;
      p{
        margin-top: 24px;
      }
    }
    .no-data{
      &.contact-no-data{
        padding-top: 200px;
      }
    }
    .contact-no-data .img{
      background: url(../../assets/img/empty-contact.png) center no-repeat;
    }
    .hidden-select{
      position: absolute;
      top: 4px;
      right: 1px;
      width: calc(~'100% - 52px');
      height: 47px;
      line-height: 47px;
      background: #F5F8FA;
      z-index: 999;
      .select-table{
        color: #7C98B6;
        font-size: 13px;
      }
      //border: 1px solid rgb(223, 226, 236);
    }
    .operate{
      display: inline-block;
      margin-left: 40px;
      font-size: 14px;
      color: #45628A;
      .icon-buttons{
        background: #fff;
        height: 28px;
        border: 1px solid #CBD6E3;
        border-radius: 4px;
      }
      .icon-button{
        padding: 0 28px;
        line-height: 29px;
      }
      i{
        margin-right: 5px;
      }
      .op-menu{
        cursor: pointer;
        margin-left: 30px;
      }
      .menu-after{
        display: inline-block;
        text-align: center;
      }
      .el-dropdown+.el-dropdown{
        border-left: 1px solid #CBD6E3;
      }
      .el-dropdown-link{
        padding: 0 28px;
        cursor: pointer;
      }
    }
    .filter-contact{
      height: 36px;
      padding: 12px;
      span{
        font-size: 14px;
        cursor: pointer;
        color: #7C98B6;
      }
      .down-line{
        margin: 0 10px;
        color: #CBD6E3;
      }
      span.active{
        font-size: 16px;
        cursor: default;
        font-weight: bold;
        color: #33475B;
      }
      .left{
        float: left;
        margin-top: 10px;
        margin-bottom: 25px;
      }
      .operate-container{
        float: right;
        margin-top: 0;
        font-size:0px;
        .contact-list-search{
          background: #F5F8FA;
          padding: 7px;
        }
        .el-select{
          margin-left: 10px;
          width: 168px;
        }
        .el-select+.btn{
          margin-left: 10px;
        }
        .tags-btn{
          position: relative;
          margin-right: 20px;
          i{
            margin-right: 5px;
          }
        }
        .search-two{
          width: 240px;
          .el-input-group__append{
            padding: 0 11px;
          }
        }
        .btn{
          width: 90px;
          margin-left: 8px;
        }
        .short-select{
          width: 118px;
        }
      }
    }
    .el-table__body-wrapper{
      .tag{
        margin: 3px;
      }
    }
  }
  .person-table{
    tr:hover{
     .circle-mask{
       background: #F5F8FA
     }
    }
    .nationalflag{
      width:24px;
      height:16px;
      display:inline-block;
      vertical-align: middle;
      margin-right:5px;
      border-radius:4px;
      background: url('../../../static/img/ImageFlag/common.png') center no-repeat;
      background-size: 25px;
    }
    .info-msg{
      min-height: 60px;
      position: relative;
      .autoComplete{
        position: absolute;
        left: 185px;
        top: 18px;
        padding: 1px 5px;
        height: 17px;
        line-height: 15px;
        /*background: @textareaBorder;*/
        background: #5488F9;
        color: #fff;
        border-radius: 10px;
        font-size: 10px;
      }
      img {
        position: absolute;
        top: 9px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .name:hover{
        color:#5488F9;
      }
      .name,.companyName{
        position: absolute;
        display: inline-block;
        width: 130px;
        left: 50px;
        top: 9px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .name{
        font-weight: bolder;
      }
      .no-company{
        top: 19px;
      }
      .companyName {
        top: 30px;
        color: #7C98B6;
      }
    }
    .follow{
      margin-left: 20px;
      font-size: 16px;
      color: #B0C1D4;
      // float: right;
      // margin-top: 25px;
    }
    .on{
      color: @yellow;
    }
    .info-nopic{
      .name,.companyName{
        left: 0
      }
    }
  }
  // 表格tips问题
  .cell-tips{
    max-width: 100%;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  }

</style>

<style lang="less" rel="stylesheet/less">
  @import "../../assets/style/variable";
  @import '../../assets/style/page';
  @import '../../assets/style/dialog';
  .vscroll{
    height: 420px;
    overflow: auto;
  }
  .canClick{
    cursor: pointer;
  }
  .el-popover{
    input{
      height: 28px;
      margin: 10px 0 20px 0;
    }
  }
  // 排序
  .el-table {
    .caret-wrapper{
      height: 10px;
    }
    .sort-caret.ascending{
      top: -1px;
      border-bottom: 5px solid #B0C1D4
    }
    .sort-caret.descending{
      bottom: -1px;
      border-top: 5px solid #B0C1D4
    }
    .descending .sort-caret.descending{
      border-top-color: #02AAAA;
    }
    .ascending .sort-caret.ascending{
      border-bottom-color: #02AAAA;
    }
  }
  .text-ellipsis(){
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .person-list{
    // min-height: calc(~'100vh - 207px');
    .el-table__fixed-header-wrapper{
      .is-leaf:nth-child(2){
        .cell{
          padding:0 20px 0 0;
        }
      }
    }
    .el-table__body-wrapper{
      z-index: 2;
    }
    .el-table__fixed{
      z-index: 4;
      border-right: 1px solid #DFE3EB;
      box-shadow: none;
      &.hasShadow{
        border: none;
        box-shadow: 1px 0 8px #d3d4d6;
      }
      .el-table__fixed-header-wrapper{
        background:#000;
        .is-leaf:nth-child(2){
          .cell{
            padding:0 20px 0 0;
          }
        }
      }
      .el-table__fixed-body-wrapper{
        td:nth-child(2){
          .cell{
            padding:0 20px 0 0;
          }
        }
      }
    }
    table{
      border-collapse: inherit;
      tr{
        height: 48px;
      }
    }
    .comp-table{
      tr{
        td:last-child .cell{
          padding: 0;
        }
      }
    }
    .el-table__empty-block{
      display: none;
      font-size: 13px;
      color: #33475B;
    }
    .el-table__body tr.hover-row > td{
      background: #F5F8FA;
    }
    td {
      .cell{
        white-space: nowrap;
      }
      .contact-tag-list{
        white-space: normal;
        font-size: 12px;
        .tag{
          max-width: 78px;
          vertical-align: bottom;
          .text-ellipsis()
        }
        .el-button{
          font-size: 12px;
        }
      }
      .logo{
        margin-right:4px;
      }
      .icon-twitter-two{
        color: #48B3FE;
      }
    }
    th{
      background: #F5F8FA;
      .cell{
        background: #F5F8FA;
      }
    }
    .group{
      .el-dialog{
        width:520px;
      }
      .el-dialog__header{
        padding: 15px 20px;
        border-bottom: 1px solid #EAF0F6;
      }
      .textCenter{
        text-align: center;
      }
      .el-dialog__body{
        padding:0 0;
        height:260px;
        overflow-y:auto;
        .loading-group{
          margin-top: 100px;
        }
        .group-list{
          .group-info{
            padding:8px 16px 8px 20px;
            font-size: 13px;
            color: #33475B;
            line-height:18px;
            overflow:hidden;
            .group-edit-box{
              .opt{
                width:28px;
                height:28px;
                background: #FFFFFF;
                border: 1px solid #CBD6E3;
                border-radius: 4px;
                padding:4px 6px;
                color: #B0C1D4;
                cursor: pointer;
              }
              .opt:hover{
                border: 1px solid #5488F9;
                color: #5488F9;
              }
              .edit-input{
                width:160px;
              }
              .el-input__inner{
                font-size: 13px;
                color: #33475B;
                height:29px;
              }
            }
            .group-option{
              display: none;
              float:right;
              .el-tooltip{
                margin-right:16px;
                display:inline-block;
                color: #DFE3EB;
              }
            }
          }
          .group-info.selected{
            background:#e6f8fa;
          }
          li:hover{
            background: #F4F6F8;
            .group-option{
              display: inline-block;
              .item{
                color: #5488F9;
              }
            }
          }
        }
        .no-data-group{
          padding:66px 0 140px 0;
          .info{
            margin-bottom:8px;
            display: inline-block;
            font-size: 13px;
            color: #7C98B6;
          }
          .uploader-container{
            .el-button{
              padding:5px 18px;
              .add{
                margin-right:5px;
              }
            }
          }
        }
      }
      .el-dialog__footer{
        border-top: 1px solid #EAF0F6;
        padding:16px 16px;
        overflow:hidden;
        .el-button{
          padding: 9px 15px;
        }
        .el-button.sure{
          padding: 9px 25px;
        }
        .el-button.cancel{
          padding: 9px 25px;
        }
        .addgroup{
          float:left;
          .add-icon{
            color: #B0C1D4;
            margin-right:5px;
          }
        }
        .addgroup:hover{
          .add-icon{
            color: #5488F9;
          }
        }
        .addgroup:focus{
          .add-icon{
            color: #5488F9;
          }
        }
      }
    }
    /* .merge-dialog{ // ,.delete-dialog
      .el-dialog{
        width: 500px;
        .warning{
          font-size: 30px;
          color: @yellow;
          margin-right: 10px;
        }
        .text{
          vertical-align: text-top;
          font-weight: bold;
        }
      }
      .el-dialog__header{
        border: none;
      }
      .el-dialog__body{
        padding: 10px 40px;
        .content{
          padding-left: 44px;
          .info-text{
            display: inline-block;
            margin: 10px 0;
            font-size: 12px;
          }
          p{
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            max-width: 250px;
            .text-ellipsis()
          }
        }
      }
      .el-dialog__footer{
        text-align: left;
        padding: 15px 84px 55px;
        button{
          padding: 10px 25px;
        }
      }
    }
    .delete-dialog{
      .el-dialog{
        .warning{
          font-size: 30px;
          color: @tipError;
          margin-right: 10px;
        }
        .el-button--primary{
          background-color: @tipError;
          border: 0;
        }
      }
    }
    .import-person{
      .el-dialog{
        width: 466px;
      }
      .el-dialog__header{
        padding: 15px 20px;
        border-bottom: 1px solid @textBorderColor;
      }
      .warning{
        font-size: 20px;
        color: @yellow;
      }
      .el-dialog__footer{
        text-align: left;
        padding-bottom: 50px;
        padding-left: 40px;
        button{
          padding: 10px 25px;
        }
      }
      .el-dialog__body{
        text-align: center;
        font-size: 13px;
        padding: 30px 20px 20px 20px;
        .uploader-container{
          position: relative;
          input{
            opacity: 0;
            display: inline-block;
            width: 186px;
            height: 33px;
            position: absolute;
            left: 119px;
            top: 30px;
            border: 1px solid;
          }
        }
        .file-container{
          padding: 10px 40px;
          background: #F5F8FA;
          text-align: left;
          width: 386px;
          margin-left: -20px;
          margin-top: 20px;
          .files:hover{
            .close {
              display: inline-block;
            }
          }
          .files{
            .type{
              color: #7BD12C;;
            }
            .close{
              float: right;
              cursor: pointer;
              display: none;
            }
            span{
              margin-left: 5px;
            }
          }
        }
        .info{
          color: #7C98B6;
        }
        .uploader{
          padding: 10px 65px;
          margin-top: 30px;
          margin-bottom: 10px;
        }
        .download{
          font-weight: normal;
          color: @activeBlue;
        }
      }
    } */
    .add-dialog{
      .el-dialog__header{
        border: none;
        padding: 27px 20px;
        background: @activeBlue;
        span{
          color: @white;
          font-size: 20px;
        }
        .el-dialog__close{
          font-size: 16px;
          color: @white;
        }
      }
      .el-dialog__body{
        padding: 30px 40px 20px;
        .el-form-item{
          margin-bottom: 20px;
          input{
            height: 40px;
          }
        }
      }
      .el-dialog__footer{
        padding: 15px 30px 30px 30px;
        text-align: left;
        background: #F5F8FA;
        border-top: 1px solid #CBD6E2;
        .add-btn{
          padding: 17px 55px;
        }
      }
    }
    .el-tag{
      height: 28px;
      line-height: 26px;
    }
  }
  .addTag.el-popover{
    padding:10px;
    .el-popover__title{
      text-align: left;
    }
  }
  .tag-pop{
    .el-input{
      width: 179px;
    }
    .el-popover__title{
      margin: 10px 0 0 0;
      color: #33475B;
      font-size: 13px;
      font-weight: bold;
    }
  }
  .tag-btn{
    text-align: right;
    .el-button{
      font-size: 13px;
    }
    .el-button--text{
      color: #4F6D95;
    }
  }
  /* .el-dropdown-menu{
    .filter_country_logo{
      width: 24px;
      vertical-align: middle;
      margin-right: 5px;
      border-radius:4px;
      background: url('../../../static/img/ImageFlag/common.png') center no-repeat;
      background-size: 25px;
      height: 16px;
      display: inline-block;
    }
  } */
  .circle-score {
    position: relative;
    margin: 2px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #d6d6d6;
    .clip-left, .clip-right, .circle-left, .circle-right, .circle-360{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 34px;
      height: 34px;
    }
    .circle-left, .circle-right{
      border-radius: 50%;
      background: #EF4639;
    }
    .circle-left{
      transform: rotate(180deg)
    }
    .circle-right{
    }
    .circle-right, .clip-right {
      clip: rect(0, auto, auto, 16px);
    }
    .circle-left , .clip-left{
      clip: rect(0, 16px, auto, 0);
    }
    .circle-360{
      left: -1px;
      top: -1px;
      border: 1px solid #d6d6d6;
      border-radius: 50%;
    }
    .step3{
      background: #FDC441;
    }
    .step4{
      background: #54B3CF;
    }
    .step5{
      background: #7AC54E;
    }
    .stepbg{
      background: #d6d6d6;
    }
  }
  /*
  *当top和left取值为auto时，相当于0
  *当bottom和right取值为auto时，相当于100%
  */
  .circle-mask {
    position: absolute;
    left: 4px;
    top: 4px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
    background: #FFF;
    text-align: center;
  }
  .score-box{
    position: relative;
    .el-progress{
      path{
        stroke-width: 10px;
      }
    }
    .score-text{
      position: absolute;
      top: 5px;
      left: 4px;
      font-size: 12px;
      font-weight: bold;
      width: 25px;
      text-align: center
    }
    .el-progress__text{
      display: none;
    }
  }
  .el-table-filter{
    .el-checkbox + .el-checkbox{
      margin-left: 5px;
    }
  }
</style>
