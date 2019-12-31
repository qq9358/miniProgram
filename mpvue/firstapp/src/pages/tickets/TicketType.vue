<template>
  <div>
    <div class="scenic">
      <div class="scenic-screen">
        <!-- <van-swipe :autoplay="3000" :height="swipeHeight">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img :src="image" />
          </van-swipe-item>
        </van-swipe>-->
        <Swiper :images="images" />
      </div>

      <div class="parent_view" style="margin-top:rpx;">
        <button
          type="primary"
          open-type="getUserInfo"
          @getuserinfo="onGotUserInfo"
          withCredentials="true"
        >授权用户信息</button>
      </div>
      <div v-if="scenic.noticeTitle" @click="showNotice = true" class="scenic-event">
        <div>
          <van-icon name="gonggao" />
          <span>{{ scenic.noticeTitle }}</span>
        </div>
        <div class="scenic-more">
          <van-icon name="arrow" />
        </div>
      </div>
      <div @click="showScenic = true" class="scenic-ext">
        <div>
          <div class="scenic-ext-title">
            <span v-if="scenic.openText">开放时间</span>
            <span>景区特色</span>
            <span>景区简介</span>
          </div>
          <div v-if="scenic.openText" class="scenic-ext-word">{{ scenic.openText }}</div>
        </div>
        <div class="scenic-more">
          <span>详情</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="ticket">
      <div class="ticket-title">
        <van-icon name="menpiao-y" />
        <span>景区门票</span>
      </div>
      <div class="ticket-ul" id="ticket-div">
        <div v-for="ticketType in ticketTypes" :key="ticketType.id" class="ticket-li">
          <div style="flex:1;">
            <div class="ticket-li-title">{{ ticketType.name }}</div>
            <div class="ticket-li-timebox">
              <span>{{ ticketType.travelDateText }}</span>
              <span :style="{ color: getRefundColor(ticketType) }">
                {{
                ticketType.refundText
                }}
              </span>
              <span>无需取票</span>
            </div>
            <div class="ticket-li-detail" @click="onShowDescription(ticketType)">
              <span>新品</span>
              <span class="ticket-li-detail-split"></span>
              <span>购买须知></span>
            </div>
          </div>
          <div>
            <div class="ticket-li-price">
              <span class="ticket-li-price-span">¥</span>
              <span class="ticket-li-price-i">{{ ticketType.price }}</span>
            </div>
            <div class="ticket-li-btn">
              <button class="button-main" @click="onBuy(ticketType)">立即预订</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <van-popup :show="showNotice" position="bottom">
        <div class="description">
          <div class="description-title">
            <div>景区公告</div>
            <div class="description-close-btn" @click="showNotice = false">
              <van-icon name="cuowu" />
            </div>
          </div>
          <div style="height: 100%; overflow-y: auto;">
            <div class="description-content">
              <div style="height:40px;">&nbsp;</div>
              <div v-if="scenic.noticeContent" class="description-content-item">
                <div class="description-content-item-text" v-html="scenic.noticeContent"></div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <van-popup :show="showScenic" position="bottom">
        <div class="description">
          <div class="description-title">
            <div>{{ scenic.scenicName }}</div>
            <div class="description-close-btn" @click="showScenic = false">
              <van-icon name="cuowu" />
            </div>
          </div>
          <div style="height: 100%; overflow-y: auto;">
            <div class="description-content">
              <div style="height:40px;">&nbsp;</div>
              <div v-if="scenic.openTime && scenic.closeTime" class="description-content-item">
                <h3>开放时间</h3>
                <div
                  class="description-content-item-text"
                >{{ scenic.openTime }}至{{ scenic.closeTime }}</div>
              </div>
              <div v-if="scenic.scenicIntro" class="description-content-item">
                <h3>景区简介</h3>
                <div class="description-content-item-text" v-html="scenic.scenicIntro"></div>
              </div>
              <div v-if="scenic.scenicFeature" class="description-content-item">
                <h3>景区特色</h3>
                <div class="description-content-item-text" v-html="scenic.scenicFeature"></div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
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
                <span>{{ ticketTypeName }}</span>
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
              <div style="height:49px;">&nbsp;</div>
            </div>
          </div>
          <van-submit-bar
            :price="ticketTypePrice"
            label=" "
            button-text="立即预订"
            @submit="onSelectBuy"
          />
        </div>
      </van-popup>
    </div>
  </div>
