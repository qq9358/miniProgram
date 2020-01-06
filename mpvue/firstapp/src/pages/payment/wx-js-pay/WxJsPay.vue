<template>
  <div>
    <div class="in-order">
      <div class="in-order-countdown">
        支付剩余时间
        <span>{{ countdownText }}</span>
      </div>
      <div class="in-order-fee">
        <span class="in-order-fee-dfn">¥</span>
        <span>{{ totalMoney }}</span>
      </div>
      <div class="in-order-title">{{ product }}</div>
    </div>
    <div class="in-pay-method">
      <div class="in-pay-method-pay-type">
        <van-icon name="wechat" />
        <span>微信支付</span>
      </div>
    </div>
    <div class="in-button">
      <button class="button-operate" size="large" :loading="saving" @click="pay">确认支付</button>
    </div>
    <van-loading />
    <van-popup :show="showQuery" :close-on-click-overlay="false">
      <div class="popup-query">
        <div class="popup-text">查询支付结果中...</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import dayjs from "dayjs";
import paymentService from "@/services/paymentService.js";
import commonService from "@/services/commonService.js";
import weiXinJsSdkHelper from "@/utils/weiXinJsSdkHelper.js";

export default {
  data() {
    return {
      countdownText: "",
      totalMoney: 0,
      timer: -1,
      queryTimer: -1,
      saving: false,
      shouldConfirm: true,
      listNo: "",
      showQuery: false
    };
  },
  computed: {
    product() {
      return wx.getStorageSync("Pay:Product");
    }
  },
  async onLoad(option) {
    this.listNo = option.listNo;
    const order = await paymentService.getNetPayOrderAsync(this.listNo);
    this.totalMoney = order.payMoney;

    if (order.expireSeconds <= 0) {
      this.shouldConfirm = false;
      this.$router.push({ name: "tickettype" });
      return;
    }

    const endTime = dayjs("2018-01-01 00:00:00");
    let countdown = endTime.clone().addSeconds(order.expireSeconds);
    const formatStr = order.expireSeconds > 3600 ? "HH:mm:ss" : "mm:ss";
    this.countdownText = countdown.format(formatStr);
    this.timer = setInterval(() => {
      countdown = countdown.addSeconds(-1);
      this.countdownText = countdown.format(formatStr);
      if (countdown.isSame(endTime)) {
        paymentService.getNetPayOrderAsync(this.listNo).then(result => {
          this.clear();
          this.shouldConfirm = false;
          if (result.paySuccess) {
            this.$router.replace({
              name: "orderdetail",
              params: { listNo: this.listNo }
            });
          } else {
            this.$dialog
              .alert({
                title: "支付超时订单已取消"
              })
              .then(() => {
                this.$router.push({ name: "tickettype" });
              });
          }
        });
      }
    }, 1000);
  },
  onUnload(to, from, next) {
    this.clear();
  },
  methods: {
    async pay() {
      try {
        this.saving = true;

        const payArgs = await paymentService.jsApiPayAsync(this.listNo);
        let payObj = JSON.parse(payArgs);
        await wx.requestPayment({
          timeStamp: payObj.timeStamp,
          nonceStr: payObj.nonceStr,
          package: payObj.package,
          signType: payObj.signType,
          paySign: payObj.paySign,
          success: function(res) {},
          fail: function(res) {
            if (res.errMsg == "requestPayment:fail cancel") return;

            commonService.logError(res.errMsg);
          },
          complete: function(res) {
          }
        });
        this.queryTimer = setInterval(() => {
          paymentService.getNetPayOrderAsync(this.listNo).then(result => {
            if (result.paySuccess) {
              this.clear();
              this.shouldConfirm = false;
              wx.navigateTo({
                url: `/pages/orders/order-detail/main?listNo=${this.listNo}`
              });
            }
          });
        }, 3000);
        this.showQuery = true;
      } catch (err) {
        if (err.err_msg == "get_brand_wcpay_request:cancel") return;

        commonService.logError(err);
      } finally {
        this.saving = false;
      }
    },
    clear() {
      clearInterval(this.timer);
      clearInterval(this.queryTimer);
      this.showQuery = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.in-order {
  background-color: #fff;
  text-align: center;
  padding: 15px 15px;

  &-countdown {
    font-size: 13px;
    color: #999;
    line-height: 1;
  }

  &-fee {
    margin-top: 10px;
    line-height: 1;
    font-size: 30px;
    letter-spacing: -0.44px;

    &-dfn {
      font-size: 20px;
      margin-right: 8px;
    }

    span {
      font-weight: 700;
    }
  }

  &-title {
    margin-top: 3px;
    font-size: 11px;
    color: #999;
  }
}

.in-pay-method {
  margin: 15px 0;
  background-color: #fff;

  &-pay-type {
    padding: 0 20px;
    height: 70px;
    line-height: 70px;

    van-icon {
      vertical-align: middle;
      font-size: 25px;
      margin-right: 20px;
      color: rgb(9, 187, 7);
    }

    span {
      display: inline-block;
      vertical-align: middle;
      font-size: 18px;
      font-weight: 600;
    }
  }
}

.in-button {
  padding: 0 15px;

  button {
    border-radius: 5px;
  }
}

.popup-query {
  background: #000000;
  color: #ffffff;
  padding: 30px 18px;
  text-align: center;
  overflow: hidden;
  border: 0px;
}
.popup-text {
  margin-top: 13px;
}
</style>
