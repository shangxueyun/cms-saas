<template>
  <div class="Project-Overview">
    <div class="collection-expenses clearfix"
         v-if="hasAuthority('09010101')"
         ref='ManagementAreasRef'>
      <i class="classifi projectContrast projectContrast2"></i>
      <span>
        管理面积
      </span>
      <div class="chart">
        <div id="ManagementAreas"
             :style="{width: '100%', height: '90%'}"></div>
      </div>
    </div>
    <div class="collection-expenses clearfix"
         v-if="hasAuthority('09010102')"
         ref='rentalRateRef'>
      <i class="classifi projectContrast projectContrast2"></i>
      <span>
        一手出租率
      </span>
      <div class="chart">
        <div id="rentalRate"
             :style="{width: '100%', height: '90%'}"></div>
      </div>
    </div>
    <div class="collection-expenses clearfix"
         v-if="hasAuthority('09010103')"
         ref='RentCollectionRate'>
      <i class="classifi projectContrast projectContrast2"
         style="top: -26px;"></i>
      <span style="line-height: 24px;">
        当年租金收缴率
        <br />
        <s style="color: #666666;text-decoration: none;font-size: 15px;font-weight: 500;">
          (数据截止日期：2022年6月)
        </s>
      </span>
      <div class="chart">
        <div id="PayableYear"
             :style="{width: '100%', height: '90%'}"></div>
      </div>
    </div>
    <!-- v-if="anchorList.includes(1) || anchorList.includes(2) || anchorList.includes(3) || anchorList.includes(4) && hasAuthority('090102')" -->
    <div class="pj-search"
         v-if="hasAuthority('090102')">
      <el-select size="small"
                 v-model="searchParame.manageEnterpriseId"
                 placeholder="管理企业">
        <el-option v-for="item in manageEnterpriseData"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>
      <div style="margin-left:0px;margin-top: 0px;  height: 32px;line-height: 32px;width: 80px;"
           @click="manageEnterpriseSelect"
           class="query-btn">查询</div>
    </div>
    <!-- 铺位出租率-企业 饼状图-->
    <div class="padd_bor"
         style="padding-right: 0;"
         v-if="hasAuthority('090102')">
      <section class="rental-rate"
               ref='rentalRateCompanyShopOccupancy'>
        <i class="classifi projOverview"
           style="background: transparent"></i>
        <span>出租率（房源面积）</span>
        <div class="chart">
          <div id="rentalRateCompanyShopOccupancy"
               :style="{width: '100%', height: '100%'}"></div>
          <div class="all-area">总面积：{{ CompanyallArea }}㎡</div>
        </div>
      </section>
    </div>
    <!-- 费用收缴-企业 柱状图-->
    <div class="padd_bor"
         v-if="hasAuthority('090102')">
      <section class="rental-rate clearfix"
               ref="CompanyFeesCollected">
        <i class="classifi projOverview"
           style="background: transparent"></i>
        <span class="section-title">费用收缴</span>
        <span class="datepicker"
              style="margin-left: 20px;margin-right: 20px;height: 30px;float: right">
          <el-date-picker style="width: 160px"
                          size="small"
                          @change="collectionGroupByMonth"
                          v-model="sjDatepicker2"
                          value-format="yyyy"
                          type="year"
                          :clearable="false"
                          placeholder="选择年">
          </el-date-picker>
        </span>
        <div class="chart">
          <div id="CompanyFeesCollected"
               :style="{width: '100%', height: '80%'}"
               style="margin-top: 15px;"></div>
        </div>
      </section>
    </div>
    <!-- 行业占比-企业 饼状图-->
    <div class="padd_bor"
         v-if="hasAuthority('090102')"
         style="height: 382px;padding-right: 0;">
      <section class="rental-rate"
               style="margin-top: 0;"
               ref="CompanyIndustryAccounted">
        <i class="classifi projOverview"
           style="top: -2px;background: transparent"></i>
        <span class="type-warp">
          行业占比（房源面积）
          <!-- {{currentAreaType}}分析
          （面积）
          <i class="iconfont icon-bottom"
            @click="showAreaType = !showAreaType"
            v-if="areaTypeList.length > 1"></i>

          <ul class="type-ul"
              v-show="showAreaType">
            <li v-for="(item, index) in areaTypeList" :key="index"
                @click="selectType(item, index)"
                :class="{'selected': index === selectedIdx}">{{item.name}}分析 (面积)</li>
          </ul> -->
        </span>
        <div class="chart">
          <div id="CompanyIndustryAccounted"
               :style="{width: '100%', height: '100%'}"></div>
          <div class="all-area">总面积：{{ CompanyIndustryAccountedAllArea }}㎡</div>
        </div>
      </section>
    </div>
    <!-- 税收指标完成率-企业 饼状图-->
    <div class="padd_bor"
         v-if="hasAuthority('090102')"
         style="height: 382px;">
      <section class="rental-rate"
               style="margin-top: 0;"
               ref='CompanyTargetCompletion'>
        <i class="classifi projOverview"
           style="background: transparent"></i>
        <span>税收指标完成率</span>
        <div class="chart">
          <div id="CompanyTargetCompletion"
               :style="{width: '100%', height: '100%'}"></div>
          <div class="all-area">税收总金额：{{ CompanyTargetCompletionAllArea }}万元</div>
        </div>
      </section>
    </div>
    <!-- 项目 -->
    <!-- v-if="anchorList.includes(1) || anchorList.includes(2) || anchorList.includes(3) || anchorList.includes(4) && hasAuthority('090103')" -->
    <div class="pj-search"
         v-if="hasAuthority('090103')">
      <el-select size="small"
                 v-model="searchParame.projectId"
                 placeholder="项目">
        <el-option v-for="item in projectListData"
                   :key="item.id"
                   :label="item.referred"
                   :value="item.id">
        </el-option>
      </el-select>
      <div style="margin-left:0px;margin-top: 0px;  height: 32px;line-height: 32px;width: 80px;"
           @click="projectIdSelect"
           class="query-btn">查询</div>
    </div>
    <!-- 铺位出租率-项目 饼状图-->
    <div class="padd_bor"
         v-if="hasAuthority('090103')"
         style="padding-right: 0;">
      <section class="rental-rate"
               ref='rentalRateProjectShopOccupancy'>
        <i class="classifi projOverview"
           style="background: transparent"></i>
        <span>出租率（房源面积）</span>
        <div class="chart">
          <div id="rentalRateProjectShopOccupancy"
               :style="{width: '100%', height: '100%'}"></div>
          <div class="all-area">总面积：{{ ProjectallArea }}㎡</div>
        </div>
      </section>
    </div>
    <!-- 历年税收 柱状图 -->
    <div class="padd_bor"
         v-if="hasAuthority('090103')">
      <section class="rental-rate"
               ref='rentalCalendarTax'>
        <i class="classifi projectContrast projectContrast2"
           style="background: transparent"></i>
        <span>
          历年税收
        </span>
        <div class="chart">
          <div id="rentalCalendarTax"
               :style="{width: '100%', height: '90%'}"></div>
        </div>
      </section>
    </div>
    <!-- 行业占比-项目 饼状图-->
    <div class="padd_bor"
         v-if="hasAuthority('090103')"
         style="height: 382px;padding-right: 0;">
      <section class="rental-rate"
               style="margin-top: 0;"
               ref="formatAnalysis">
        <i class="classifi projOverview"
           style="top: -2px;background: transparent"></i>
        <span class="type-warp">
          行业占比（房源面积）
          <!-- {{currentAreaType}}分析
          （面积）
          <i class="iconfont icon-bottom"
            @click="showAreaType = !showAreaType"
            v-if="areaTypeList.length > 1"></i>

          <ul class="type-ul"
              v-show="showAreaType">
            <li v-for="(item, index) in areaTypeList" :key="index"
                @click="selectType(item, index)"
                :class="{'selected': index === selectedIdx}">{{item.name}}分析 (面积)</li>
          </ul> -->
        </span>
        <div class="chart">
          <div id="formatAnalysis"
               :style="{width: '100%', height: '100%'}"></div>
          <div class="all-area">总面积：{{formatAllArea}}㎡</div>
        </div>
      </section>
    </div>
    <!-- 房源列表-项目 -->
    <div class="padd_bor table-colorP"
         v-if="hasAuthority('090103')"
         style="height: 382px;">
      <section class="rental-rate"
               style="margin-top: 0;"
               ref="noRentShop">
        <div class="st-title">
          <i class="classifi investmentModule"
             style="background: transparent"></i>
          <span>未租房源</span>
        </div>
        <el-table :data="noRentShopData"
                  :header-row-style="{ background: '#F3F8FE !important' }"
                  height="266"
                  style="background: #F3F8FE !important">
          <!-- <el-table-column prop="projectName"
                          label="项目"
                          align="center">
            <template slot-scope="scope">
              <div>{{scope.row.projectManagement.projectName}}</div>
              <span v-if="scope.row.contractEndDay>0 && onRent"
                    class="expire"
                    style="background-color: #f3cccb;padding: 2px 5px;border-radius: 4px;color: #EB605B;">合同{{scope.row.contractEndDay}}天后到期</span>
              <span v-if="scope.row.contractEndDay<=0 && onRent && scope.row.contractEndDay!==null"
                    class="expire"
                    style="background-color: #f3cccb;padding: 2px 5px;border-radius: 4px;color: #EB605B;">合同已到期</span>
            </template>                 
          </el-table-column> -->
          <el-table-column prop="building.buildingName"
                           label="楼宇"
                           align="center"></el-table-column>
          <el-table-column label="楼层"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.floor.name}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="招商指导价"
                          align="center">
            <template slot-scope="scope">
              {{scope.row.priceAndUnit}}
            </template>
          </el-table-column> -->
          <el-table-column label="房源号"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.shopNumber}}
            </template>
          </el-table-column>
          <el-table-column label="建筑面积/㎡"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.buildingArea}}
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="wzBerth(scope.$index, scope.row)"
                         style="color: #3575F6"
                         type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="ctc-foot1"
             v-if="noRentShopData && noRentShopData.length > 0">
          <span style="margin: 0"><span style="margin: 0;margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size="pager.pgSize"
                         :total="pager.total"
                         :current-page.sync="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
          <!-- <div class="pagingnum">
            显示 <select v-model="pager.pgSize"
                    @change="pgSizeSelectFn">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目
          </div> -->
        </div>
      </section>
    </div>
    <!-- 租赁房源 -->
    <!-- v-if="isOnSubscribe('6') && hasAuthority('09010201')" -->
    <div class="signing-tenants"
         v-if="hasAuthority('090104')"
         ref="rentalhousing">
      <div class="st-title">
        <i class="classifi investmentModule"></i>
        <span>租赁房源</span>
      </div>
      <div class="searchbar">
        <el-select size="small"
                   clearable
                   v-model="rhSearchParame.organizeId"
                   @change="getProject(rhSearchParame.organizeId)"
                   placeholder="管理企业">
          <el-option v-for="item in manageEnterpriseData"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select size="small"
                   clearable
                   multiple
                   collapse-tags
                   v-model="rhSearchParame.projectManagemantId"
                   placeholder="项目">
          <el-option v-for="item in rhProjectListData"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <div style="display: flex;align-items: center;">
          <el-checkbox v-model="rhSearchParame.onExpireDay"></el-checkbox>
          包含
          <el-select size="small"
                     style="width: 100px;margin: 0 10px;"
                     v-model="rhSearchParame.expireDay"
                     placeholder="天数">
            <el-option label="30天内"
                       value="30"></el-option>
            <el-option label="60天内"
                       value="60"></el-option>
            <el-option label="90天内"
                       value="90"></el-option>
            <el-option label="180天内"
                       value="180"></el-option>
            <el-option label="360天内"
                       value="360"></el-option>
          </el-select>
          到期房源
        </div>
        <el-input style="width: 170px;margin-right: 10px;"
                  size="small"
                  placeholder="建筑面积"
                  v-model="rhSearchParame.sortBuildingArea">
        </el-input>㎡
        <el-input style="width: 170px;margin: 0 10px;"
                  size="small"
                  placeholder="租金单价"
                  v-model="rhSearchParame.sortExpectedUnitPrice">
        </el-input>元/(m²·天)
        <el-input style="width: 170px;margin: 0 10px;"
                  size="small"
                  placeholder="地址"
                  v-model="rhSearchParame.sortAddress">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
        </el-input>
        <div style="flex: 1;text-align: right">
          <div @click="pager1.currentPage = 1;getRentalhous1()"
               class="query-btn inline-query-btn">查询</div>
        </div>
      </div>
      <el-table :data="rentalHousData"
                style="border:1px solid #eee"
                :class="{'table-height': tableHeightYxTenant}">
        <el-table-column prop="building.organizeName"
                         label="管理企业"
                         align="center"></el-table-column>
        <el-table-column prop="building.projectManagementDTO.referred"
                         label="项目名称"
                         align="center"></el-table-column>
        <el-table-column label="楼宇名称"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.building.buildingName}}
          </template>
        </el-table-column>
        <el-table-column label="地址"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.building.address}}
          </template>
        </el-table-column>
        <el-table-column label="房源号"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.shopNumber}}
          </template>
        </el-table-column>
        <el-table-column label="建筑面积 (m²)"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.buildingArea}}
          </template>
        </el-table-column>
        <el-table-column label="租金 元/(m²·天)"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.expectedUnitPrice | toLocaleStringRent }}
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.contractEndDay && scope.row.contractEndDay > 0 ? scope.row.contractEndDay + '天后到期' : '空置'}}
          </template>
        </el-table-column>
        <el-table-column label="联系人"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.contact}}
          </template>
        </el-table-column>
        <el-table-column label="联系电话"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.telephone}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="wzBerth(scope.$index, scope.row)"
                       v-if="hasAuthority('09010401') && hasAuthority('02020203')"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="ctc-foot1"
           v-if="rentalHousData && rentalHousData.length > 0">
        <span><span style="margin-right:10px">{{pager1.currentPage}}/{{Math.ceil(pager1.total/pager.pgSize)}}页</span> 共{{pager1.total}}条记录</span>
        <el-pagination v-if="pager1.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager1.pgSize"
                       :total="pager1.total"
                       :current-page.sync="pager1.currentPage"
                       @current-change="current_change1">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pager1.pgSize"
                  @change="pgSizeSelectFn1">
            <option v-for="item in pager1.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- 客户列表 -->
    <div class="signing-tenants"
         v-if="hasAuthority('090106')"
         ref="customerlist">
      <div class="st-title">
        <i class="classifi investmentModule"></i>
        <span>客户列表</span>
      </div>
      <div class="searchbar">
        <el-select size="small"
                   clearable
                   v-model="stSearchParame.organizeId"
                   placeholder="管理企业">
          <el-option v-for="item in manageEnterpriseData"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-cascader v-model="stSearchParame.industryId"
                     filterable
                     clearable
                     size="small"
                     :props="industryPropsTree"
                     :options="industryOptionsTree"
                     @change="handleIndustryChange"
                     placeholder="行业">
        </el-cascader>
        <el-select size="small"
                   clearable
                   v-model="stSearchParame.employeesNumber"
                   placeholder="就业人数">
          <el-option v-for="item in employment"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select size="small"
                   clearable
                   v-model="stSearchParame.taxNumber"
                   placeholder="当年税收">
          <el-option v-for="item in currentYearTax"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="stSearchParame.companyQualification"
                   size="small"
                   clearable
                   placeholder="企业资质">
          <el-option label="高新技术"
                     value="HIGH_TECH"></el-option>
          <el-option label="科技小巨人"
                     value="TECHNOLOGY_GIANT"></el-option>
          <el-option label="上市企业"
                     value="LISTED_COMPANY"></el-option>
          <el-option label="其他"
                     value="OTHER"></el-option>
        </el-select>
        <el-select v-model="stSearchParame.businessRegister"
                   size="small"
                   clearable
                   placeholder="工商注册">
          <el-option label="本镇本村"
                     value="BZBC"></el-option>
          <el-option label="本镇外村"
                     value="BZWC"></el-option>
          <el-option label="镇外注册"
                     value="ZWZC"></el-option>
          <el-option label="未注册"
                     value="WZC"></el-option>

        </el-select>
        <el-select v-model="stSearchParame.registerType"
                   size="small"
                   clearable
                   placeholder="注册类别">
          <el-option label="实地"
                     value="ON_THE_SPOT"></el-option>
          <el-option label="挂靠"
                     value="AFFILIATED"></el-option>
        </el-select>
        <el-select size="small"
                   clearable
                   v-model="stSearchParame.taxRegistration"
                   placeholder="税务登记">
          <el-option label="本镇本村"
                     value="BZBC"></el-option>
          <el-option label="本镇外村"
                     value="BZWC"></el-option>
          <el-option label="镇外登记"
                     value="ZWZC"></el-option>
          <el-option label="未登记"
                     value="WZC"></el-option>
        </el-select>
        <el-input style="width: 170px;margin: 0 10px;"
                  size="small"
                  placeholder="客户名称"
                  v-model="stSearchParame.tenantName">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
        </el-input>
        <div style="flex: 1;text-align: right">
          <div @click="pager2.currentPage = 1;getCustomerList()"
               class="query-btn inline-query-btn">查询</div>
        </div>
      </div>
      <el-table :data="customerListData"
                style="border:1px solid #eee"
                :class="{'table-height': tableHeightYxTenant}">
        <el-table-column prop="organizeName"
                         label="管理企业"
                         align="center"></el-table-column>
        <el-table-column prop="teantName"
                         label="客户名称"
                         align="center"></el-table-column>
        <el-table-column label="行业"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.standardIndustryName}}
          </template>
        </el-table-column>
        <el-table-column label="就业人数"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.employeesNumber}}
          </template>
        </el-table-column>
        <el-table-column label="企业资质"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.companyQualificationDescription}}
          </template>
        </el-table-column>
        <el-table-column label="工商注册"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.businessRegisterDescription}}
          </template>
        </el-table-column>
        <el-table-column label="注册类别"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.registerTypeDescription}}
          </template>
        </el-table-column>
        <el-table-column label="税务登记"
                         align="center">
          <template slot-scope="scope">
            {{taxRegistrationFormated(scope.row.taxRegistration)}}
          </template>
        </el-table-column>
        <el-table-column label="租赁面积 (m²)"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.buildingArea}}
          </template>
        </el-table-column>
        <el-table-column label="当年税收 (万元)"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.taxAmount}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="tenantDetailhandle(scope.$index, scope.row)"
                       v-if="hasAuthority('09010601') && hasAuthority('02030104')"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="ctc-foot1"
           v-if="customerListData && customerListData.length > 0">
        <span><span style="margin-right:10px">{{pager2.currentPage}}/{{Math.ceil(pager2.total/pager.pgSize)}}页</span> 共{{pager2.total}}条记录</span>
        <el-pagination v-if="pager2.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager2.pgSize"
                       :total="pager2.total"
                       :current-page.sync="pager2.currentPage"
                       @current-change="current_change2">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pager2.pgSize"
                  @change="pgSizeSelectFn2">
            <option v-for="item in pager1.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- <section class="rental-rate clearfix"
             v-if="isOnSubscribe('15') && hasAuthority('09010101')"
             ref="averageRent2">
      <i class="classifi projOverview"></i>
      <span class="section-title">平均租金
        <el-tooltip class="item"
                    effect="dark"
                    placement="right-start">
          <div slot="content">建筑面积平均租金</div>
          <i class="icon question-mark-icon"></i>
        </el-tooltip>
      </span>
      <span class="datepicker"
            style="margin-left: 0;margin-right: 20px;height: 30px;float: right">
        <el-date-picker style="width: 160px"
                        @change="getAverageRent2"
                        value-format="yyyy-MM"
                        v-model="arEndDate"
                        type="month"
                        size="small"
                        :clearable="false"
                        :picker-options="pickerBeginDateAfter"
                        placeholder="选择月">
        </el-date-picker>
      </span>
      <span style="float: right;margin: 25px 20px 0 0;">-</span>
      <span class="datepicker"
            style="margin-left: 0;margin-right: 20px;height: 30px;float: right">
        <el-date-picker style="width: 160px"
                        @change="getAverageRent2"
                        v-model="arStartDate"
                        value-format="yyyy-MM"
                        type="month"
                        size="small"
                        :clearable="false"
                        :picker-options="pickerBeginDateBefore"
                        placeholder="选择月">
        </el-date-picker>
      </span>
      <div class="chart">
        <div id="averageRent2"
             :style="{width: '100%', height: '80%'}"
             style="margin-top: 10px"></div>
      </div>
    </section> -->
    <!-- <div class="signing-tenants" v-if="isOnSubscribe('4')" ref="signingTenants">
      <div class="st-title">
        90天内签约客户
      </div>
      <el-table :data="tableData" style="border:1px solid #eee">
        <el-table-column  prop="index" label="序号" align="center"></el-table-column>
        <el-table-column  prop="tenantName" label="客户名称" align="center"></el-table-column>
        <el-table-column  label="品牌" align="center">
          <template slot-scope="scope">
            {{scope.row.referred}}
          </template>
        </el-table-column>
        <el-table-column  label="项目" align="center" >
          <template slot-scope="scope">
            {{scope.row.projectName}}
          </template>
        </el-table-column>
        <el-table-column label="类型"  prop="customerType" align="center"  :formatter="customerTypeFormat"></el-table-column>
        <el-table-column  label="业态" align="center" >
          <template slot-scope="scope">
            {{scope.row.industry}}
          </template>
        </el-table-column>
        <el-table-column  label="房源号" align="center" >
          <template slot-scope="scope">
            {{scope.row.roomsNo}}
          </template>
        </el-table-column>
        <el-table-column  label="运营支持人" align="center" >
          <template slot-scope="scope">
            {{scope.row.operateUserName}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini" >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    <!-- <div class="signing-tenants"
         v-if="isOnSubscribe('6') && hasAuthority('09010201')"
         ref="yxTenant">
      <div class="st-title">
        <i class="classifi investmentModule"></i>
        <span>当前意向客户</span>
        <div @click="pager1.currentPage = 1;getIntentionalCustomer()"
             class="query-btn inline-query-btn">查询</div>
        <el-input style="width: 170px;float: right;margin-right: 20px;"
                  size="small"
                  placeholder="客户名称/品牌名称"
                  v-model="brandName">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-table :data="yxTenantData"
                style="border:1px solid #eee"
                :class="{'table-height': tableHeightYxTenant}">
        <el-table-column prop="projectName"
                         label="项目"
                         align="center"></el-table-column>
        <el-table-column prop="customerType"
                         label="客户类型"
                         align="center"
                         :formatter="customerTypeFormat"></el-table-column>
        <el-table-column label="客户名称"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.tenantName}}
          </template>
        </el-table-column>
        <el-table-column label="品牌名称"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.referred}}
          </template>
        </el-table-column>
        <el-table-column label="行业"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.industry}}
          </template>
        </el-table-column>
        <el-table-column label="联系人/联系电话"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.contact}} / {{scope.row.telephone}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="handleYx(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="ctc-foot1"
           v-if="yxTenantData && yxTenantData.length > 0">
        <span><span style="margin-right:10px">{{pager1.currentPage}}/{{Math.ceil(pager1.total/pager.pgSize)}}页</span> 共{{pager1.total}}条记录</span>
        <el-pagination v-if="pager1.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager1.pgSize"
                       :total="pager1.total"
                       :current-page.sync="pager1.currentPage"
                       @current-change="current_change1">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pager1.pgSize"
                  @change="pgSizeSelectFn1">
            <option v-for="item in pager1.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div> -->
    <!-- <div class="signing-tenants"
         v-if="isOnSubscribe('9') && hasAuthority('09010301')"
         ref="billMaturity"
         style="margin-bottom: 20px;">
      <div class="st-title">
        <div class="hourse_tab clearfix">
          <i class="classifi operateModule"></i>
          <span>当前账单</span>
          <div @click="pager2.currentPage = 1;billsNow();sumAmount()"
               class="query-btn inline-query-btn">查询</div>
          <div style="float: right">
            <el-select v-model="billType"
                       placeholder="请选择账单类型"
                       style="width: 160px;margin-right: 10px;"
                       size="small">
              <el-option v-for="item in billOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="feeType"
                       placeholder="请选择费用类型"
                       style="width: 160px;margin-right: 10px;"
                       size="small"
                       :clearable=true>
              <el-option v-for="item in costOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
            <el-input size="medium"
                      style="width: 170px;margin-right: 20px;"
                      placeholder="客户名称/品牌名称"
                      v-model="queryName">
              <i slot="prefix"
                 class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
      </div>
      <el-table :data="billTableData"
                show-summary
                :summary-method="getSummaries"
                style="border:1px solid #eee"
                :class="{'table-height': tableHeight}">
        <el-table-column prop="tenantName"
                         label="客户名称"
                         align="center"></el-table-column>
        <el-table-column label="品牌名称"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.referred}}
          </template>
        </el-table-column>
        <el-table-column label="应收时间"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.finalPaymentDate}}
            <div style="color: #BF1E1E"
                 v-if="scope.row.expectedDay"><i class="beOverdueIcon"></i>逾期{{scope.row.expectedDay}}天</div>
          </template>
        </el-table-column>
        <el-table-column label="费用类型"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.feeTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="账单金额"
                         align="center"
                         prop="amount">
          <template slot-scope="scope">
            {{scope.row.amount | toLocaleString}}
          </template>
        </el-table-column>
        <el-table-column label="已收金额"
                         align="center"
                         prop="writeOffAmount">
          <template slot-scope="scope">
            {{scope.row.writeOffAmount}}
          </template>
        </el-table-column>
        <el-table-column label="待收金额"
                         align="center"
                         prop="arrearsAmount">
          <template slot-scope="scope">
            {{scope.row.arrearsAmount | toLocaleString}}
          </template>
        </el-table-column>
        <el-table-column label="账单状态"
                         prop="billStatus"
                         align="center"
                         :formatter="formatterBillStatus"></el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="billDetail(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="billTableData.length > 0"
           class="plc-table-bottom">
        <ul class="ctable">
          <li style="width: 183px;">合计</li>
          <li></li>
          <li></li>
          <li></li>
          <li>{{totalData.amount | toLocaleString}}元</li>
          <li>{{totalData.writeOffAmount | toLocaleString}}元</li>
          <li>{{totalData.arrearsAmount | toLocaleString}}元</li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="ctc-foot1"
           v-if="billTableData && billTableData.length > 0">
        <span><span style="margin-right:10px">{{pager2.currentPage}}/{{Math.ceil(pager2.total/pager.pgSize)}}页</span> 共{{pager2.total}}条记录</span>
        <el-pagination v-if="pager2.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager2.pgSize"
                       :total="pager2.total"
                       :current-page.sync="pager2.currentPage"
                       @current-change="current_change2">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pager2.pgSize"
                  @change="pgSizeSelectFn2">
            <option v-for="item in pager2.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div> -->
    <!-- 账单详情 -->
    <!-- <bill-details v-if="detailsdrawershow"
                  :detailsdrawershow="detailsdrawershow"
                  :detailsData="builddetailsData"
                  @drawerClose="drawerClose"
                  @handleEdit="billDetail"
                  @query='queryBill'
                  ref="billDetail"></bill-details> -->
    <!-- 多经账单详情 -->
    <!-- <income-details v-if="incdDetailsdrawershow"
                    :detailsdrawershow="incdDetailsdrawershow"
                    :detailsData="builddetailsData"
                    @drawerClose="drawerClose"
                    @handleEdit="billDetail"
                    @query='queryBill'
                    ref="billDetail"></income-details> -->
    <!-- 意向客户详情 -->
    <!-- <pot-clien-dtl :detailsdrawershow="pcdetailsShow"
                   :yxkhFrom="yxkhFrom"
                   :options2="projectOptions"
                   :pageType="pageType"
                   :draweDetaileData="pcdetaileData"
                   :timeLineListData="timeLineListData"
                   :isAllYXtenant="isAllYXtenant"
                   :project="project"
                   ref="potClienDtl"
                   @addFlowListSuccess="addFlowListSuccess"
                   @shopDetails="shopDetails"
                   @addProgressFn="addProgressFn"
                   @refreshList="refreshList"
                   @drawerClose="detailsClose"></pot-clien-dtl> -->
    <!-- 客户详情 -->
    <!-- <tenant-details :detailsdrawershow="detailsShow"
                    :tenantDetail="detailDataes"
                    ref="tenantDetails"
                    @affirmDialog="affirmDialog"
                    @drawerClose="tenantDetailsClose"
                    @query="query"
                    @handleEdit="handleEdit"
                    v-if="detailsShow"></tenant-details> -->
    <!-- 房源详情 -->
    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options1="projectOptions"
                   ref="storeDetailis"
                   @queryList="getRentalhous1"
                   @shopDetails="shopDetails"
                   @showStoreDetails="showStoreDetails"
                   @handleEdit='wzBerth'
                   @tenantHandleEdit='tenantHandleEdit'
                   @drawerClose="storeDetailisHide" />
    <!-- 合同详情 -->
    <!-- <contractsDetails :detailsdrawershow="contractsDetailsShow"
                      :detailData="contractsDetailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="contractDrawerClose"
                      @showTenant="showTenant" /> -->
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="tdDetailsShow"
                   :tenantDetail="detailData"
                   :checkData='checkData'
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   @query="getCustomerList"
                   @handleEdit="tenantDetailhandle"
                   v-if="tdDetailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="detailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import tenantDetails from '@/views/operationManagement/tenantInfo/components/tenantDetails'
