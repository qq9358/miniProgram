<template>
  <div ref="grbody" class="booking">
    <mptoast />
    <van-dialog id="van-dialog" />
    <div class="booking-mod">
      <div class="booking-mod-hd">
        <span class="booking-mod-hd-title">使用日期</span>
      </div>
      <div class="booking-mod-bd">
        <date-selector v-model="input.travelDate" :dates="ticketType.dailyPrices"></date-selector>
      </div>
    </div>

    <div class="booking-mod">
      <div class="booking-mod-around">
        <div class="booking-multi-item">
          <div class="booking-multi-item-auto">
            <h3>{{ ticketType.name }}</h3>
            <ul class="booking-mod-around-label clearfix">
              <li :class="refundClass">
                <van-icon :name="refundIcon" />
                <span>{{ refundText }}</span>
              </li>
              <li class="info">
                <van-icon name="passed" />
                <span>入园保障</span>
              </li>
            </ul>
            <p @click="descriptionClick" class="booking-mod-around-resinfo">购买须知></p>
            <p
              v-if="ticketType.minBuyNum > 1"
              class="booking-mod-around-limited"
            >至少需购买{{ ticketType.minBuyNum }}份</p>
          </div>
          <div>
            <div class="booking-mod-around-price">
              <span class="booking-mod-around-price-span">¥</span>
              <span class="booking-mod-around-price-i">{{ price }}</span>
            </div>
            <div class="booking-mod-around-num">
              <van-stepper
                v-model="quantity"
                :min="minBuyNum"
                :max="maxBuyNum"
                integer
                @change="onQuantityChange"
              />
            </div>
          </div>
        </div>
        <p
          v-if="false"
          class="booking-mod-around-tips"
        >景区统一限购，同一手机号1天内在所有网络平台最多只能预订5份。如您需要重复购买，请使用其他手机号购买。</p>
      </div>
    </div>

    <div v-if="ticketType.groundChangCis.length > 0" class="booking-mod">
      <div class="booking-mod-hd">
        <span class="booking-mod-hd-title">场次信息</span>
      </div>
      <div class="booking-mod-bd">
        <div v-for="groundChangCi in ticketType.groundChangCis" :key="groundChangCi.groundId">
          <div>{{groundChangCi.groundName}}</div>
          <picker
            :value="groundChangCi.changCiId"
            :range="groundChangCi.changCis"
            range-key="displayText"
            @change="bindPickerChange($event,groundChangCi)"
          >
            <div v-if="groundChangCi.changCiId" class="picker">{{groundChangCi.changCiId}}</div>
            <div v-else>请选择场次</div>
          </picker>
        </div>
      </div>
    </div>

    <div v-if="ticketType.needCert" class="booking-mod">
      <div class="booking-mod-hd">
        <span class="booking-mod-hd-title">出行人信息</span>
        <span class="booking-mod-hd-tips">
          需填写
          <span class="booking-mod-hd-tips-em">{{ quantity }}个</span>出行人
        </span>
      </div>
      <div class="booking-mod-bd">
        <van-cell-group v-if="quantity == 1">
          <van-field
            :value="firstTourist.name"
            @change="firstTouristName"
            clearable
            label="姓名"
            placeholder="须与证件上的名字一致"
          />
          <van-field
            :value="firstTourist.certNo"
            @change="firstTouristCertNo"
            clearable
            label="身份证"
            placeholder="请填写证件号码"
          />
        </van-cell-group>
        <div v-if="quantity > 1" class="booking-tourist">
          <div style="width:75px;">出行人</div>
          <div style="flex:1;">
            <van-cell-group :border="false">
              <template v-for="(tourist, index) in tourists">
                <van-cell
                  v-if="tourist.name || tourist.certNo"
                  :key="index"
                  :class="{
                    'booking-tourist-error': errorTouristIndex == index
                  }"
                  style="align-items: center;"
                  @click="onTouristEdit(index)"
                >
                  <p v-if="tourist.name" class="booking-tourist-item">{{ tourist.name }}</p>
                  <p v-if="tourist.certNo" class="booking-tourist-item">身份证 {{ tourist.certNo }}</p>
                  <van-icon slot="right-icon" name="edit" />
                </van-cell>
                <van-cell
                  v-else
                  :key="index"
                  :title="'点击添加出行人' + (index + 1)"
                  :class="{
                    'booking-tourist-error': errorTouristIndex == index
                  }"
                  @click="onTouristEdit(index)"
                >
                  <van-icon slot="right-icon" name="edit" />
                </van-cell>
              </template>
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>

    <div v-if="needContact" class="booking-mod">
      <div class="booking-mod-hd">
        <span class="booking-mod-hd-title">联系信息</span>
        <span class="booking-mod-hd-tips">
          需填写
          <span class="booking-mod-hd-tips-em">1个</span>联系人
        </span>
      </div>
      <div class="booking-mod-bd">
        <van-cell-group>
          <van-field
            v-if="!ticketType.needCert"
            :value="input.contactName"
            clearable
            label="姓名"
            placeholder="请填写姓名"
            @change="contactNameChange"
          />
          <van-field
            :value="input.contactMobile"
            type="tel"
            clearable
            label="联系手机"
            placeholder="请填写手机号码"
            @change="contactMobileChange"
          />
        </van-cell-group>
      </div>
    </div>

    <van-submit-bar
      :loading="saving"
      :price="totalMoney"
      label="总额："
      :button-text="submitText"
      @submit="onSubmit"
    />

    <van-popup :show="showDescription" position="bottom">
      <div class="description">
        <div class="description-title">
          <div>购买须知</div>
          <div class="description-close-btn" @click="showDescription = false">
            <van-icon name="cuowu" />
          </div>
        </div>
        <div style="height: 100%; overflow-y: auto;">
          <div class="description-content">
            <div style="height:40px;">&nbsp;</div>
            <div class="description-content-item description-content-title">
              <span>{{ ticketType.name }}</span>
            </div>
            <div v-if="description.bookDescription" class="description-content-item">
              <h3>预订说明</h3>
              <div class="description-content-item-text" v-html="description.bookDescription"></div>
            </div>
            <div v-if="description.feeDescription" class="description-content-item">
              <h3>费用说明</h3>
              <div class="description-content-item-text" v-html="description.feeDescription"></div>
            </div>
            <div v-if="description.usageDescription" class="description-content-item">
              <h3>使用说明</h3>
              <div class="description-content-item-text" v-html="description.usageDescription"></div>
            </div>
            <div v-if="description.refundDescription" class="description-content-item">
              <h3>退改说明</h3>
              <div class="description-content-item-text" v-html="description.refundDescription"></div>
            </div>
            <div v-if="description.otherDescription" class="description-content-item">
              <h3>其他说明</h3>
              <div class="description-content-item-text" v-html="description.otherDescription"></div>
            </div>
            <div v-if="showBuy" style="height:49px;">&nbsp;</div>
          </div>
        </div>
        <van-submit-bar
          v-if="showBuy"
          :price="ticketTypePrice"
          label=" "
          button-text="立即预订"
          @submit="onBuy"
        />
      </div>
    </van-popup>

    <van-popup v-if="ticketType.needCert" :show="showTourist" position="right">
      <div class="booking-tourist-edit">
        <div class="booking-tourist-edit-title">{{editTouristTitle}}出行人</div>
        <div class="booking-tourist-edit-content">
          <div class="booking-tourist-edit-content-div">
            <van-field
              v-model="editTourist.name"
              clearable
              label="姓名"
              placeholder="须与证件上的名字一致"
              class="top-radius"
              @change="editNameChange"
            />
            <van-field
              v-model="editTourist.certNo"
              clearable
              label="身份证"
              placeholder="请填写证件号码"
              class="bottom-radius"
              @change="editMobileChange"
            />
          </div>
          <div class="booking-tourist-edit-btnbox">
            <button class="button-main" @click="onTouristSave">完成</button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import DateSelector from "@/components/DateSelector.vue";