</template>


<script>
import dayjs from "dayjs";
import { mapState, mapMutations } from "vuex";
import ticketTypeService from "@/services/ticketTypeService.js";
import memberService from "@/services/memberService";
import scenicService from "@/services/scenicService.js";
import settingService from "@/services/settingService.js";
import scenicImage1 from "@/assets/scenic1.jpg";
import scenicImage2 from "@/assets/scenic2.jpg";
import Swiper from "@/components/Swiper.vue";

const today = dayjs();
const tomorrow = dayjs().addDays(1);

export default {
  components: {
    Swiper
  },
  props: {
    publicSaleFlag: {
      type: [Boolean, String],
      default: true
    }
  },
  data() {
    return {
      images: [scenicImage1, scenicImage2],
      scenic: {},
      showNotice: false,
      showScenic: false,
      ticketTypes: [],
      showDescription: false,
      selectedTicketType: {},
      shareImgUrl: `${scenicImage1}`,
      ticketTypeName: "",
      description: {
        bookDescription: "",
        feeDescription: "",
        usageDescription: "",
        refundDescription: "",
        otherDescription: ""
      }
    };
  },
  computed: {
    swipeHeight() {
      return 360;
    },
    ...mapState(["groundId"])
  },
  watch: {
    showDescription: function(val) {
      if (val) {
        wx.hideTabBar({});
      } else {
        wx.showTabBar({});
      }
    }
  },
  async onLoad() {
    let querySelect = wx.createSelectorQuery().in(this);
    querySelect.select("#ticket-div").boundingClientRect();
    querySelect.exec(function(res) {});
    const loginTask = await memberService.loginFromMiniAsync();
    const groundId = this.groundId;
    const ticketTypes = await ticketTypeService.getTicketTypesForWeiXinSaleAsync(
      {
        publicSaleFlag: this.publicSaleFlag,
        groundId: groundId
      }
    );
    // .then(ticketTypes => {
    for (const ticketType of ticketTypes) {
      ticketType.travelDateText = this.getTravelDateText(ticketType);
      ticketType.refundText = this.getRefundText(ticketType);
    }

    this.ticketTypes = ticketTypes;

    // });
    const scenic = await scenicService.getScenicAsync();
    // .then(scenic => {
    if (scenic.photoList && scenic.photoList.length > 0) {
      this.images = scenic.photoList.map(p => p.url);
      this.shareImgUrl = this.images[0];
    }

    if (scenic.openTime && scenic.closeTime) {
      const today = dayjs().toDateString();
      const openTime = dayjs(`${today} ${scenic.openTime}:00`);
      const closeTime = dayjs(`${today} ${scenic.closeTime}:00`);
      const now = dayjs();
      if (now.isBefore(openTime)) {
        scenic.openText = `未开园 ${scenic.openTime}开园`;
      } else if (now.isBetween(openTime, closeTime)) {
        scenic.openText = `开放中 ${scenic.closeTime}闭园`;
      } else {
        scenic.openText = `已闭园 明日${scenic.openTime}开园`;
      }
    }

    this.scenic = scenic;
    // })
    // .then(() => {
    let shareUrl = `/tickettype/${this.publicSaleFlag}`;
    if (groundId) {
      shareUrl += `?groundId=${groundId}`;
    }
    settingService.configWxJsApi().then(() => {
      settingService.configWxShareUrl(shareUrl, this.shareImgUrl);
    });
    // });
    try {
      // await Promise.all([getTicketTypeTask, getScenicTask]);
    } finally {
    }
  },
  methods: {
    async onShowDescription(ticketType) {
      this.description = await ticketTypeService.getTicketTypeDescriptionAsync(
        ticketType.id
      );
      this.ticketTypeName = ticketType.name;
      this.selectedTicketType = ticketType;
      this.showDescription = true;
    },
    onBuy(ticketType) {
      // this.$router.push({
      //   name: "buyticket",
      //   params: { ticketTypeId: ticketType.id }
      // });
      wx.navigateTo({
        url: `/pages/tickets/buy-ticket/main?ticketTypeId=${ticketType.id}`
      });
    },
    onSelectBuy() {
      wx.navigateTo({
        url: `/pages/tickets/buy-ticket/main?ticketTypeId=${
          this.selectedTicketType.id
        }`
      });
    },
    getTravelDateText(ticketType) {
      const startTravelDate = dayjs(ticketType.startTravelDate);
      let travelDateText = "";
      if (startTravelDate.isSameOrBefore(today)) {
        travelDateText = "今日";
      } else if (startTravelDate.isSameOrBefore(tomorrow)) {
        travelDateText = "明日";
      } else {
        travelDateText = startTravelDate.format("MM月DD日");
      }

      return `最早可订${travelDateText}票`;
    },
    getRefundText(ticketType) {
      if (ticketType.allowRefund === false) {
        return "不可退";
      }

      return ticketType.refundLimited ? "有条件退" : "随时退";
    },
    getRefundColor(ticketType) {
      if (ticketType.allowRefund === false) {
        return "#ff2f39";
      }
      return ticketType.refundLimited ? "#ffae13" : "#099fde";
    },
    onGotUserInfo: async function(e) {
      await memberService.loginFromMiniAsync(e.mp.detail.userInfo);
    },
    ...mapMutations(["setGroundId"])
  }
};
</script>