import riskDetails from '@/views/operationManagement/tenantInfo/components/riskDetails'
// import potClienDtl from '@/views/financialManagement/mnangement/potlClientsList/components/potClienDtl'
// import incomeDetails from '@/views/operations/varietyBusiness/income/components/incomeDetails'
// import billDetails from '@/views/operations/costCollection/billList/components/billDetails'
import storeDetailis from '@/views/project/housingList/components/storeDetailis'
import { toLocaleString } from '@/utils/validate.js'
// import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails.vue'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
export default {
  name: '',
  props: ['projectIdSelected', 'anchorList', 'projectOptions'],
  components: {
    // potClienDtl,
    tenantDetails,
    riskDetails,
    // billDetails,
    // incomeDetails,
    storeDetailis
    // contractsDetails
  },
  data () {
    return {
      totalData: '',
      arStartDate: '',
      arEndDate: '',
      endDate: '',
      startDate: '',
      brandName: '',
      berthNumber: '',
      myyear: '',
      mymonth: '',
      condition: 'MONTH',
      twoCharCondition: 'MONTH',
      tenantOptions: '',
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      rentalRateDatepicker: '',
      storeDetailisShow: false,
      incdDetailsdrawershow: false,
      builddetailsData: {},
      detailsdrawershow: false,
      tableHeightYxTenant: false,
      tableHeightRentShop: false,
      tableHeightTenant: false,
      tableHeight: false,
      pageType: 'readOnly',
      datepicker: ['', ''],
      gkDatepicker: ['', ''],
      projectId: '',
      onRent: false,
      searchParame: {
        manageEnterpriseId: '',
        projectId: ''
      },
      rhSearchParame: {
        expireDay: '30'
      },
      CompanyallArea: '',
      formatAllArea: '',
      CompanyIndustryAccountedAllArea: '',
      CompanyTargetCompletionAllArea: '',
      ProjectallArea: '',
      sjDatepicker: '',
      sjDatepicker2: '',
      tableData: [],
      billTableData: [],
      noRentShopData: [],
      yxTenantData: [],
      yearsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      yearsListId: '',
      isAllYXtenant: false,
      timeLineListData: '', // 时间轴数据,
      yxTenantDTOStorage: '', // 意向客户信息
      project: [], // 工程条件列表
      pcdetailsShow: false,
      detailsShow: false,
      onExpected: false,
      yxkhFrom: '',
      queryName: '',
      detailDataes: {},
      building: {}, // 房源房源信息
      addProgressFrom: false,
      activeNames: ['1'],
      activeName: 1,
      feeType: '',
      billType: null,
      tenantIds: '',
      twoCharDate: '',
      averageRentDate: '',
      twoCharDatepicker: '',
      twoCharDatepicker2: '',
      costOptions: [],
      billOptions: [{ value: '全部账单', id: null }, { value: '当月账单', id: false }, { value: '逾期账单', id: true }],
      options3: [
        { label: '元/m²·天', value: 'M2DAYS' },
        { label: '元/月', value: 'M2MONTH' }
      ],
      pcdetaileData: {
        projectManagementDTO: {},
        projectConditions: []
      },
      addProgressRules: {
        followTime: [
          { required: true, message: '请填写跟进时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请填写跟进记录', trigger: 'change' }
        ]
      },
      followRecordDTOParams: {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      },
      navList: [{ label: '本期账单', value: true }, { label: '逾期未结清', value: false }],
      addParmas: {
        projectManagementDTO: '', // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 企业名称/姓名
        referred: '', // 品牌名称
        industryId: '', // 行业ID
        industryName: '', // 行业名
        lowArea: '', // 需求面积小
        highArea: '',
        lowPrice: '', // 心理价位小
        highPrice: '',
        priceUnit: 'M2DAYS', // 价格单位
        signDate: '', // 预计开店时间
        contact: '', // 联系人
        telephone: '', // 联系电话
        customerSource: '', // 客户来源
        customerSourceId: '', // 客户来源id
        remark: '', // 客户备注
        annexes: [ // 附件
        ],
        projectConditions: [ // 工程条件   projectType工程类型 (KWH用电量, SWWER排污水, WASTE_WATER排废水, FEED_WATER给水, AIR_CONDITION空调, OIL_DIAIN排油, FLUE烟道, CAS燃气)
          // {projectType: '', needValue: ''}
        ]
      },
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 5,
        pgNumoptions: [
          {
            value: 5,
            label: '5'
          },
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      pager1: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 5,
        pgNumoptions: [
          {
            value: 5,
            label: '5'
          },
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      pager2: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 5,
        pgNumoptions: [
          {
            value: 5,
            label: '5'
          },
          {
            value: 15,
            label: '15'
          },
          {
            value: 30,
            label: '30'
          },
          {
            value: 50,
            label: '50'
          }
        ]
      },
      pickerDate: {
        disabledDate: time => {
          return time.getTime() > new Date().getTime()
        }
      },
      pickerBeginDate: {
        disabledDate: time => {
          let endDateVal = this.gkDatepicker[1]
          let beginDateVal = this.gkDatepicker[0]
          if (beginDateVal || endDateVal) {
            let temp2 = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(temp2).getTime()
          }
        }
      },
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.arEndDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 11 * 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.arStartDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
      contractsDetailsShow: false,
      contractsDetailData: {},
      withdrawalData: {},
      areaTypeList: [],
      currentAreaType: '',
      showAreaType: false,
      selectedIdx: 0,
      CompanyShopOccupancy: [], // 企业铺位
      ProjectShopOccupancy: [], // 项目铺位
      projectListData: [],
      manageEnterpriseData: [],
      // projectOptions: [],
      roomsRowId: '',
      containChecked: false,
      rentalHousData: [],
      customerListData: [],
      rhProjectListData: [],
      industryPropsTree: { label: 'name', value: 'id', children: 'child', expandTrigger: 'hover', emitPath: true, checkStrictly: true },
      industryOptionsTree: [],
      stSearchParame: {},
      employment: [{
        label: '10人以下',
        value: '0'
      }, {
        label: '10~50人',
        value: '10'
      }, {
        label: '50~100人',
        value: '50'
      }, {
        label: '100~500人',
        value: '100'
      }, {
        label: '500人以上',
        value: '500'
      }],
      currentYearTax: [{
        label: '1万以下',
        value: '0'
      }, {
        label: '1~10万',
        value: '1'
      }, {
        label: '10~100万',
        value: '10'
      }, {
        label: '100~1000万',
        value: '100'
      }, {
        label: '1000万以上',
        value: '1000'
      }],
      tdDetailsShow: false,
      detailData: {},
      checkData: [],
      riskTab: 0,
      riskDetailsShow: false,
      flag: false // flag  true代表经营数据 false税收数据
    }
  },
  watch: {
    projectIdSelected: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.projectId = this.projectIdSelected
        } else {
          if (this.projectOptions.length > 0) {
            this.projectId = this.projectOptions[0].id
          }
        }
      },
      immediate: true
    },
    anchorList: {
      handler: function () {
        this.$nextTick(() => {
          this.search()
        })
      }
    }
  },
  created () {
    // this.getFeeType()
    // this.customerSource()
    this.sjDatepickerTimes()
    // 新视图

    // 获取管理企业数据接口
    this.getManageEnterprise()
    this.getAllIndustry()
  },
  mounted () {
    this.$nextTick(() => {
      // this.search()
    })
  },
  methods: {
    addFlowListSuccess (data) { // 新增跟进成功 参数为跟进信息
      this.timeLineListData = data
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    async getManageEnterprise () {
      let result = await context.http.get('uaa/api/organizes/enterprise/user?organizeType=ENTERPRISE&useStatus=USING')
      this.manageEnterpriseData = result.data
      // 默认第一个
      this.searchParame.manageEnterpriseId = result.data[0].id
      //
      this.SelectData()
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions = result.data
      this.projectId = this.$route.params.projectId ? this.$route.params.projectId : this.projectOptions[0].id
    },
    sjDatepickerTimes () {
      var now = new Date()
      var myyear = now.getFullYear()
      var mymonth = now.getMonth() + 1
      var myday = now.getDate()
      mymonth = mymonth < 10 ? '0' + mymonth : mymonth
      myday = myday < 10 ? '0' + myday : myday
      let startData = myyear + '-01' + '-01'
      let endData = myyear + '-' + mymonth + '-' + myday
      this.startDate = startData
      this.endDate = endData
      this.gkDatepicker = [startData, endData]
      this.myyear = myyear
      this.mymonth = mymonth
      let myyearandm = myyear + '-' + mymonth
      this.sjDatepicker = myyearandm
      this.twoCharDatepicker = myyearandm
      this.rentalRateDatepicker = myyearandm
      this.arStartDate = myyear + '-01'
      this.arEndDate = myyearandm
      this.averageRentDate = myyearandm
      this.sjDatepicker2 = this.myyear + ''
    },
    isOnSubscribe (id) { // 模块是否订阅
      for (var i = 0; i < this.anchorList.length; i++) {
        if (Number(this.anchorList[i]) === Number(id)) {
          return true
        }
      }
    },
    queryProject (id) {
      this.queryProjectList(id)
    },
    // 管理面积 || 出租率
    async queryProjectList (id) {
      let result = await context.http.get('cms/api/getOrganiz/infoByids/all', { useStatus: 'USING', ids: '' })
      if (result.status === 200) {
        // 出租率
        if (this.hasAuthority('09010102')) {
          let ObjArr1 = this.ObjFor(result.data, 'rentRate', 'organizeName')
          this.rentalRateChar(ObjArr1.NameArr, ObjArr1.valueArr, 'rentalRate', '出租率', '%')
        }
        // 管理面积
        if (this.hasAuthority('09010101')) {
          let ObjArr2 = this.ObjFor(result.data, 'area', 'organizeName')
          ObjArr2.valueArr.forEach((v, i) => {
            // 保留真实数据的一位小数
            // let num = Number(v / 10000).toString()
            // ObjArr2.valueArr[i] = num = num.substring(0, num.indexOf('.') + 2)
            // 四舍五入保留一位小数
            ObjArr2.valueArr[i] = Number(v / 10000).toFixed(1)
          })
          this.rentalRateChar(ObjArr2.NameArr, ObjArr2.valueArr, 'ManagementAreas', '面积', '万m²')
        }
        // 当年租金收率缴
        if (this.hasAuthority('09010103')) {
          let ObjArr3 = this.ObjFor(result.data, 'Yield', 'organizeName')
          this.rentalRateChar(['工业公司', '外资公司', '上虹公司', '资产公司', '虹桥村', '虹二村', '虹四村', '虹五村', '虹六村', '红春村', '新桥村', '西郊村', '先锋村', '井亭村', '科技园区', '紫晶公司'],
          ['50.7', 71.7, 42.8, 115.3, 46.0, 34.1, 50.2, '60.9', '45.1', 52.3, 52.4, 112.5, 61.9, 49.3, 130.5, 34.0], 'PayableYear', '收缴率', '%')
        }
      }
    },
    ObjFor (data, key, name) {
      let valueArr = []
      let NameArr = []
      data.forEach(ele => {
        if (key === 'Yield') {
          // 数据造假
          valueArr.push(ele[key] === undefined ? Number(Math.random(100) * 100).toFixed(2) : ele[key])
        } else {
          valueArr.push(ele[key] === null ? '' : ele[key])
        }
        NameArr.push(ele[name] === null ? '' : ele[name])
      })
      return { valueArr, NameArr }
    },
    search () {
      this.tenantIds = ''
      this.tenantOptions = []
      // if (this.$refs.collectionExpenses) {
      //   this.collectionGroupByFeeType()
      // }
      if (this.$refs.ManagementAreasRef || this.$refs.RentCollectionRate || this.$refs.rentalRateRef) {
        this.queryProjectList()
      }
      if (this.$refs.collectionRateCom) {
        this.getCollectionRate()
      }
      // if (this.$refs.rentalRateRef) {
      //   this.getRentalRate()
      // }
      if (this.$refs.rentalRate2Ref) {
        this.getRentalRate2()
      }
      if (this.$refs.formatAnalysis) {
        this.getFormatAnalysis()
      }
      if (this.$refs.collectionOfExpenses) {
        this.collectionGroupByMonth()
      }
      // if (this.$refs.signingTenants) {
      //   this.getSigningTenants()
      // }
      // if (this.$refs.noRentShop) {
      //   this.getNoRentShop()
      // }
      if (this.$refs.yxTenant) {
        this.getIntentionalCustomer()
        this.getProjectList()
      }
      if (this.$refs.billMaturity) {
        this.billsNow()
        this.sumAmount()
      }
      if (this.$refs.averageRent) {
        this.getAverageRent()
      }
      if (this.$refs.averageRent2) {
        this.getAverageRent2()
      }
      if (this.$refs.rentalhousing) {
        this.getRentalhous1()
      }
      if (this.$refs.customerlist) {
        this.getCustomerList()
      }
    },
    queryBerth () { },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.onExpected = false
      } else if (inx === 1) {
        this.onExpected = true
      }
      this.pager2.currentPage = 1
      this.billsNow()
    },
    formatterBillStatus (row, column) {
      let res = ''
      if (row.billStatus === 'APPROVAL') {
        res = '减免审核中'
      } else if (row.billStatus === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (row.billStatus === 'NO') {
        res = '未付款'
      } else if (row.billStatus === 'OK') {
        res = '已结清'
      } else if (row.billStatus === 'SECTION') {
        res = '部分结清'
      } else if (row.billStatus === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    drawerClose () {
      this.detailsdrawershow = false
      this.incdDetailsdrawershow = false
    },
    getProjectId () {
      this.$emit('getProject', this.projectId) // 触发事件
    },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    async getFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.costOptions = result1.data.concat(result2.data)
    },
    collection (dateArray, seriesData) {
      var yMax = 100
      var dataShadow = []
      for (var i = 0; i < seriesData.length; i++) {
        dataShadow.push(yMax)
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('collection'))
      // if (!this.$refs.collectionRateCom) {
      //   return
      // }
      // let myChart = this.$echarts.init(this.$refs.collectionRateCom)
      myChart.clear()
      // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[1]
            return item.axisValue + '<br>' + '收缴率：' + item.data + '%'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              interval: 0,
              // rotate: 40,
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '%',
            nameTextStyle: {
              color: '#666666'
            },
            position: 'left',
            max: 100,
            min: 0,
            scale: true,
            interval: 25,
            splitNumber: 4,
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            barMaxWidth: '18',
            itemStyle: {
              normal: { color: 'rgba(0,0,0,0.05)' }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            name: '费用收缴完成率',
            type: 'bar',
            barMaxWidth: '18',
            data: seriesData,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                // color: function (d) { return '#' + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16) }
                // color: function (params) {
                //   var colorList = ['#6652F6', '#7BC1E7', '#0A93EA', '#ED645E', '#99C855', '#EBC05B', '#528BEF', '#6652F6']
                //   let val = params.dataIndex >= colorList.length ? (params.dataIndex % 8) : params.dataIndex
                //   return colorList[val]
                // }
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#68D0FB' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#1552FF' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    costProfile (sourceData) {
      let myChart = this.$echarts.init(document.getElementById('costProfile'))
      myChart.clear()
      let option = {
        color: ['#3C5DFD', '#E64E28'],
        legend: {
          x: 'center',
          y: 'bottom',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10 //
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[0]
            const collectionRate = isNaN(item.data[2] / item.data[1]) ? 0 : (item.data[2] / item.data[1] * 100).toFixed(2)
            return item.name + '<br>' + '应收：' + (item.data[1]).toFixed(2) + '元' + '<br>' + '已收：' + (item.data[2]).toFixed(2) + '元' + '<br>' + '欠收：' + (item.data[1] - item.data[2]).toFixed(2) + '元' + '<br>' + '收缴率：' + collectionRate + '%'
          }
        },
        dataset: {
          source: sourceData
        },
        xAxis: {
          type: 'category',
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            lineStyle: {
              color: '#DCDCDC', // 颜色
              width: 1 // 粗细
            }
          },
          axisLabel: {// x轴文字的配置
            show: true,
            textStyle: {
              color: '#666666'
            }
          }
        },
        yAxis: {
          'axisLine': {       // y轴
            'show': false
          },
          'axisTick': {       // y轴刻度线
            'show': false
          },
          splitLine: {// 分割线配置
            show: true,
            lineStyle: {
              color: '#DCDCDC'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            }
          },
          {
            type: 'bar',
            barMaxWidth: '30',
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0]
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getRentalRate () {
      if (!this.rentalRateDatepicker) {
        return
      }
      context.http.get(`/cms/api/reportRented/statistics/all`, { date: this.rentalRateDatepicker }).then(res => {
        if (res.status === 200) {
          let datearr = []
          let collectionRate = []
          res.data.forEach(ele => {
            datearr.push(ele.projectName)
            collectionRate.push(ele.rentedRate)
          })
          this.rentalRateChar(datearr, collectionRate) // 出租率
        }
      })
    },
    // 柱状图
    // 参数 dateArray=> x轴数据
    // seriesData=> y轴数据
    // DomName=> dom id或者ref Dom
    // Note=> 提示title名称
    // YName=> 提示子集名称
    rentalRateChar (dateArray, seriesData, DomName, Note, YName) {
      var dataShadow = []
      for (var i = 0; i < seriesData.length; i++) {
        dataShadow.push(seriesData[i])
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[1] ? params[1] : params[0]
            if (item) {
              if (Note === '出租率' || Note === '收缴率') {
                return item.axisValue + '<br>' + Note + '：' + item.data + '%'
              } else {
                return item.axisValue + '<br>' + Note + '：' + item.data + YName
              }
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              interval: 0,
              // rotate: 40,
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: YName,
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#666', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            barMaxWidth: '18',
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    if (params) {
                      if (Note === '出租率') {
                        return params.data + '%'
                      } else {
                        return params.data
                      }
                    }
                  },
                  // 开启显示
                  position: 'top',
                  // 在上方显示
                  textStyle: { // 数值样式
                    color: '#262626',
                    fontSize: 12
                  }
                },
                color: 'rgba(0,0,0,0.02)'
              }
            },
            animation: false
          },
          {
            name: Note,
            type: 'bar',
            barMaxWidth: '18',
            data: seriesData,
            itemStyle: {
              normal: {
                barBorderRadius: [4, 4, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#07F6F9' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#0180FF' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          }
        ]
      }
      if (Note === '收缴率') {
        option.series = [{
          name: '收缴率',
          type: 'bar',
          barWidth: '18',
          itemStyle: {
            normal: {
              barBorderRadius: [4, 4, 0, 0],
              label: {
                show: true,
                formatter: function (params) {
                  if (params) {
                    return params.data + '%'
                  }
                },
                // 开启显示
                position: 'top',
                // 在上方显示
                textStyle: { // 数值样式
                  color: '#262626',
                  fontSize: 12
                }
              },
              color: function (params) {
                if (params.value > 75 && params.value < 90) { // 大于75 小90 橙色
                  return new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#FF001E' },
                      { offset: 1, color: '#EEB548' }
                    ]
                  )
                } else if (params.value < 75) { // 红色
                  return new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#f00f00' },
                      { offset: 1, color: '#FF001E' }
                    ]
                  )
                } else {
                  return new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#07F6F9' },
                      { offset: 1, color: '#0180FF' }
                    ]
                  )
                }
              }
            }
          },
          data: dataShadow
          // data: [10, 52, 20, 33, 39]
        }]
      } else if (Note === '税收') {
        option.series = [{
          name: '收缴率',
          type: 'bar',
          barWidth: '16',
          itemStyle: {
            normal: {
              barBorderRadius: [0, 0, 0, 0],
              color: '#3F79F7'
            }
          },
          data: dataShadow
          // data: [10, 52, 20, 33, 39]
        }]
      }
      myChart.setOption(option)
    },
    // 饼状
    // resData=> 类型数据
    // legend=> 指示图例
    // color=> 颜色
    // DomName=> dom id或者ref Dom
    // text=> 底部文字数据显示
    // subtext=> 底部数据显示
    formatAnalysis (resData, legend, color, DomName, text, subtext) {
      let myChart = this.$echarts.init(document.getElementById(`${DomName}`))
      myChart.clear()
      let itemGap = 30
      let fleag = false
      if (legend && legend.length >= 7) {
        itemGap = 15
        fleag = true
      }
      let data = resData
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (name) {
            var total = 0
            var target
            // for (var i = 0, l = data.length; i < l; i++) {
            //   total += data[i].value
            //   if (data[i].name === name.name) {
            //     target = data[i].value
            //   }
            // }
            data.forEach(v => {
              total += v.value
              if (v.name === name.name) {
                target = v.value
              }
            })
            let percentage = isNaN(target / subtext) ? 0 : (target / subtext)
            if (text === '税收总金额') {
              return `
                  ${name.name}<br/>
                  税收金额：${name.value}万元<br/>
                  占比：${(percentage * 100).toFixed(2)}%
              `
            } else {
              return `
                  ${name.name}<br/>
                  面积：${name.value}㎡<br/>
                  占比：${(percentage * 100).toFixed(2)}%
              `
            }
          }
        },
        color: color,
        title: {
          show: false,
          text,
          subtext,
          x: '30%',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#333'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        legend: {
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, // 标志图形的宽度
          right: '5%',
          top: fleag ? '10%' : 40,
          itemGap: itemGap,
          data: legend,
          formatter: function (name) {
            var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let percentage = isNaN(target / subtext) ? 0 : (target / subtext)
            // 限制名称长度
            if (name.length >= 10) {
              name = name.substring(0, 9) + '. . .'
            }
            if (text === '税收总金额') {
              return name + '     ' + target + '万元  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
            } else {
              return name + '     ' + target + '㎡  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['35%', '45%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
    },
    collections (dateArray, shishou, shouru, completeRate, totalMax) {
      // 基于准备好的dom，初始化echarts实例
      let _this = this
      let myChart = this.$echarts.init(document.getElementById('CompanyFeesCollected'))
      myChart.clear()
      // 绘制图表
      var colors = ['#68DF92', '#3F79F7']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3.6%',
          right: '5%',
          bottom: '0',
          containLabel: true
        },
        legend: {
          x: 'right',
          y: 'top',
          bottom: '0',
          padding: [0, 20, 0, 0],
          data: ['已收金额', '应收金额']
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '元',
            nameTextStyle: {
              color: '#666666'
            },
            position: 'left',
            type: 'value',
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: [
          {
            name: '已收金额',
            type: 'bar',
            data: shishou,
            barMaxWidth: '10',
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0]
              }
            }
          },
          {
            name: '应收金额',
            type: 'bar',
            data: shouru,
            barMaxWidth: '10',
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0]
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },

    // 虹桥项目八个图表
    // 企业-铺位出租率
    async getShopOccupancyDataAnalyticAcquisition (id) {
      let result = await context.http.get(`/cms/api/stat/thisProjectZc`, { id: typeof id === 'object' ? id.toString() : id, UseStatus: 'USING' })
      if (typeof id === 'object') {
        this.CompanyShopOccupancy = result.data
        this.formatAnalysis(
          [{ name: '已租', value: result.data.rRentAreaB }, { name: '未租', value: result.data.kRentAreaB }],
          ['已租', '未租'],
          ['#37C2FF', '#3985FF'],
          'rentalRateCompanyShopOccupancy',
          '总面积',
          ((result.data.rRentAreaB * 10000) + (result.data.kRentAreaB * 10000)) / 10000
        )
        this.CompanyallArea = ((result.data.rRentAreaB * 10000) + (result.data.kRentAreaB * 10000)) / 10000
      } else {
        this.ProjectShopOccupancy = result.data
        this.formatAnalysis(
          [{ name: '已租', value: result.data.rRentAreaB }, { name: '未租', value: result.data.kRentAreaB }],
          ['已租', '未租'],
          ['#37C2FF', '#3985FF'],
          'rentalRateProjectShopOccupancy',
          '总面积',
          ((result.data.rRentAreaB * 10000) + (result.data.kRentAreaB * 10000)) / 10000
        )
        this.ProjectallArea = ((result.data.rRentAreaB * 10000) + (result.data.kRentAreaB * 10000)) / 10000
      }
    },
    // 企业-行业占比
    async getCompanyIndustryAccounted (flag) {
      let id
      let url = `/cms/api/staging/tenantIndustry/organize/${this.searchParame.manageEnterpriseId}/`
      if (!flag) {
        url = `/cms/api/staging/tenantIndustry/${this.searchParame.projectId}/`
      }
      let result = await context.http.get(url)
      if (result.status === 200) {
        let arr = []
        let legend = []
        let color = []
        result.data.tenantIndustryDTOList.forEach((ele, i) => {
          if (i <= 9) {
            arr.push({ value: ele.area, name: ele.industry, price: ele.price })
            legend.push(ele.industry)
            color.push(ele.color ? ele.color : '#333')
          }
        })
        if (!result.data.tenantIndustryDTOList.length) {
          arr = [{ value: 0, name: '未知行业' }]
          legend = ['未知行业']
          color = ['#37C2FF']
        }
        if (flag) {
          this.formatAnalysis(
            arr,
            legend,
            color,
            'CompanyIndustryAccounted',
            '总面积',
            result.data.allArea
          )
          this.CompanyIndustryAccountedAllArea = result.data.allArea
        } else {
          this.formatAnalysis(
            arr,
            legend,
            color,
            'formatAnalysis',
            '总面积',
            result.data.allArea
          )
          this.formatAllArea = result.data.allArea
        }
      }
    },
    // 历年税收
    async getCalendarTaxData () {
      let result = await context.http.get(`/cms/api/parkRun?time=1641262577543&level=PROJECTTYPE&id=${this.searchParame.projectId}&kpiName=LNSS`)
      if (result.status === 200) {
        let timeArr = []
        let valueArr = []
        result.data.forEach(v => {
          timeArr.push(v.time)
          valueArr.push(v.value)
        })
        this.rentalRateChar(timeArr, valueArr, 'rentalCalendarTax', '税收', '万元')
      }
    },
    // 费用收缴
    collectionGroupByMonth () {
      let sjDatepicker = ''
      if (this.condition === 'MONTH') {
        sjDatepicker = this.sjDatepicker
      } else {
        sjDatepicker = this.sjDatepicker2
      }
      if (!sjDatepicker) {
        return
      }
      context.http.get(`/cms/api/reportColl/statistics/byOrganize`, {
        organizeId: this.searchParame.manageEnterpriseId,
        startDate: this.sjDatepicker2 + '-01-01',
        endDate: this.sjDatepicker2 + '-12-31',
        dateType: 'MONTH'
      }).then(res => {
        if (res.status === 200) {
          let dateArray = []
          let shishou = []
          let shouru = []
          let completeRate = []
          let max = ''
          res.data.forEach(ele => {
            // dateArray.push((ele.x).substring(0, 7))
            shishou.push(ele.sjAmount)
            shouru.push(ele.amount)
            completeRate.push(ele.rate)
          })
          let allAry = [...shishou, ...shouru]
          let totalMax = Math.max.apply(null, allAry)
          if (dateArray.length === 0) {
            dateArray = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            totalMax = 50000
          }
          dateArray = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          this.collections(dateArray, shishou, shouru, completeRate, totalMax)
        }
      })
    },
    // 税收指标完成率
    async getCompanyTargetCompletion (id) {
      // let result = await context.http.get(`/cms/api/stat/thisProjectZc`, { id: typeof id === 'object' ? id.toString() : id, UseStatus: 'USING' })
      // if (result.status === 200) {
      this.formatAnalysis([{ name: '已完成', value: 0 }, { name: '未完成', value: 0 }], ['已完成', '未完成'], ['#535BA6', '#DC92AB'], 'CompanyTargetCompletion', '税收总金额', 1000)
      // 税收总金额
      this.CompanyTargetCompletionAllArea = 0
      // }
    },
    // 项目-未租房源
    getNoRentShop () {
      context.http.get(`/cms/api/rooms`, {
        projectManagemantId: this.searchParame.projectId,
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        useStatus: 'USING',
        onRent: false,
        sort: 'desc'
      }).then(res => {
        this.noRentShopData = []
        if (res.status === 200) {
          this.pager.total = Number(res.headers['x-total-count'])
          this.noRentShopData = res.data.list
        }
      })
    },
    queryZzBerth () {
    },
    storeDetailisHide () {
      this.storeDetailisShow = false
      this.getNoRentShop()
    },
    tenantHandleEdit (index, row) {
      console.log(row)
      this.storeDetailisShow = false
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.tenantDetailData = res.data
        this.tenantDetailsShow = true
      })
    },
    showStoreDetails (storeId) {
      console.log('showStoreDetails')
      this.shopDetails(storeId)
    },
    shopDetails (roomId) {
      console.log(roomId)
      context.http.get('/cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    wzBerth (index, row) {
      this.roomsRowId = row.id
      context.http.get('/cms/api/rooms/' + row.id).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    // 全部模块
    SelectData () {
      // 动态项目
      context.http.get('/cms/api/getOrganiz/infoByids?useStatus=USING&ids=' + this.searchParame.manageEnterpriseId).then(result => {
        if (result.status === 200) {
          // 因为数据多了层数组
          if (result.data[0]) {
            this.projectListData = result.data[0].projectManagementDTO
            let projectIdList = this.projectListData.map(v => {
              return v.id
            })
            this.searchParame.projectId = this.projectListData[0].id
            // 获取图表数据未处理
            // 铺位出租率数据
            // 企业
            this.getShopOccupancyDataAnalyticAcquisition(projectIdList)
            // 费用
            this.collectionGroupByMonth()
            // 税收报表
            this.getCompanyTargetCompletion(projectIdList)
            // 行业
            this.getCompanyIndustryAccounted(true)
            // 项目
            this.ProjectModule(this.projectListData[0].id)
          }
        }
      })
    },
    // 企业下拉框
    manageEnterpriseSelect (row) {
      this.sjDatepickerTimes()
      this.SelectData()
    },
    // 项目模块
    ProjectModule () {
      this.getShopOccupancyDataAnalyticAcquisition(this.searchParame.projectId) // 项目
      // 2
      this.pager.currentPage = 1
      this.pager.total = 0
      this.getNoRentShop()
      // 3
      this.getCalendarTaxData()
      // 4
      this.getCompanyIndustryAccounted()
    },
    projectIdSelect (id) {
      this.ProjectModule(id)
    },
    pgSizeSelectFn () { // 切换显示条数
      this.pager.currentPage = 1
      this.getNoRentShop()
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.getNoRentShop()
    },
    // end

    getRentalRate2 () {
      if (!this.projectId) return
      context.http.get('/cms/api/reportRented/statistics/byProject', { projectId: this.projectId }).then(res => {
        if (res.status === 200) {
          this.rentalRate2Char(res.data)
          this.allArea = res.data.totalArea
        }
      })
    },
    rentalRate2Char (resData) {
      let myChart = this.$echarts.init(document.getElementById('rentalRate2'))
      // if (!this.$refs.rentalRate) {
      //   return
      // }
      // let myChart = this.$echarts.init(this.$refs.rentalRate)
      myChart.clear()
      let data = [
        { value: resData.rentedArea, name: '已租' },
        { value: resData.unRentedArea, name: '未租' }
      ]
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}' + '㎡' + '({d}%)'
        },
        title: {
          show: false,
          text: '总面积',
          subtext: '100000',
          x: '30%',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: ['#333'],
            padding: [50, 10]
          },
          subtextStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        color: ['#37C2FF', '#3985FF'],
        legend: {
          orient: 'vertical',
          itemWidth: 20, // 标志图形的长度
          itemHeight: 10, //
          right: '7%',
          top: 100,
          itemGap: 50,
          data: ['已租', '未租'],
          formatter: function (name) {
            var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            let percentage = isNaN(target / total) ? 0 : (target / total)
            return name + '       ' + target + '㎡' + '  (' + ((percentage) * 100).toFixed(2) + '%' + ')'
          }
        },
        series: [
          {
            name: '出租率',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['35%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: { // 此配置
              normal: {
                borderWidth: 2,
                borderColor: '#fff'
              },
              emphasis: {
                borderWidth: 0,
                shadowBlur: 2,
                shadowOffsetX: 0,
                shadowColor: '#fff'
              }
            },
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            outline: {
              itemStyle: {
                borderColor: '#000',
                borderWidth: 0
              },
              borderDistance: 0
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
    },
    getFormatAnalysis () {
      if (!this.projectId) return
      context.http.get(`/cms/api/staging/tenantIndustry/${this.projectId}`).then(res => {
        if (res.status === 200) {
          if (res.data.length === 0) return
          this.FormatAnalysisData = res.data
          let areaTypeList = []
          res.data.forEach(ele => {
            areaTypeList.push({ name: ele.tenantUseIndustry })
          })
          this.areaTypeList = areaTypeList
          this.currentAreaType = this.areaTypeList[0].name
          this.formatAllArea = res.data[0].value.allArea
          let resData = res.data
          this.setFormatAnalysis(resData)
        }
      })
    },
    setFormatAnalysis (resData) {
      let arr = []
      let legend = []
      let color = []
      if (resData.length === 0) return
      resData[0].value.tenantIndustryDTOList.forEach(ele => {
        arr.push({ value: ele.area, name: ele.industry, price: ele.price })
        legend.push(ele.industry)
        color.push(ele.color)
      })
      this.formatAnalysis(arr, legend, color)
    },
    getSigningTenants () {
      context.http.get(`/cms/api/staging/ninetyTenant/${this.projectId}`).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
          this.tableData.forEach((ele, index) => {
            ele.index = index + 1
          })
        }
      })
    },
    customerTypeFormat (row, column) {
      if (row.customerType === 'PERSONAL') {
        return '个人'
      } else if (row.customerType === 'COMPANY') {
        return '企业'
      }
    },
    getCollectionRate () {
      let sjDatepicker = ''
      if (this.twoCharCondition === 'MONTH') {
        sjDatepicker = this.twoCharDatepicker
      } else {
        sjDatepicker = this.twoCharDatepicker2
      }
      if (!sjDatepicker) {
        return
      }
      context.http.get(`/cms/api/reportColl/collectionRate/${this.twoCharCondition}`, { dateStr: sjDatepicker }).then(res => {
        if (res.status === 200) {
          let datearr = []
          let collectionRate = []
          res.data.forEach(ele => {
            datearr.push(ele.projectName)
            collectionRate.push(ele.collectionRate)
          })
          this.collection(datearr, collectionRate)
        }
      })
    },
    getAverageRent () {
      if (!this.averageRentDate) return
      context.http.get(`/cms/api/staging/avgPirce`, { date: this.averageRentDate + '-01' }).then(res => {
        if (res.status === 200) {
          let datearr = []
          let collectionRate = []
          res.data.forEach(ele => {
            datearr.push(ele.referred)
            collectionRate.push(ele.price)
          })
          this.averageRent1Char(datearr, collectionRate) // 平均租金
        }
      })
    },
    averageRent1Char (dateArray, seriesData) {
      const max = Math.max.apply(null, seriesData)
      var yMax = max
      var dataShadow = []
      for (var i = 0; i < seriesData.length; i++) {
        dataShadow.push(yMax)
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('averageRent1'))
      // if (!this.$refs.collectionRateCom) {
      //   return
      // }
      // let myChart = this.$echarts.init(this.$refs.collectionRateCom)
      myChart.clear()
      // 绘制图表
      var colors = ['#DD6243', '#54B0E8', '#62CA6D', '#66CEB5', '#9F88F3']
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[1]
            return item.axisValue + '<br>' + '平均租金：' + item.data + '元/m²天'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: dateArray,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              interval: 0,
              // rotate: 40,
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '元/m²天',
            nameTextStyle: {
              color: '#666666'
            },
            position: 'left',
            // max: max + 20,
            // min: 0,
            scale: true,
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            barMaxWidth: '18',
            itemStyle: {
              normal: { color: 'rgba(0,0,0,0.00)' }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            name: '平均租金',
            type: 'bar',
            barMaxWidth: '18',
            data: seriesData,
            itemStyle: {
              normal: {
                barBorderRadius: [12, 12, 0, 0],
                // color: function (d) { return '#' + Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16) }
                // color: function (params) {
                //   var colorList = ['#6652F6', '#7BC1E7', '#0A93EA', '#ED645E', '#99C855', '#EBC05B', '#528BEF', '#6652F6']
                //   let val = params.dataIndex >= colorList.length ? (params.dataIndex % 8) : params.dataIndex
                //   return colorList[val]
                // }
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#A8FF78' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#00CEBF' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getAverageRent2 () {
      if (!this.arStartDate || !this.arEndDate || !this.projectId) {
        return
      }
      context.http.get(`/cms/api/staging/avgPirce/${this.projectId}`, { startDate: this.arStartDate + '-01', endDate: this.arEndDate + '-01' }).then(res => {
        if (res.status === 200) {
          let datearr = []
          let collectionRate = []
          let copy = res.data
          // res.data.forEach(ele1 => {
          copy.forEach(ele1 => {
            ele1.collectionRate = []
            ele1.datearr = []
            ele1.value.forEach(ele => {
              if (!ele) return
              ele1.datearr.push(ele.recordDate && ele.recordDate.substring(0, 7))
              ele1.collectionRate.push(ele.price)
            })
          })
          // console.log('collectionRate', copy)
          this.averageRent2Char(datearr, copy) // 平均租金
        }
      })
    },
    averageRent2Char (datearr, seriesData) {
      // 基于准备好的dom，初始化echarts实例
      // seriesData = [3.19, 3.19, 3.20, 3.19, 3.19]
      // seriesData = [3.17, 3.18, 3.13, 3.19, 3.17, 3.13]
      let arr = []
      for (var i = 0; i < seriesData.length; i++) {
        for (var j = 0; j < seriesData[i].collectionRate.length; j++) {
          arr.push(seriesData[i].collectionRate[j])
        }
      }
      // arr = [...seriesData[0].collectionRate, ...seriesData[1].collectionRate, ...seriesData[2].collectionRate]
      const max = Math.max.apply(null, arr)
      const min = Math.min.apply(null, arr)
      var yScale = Number(((max - min) / 5).toFixed(2))
      if (yScale < 0.01) yScale = 0.01
      // yScale = yScale === 0 ? 0.002 : yScale
      console.log(yScale)
      let _this = this
      let series = []
      let legendData = []
      seriesData.forEach(ele => {
        legendData.push(ele.tenantUseDescription)
        series.push(
          {
            name: ele.tenantUseDescription,
            type: 'line',
            itemStyle: {
              normal: {   // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: ele.tenantUseColor // 0% 处的颜色
                },
                {
                  offset: 0.3, color: ele.tenantUseColor // 100% 处的颜色
                },
                {
                  offset: 1, color: '#fff' // 100% 处的颜色
                }]
                ),  // 背景渐变色
                lineStyle: {        // 系列级个性化折线样式
                  width: 2,
                  type: 'solid',
                  color: ele.tenantUseColor
                }
              },
              emphasis: {
                color: ele.tenantUseColor,
                lineStyle: {        // 系列级个性化折线样式
                  width: 2,
                  type: 'dotted',
                  color: ele.tenantUseColor // 折线的颜色
                }
              }
            }, // 线条样式
            areaStyle: { normal: {} },
            data: ele.collectionRate
          }
        )
      })
      let myChart = this.$echarts.init(document.getElementById('averageRent2'))
      myChart.clear()
      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var showHtm = ''
            for (let i = 0; i < params.length; i++) {
              // x轴名称
              var name = i === 0 ? params[i].axisValue : ''
              // x轴名称
              var seriesName = params[i].seriesName
              // 值
              var value = params[i].data
              showHtm += name + '<br>' + seriesName + '：' + value + '元/m²天'
            }
            // const item = params[0]
            // return item.axisValue + '<br>' + '平均租金：' + item.data + '元/m²天'
            return showHtm
          }
        },
        legend: {
          data: legendData,
          x: 'right'
        },
        grid: {
          left: '3%',
          right: '5%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: seriesData[0].datearr,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            axisLabel: {// x轴文字的配置
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        yAxis: [
          {
            max: (max * 1000 + yScale * 1000 * 1) / 1000,
            min: (min * 1000 - yScale * 1000 * 3) / 1000,
            name: '元/m²天',
            nameTextStyle: {
              color: '#666666'
            },
            interval: yScale,
            position: 'left',
            type: 'value',
            'axisLine': {       // y轴
              'show': true,
              lineStyle: {
                color: '#DCDCDC', // 颜色
                width: 1 // 粗细
              }
            },
            'axisTick': {       // y轴刻度线
              'show': true
            },
            splitLine: {// 分割线配置
              show: true,
              lineStyle: {
                color: '#DCDCDC'
              }
            },
            axisLabel: {
              interval: 3,
              show: true,
              textStyle: {
                color: '#666666'
              }
            }
          }
        ],
        series: series
        // seriess: [
        //   {
        //     name: '平均租金',
        //     type: 'line',
        //     itemStyle: {
        //       normal: {   // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
        //         color: new _this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        //           offset: 0, color: '#CBD2FF' // 0% 处的颜色
        //         },
        //         //  {
        //         //   offset: 0.5, color: '#CBD2FF' // 100% 处的颜色
        //         // },
        //         {
        //           offset: 1, color: '#FFFFFF' // 100% 处的颜色
        //         }]
        //             ),  // 背景渐变色
        //         lineStyle: {        // 系列级个性化折线样式
        //           width: 2,
        //           type: 'solid',
        //           color: '#3173E6'
        //         }
        //       },
        //       emphasis: {
        //         color: '#3173E6',
        //         lineStyle: {        // 系列级个性化折线样式
        //           width: 2,
        //           type: 'dotted',
        //           color: '#3173E6' // 折线的颜色
        //         }
        //       }
        //     }, // 线条样式
        //     areaStyle: {normal: {}},
        //     data: seriesData
        //   }
        // ]
      }
      myChart.setOption(option)
    },
    collectionGroupByFeeType () {
      context.http.get(`/cms/api/reportColl/collectionGroupByFeeType`, { projectId: this.projectId, startDate: this.gkDatepicker[0], endDate: this.gkDatepicker[1] }).then(res => {
        if (res.status === 200) {
          let sourceData = [['product', '应收', '已收']]
          res.data.forEach(ele => {
            sourceData.push([ele.feeTypeName, ele.accountReceivable, ele.accountActual])
          })
          this.costProfile(sourceData)
        }
      })
    },
    detailsClose () {
      this.tdDetailsShow = false
      // this.getIntentionalCustomer()
      this.getCustomerList()
    },
    tenantDetailsClose (id) {
      this.getIntentionalCustomer()
      if (!id) {
        this.detailsShow = false
        context.http.get('/cms/api/rooms/' + this.roomsRowId).then(res => {
          if (res.status === 200) {
            this.storeDetailisData = res.data
            this.storeDetailisShow = true
          }
        })
        return
      }
      context.http.get(`/cms/api/contracts/${id}`).then(res => {
        if (res.status === 200) {
          this.contractsDetailData = res.data
          this.detailsShow = false
          this.contractsDetailsShow = true
        }
      })
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
    },
    async query () {
      this.getSigningTenants()
    },
    handleEdit (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.detailDataes = res.data
        this.detailsShow = true
      })
    },
    loadMoreTenant () {
      this.tableHeightTenant = true
    },
    remoteMethod (query) {
      if (query !== '') {
        context.http.get(`/cms/api/tenant/nameLike/${query}`, { projectId: this.projectId }).then(res => {
          if (res.status === 200) {
            this.tenantOptions = res.data
          }
        })
      }
    },
    getIntentionalCustomer () {
      if (!this.projectId) return
      context.http.get(`/cms/api/staging/yxTenant/${this.projectId}`, { name: this.brandName, page: (this.pager1.currentPage - 1), size: this.pager1.pgSize, sort: 'desc' }).then(res => {
        if (res.status === 200) {
          this.yxTenantData = res.data
          // this.pager1.total = Number(res.headers['x-total-count'])
        }
      })
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        this.project = res.data
        for (let i = 0; i < this.project.length; i++) {
          this.$set(this.project[i], 'isChecked', false)
          this.$set(this.project[i], 'needValue', null)
        }
      }).catch(error => {
        console.info(error)
      })
    },
    handleYx (index, row) {
      context.http.get(`cms/api/yxTenant/${row.id}`).then(res => {
        if (res) {
          this.followRecordDTOParams.yxTenantDTO = row
          this.yxTenantDTOStorage = row
          if (row.projectManagementDTO) {
            this.projectId = row.projectManagementDTO.id // 此条记录的项目id
          }
          this.pageType = 'readOnly'
          this.pcdetaileData = res.data
          context.http.get(`cms/api/followRecords/${row.id}`).then(result => {
            this.timeLineListData = result.data
            this.pcdetailsShow = true
          })
        }
      })
    },
    addFlowList () { // 新增更近记录
      this.$refs['followRecordDTOParams'].validate((valid) => {
        if (valid) {
          context.http.post('cms/api/followRecord', this.followRecordDTOParams).then(res => {
            context.http.get(`cms/api/followRecords/${this.followRecordDTOParams.yxTenantDTO.id}`).then(result => {
              this.timeLineListData = result.data
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.addProgressFrom = false
              this.addProgressFromClose()
              // this.getPotlClientsList()
              context.http.get(`cms/api/yxTenant/${this.yxTenantDTOStorage.id}`).then(res => {
                if (res) {
                  this.pcdetaileData = res.data
                }
              })
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addProgressFromClose () {
      this.followRecordDTOParams = {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      }
      this.followRecordDTOParams.yxTenantDTO = this.yxTenantDTOStorage
    },
    addProgressFn () { // 打开写进度弹窗
      this.getRooms(this.projectId) // 新增更近记录页面项目房源信息
    },
    async getRooms (id) {
      let res = await context.http.get('/cms/api/rooms/projectManagement?projectManagementId=' + id)
      this.building = res.data
      this.addProgressFrom = true
    },
    refreshList () {
      context.http.get(`cms/api/yxTenant/${this.pcdetaileData.id}`).then(res => {
        if (res) {
          this.pcdetaileData = res.data
        }
      })
    },
    loadMoreRentShop () {
      this.tableHeightRentShop = true
    },
    loadMoreYxTenant () {
      this.tableHeightYxTenant = true
    },
    industry (state) {
      if (state === 'LIFE') {
        return '生活配套'
      } else if (state === 'FOOD') {
        return '餐饮'
      } else if (state === 'RETAIL') {
        return '零售'
      } else if (state === 'BDUCATION') {
        return '亲子教育'
      } else if (state === 'CSE') {
        return '娱乐'
      } else if (state === 'FINANCIAL') {
        return '金融'
      } else if (state === 'REALESTATE') {
        return '房地产'
      } else if (state === 'SERVICE') {
        return '其他'
      }
    },
    queryBill () {
      this.billsNow()
      this.sumAmount()
    },
    billsNow () {
      let tenantIds = this.tenantIds
      context.http.get(`/cms/api/bills/expire`, {
        projectManagementId: this.projectId,
        feeType: this.feeType,
        onExpected: this.billType,
        referred: this.queryName,
        page: this.pager2.currentPage - 1,
        size: this.pager2.pgSize,
        sort: 'finalPaymentDate,desc'
      }).then(res => {
        if (res.status === 200) {
          this.billTableData = res.data
          this.pager2.total = Number(res.headers['x-total-count'])
        }
      })
    },
    sumAmount () {
      let tenantIds = this.tenantIds
      context.http.get(`/cms/api/bills/expire/sumAmount`, {
        projectManagementId: this.projectId,
        feeType: this.feeType,
        onExpected: this.billType,
        referred: this.queryName
      }).then(res => {
        if (res.status === 200) {
          this.totalData = res.data
        }
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '本页小计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          // sums[index] = (sums[index]).toFixed(2) + '元'
          sums[index] = toLocaleString(sums[index]) + '元'
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    async billDetail (index, row) {
      if (row.billCategory === 'DIVERSIFICATION') {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.incdDetailsdrawershow = true
      } else {
        let result = await context.http.get(`cms/api/bills/${row.id}`)
        this.builddetailsData = JSOG.decode(result.data)
        this.detailsdrawershow = true
      }
    },
    imageChange (state, event) {
      let files = event.target.files
      let fileSize = files[0].size
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let annexes = this.addParmas.annexes
      if (parseInt(fileSize) > 1024 * 1024 * 20) { // 不大于20M
        this.$message({
          message: '文件大小不超过20M',
          type: 'error'
        })
        return
      }
      for (let i = 0; i < annexes.length; i++) {
        if (annexes[i].annexName === name) {
          return false
        }
      }
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        // this.$set(this.addParmas, 'annexName', name)
        // this.$set(this.addParmas, 'annexURL', res.data)
        if (state === 'addFlowList') {
          this.followRecordDTOParams.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        } else if (state === 'addapp') {
          this.addParmas.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        }
      }).catch(error => {
        console.info(error)
      })
      // this.addParmas.annexes = this.annexesList
      // this.$forceUpdate()
    },
    deleFile (item, index, type) {
      if (type === 'yx') {
        this.addParmas.annexes.splice(index, 1)
      } else {
        this.followRecordDTOParams.annexes.splice(index, 1)
      }
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    pgSizeSelectFn1 () { // 切换显示条数
      this.pager1.currentPage = 1
      this.getRentalhous1()
    },
    pgSizeSelectFn2 () { // 切换显示条数
      this.pager2.currentPage = 1
      this.getCustomerList()
    },
    current_change1 (currentPage) {
      this.pager1.currentPage = currentPage
      this.getRentalhous1()
    },
    current_change2 (currentPage) {
      this.pager2.currentPage = currentPage
      this.getCustomerList()
    },
    showTenant (index, row) {
      this.tenantHandleEdit(0, row)
      this.contractsDetailsShow = false
    },
    openAddDialog () {
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'TenantInformation' } })
    },
    contractDrawerClose (state) {
      console.log(state)
      this.contractsDetailsShow = false
      this.tenantDetailsShow = true
    },
    selectType (item, index) {
      this.selectedIdx = index
      this.currentAreaType = item.name
      let resData = this.FormatAnalysisData.filter(ele => {
        return item.name === ele.tenantUseIndustry
      })
      this.formatAllArea = resData[0].value.allArea
      this.setFormatAnalysis(resData)
      this.showAreaType = false
    },
    // 获取项目
    getProject (id) {
      this.$set(this.rhSearchParame, 'projectManagemantId', '')
      if (!id) {
        this.rhProjectListData = []
        return
      }
      context.http.get('/cms/api/getOrganiz/infoByids?useStatus=USING&ids=' + id).then(res => {
        if (res.status === 200) {
          this.rhProjectListData = res.data[0].projectManagementDTO
        }
      })
    },
    // 租赁房源
    getRentalhous1 () {
      context.http.get(`/cms/api/rooms/staging`, {
        organizeId: this.rhSearchParame.organizeId,
        projectManagementId: this.rhSearchParame.projectManagemantId && this.rhSearchParame.projectManagemantId.join(),
        onExpireDay: this.rhSearchParame.onExpireDay,
        expireDay: this.rhSearchParame.expireDay,
        sortBuildingArea: this.rhSearchParame.sortBuildingArea,
        sortExpectedUnitPrice: this.rhSearchParame.sortExpectedUnitPrice,
        sortAddress: this.rhSearchParame.sortAddress,
        page: (this.pager1.currentPage - 1),
        size: this.pager1.pgSize,
        sort: 'desc'
      }).then(res => {
        if (res.status === 200) {
          this.rentalHousData = res.data
          this.pager1.total = Number(res.headers['x-total-count'])
        }
      })
    },
    // 客户列表
    getCustomerList () {
      context.http.get(`/cms/api/tenant/staging`, {
        organizeId: this.stSearchParame.organizeId,
        projectManagementId: this.stSearchParame.projectManagementId,
        industryId: this.stSearchParame.industryId && this.stSearchParame.industryId.join(),
        employeesNumber: this.stSearchParame.employeesNumber,
        taxNumber: this.stSearchParame.taxNumber,
        companyQualification: this.stSearchParame.companyQualification,
        businessRegister: this.stSearchParame.businessRegister,
        registerType: this.stSearchParame.registerType,
        taxRegistration: this.stSearchParame.taxRegistration,
        tenantName: this.stSearchParame.tenantName,
        page: (this.pager2.currentPage - 1),
        size: this.pager2.pgSize,
        sort: 'desc'
      }).then(res => {
        if (res.status === 200) {
          this.customerListData = res.data
          this.pager2.total = Number(res.headers['x-total-count'])
        }
      })
    },
    handleIndustryChange (e) {
      let id = e[e.length - 1]
      this.standardIndustryId = id + ''
      let name
      this.allIndustryName.forEach((item, index) => {
        if (item.id === id) {
          name = item.industryId + '' + item.name
        }
      })
      this.standardIndustryName = name
      console.log(e, this.standardIndustryId, this.standardIndustryName)
      console.log(this.rhSearchParame.industryId)
    },
    // 行业
    getAllIndustry () {
      this.allIndustryName = []
      context.http.get('/cms/api/tenant/standardIndustry/tree').then(res => {
        let data = res.data || []
        data.forEach((it, ind) => {
          this.allIndustryName.push(it)
          if (it.child) {
            it.child.forEach((ite, inde) => {
              this.allIndustryName.push(ite)
              if (ite.child) {
                ite.child.forEach((item, index) => {
                  this.allIndustryName.push(item)
                  if (item.child) {
                    item.child.forEach((itemr, indexr) => {
                      this.allIndustryName.push(itemr)
                      delete itemr.child
                    })
                  }
                })
              }
            })
          }
        })
        // console.log(this.allIndustryName)
        this.industryOptionsTree = data
      })
    },
    riskDetailsClose () {
      this.riskDetailsShow = false
    },
    riskDetailsShowFn (i) {
      this.riskTab = i
      this.riskDetailsShow = true
    },
    queryExportResult (id, flag) { // flag  true代表经营数据 false税收数据
      this.flag = flag
      console.log(id)
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let url = ''
      if (flag) {
        url = `/cms/api/tenantBusiness-excel/detail?excelId=${id}`
      } else {
        url = `/cms/api/tenantTax-excel/detail?excelId=${id}`
      }
      context.http.get(url).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id, flag)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          console.log(this.$refs['tenantDetails'].$refs['dynamicComponent1'])
          this.$refs['tenantDetails'].$refs['dynamicComponent1'].queryFn()
          loading.close()
          // this.query()
        }
      })
    },
    tenantDetailhandle (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        if (!res.data.building) {
          res.data.building = { id: '', buildingName: '' }
        }
        context.http.get('/cms/api/enterpriseRooms/tenantId/' + row.id).then(result => {
          this.checkData = result.data
        })
        this.detailData = res.data
        this.detailData.industryIdid = []
        // this.detailData.iDNumber = this.decryptMsg(this.detailData.iDNumber)
        this.tdDetailsShow = true
        this.$nextTick(() => {
          console.log(this.$refs.tenantDetails)
        })
      })
    },
    taxRegistrationFormated (val) {
      let obj = {
        'BZBC': '本镇本村',
        'BZWC': '本镇外村',
        'ZWZC': '镇外登记',
        'WZC': '未登记'
      }
      return obj[val]
    }
  }
}
</script>
<style lang="scss" scoped>
.Project-Overview {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 100%;
  }
  .chart {
    position: relative;
    .all-area {
      position: absolute;
      bottom: 40px;
      left: 0;
      width: 70%;
      text-align: center;
    }
  }
  .collection-expenses {
    background-color: #fff;
    margin-top: 10px;
    > span {
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
    span {
      display: inline-block;
      margin: 20px;
      &:nth-of-type(2) {
        float: right;
      }
    }
    .chart {
      margin-top: 25px;
      width: 100%;
      height: 400px;
      background: #fff;
    }
  }
  .ctc-foot1 {
    padding: 0;
    background: #f3f8fe;
    padding-right: 20px;
  }
  .pj-search {
    background-color: #fff;
    box-shadow: none;
    margin: 0px;
    margin-top: 10px;
    .el-select {
      margin: 15px 15px 0 20px;
    }
    div {
      display: inline-block;
    }
  }
  .padd_bor {
    width: 49.6%;
    height: 400px;
    padding: 0px 20px 20px 20px;
    background: #fff;
  }
  .rental-rate {
    width: 100%;
    height: 362px;
    background: #f3f8fe !important;
    margin-top: 20px;
    > span {
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
    span {
      display: inline-block;
      margin: 20px;
    }
    .chart {
      height: 302px;
    }
    .icon-bottom {
      display: inline-block;
      color: #3575f6;
      font-size: 16px;
      cursor: pointer;
    }
    .type-warp {
      position: relative;
      .type-ul {
        position: absolute;
        left: 0;
        top: 23px;
        width: 120px;
        background: #fff;
        color: #333;
        font-size: 12px;
        box-shadow: 0px 2px 4px 0px rgba(181, 181, 181, 0.72);
        border-radius: 2px;
        z-index: 999;
        li {
          height: 10px;
          line-height: 10px;
          margin: 14px 4px;
          cursor: pointer;
        }
      }
    }
  }
  section:nth-of-type(2n) {
    margin-left: 0.8%;
  }
  .signing-tenants {
    margin-top: 10px;
    background-color: #fff;

    .searchbar {
      display: flex;
      align-items: center;
      padding-left: 20px;
      padding-bottom: 20px;
      > div {
        margin-right: 10px;
      }
    }
    .table-height {
      height: auto !important;
    }
    .hourse_tab {
      height: 60px;
      background-color: #fff;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      align-items: center;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          font-weight: initial;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
    }
    .st-title {
      height: 60px;
      line-height: 60px;
      color: #333;
      font-weight: bold;
      font-size: 14px;
    }
    .st-footer {
      height: 50px;
      line-height: 50px;
      color: #3175f6;
      font-size: 14px;
      span {
        cursor: pointer;
      }
      .page {
        display: flex;
        justify-content: space-between;
        padding-top: 0 !important;
      }
      .pagingnum {
        margin-left: 20px;
      }
      .el-pagination {
        padding-top: 12px;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #2f3f48;
        color: #fff;
      }
      .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #999;
      }
    }
  }
  .classifi {
    display: inline-block;
    width: 4px;
    height: 16px;
    position: relative;
    border-radius: 2px;
    margin-left: 12px;
    vertical-align: sub;
    + span {
      margin-left: 2px;
      font-weight: 700;
      font-size: 16px;
    }
  }
  .projectContrast {
    background-color: #3575f6;
    top: -1px;
  }
  .projectContrast2 {
    top: -1px;
  }
  .projectContrast3 {
    top: 0;
  }
  .projOverview {
    background-color: #99c855;
    top: -1px;
  }
  .investmentModule {
    background-color: #71bfce;
    top: -2px;
  }
  .operateModule {
    background-color: #f39b2a;
    top: -2px;
  }
  .beOverdueIcon {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid #bf1e1e;
    margin-right: 4px;
  }
  .addProgressFrom {
    .form1 {
      > .content {
        width: 730px;
        min-height: 850px;
        margin: 20px auto;
        .item {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
          > span {
            margin-bottom: 10px;
            > i {
              color: #ff0000;
              font-style: normal;
            }
          }
          .storeInfo {
            min-height: 560px;
            border: 1px solid #eeeeee;
            .title {
              height: 50px;
              line-height: 50px;
              padding: 0 15px;
              background-color: #fafafa;
              display: block;
            }
            .content {
              padding: 10px;
              display: flex;
              justify-content: space-between;
              .project {
                width: 300px;
                height: 500px;
                border: 1px solid #eeeeee;
                padding: 15px;
                overflow-y: scroll;
                .collapse {
                  margin-top: 20px;
                  .el-collapse-item__header {
                    background-color: #fafafa;
                    padding-left: 15px;
                    height: 40px;
                    line-height: 40px;
                  }
                  .el-collapse-item__wrap {
                    padding-left: 25px;
                    .el-checkbox {
                      width: 100%;
                      margin-right: 0;
                      margin-bottom: 5px;
                    }
                  }
                }
              }
              .offer {
                width: 400px;
                height: 500px;
                padding-left: 20px;
                > .item {
                  display: flex;
                  flex-direction: column;
                  margin-bottom: 15px;
                  > div {
                    display: flex;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .switch-select {
    background-color: #3577f6;
    border: 1px solid #3577f6 !important;
    color: #fff !important;
  }
  .switch-btn {
    display: inline-flex;
    span {
      display: inline-block;
      width: 42px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin: 0 !important;
      font-size: 12px;
      color: #999;
      font-weight: initial;
      &:first-child {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child {
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  .inline-query-btn {
    display: inline-block;
    width: 60px;
    font-size: 14px;
    font-weight: normal;
    margin: 0;
  }
  .plc-table-bottom {
    background: #fff;
    border: 1px solid rgba(238, 238, 238, 1);
    border-top: none;
    overflow-x: auto;
    .ctable {
      width: 100%;
      display: flex;
      li {
        width: 181px;
        text-align: center;
        font-size: 14px;
        padding: 10px 0;
        background-color: #eff4fe;
        color: #606266;
      }
    }
  }
  .selected {
    color: #3575f6;
  }
}
</style>
<style lang="scss">
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #2f3f48 !important;
  color: #fff !important;
}
.Project-Overview {
  .el-table th > .cell {
    font-weight: initial;
  }
  .el-table tr {
    background-color: transparent;
  }
  .multiple-sel {
    .el-tag--light {
      max-width: 200px;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
    }
    .el-select__tags-text {
      max-width: 146px;
      overflow: hidden;
      display: inline-block;
    }
  }
  .el-table__footer-wrapper tbody td {
    background: #fafbff;
  }
}
.el-select {
  .el-select__tags {
    max-width: 500px !important;
  }
}
</style>
<style>
.table-colorP .el-table__header thead tr th {
  background: #eae3fa !important;
  border: none !important;
  font-weight: 700;
  color: #333;
}
.table-colorP .el-table th.el-table__cell > .cell {
  font-weight: 700;
  color: #333;
}
.table-colorP .el-table td.el-table__cell {
  background: #f3f8fe !important;
  padding: 0 !important;
}
.table-colorP .el-table::before {
  display: none;
}
</style>