import ticketTypeService from "@/services/ticketTypeService.js";
import orderService from "@/services/orderService.js";
import validate from "@/utils/validator.js";
import mptoast from "mptoast";
import Dialog from "@/../static/vant/dialog/dialog";

class Tourist {
  constructor() {
    this.name = "";
    this.certNo = "";
  }
}

export default {
  components: {
    DateSelector,
    mptoast
  },
  props: {
    ticketTypeId: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      input: {
        items: [
          {
            ticketTypeId: "",
            quantity: 1
          }
        ],
        travelDate: "",
        contactName: "",
        contactMobile: "",
        ifMini: true
      },
      quantity: 1,
      tourists: [],
      ticketType: {
        dailyPrices: [],
        groundChangCis: []
      },
      minBuyNum: 1,
      maxBuyNum: 100,
      showDescription: false,
      saving: false,
      submited: false,
      showTourist: false,
      firstTourist: new Tourist(),
      currentTouristIndex: -1,
      editTourist: {},
      errorTouristIndex: -1,
      description: {
        ticketTypeName: "",
        bookDescription: "",
        feeDescription: "",
        usageDescription: "",
        refundDescription: "",
        otherDescription: ""
      }
    };
  },
  computed: {
    refundClass() {
      let className = "info";
      if (this.ticketType.allowRefund === false) {
        className = "error";
      } else if (this.ticketType.refundLimited) {
        className = "warning";
      }
      let classObj = {};
      classObj[className] = true;
      return className;
    },
    refundIcon() {
      if (this.ticketType.allowRefund === false) {
        return "close";
      }
      return this.ticketType.refundLimited ? "info-o" : "passed";
    },
    refundText() {
      if (this.ticketType.allowRefund === false) {
        return "不可退";
      }
      return this.ticketType.refundLimited ? "有条件退" : "随时退";
    },
    price() {
      const priceObj = this.ticketType.dailyPrices.find(
        p => p.date == this.input.travelDate
      );
      return priceObj ? priceObj.price : 0;
    },
    totalMoney() {
      return this.price * this.quantity * 100;
    },
    submitText() {
      return this.totalMoney > 0 ? "去支付" : "提交订单";
    },
    editTouristTitle() {
      if (this.editTourist.certNo) {
        return "编辑";
      }
      return "新增";
    },
    needContact() {
      return this.ticketType.needContact;
    }
  },
  watch: {
    "input.travelDate": async function(val, oldVal) {
      if (!oldVal) {
        return;
      }

      if (!this.ticketType.hasGroundChangCi) {
        return;
      }

      try {
        this.loading();

        this.ticketType.groundChangCis = await ticketTypeService.getTicketTypeChangCiComboboxItemsAsync(
          this.ticketTypeId,
          val
        );
        this.setGroundChangCiDefaultValue();
      } finally {
        this.loaded();
      }
    },
    quantity: function(val, oldVal) {
      if (!this.ticketType.needCert) return;

      const diff = val - oldVal;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          this.tourists.push(new Tourist());
        }
        if (val == 1) {
          this.firstTourist = this.tourists[0];
        }
      } else {
        this.tourists.length += diff;
      }
    }
  },
  async onLoad(option) {
    this.ticketTypeId = option.ticketTypeId;
    this.input.items[0].ticketTypeId = this.ticketTypeId;
    try {
      this.ticketType = await ticketTypeService.getTicketTypeForWeiXinSaleAsync(
        this.ticketTypeId
      );

      this.minBuyNum =
        this.ticketType.minBuyNum > 1 ? this.ticketType.minBuyNum : 1;
      this.maxBuyNum =
        this.ticketType.maxBuyNum > 1 ? this.ticketType.maxBuyNum : 100;
      this.quantity = this.minBuyNum;

      const priceObj = this.ticketType.dailyPrices.find(p => !p.disable);
      if (priceObj) {
        this.input.travelDate = priceObj.date;
      }

      this.setGroundChangCiDefaultValue();
      if (this.ticketType.needCert && this.tourists.length < 1) {
        this.tourists.push(this.firstTourist);
      }
    } finally {
    }
  },
  beforeRouterLeave(to, from, next) {
    if (this.showTourist) {
      this.showTourist = false;
      next(false);
      return;
    }

    if (this.submited || to.meta.shouldNotConfirm) {
      this.$mptoast.clear();
      next();
      return;
    }

    this.Dialog.confirm({
      title: "确认离开订单填写页？",
      showCancelButton: true,
      confirmButtonText: "离开",
      cancelButtonText: "取消"
    })
      .then(() => {
        next();
      })
      .catch(() => {
        next(false);
      });
  },
  methods: {
    onQuantityChange(val) {
      this.quantity = val.mp.detail;
      if (val < this.minBuyNum) {
        this.$nextTick(() => {
          this.quantity = this.minBuyNum;
          this.$mptoast(`至少需购买${this.minBuyNum}份`);
        });
      } else if (val > this.maxBuyNum) {
        this.$nextTick(() => {
          this.quantity = this.maxBuyNum;
          this.$mptoast(`最多购买${this.maxBuyNum}份`);
        });
      }
    },
    onTouristEdit(index) {
      this.currentTouristIndex = index;
      const tourist = this.tourists[index];
      this.editTourist = { ...tourist };
      this.showTourist = true;
    },
    onTouristSave() {
      if (!this.validateTourist(this.editTourist)) return;

      const index = this.tourists.findIndex(
        t => t.certNo == this.editTourist.certNo
      );
      if (index >= 0 && index != this.currentTouristIndex) {
        this.$mptoast("身份证已添加");
        return;
      }

      this.tourists[this.currentTouristIndex] = { ...this.editTourist };
      if (this.currentTouristIndex == 0) {
        this.firstTourist = this.tourists[0];
      }
      this.showTourist = false;
    },
    async onSubmit() {
      if (this.ticketType.groundChangCis.length > 0) {
        for (const groundChangCi of this.ticketType.groundChangCis) {
          if (!groundChangCi.changCiId) {
            if (
              groundChangCi.changCis.length === 1 &&
              groundChangCi.changCis[0].disabled
            ) {
              this.$mptoast(`${groundChangCi.groundName}暂无可售场次`);
            } else {
              this.$mptoast(`请选择${groundChangCi.groundName}场次`);
            }
            return;
          }
        }
      }
      if (this.ticketType.needCert) {
        for (let i = 0; i < this.tourists.length; i++) {
          const tourist = this.tourists[i];
          if (!this.validateTourist(tourist)) {
            this.errorTouristIndex = i;
            return;
          }
        }
        this.errorTouristIndex = -1;
      }
      if (this.needContact) {
        const validateRules = [
          {
            value: this.input.contactMobile,
            name: "手机号码",
            rules: [{ rule: "required" }, { rule: "isMobile" }]
          }
        ];
        if (!this.ticketType.needCert) {
          validateRules.push({
            value: this.input.contactName,
            name: "姓名",
            rules: [{ rule: "required" }]
          });
        }
        let validateResult = validate(validateRules);
        if (!validateResult.success) {
          this.$mptoast(validateResult.message);
          return;
        }
      }
      this.quantity = Math.max(this.minBuyNum, this.quantity);
      this.quantity = Math.min(this.maxBuyNum, this.quantity);

      await this.createOrder();
    },
    setGroundChangCiDefaultValue() {
      if (
        !this.ticketType.groundChangCis ||
        this.ticketType.groundChangCis.length <= 0
      ) {
        return;
      }

      this.ticketType.groundChangCis.forEach(groundChangCi => {
        if (groundChangCi.changCis.length == 0) {
          groundChangCi.changCis.push({
            value: "",
            displayText: "暂无可售场次",
            disabled: true
          });
        } else if (groundChangCi.changCis.length == 1) {
          groundChangCi.changCiId = groundChangCi.changCis[0].value;
        }
      });
    },
    validateTourist(tourist) {
      const rules = [
        {
          value: tourist.name,
          name: "姓名",
          rules: [{ rule: "required" }]
        },
        {
          value: tourist.certNo,
          name: "身份证",
          rules: [{ rule: "required" }, { rule: "isIdCard" }]
        }
      ];
      let validateResult = validate(rules);
      if (!validateResult.success) {
        this.$mptoast(validateResult.message);
        return false;
      }
      return true;
    },
    async createOrder() {
      try {
        this.input.items[0].quantity = this.quantity;
        this.input.items[0].tourists = this.tourists;
        this.input.items[0].groundChangCis = this.ticketType.groundChangCis.map(
          g => {
            return { groundId: g.groundId, changCiId: g.changCiId };
          }
        );

        this.saving = true;
        const result = await orderService.createWeiXinOrderAsync(this.input);
        this.submited = true;
        if (result.shouldPay) {
          wx.setStorageSync("Pay:Product", this.ticketType.name);
        }
        let url = "";
        if (result.shouldPay) {
          url = `/pages/payment/wx-js-pay/main?listNo=${result.listNo}`;
        } else {
          url = `/pages/orders/order-detail/main?listNo=${result.listNo}`;
        }
        wx.navigateTo({
          url: url
        });
      } finally {
        this.saving = false;
      }
    },
    firstTouristName(a) {
      this.firstTourist.name = a.mp.detail;
    },
    firstTouristCertNo(a) {
      this.firstTourist.certNo = a.mp.detail;
    },
    async descriptionClick() {
      this.showDescription = true;
      this.description = await ticketTypeService.getTicketTypeDescriptionAsync(
        this.ticketTypeId
      );
    },
    contactNameChange(val) {
      this.input.contactName = val.mp.detail;
    },
    contactMobileChange(val) {
      this.input.contactMobile = val.mp.detail;
    },
    editNameChange(val) {
      this.editTourist.name = val.mp.detail;
    },
    editMobileChange(val) {
      this.editTourist.certNo = val.mp.detail;
    },
    bindPickerChange({ mp }, groundChangCi) {
      groundChangCi.changCiId = groundChangCi.changCis[mp.detail.value].value;
    },
    changCiClick(groundChangCi) {
      groundChangCi.showPicker = true;
    },
    changCiCancel(groundChangCi) {
      groundChangCi.showPicker = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.booking {
  padding: 10px 6px 70px;
  background-color: #c0c7cf;
  min-height: calc(100vh - 25px);
  box-sizing: border-box;

  &-mod {
    margin-bottom: 10px;

    &-hd {
      padding: 10px 12px;
      border-radius: 5px 5px 0 0;
      background: #eff0f2;

      &-title {
        margin-right: 5px;
        font-size: 16px;
        line-height: 20px;
        color: #000;
      }

      &-tips {
        display: inline-block;
        vertical-align: middle;
        line-height: 18px;
        font-size: 13px;
        color: #999;
        word-break: break-all;

        &-em {
          color: #f40;
          font-style: normal;
          font-weight: 400;
        }
      }
    }

    &-bd {
      border-radius: 0 0 5px 5px;
      border-bottom: solid 1px #a3aab2;
      overflow: hidden;
      background: #fff;

      .van-cell {
        padding: 13px 15px;
      }
    }

    &-around {
      border-radius: 5px;
      background-color: #fff;
      padding: 15px;

      h3 {
        font-size: 16px;
        color: #333;
        font-weight: 700;
      }

      &-label {
        margin-top: 3px;
        font-size: 12px;
        height: 20px;
        overflow: hidden;

        li {
          float: left;
          margin-right: 14px;
          line-height: 20px;

          van-icon {
            vertical-align: middle;
            margin-right: 2px;
          }

          span {
            display: inline-block;
            vertical-align: middle;
          }
        }

        .warning {
          color: #ffae13;
          van-icon {
            color: #ffae13;
          }
        }

        .info {
          color: #999;
          van-icon {
            color: #19a0f0;
          }
        }

        .error {
          color: #ff2f39;
          van-icon {
            color: #ff2f39;
          }
        }
      }

      &-resinfo {
        font-size: 12px;
        color: #19a0f0;
        line-height: 20px;
      }

      &-limited {
        font-size: 12px;
        color: #999;
        line-height: 20px;
      }

      &-price {
        text-align: right;
        color: #f40;

        &-span {
          font-size: 15px;
        }

        &-i {
          font-size: 21px;
          margin-right: 1px;
          line-height: 21px;
          font-style: normal;
          font-weight: 400;
        }
      }

      &-num {
        .van-stepper {
          display: flex;
        }

        /deep/ .van-stepper__input {
          margin: 0;
          // height: 26px;
        }
      }

      &-tips {
        margin: 5px -15px 0 -15px;
        padding: 10px 15px;
        background-color: #fff7e0;
        font-size: 12px;
        color: #481a03;
      }
    }
  }

  &-multi {
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-auto {
        flex: 1;
      }
    }
  }

  .changCi {
    /deep/ .van-field .van-cell__title {
      max-width: 40%;
    }
  }

  &-tourist {
    display: flex;
    align-items: center;
    margin-left: 15px;

    /deep/ .van-cell__title {
      color: #999;
    }

    .van-cell__value {
      line-height: 16px;
    }

    van-icon {
      color: #19a0f0;
    }

    &-error {
      background-color: #fffdf2;

      .booking-tourist-item,
      .van-cell__title {
        color: #ff2f39;
      }
    }

    &-item {
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      font-size: 14px;
      color: #333;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &-edit {
      width: 100vw;
      height: 100vh;
      background-color: #c0c7cf;
      &-title {
        text-align: center;
        background-color: #ffffff;
        padding: 5px 0px 10px 0px;
      }

      &-content {
        padding: 10px 6px;
        overflow-y: auto;
        &-div {
          border-radius: 10px;
          border: 1px solid #ffffff;
          overflow: hidden;
        }
      }

      &-btnbox {
        padding: 10px;

        button {
          width: 100%;
          line-height: 32px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          background-color: #ff9a14;
          border: 1px solid #ff9a14;
          letter-spacing: 1px;
          border-radius: 5px;
        }
      }
    }
  }

  .div-picker {
    display: flex;
    justify-content: space-between;
  }
}

.top-radius {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.bottom-radius {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.description {
  background-color: #fff;
  transition: all 0.3s ease;
  transform: translateY(0);

  &-title {
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
    position: fixed;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    text-align: center;
    background-color: #efefef;
  }

  &-close-btn {
    right: 0;
    top: 0;
    position: absolute;
    color: #999;
    width: 40px;
    height: 40px;
  }

  &-content {
    position: relative;
    font-size: 15px;
    height: 84vh;
    overflow-y: auto;
    box-sizing: border-box;

    &-item {
      margin-left: 15px;
      padding: 15px 15px 15px 0;
      word-wrap: break-word;
      word-break: normal;
      border-bottom: 1px solid #dbdbdb;

      h3 {
        color: #333;
        font-size: 100%;
        font-weight: 700;
        padding-bottom: 5px;
      }

      &-text {
        margin-left: 15px;
      }

      /deep/ img {
        max-width: 100% !important;
      }
    }

    &-title {
      margin-left: 0;
      padding-left: 15px;
      color: #000;
      font-weight: 700;
      border-bottom: 1px solid #dbdbdb;
    }
  }
}
</style>
