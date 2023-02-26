<!--
 * @Description: 
 * @version: 
 * @Author: chenkun
 * @Date: 2021-08-23 14:56:53
 * @LastEditors: chenkun
 * @LastEditTime: 2021-09-24 10:18:23
-->
<template>
  <div class="PaymentApplication">
    <div class="pl-head">
      <span class="step"
            :class="{stepActive: step1, stepActivePast: step2}"><span style="font-size: 20px;">1</span>. 填写管理员资料</span>
      <span class="step"
            :class="{stepActive: step2}"><span style="font-size: 20px;">2</span>. 填写商户资料</span>
      <span class="step"
            :class="{stepActive: step3}"><span style="font-size: 20px;">3</span>. 确认提交</span>
    </div>
    <div class="pl-content"
         v-if="step1">
      <div class="dr-head"><span class="vertical"></span>管理员信息</div>
      <div class="pl-tips">
        <i class="el-icon-info"></i>
        超级管理员将接收开户信息及日常重要管理信息，并可进行资金操作，请确定您为法定代表人或负责人再进行操作
      </div>
      <el-form :model="ruleForm1"
               :rules="rules1"
               label-width="130px"
               label-position="left"
               ref="ruleForm1"
               :key="1"
               class="ruleForm1">
        <el-form-item label="超级管理员类型"
                      prop="contactType">
          <el-radio-group v-model="ruleForm1.contactType">
            <el-radio label="LEGAL_PERSON">经营者/法人</el-radio>
            <el-radio label="CHARGE_PERSON">负责人</el-radio>
          </el-radio-group>
          <p v-show="ruleForm1.contactType === 'CHARGE_PERSON'"
             style="line-height: 20px">经商户授权办理微信支付业务的人员，授权范围包括但不限于签约，入驻过程需完成账户验证</p>
        </el-form-item>
        <el-form-item label="超级管理员姓名"
                      prop="contactName">
          <el-input v-model="ruleForm1.contactName"
                    placeholder="请填写超级管理员姓名"
                    size="small"></el-input>
        </el-form-item>
        <!-- <el-form-item label="证件类型"
                      prop="idDocType">
          <el-radio-group v-model="ruleForm1.idDocType">
            <el-radio label="IDENTIFICATION_TYPE_MAINLAND_IDCARD">中国大陆居民-身份证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_OVERSEA_PASSPORT">中国香港居民-来往内地通行证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_OVERSEA_PASSPORT">中国澳门居民-来往内地通行证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_MACAO"
                      style="margin-top: 20px">中国台湾居民-来往大陆通行证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_TAIWAN"
                      style="margin-top: 20px">其他国家或地区居民-护照</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="证件号码"
                      prop="contactIdCardNumber">
          <el-input v-model="ruleForm1.contactIdCardNumber"
                    placeholder="请输入证件号码"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="mobilePhone">
          <el-input v-model.number="ruleForm1.mobilePhone"
                    placeholder="用于接受微信支付的重要管理信息及日常操作验证码"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员邮箱"
                      prop="contactEmail">
          <el-input v-model="ruleForm1.contactEmail"
                    placeholder="用于接受微信支付的开户邮件及日常业务通知"
                    size="small"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="pl-content"
         v-if="step2">
      <div class="dr-head"><span class="vertical"></span>主体信息</div>
      <div class="pl-tips">
        <i class="el-icon-info"></i>
        请先选择贵司的主体类型
      </div>
      <el-form :model="ruleForm2"
               :rules="rules2"
               label-width="135px"
               label-position="left"
               ref="ruleForm2"
               :key="2"
               class="ruleForm2">
        <el-form-item label="主体类型"
                      prop="organizationType">
          <el-radio-group v-model="ruleForm2.organizationType">
            <el-radio label="INDIVIDUAL_BUSINESS">个体工商户</el-radio>
            <el-radio label="ENTERPRISE">企业</el-radio>
            <!-- <el-radio label="PARTY">党政、机关及事业单位</el-radio> -->
            <el-radio label="OTHER">其他组织</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="subtitle">营业执照</div>
        <div class="pl-tips">
          <i class="el-icon-info"></i>
          请上传“营业执照”，需年检章齐全，当年注册除外
        </div>

        <el-form-item label="营业执照照片"
                      prop="businessLicenseCopyImgageUrl">
          <div class="preview-wrap">
            <div class="preview">
              <i class="iconfont icon-cms_cuowu"
                 v-if="ruleForm2.businessLicenseCopyImgageUrl"
                 @click="delBusinessImage()"></i>
              <img :src="ruleForm2.businessLicenseCopyImgageUrl"
                   v-if="ruleForm2.businessLicenseCopyImgageUrl" />
              <div class="tips1"
                   v-else>
                <i class="iconfont icon-shangchuantupianicon"></i>
                <p>上传图片</p>
              </div>
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :iconShow="false"
                         :fileSize="2"
                         @setAnnex="setAnnexs" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="注册号"
                      prop="businessLicenseNumber">
          <el-input v-model="ruleForm2.businessLicenseNumber"
                    placeholder="请依据营业执照，填写15位注册号或18位的统一社会信用代码"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="商户名称"
                      prop="merchantName">
          <el-input v-model="ruleForm2.merchantName"
                    placeholder="请填写商户名称"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="注册地址"
                      prop="companyAddress">
          <el-input v-model="ruleForm2.companyAddress"
                    placeholder="请依照营业执照/登记证书，填写注册地址"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="营业期限"
                      required>
          <el-col :span="6">
            <el-form-item prop="businessStartTime">
              <el-date-picker type="date"
                              placeholder="选择日期"
                              size="small"
                              value-format="yyyy-MM-dd"
                              v-model="ruleForm2.businessStartTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line"
                  style="text-align: center;width: 3.5%;"
                  :span="1">-</el-col>
          <el-col :span="6">
            <el-form-item prop="businessEndTime">
              <el-date-picker type="date"
                              placeholder="选择日期"
                              size="small"
                              value-format="yyyy-MM-dd"
                              v-model="ruleForm2.businessEndTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-checkbox v-model="ruleForm2.onLongTerm"
                       style="margin-left: 15px">长期</el-checkbox>
        </el-form-item>
        <el-form-item label="经营者姓名/法定代表人"
                      prop="legalPerson">
          <el-input v-model="ruleForm2.legalPerson"
                    placeholder="请填写经营者姓名/法定代表人"
                    size="small"></el-input>
        </el-form-item>

        <div class="subtitle">法定代表人/个体户经营者证件</div>
        <div class="pl-tips">
          <i class="el-icon-info"></i>
          请上传法人“{{ruleForm2.legalPerson}}”的身份证/护照
        </div>

        <el-form-item label="证件类型"
                      prop="idDocType">
          <el-radio-group v-model="ruleForm2.idDocType">
            <el-radio label="IDENTIFICATION_TYPE_MAINLAND_IDCARD">中国大陆居民-身份证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_HONGKONG">中国香港居民-来往内地通行证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_MACAO">中国澳门居民-来往内地通行证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_TAIWAN"
                      style="margin-top: 20px">中国台湾居民-来往大陆通行证</el-radio>
            <el-radio label="IDENTIFICATION_TYPE_OVERSEA_PASSPORT"
                      style="margin-top: 20px">其他国家或地区居民-护照</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="ruleForm2.idDocType === 'IDENTIFICATION_TYPE_MAINLAND_IDCARD' ? '身份证人像面照片' : '证件照片'"
                      prop="idCardCopyImageUrl">
          <div class="preview-wrap">
            <div class="preview">
              <i class="iconfont icon-cms_cuowu"
                 v-if="ruleForm2.idCardCopyImageUrl"
                 @click="delIdCardImage()"></i>
              <img :src="ruleForm2.idCardCopyImageUrl"
                   v-if="ruleForm2.idCardCopyImageUrl" />
              <div class="tips1"
                   v-else>
                <i class="iconfont icon-shangchuantupianicon"></i>
                <p>上传图片</p>
              </div>
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :iconShow="false"
                         :fileSize="2"
                         @setAnnex="setAnnexs2" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="证件持有人姓名"
                      prop="idCardName">
          <el-input v-model="ruleForm2.idCardName"
                    placeholder="请填写证件持有人姓名"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="证件号码"
                      prop="idCardNumber">
          <el-input v-model="ruleForm2.idCardNumber"
                    placeholder="请输入证件号码"
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="身份证国徽面照片"
                      v-if="ruleForm2.idDocType === 'IDENTIFICATION_TYPE_MAINLAND_IDCARD'"
                      prop="idCardNationalImageUrl">
          <div class="preview-wrap">
            <div class="preview">
              <i class="iconfont icon-cms_cuowu"
                 v-if="ruleForm2.idCardNationalImageUrl"
                 @click="delIdCard2Image()"></i>
              <img :src="ruleForm2.idCardNationalImageUrl"
                   v-if="ruleForm2.idCardNationalImageUrl" />
              <div class="tips1"
                   v-else>
                <i class="iconfont icon-shangchuantupianicon"></i>
                <p>上传图片</p>
              </div>
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :iconShow="false"
                         :fileSize="2"
                         @setAnnex="setAnnexs3" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="证件有效期"
                      required>
          <el-col :span="6">
            <el-form-item prop="idCardStartTime">
              <el-date-picker type="date"
                              placeholder="选择日期"
                              size="small"
                              value-format="yyyy-MM-dd"
                              v-model="ruleForm2.idCardStartTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line"
                  style="text-align: center;width: 3.5%;"
                  :span="1">-</el-col>
          <el-col :span="6">
            <el-form-item prop="idCardEndTime">
              <el-date-picker type="date"
                              placeholder="选择日期"
                              size="small"
                              value-format="yyyy-MM-dd"
                              v-model="ruleForm2.idCardEndTime"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-checkbox v-model="ruleForm2.idCardOnLongTerm"
                       style="margin-left: 15px">长期</el-checkbox>
        </el-form-item>

        <div class="subtitle">结算账户</div>
        <div class="pl-tips"
             v-if="ruleForm2.bankAccountType === 'PUBLIC'">
          <i class="el-icon-info"></i>
          你选择的是对公账户，请务必填写开户名为“{{ruleForm2.merchantName}}”的银行账户
        </div>

        <el-form-item label="证件类型"
                      prop="bankAccountType">
          <el-radio-group v-model="ruleForm2.bankAccountType">
            <el-radio label="PUBLIC">对公账户</el-radio>
            <el-radio label="PRIVATE"
                      :disabled="ruleForm2.organizationType !== 'INDIVIDUAL_BUSINESS'">对私账户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开户名称"
                      prop="accountName">
          <div v-if="ruleForm2.bankAccountType === 'PUBLIC'">{{ruleForm2.merchantName}}</div>
          <div v-else>{{ruleForm2.legalPerson}}</div>
        </el-form-item>
        <el-form-item label="开户银行"
                      prop="accountBank">
          <el-select v-model="ruleForm2.accountBank"
                     placeholder="请选择开户银行"
                     @change="clearBankName"
                     size="small">
            <el-option :label="item"
                       v-for="(item, index) in bankList"
                       :key="index"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户支行"
                      prop="bankName">
          <el-select v-model="bankProvinceCode"
                     class="province"
                     @change="getNodes('City', bankProvinceCode)"
                     placeholder="请选择"
                     size="small">
            <el-option :label="item.name"
                       v-for="(item, index) in ProvinceList"
                       :key="index"
                       :value="item.code"></el-option>
          </el-select>
          <el-select v-model="bankCityCode"
                     class="province"
                     value-key="id"
                     @change="getNodes('Area', bankCityCode.code)"
                     placeholder="请选择"
                     size="small">
            <el-option :label="item.name"
                       v-for="(item, index) in CityList"
                       :key="index"
                       :value="item"></el-option>
          </el-select>
          <el-select v-model="bankAreaCode"
                     class="province"
                     @change="getSubBranch(bankCityCode)"
                     placeholder="请选择"
                     size="small">
            <el-option :label="item.name"
                       v-for="(item, index) in AreaList"
                       :key="index"
                       :value="item.code"></el-option>
          </el-select>
          <el-select v-model="ruleForm2.bankName"
                     filterable
                     remote
                     :remote-method="remoteMethod"
                     placeholder="请选择支行"
                     size="small">
            <el-option :label="item.bankName"
                       v-for="(item, index) in subBranchList"
                       :key="index"
                       :value="item.bankName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行账号"
                      prop="accountNumber">
          <el-input v-model="ruleForm2.accountNumber"
                    placeholder="请填写银行账号"
                    size="small"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="pl-content"
         v-if="step2">
      <div class="dr-head"><span class="vertical"></span>经营信息</div>
      <el-form :model="ruleForm3"
               :rules="rules3"
               label-width="135px"
               label-position="left"
               :key="3"
               ref="ruleForm3"
               class="ruleForm2">
        <el-form-item label="商户简称"
                      prop="merchantShortname">
          <el-input v-model="ruleForm3.merchantShortname"
                    placeholder="请填写商户简称"
                    size="small"></el-input>
          <p class="tips2">1.不支持单纯以人名来命名，若为个体户经营，可用“个体户+经营者名称”或“经营者名称+业务”命名，如“个体户张三”或“张三餐饮店”；</p>
          <p class="tips2">2.不支持无实际意义的文案，如“XX特约商户”、“800”、“XX客服电话XXX”；</p>
        </el-form-item>
        <el-form-item label="店铺二维码"
                      prop="storeQrCodeImageUrl">
          <div class="preview-wrap">
            <div class="preview">
              <i class="iconfont icon-cms_cuowu"
                 v-if="ruleForm3.storeQrCodeImageUrl"
                 @click="delStoreImage()"></i>
              <img :src="ruleForm3.storeQrCodeImageUrl"
                   v-if="ruleForm3.storeQrCodeImageUrl" />
              <div class="tips1"
                   v-else>
                <i class="iconfont icon-shangchuantupianicon"></i>
                <p>上传图片</p>
              </div>
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :iconShow="false"
                         :fileSize="2"
                         @setAnnex="setAnnexs6" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-form label-width="135px"
               :model="ruleForm2"
               label-position="left"
               class="ruleForm2">
        <el-form-item label="特殊资质">
          <el-select v-model="ruleForm2.qualificationsType"
                     placeholder="请选择活动区域"
                     clearable
                     size="samll">
            <el-option label="食品生鲜选填，若贵司具备以下资质，建议提供：食品业态，提供《食品经营许可证》或《食品生产许可证》或供销协议 合作方资质"
                       value="食品生鲜选填，若贵司具备以下资质，建议提供：食品业态，提供《食品经营许可证》或《食品生产许可证》或供销协议 合作方资质"></el-option>
          </el-select>
          <p class="tips2">1.请提供为“申请商家主体”所属的特殊资质，可授权使用总工商/分公司的特殊资质；</p>
          <p class="tips2">2.请上传2M以内的图片。</p>

          <div class="preview-wrap">
            <div class="preview">
              <i class="iconfont icon-cms_cuowu"
                 v-if="ruleForm2.qualifications"
                 @click="delQualifImage()"></i>
              <img :src="ruleForm2.qualifications"
                   v-if="ruleForm2.qualifications" />
              <div class="tips1"
                   v-else>
                <i class="iconfont icon-shangchuantupianicon"></i>
                <p>上传图片</p>
              </div>
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :iconShow="false"
                         :fileSize="2"
                         @setAnnex="setAnnexs4" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="补充说明（选填）">
          <el-input type="textarea"
                    style="width: 400px; height: 100px"
                    maxlength="500"
                    v-model="ruleForm2.businessAdditionDesc"
                    placeholder="根据驳回要求提供额外信息，如：业务模式不清晰时，请详细描述支付场景"></el-input>
        </el-form-item>
        <el-form-item label="补充材料（选填）">
          <div class="preview-wrap">
            <div class="preview">
              <i class="iconfont icon-cms_cuowu"
                 v-if="ruleForm2.businessAdditionPicsImageUrls"
                 @click="delBusinessAddImage()"></i>
              <img :src="ruleForm2.businessAdditionPicsImageUrls"
                   v-if="ruleForm2.businessAdditionPicsImageUrls" />
              <div class="tips1"
                   v-else>
                <i class="iconfont icon-shangchuantupianicon"></i>
                <p>上传图片</p>
              </div>
              <aliUpload class="aliUpload"
                         :fileType="fileType"
                         :iconShow="false"
                         :fileSize="2"
                         @setAnnex="setAnnexs5" />
            </div>
          </div>
          <p class="tips2">根据驳回要求提供额外信息，如：</p>
          <p class="tips2">1.业务模式不清晰时，需详细描述支付场景或提供相关材料（如业务说明/门店照/手持证件照等；</p>
          <p class="tips2">2.特殊业务要求提供相关的协议材料等。</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="pl-content"
         v-if="step3">
      <div class="dr-head"><span class="vertical"></span>主体信息</div>

      <div class="subtitle">营业执照</div>
      <div class="el-form-item-label">
        <div class="label">营业执照照片</div>
        <img :src="ruleForm4.businessLicenseCopyImgageUrl"
             class="itemcontent"
             alt="" />
      </div>
      <div class="el-form-item-label">
        <div class="label">注册号</div>
        <div class="itemcontent">{{ruleForm4.businessLicenseNumber}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">商户名称</div>
        <div class="itemcontent">{{ruleForm4.merchantName}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">注册地址</div>
        <div class="itemcontent">{{ruleForm4.companyAddress}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">营业期限</div>
        <div class="itemcontent">{{ruleForm4.businessStartTime}} 至
          <span v-if="ruleForm4.onLongTerm">长期</span>
          <span v-else>{{ruleForm4.businessEndTime}}</span>
        </div>
      </div>
      <div class="el-form-item-label">
        <div class="label">经营者姓名/法定代表人</div>
        <div class="itemcontent">{{ruleForm4.legalPerson}}</div>
      </div>

      <div class="subtitle">法定代表人/个体户经营者证件</div>

      <div class="el-form-item-label">
        <div class="label">证件类型</div>
        <div class="itemcontent">{{idDocTypeFormate(ruleForm4.idDocType)}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label"
             v-if="ruleForm2.idDocType === 'IDENTIFICATION_TYPE_MAINLAND_IDCARD'">身份证人像面照片</div>
        <div class="label"
             v-else>证件照片</div>
        <img :src="ruleForm4.idCardCopyImageUrl"
             class="itemcontent" />
      </div>
      <div class="el-form-item-label">
        <div class="label">证件持有人姓名</div>
        <div class="itemcontent">{{ruleForm4.idCardName}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">证件号码</div>
        <div class="itemcontent">{{ruleForm4.idCardNumber}}</div>
      </div>
      <div class="el-form-item-label"
           v-if="ruleForm4.idDocType === 'IDENTIFICATION_TYPE_MAINLAND_IDCARD'">
        <div class="label">身份证国徽面照片</div>
        <img :src="ruleForm4.idCardNationalImageUrl"
             class="itemcontent" />
      </div>
      <div class="el-form-item-label">
        <div class="label">证件有效期</div>
        <div class="itemcontent">{{ruleForm4.idCardStartTime}}至
          <span v-if="ruleForm4.idCardOnLongTerm">长期</span>
          <span v-else>{{ruleForm4.idCardEndTime}}</span>
        </div>
      </div>

      <div class="subtitle">结算账户</div>

      <div class="el-form-item-label">
        <div class="label">证件类型</div>
        <div class="itemcontent">{{ruleForm4.bankAccountType === 'PRIVATE' ? '对私账户' : '对公账户'}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">开户名称</div>
        <div v-if="ruleForm4.bankAccountType === 'PUBLIC'">{{ruleForm4.merchantName}}</div>
        <div v-else>{{ruleForm4.legalPerson}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">开户银行</div>
        <div class="itemcontent">{{ruleForm4.accountBank}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">开户支行</div>
        <div class="itemcontent">{{ruleForm4.bankName}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">银行账号</div>
        <div class="itemcontent">{{ruleForm4.accountNumber}}</div>
      </div>

    </div>
    <div class="pl-content"
         v-if="step3">
      <div class="dr-head"><span class="vertical"></span>经营信息</div>
      <div class="el-form-item-label">
        <div class="label">商户简称</div>
        <div class="itemcontent">{{ruleForm5.merchantShortname}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">店铺二维码</div>
        <img :src="ruleForm5.storeQrCodeImageUrl"
             v-if="ruleForm5.storeQrCodeImageUrl"
             class="itemcontent" />
      </div>
      <div class="el-form-item-label">
        <div class="label">特殊资质</div>
        <div class="itemcontent">{{ruleForm6.qualificationsType}}</div>
      </div>
      <img :src="ruleForm6.qualifications"
           v-if="ruleForm6.qualifications"
           class="itemcontent"
           style="margin-left: 200px;margin-bottom: 30px" />
      <div class="el-form-item-label">
        <div class="label">补充说明（选填）</div>
        <div class="itemcontent">{{ruleForm6.businessAdditionDesc}}</div>
      </div>
      <div class="el-form-item-label">
        <div class="label">补充材料（选填）</div>
        <img :src="ruleForm6.businessAdditionPicsImageUrls"
             v-if="ruleForm6.businessAdditionPicsImageUrls"
             class="itemcontent" />
      </div>
    </div>
    <div class="pl-footer">
      <div class="dialog-footer">
        <el-button type="primary"
                   v-if="step1"
                   @click="closeDialog"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   class="close-button"
                   v-if="!step1"
                   @click="previousStep()">上一步</el-button>
        <el-button type="primary"
                   v-if="step1 || step2"
                   class="defaultbtn dialog-confirmBtn"
                   @click="nextStep()">下一步</el-button>
        <el-button type="primary"
                   v-if="step3"
                   class="defaultbtn dialog-confirmBtn"
                   @click="confirm()">确定提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
const idDocType = {
  'IDENTIFICATION_TYPE_MAINLAND_IDCARD': '中国大陆居民-身份证',
  'IDENTIFICATION_TYPE_OVERSEA_PASSPORT': '中国香港居民-来往内地通行证',
  'IDENTIFICATION_TYPE_HONGKONG': '中国澳门居民-来往内地通行证',
  'IDENTIFICATION_TYPE_MACAO': '中国台湾居民-来往大陆通行证',
  'IDENTIFICATION_TYPE_TAIWAN': '其他国家或地区居民-护照'
}
export default {
  name: 'PaymentApplication',
  components: {
    aliUpload
  },
  props: {
    tenantId: {
      type: Number
    },
    projectManagementId: {
      type: Number
    }
  },
  data () {
    var validateIdCardName = (rule, value, callback) => {
      if (value !== this.ruleForm2.legalPerson) {
        callback(new Error('请上传法人的身份证件（即与营业执照上的经营者/法人姓名相同的身份证件）'))
      } else {
        callback()
      }
    }
    return {
      step1: true,
      step2: false,
      step3: false,
      ruleForm1: {
        contactType: 'LEGAL_PERSON',
        contactName: '',
        contactIdCardNumber: '',
        mobilePhone: '',
        contactEmail: ''
      },
      ruleForm2: {
        organizationType: 'INDIVIDUAL_BUSINESS',
        businessLicenseCopyImgageUrl: '',
        merchantName: '',
        companyAddress: '',
        businessStartTime: '',
        businessEndTime: '',
        legalPerson: '',
        idDocType: 'IDENTIFICATION_TYPE_MAINLAND_IDCARD',
        idCardCopyImageUrl: '',
        idCardName: '',
        idCardNumber: '',
        idCardNationalImageUrl: '',
        idCardStartTime: '',
        idCardEndTime: '',
        bankAccountType: 'PRIVATE',
        accountBank: '',
        bankName: '',
        accountNumber: '',
        qualificationsType: '',
        qualifications: '',
        businessAdditionDesc: '',
        businessAdditionPicsImageUrls: '',
        onLongTerm: '',
        idCardOnLongTerm: '',
        businessLicenseNumber: ''
      },
      ruleForm3: {
        merchantShortname: '',
        storeQrCodeImageUrl: ''
      },
      rules1: {
        contactType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        contactName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        contactIdCardNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1(2|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        contactEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '请输入正确的邮箱', trigger: 'blur' }
        ]
      },
      rules2: {
        organizationType: [
          { required: true, message: '请选择主体类型', trigger: 'change' }
        ],
        businessLicenseCopyImgageUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        businessLicenseNumber: [
          { required: true, message: '请输入注册号', trigger: 'blur' }
        ],
        merchantName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' }
        ],
        companyAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' }
        ],
        businessStartTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        businessEndTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        legalPerson: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        idDocType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        idCardCopyImageUrl: [
          { required: true, message: '请上传证件照片', trigger: 'change' }
        ],
        idCardName: [
          { required: true, message: '请输入证件持有人姓名', trigger: 'blur' },
          { validator: validateIdCardName, trigger: 'blur' }
        ],
        idCardNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        idCardNationalImageUrl: [
          { required: true, message: '请上传身份证国徽面照片', trigger: 'blur' }
        ],
        idCardStartTime: [
          { required: true, message: '请输入证件有效期开始时间', trigger: 'change' }
        ],
        idCardEndTime: [
          { required: true, message: '请输入证件有效期结束时间', trigger: 'change' }
        ],
        bankAccountType: [
          { required: true, message: '请选择证件类型', trigger: 'change' }
        ],
        accountBank: [
          { required: true, message: '请选择开户银行', trigger: 'change' }
        ],
        bankName: [
          { required: true, message: '请选择开户支行', trigger: 'change' }
        ],
        accountNumber: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ]
      },
      rules3: {
        merchantShortname: [
          { required: true, message: '请输入商户简称', trigger: 'blur' }
        ],
        storeQrCodeImageUrl: [
          { required: true, message: '请上传店铺二维码', trigger: 'change' }
        ]
      },
      fileType: ['jpg', 'bmp', 'png'],
      bankList: [
        '交通银行',
        '上海银行',
        '工商银行',
        '招商银行',
        '民生银行',
        '中信银行',
        '浦发银行',
        '兴业银行',
        '光大银行',
        '广发银行',
        '平安银行',
        '北京银行',
        '华夏银行',
        '农业银行',
        '建设银行',
        '邮政储蓄银行',
        '中国银行',
        '宁波银行'
      ],
      bankProvinceCode: '',
      bankCityCode: '',
      ProvinceList: [],
      CityList: [],
      subBranchList: [],
      editStatus: false,
      bankAreaCode: '',
      AreaList: [],
      ruleForm4: {},
      ruleForm5: {},
      ruleForm6: {}
    }
  },
  created () {
    this.getNodes('Province')
  },
  methods: {
    closeDialog () {
      this.$emit('closePaymentDialog')
    },
    async REJECTED_handler (accountDetails) {
      this.step1 = false
      this.step2 = true
      this.step3 = false
      this.ruleForm1 = {
        id: accountDetails.id,
        tenantId: accountDetails.tenantId,
        projectManagementId: accountDetails.projectManagementId,
        contactType: accountDetails.contactType,
        contactName: accountDetails.contactName,
        contactIdCardNumber: accountDetails.contactIdCardNumber,
        mobilePhone: accountDetails.mobilePhone,
        contactEmail: accountDetails.contactEmail
      }
      // 省市区回显
      const bankAddressCode = accountDetails.bankAddressCode
      this.bankProvinceCode = bankAddressCode.split(',')[0]
      const cityList = await this.getNodes('City', this.bankProvinceCode)
      const bankCityCode = cityList.filter(item => {
        return item.code === bankAddressCode.split(',')[1]
      })
      this.bankCityCode = bankCityCode[0]
      const cityCode = bankAddressCode.split(',')[1]
      const areaList = await this.getNodes('Area', cityCode)
      this.bankAreaCode = bankAddressCode.split(',')[2]

      this.ruleForm2 = {
        bankAddressCode: accountDetails.bankAddressCode,
        organizationType: accountDetails.organizationType,
        businessLicenseCopyImgageUrl: accountDetails.businessLicenseCopyImgageUrl,
        businessLicenseNumber: accountDetails.businessLicenseNumber,
        merchantName: accountDetails.merchantName,
        companyAddress: accountDetails.companyAddress,
        businessStartTime: accountDetails.businessStartTime,
        businessEndTime: accountDetails.businessEndTime,
        legalPerson: accountDetails.legalPerson,
        idDocType: accountDetails.idDocType,
        idCardCopyImageUrl: accountDetails.idCardCopyImageUrl,
        idCardName: accountDetails.idCardName,
        idCardNumber: accountDetails.idCardNumber,
        idCardNationalImageUrl: accountDetails.idCardNationalImageUrl,
        idCardStartTime: accountDetails.idCardStartTime,
        idCardEndTime: accountDetails.idCardEndTime,
        bankAccountType: accountDetails.bankAccountType,
        accountBank: accountDetails.accountBank,
        bankName: accountDetails.bankName,
        accountNumber: accountDetails.accountNumber,
        qualificationsType: accountDetails.qualificationsType,
        qualifications: accountDetails.qualifications,
        businessAdditionDesc: accountDetails.businessAdditionDesc,
        businessAdditionPicsImageUrls: accountDetails.businessAdditionPicsImageUrls,
        onLongTerm: accountDetails.onLongTerm,
        idCardOnLongTerm: accountDetails.idCardOnLongTerm
      }
      this.ruleForm3 = {
        merchantShortname: accountDetails.merchantShortname,
        storeQrCodeImageUrl: accountDetails.storeQrCodeImageUrl
      }
      this.editStatus = true
    },
    clearBankName () {
      this.subBranchList = ''
      this.ruleForm2.bankName = ''
      if (this.bankAreaCode) {
        this.getSubBranch(this.bankCityCode)
      }
    },
    nextStep () {
      if (this.step1) {
        this.$refs['ruleForm1'].validate((valid) => {
          console.log(this.ruleForm1)
          if (valid) {
            this.step1 = false
            this.step2 = true
            this.step3 = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.step2) {
        this.$refs['ruleForm2'].validate((valid) => {
          if (valid) {
            this.$refs['ruleForm3'].validate((valid) => {
              if (valid) {
                this.ruleForm4 = this.ruleForm2
                this.ruleForm5 = this.ruleForm3
                this.ruleForm6 = this.ruleForm2
                this.step1 = false
                this.step2 = false
                this.step3 = true
              } else {
                console.log('error submit!!')
                return false
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    previousStep () {
      if (this.step2) {
        this.step2 = false
        this.step1 = true
        this.step3 = false
      } else if (this.step3) {
        this.step1 = false
        this.step2 = true
        this.step3 = false
      }
    },
    idDocTypeFormate (val) {
      return idDocType[val]
    },
    imageRecognition (imageUrl, type) {
      let postData = {}
      let URL = ''
      if (type) {
        URL = 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json'
        postData = {
          'image': imageUrl,
          'configure': {
            'side': type
          }
        }
      } else {
        URL = 'https://dm-58.data.aliyun.com/rest/160601/ocr/ocr_business_license.json'
        postData = {
          'image': imageUrl
        }
      }
      axios({
        method: 'POST',
        url: URL,
        dadaType: 'json',
        data: postData
      }).then(res => {
        const data = res.data
        if (type === 'face') {
          this.ruleForm2.idCardName = data.name
          this.ruleForm2.idCardNumber = data.num
        } else if (type === 'back') {
          let startDate = data.start_date
          let endDate = data.end_date
          this.ruleForm2.idCardStartTime = startDate.substring(0, 4) + '-' + startDate.substring(4, 6) + '-' + startDate.substring(6, 8)
          if (endDate.length > 2) {
            this.ruleForm2.idCardEndTime = endDate.substring(0, 4) + '-' + endDate.substring(4, 6) + '-' + endDate.substring(6, 8)
          } else {
            this.ruleForm2.idCardEndTime = ''
          }
        } else {
          this.ruleForm2.businessLicenseNumber = data.reg_num
          this.ruleForm2.merchantName = data.name
          this.ruleForm2.companyAddress = data.address
          this.ruleForm2.legalPerson = data.person
        }
      })
    },
    delBusinessImage () {
      this.ruleForm2.businessLicenseCopyImgageUrl = ''
    },
    setAnnexs (annexURL, annexName) {
      this.ruleForm2.businessLicenseCopyImgageUrl = annexURL
      this.imageRecognition(annexURL)
    },
    delIdCardImage () {
      this.ruleForm2.idCardCopyImageUrl = ''
    },
    setAnnexs2 (annexURL, annexName) {
      this.ruleForm2.idCardCopyImageUrl = annexURL
      if (this.ruleForm2.idDocType === 'IDENTIFICATION_TYPE_MAINLAND_IDCARD') {
        this.imageRecognition(annexURL, 'face')
      }
    },
    delIdCard2Image () {
      this.ruleForm2.idCardNationalImageUrl = ''
    },
    setAnnexs3 (annexURL, annexName) {
      this.ruleForm2.idCardNationalImageUrl = annexURL
      this.imageRecognition(annexURL, 'back')
    },
    delQualifImage () {
      this.ruleForm2.qualifications = ''
    },
    setAnnexs4 (annexURL, annexName) {
      this.ruleForm2.qualifications = annexURL
    },
    delBusinessAddImage () {
      this.ruleForm2.businessAdditionPicsImageUrls = ''
    },
    setAnnexs5 (annexURL, annexName) {
      this.ruleForm2.businessAdditionPicsImageUrls = annexURL
    },
    delStoreImage () {
      this.ruleForm3.storeQrCodeImageUrl = ''
    },
    setAnnexs6 (annexURL, annexName) {
      this.ruleForm3.storeQrCodeImageUrl = annexURL
    },
    async getNodes (type, idArea) {
      let response = await context.http.get('/ywm/api/district-codes/parentId', {
        parentId: idArea
      })
      this.ruleForm2.bankName = ''
      if (response.status === 200) {
        if (type === 'Province') {
          this.ProvinceList = response.data
        } else if (type === 'City') {
          this.CityList = ''
          this.bankCityCode = ''
          this.CityList = response.data
          this.subBranchList = ''
          this.AreaList = ''
          this.bankAreaCode = ''
        } else {
          this.AreaList = ''
          this.bankAreaCode = ''
          this.subBranchList = ''
          this.AreaList = response.data
        }
        return response.data
      }
    },
    async getSubBranch (item) {
      const cityCode = item.code
      this.ruleForm2.bankAddressCode = this.bankProvinceCode + ',' + cityCode + ',' + this.bankAreaCode
      const response = await context.http.get('/pay/api/merchantApply/bank', {
        bankName: this.ruleForm2.accountBank,
        cityName: item.name === '市辖区' ? item.address : item.name
      })
      if (response.status === 200) {
        this.subBranchList = response.data
      }
    },
    async remoteMethod (query) {
      if (query !== '') {
        let item = this.bankCityCode
        const response = await context.http.get('/pay/api/merchantApply/bank', {
          bankName: this.ruleForm2.accountBank,
          cityName: item.name === '市辖区' ? item.address : item.name,
          search: query
        })
        if (response.status === 200) {
          this.subBranchList = response.data
        }
      } else {
        this.subBranchList = []
      }
    },
    async confirm () {
      if (this.ruleForm2.bankAccountType === 'PUBLIC') {
        this.ruleForm2.accountName = this.ruleForm2.merchantName
      } else {
        this.ruleForm2.accountName = this.ruleForm2.legalPerson
      }
      const postData = { ...this.ruleForm1, ...this.ruleForm2, ...this.ruleForm3 }
      // console.log(postData)
      if (this.editStatus) {
        const response = await context.http.put('/pay/api/merchantApply', postData)
        if (response.status === 200) {
          this.$message.success('提交成功')
          this.closeDialog()
        }
      } else {
        postData.tenantId = this.tenantId
        postData.projectManagementId = this.projectManagementId
        const response = await context.http.post('/pay/api/merchantApply', postData)
        if (response.status === 200) {
          this.$message.success('提交成功')
          this.closeDialog()
        }
      }
    }
  }
}
</script>
<style lang="scss">
.PaymentApplication {
  .el-form-item__content {
    margin-left: 135px !important;
    line-height: 40px !important;
  }
  .ruleForm1 {
    .el-input {
      width: 300px;
    }
  }
  .ruleForm2 {
    .province {
      .el-input {
        width: 130px;
      }
    }
    .el-input {
      width: 400px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 186px !important;
    }
    .el-col {
      .el-form-item__content {
        margin-left: 0 !important;
        line-height: 40px !important;
      }
    }
  }
  .oss_file {
    width: 100%;
    height: 100%;
  }
  textarea {
    height: 100px !important;
  }
}
</style>
<style lang="scss" scoped>
.PaymentApplication {
  .tips2 {
    font-size: 12px;
    color: #777777;
    line-height: 20px;
  }
  .pl-head {
    display: flex;
    justify-content: space-start;
    margin-top: 20px;
    background-color: #ffffff;
    padding: 0 35px 10px 20px;
  }
  .step {
    display: inline-block;
    width: 49%;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
  .stepActive {
    color: #fff;
    background-color: #3175d2;
  }
  .stepActivePast {
    color: #fff;
    background-color: #789ed2;
  }
  .pl-content {
    margin-top: 12px;
    padding: 0 20px;
    background-color: #fff;
    overflow: hidden;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .dr-head {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 700;
    border-bottom: 1px solid #f6f6f6;
    color: #262626;
    .vertical {
      display: inline-block;
      width: 4px;
      height: 18px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
  }
  .pl-tips {
    color: #262626;
    font-size: 12px;
    margin-bottom: 20px;
    .el-icon-info {
      color: #3575f6;
      font-size: 14px;
      margin-right: 8px;
    }
  }
  .pl-footer {
    padding: 10px 20px 20px;
    text-align: right;
    box-sizing: border-box;
    padding-left: 35px !important;
    background-color: #ffffff;
    margin-top: 10px;
    .close-button {
      margin-left: 0 !important;
      background-color: #fff !important;
      border: none;
    }
    .defaultbtn {
      width: 90px !important;
      margin-left: 0 !important;
    }
  }
  .subtitle {
    color: #262626;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .preview-wrap {
    display: flex;
    justify-content: flex-start;
    margin: 10px 0;
    .preview {
      width: 100px;
      height: 100px;
      border: 1px solid #f7f9fd;
      margin: 0 30px 0 0;
      position: relative;
      background: #f7f9fd;
      &:hover {
        .pw-bottom {
          background-color: #4893fc;
        }
      }
      .pw-bottom {
        position: absolute;
        background-color: #4883f6;
        text-align: center;
        color: #fff;
        width: 100%;
        bottom: 0;
        font-size: 14px;

        .upload-icon {
          background: url(../../../assets/upload-white.png) no-repeat;
          background-size: contain;
          width: 12px;
          height: 12px;
          margin: 6px 6px 6px 0;
        }
      }

      img {
        width: 100%;
        height: 100%;
      }

      input {
        position: absolute;
        top: 0;
        right: 0;
        width: 160px;
        height: 198px;
        opacity: 0;
        cursor: pointer;
      }
      .tips1 {
        color: #3575f6 !important;
        text-align: center;
        margin-top: 20px;
        padding-left: 0 !important;
        i {
          font-size: 32px;
        }
        p {
          line-height: 10px;
        }
      }
      .icon-cms_cuowu {
        cursor: pointer;
        position: absolute;
        top: -20px;
        right: -11px;
      }
    }

    .map {
      width: 910px;
      height: 200px;
      border: 1px solid #ddd;
    }

    .errorTip {
      color: red;
      bottom: -18px;
      position: absolute;
    }
    + p {
      font-size: 12px;
      color: #777;
      margin: 0 0 10px 0;
    }
    img {
      width: 100px;
      height: 100px;
    }
    .aliUpload {
      opacity: 0;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      input {
        font-size: 12px;
      }
    }
  }
  .itemcontent {
    color: #262626;
    font-size: 14px;
  }
  .el-form-item-label {
    display: flex;
    margin-bottom: 30px;
    .label {
      width: 150px;
      margin-right: 50px;
    }
    .itemcontent {
      text-align: left;
      /* margin-left: 135px; */
    }
  }
}
</style>