<style lang="scss" scoped>
.scenic {
  margin-bottom: 10px;
  background-color: #fff;

  &-screen {
    img {
      width: 100%;
      height: 100%;
    }
  }

  &-event {
    padding: 7px 15px;
    color: #ff2f39;
    border-bottom: 1px solid #dbdbdb;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-icon-gonggao {
      margin-right: 5px;
    }
  }

  &-ext {
    padding: 13px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-title {
      font-size: 15px;

      span {
        margin-right: 5px;
      }
    }

    &-word {
      margin-top: 8px;
      line-height: 13px;
      font-size: 12px;
      color: #999;
    }
  }

  &-more {
    text-align: right;
    line-height: 24px;
    color: #999;

    span {
      display: inline-block;
      vertical-align: middle;
      margin: 0 6px;
      height: 18px;
      line-height: 18px;
      font-size: 13px;
    }

    van-icon {
      vertical-align: middle;
    }
  }
}

.ticket {
  background-color: #fff;

  &-title {
    padding: 8px 15px;
    font-size: 17px;
    color: #000;
    height: 24px;
    line-height: 24px;
    border-bottom: 1px solid #dbdbdb;

    van-icon {
      color: #ff7d13;
      margin-right: 5px;
      font-size: 24px;
      vertical-align: top;
      margin-top: -3px;
    }

    span {
      display: inline-block;
      vertical-align: top;
    }
  }

  &-ul {
    padding-left: 15px;
  }

  &-li {
    padding: 10px 0;
    border-bottom: 1px solid #dbdbdb;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-title {
      margin-bottom: 7px;
      padding-right: 0;
      line-height: 18px;
      font-size: 14px;
      color: #000;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    &-timebox {
      overflow: hidden;
      color: #099fde;

      span {
        display: inline-block;
        overflow: hidden;
        height: 15px;
        max-height: 15px;
        line-height: 15px;
        font-size: 11px;
        margin-right: 5px;
        margin-bottom: 2px;
      }
    }

    &-detail {
      font-size: 12px;
      color: #999;
      height: 21px;
      line-height: 21px;

      &-split {
        background: #999;
        height: 11px;
        width: 1px;
        margin: -2px 5px;
      }

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }

    &-price {
      color: #f40;
      text-align: right;
      overflow: hidden;
      word-break: break-all;
      font-weight: 400;
      padding-right: 15px;
      margin-bottom: 5px;

      &-span {
        font-size: 15px;
        font-family: Arial;
        margin: 0 1px;
      }

      &-i {
        font-size: 20px;
        font-style: normal;
        line-height: 21px;
        margin: 0 1px;
      }
    }

    &-btn {
      padding-right: 15px;
      text-align: right;

      // van-button {
      //   background-color: #ff7d13;
      //   border-color: #ff7d13;
      //   font-size: 14px;
      //   color: #fff;
      //   padding: 0 6px;
      // }
    }
  }
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
  }
}
</style>
