<template>
  <div>
    <div type="flex" align="center" class="poster margin-bottom-10">
      <div span="8" class="poster-headimg">
        <img :src="headImgUrl" />
      </div>
      <div span="16">
        <div class="poster-name margin-bottom-10">{{ member.name }}</div>
        <div class="poster-name" v-if="member.customerName">{{ member.customerName }}</div>
      </div>
    </div>

    <van-cell-group>
      <van-cell
        title="我的门票"
        is-link
        icon="menpiao"
        to="/myTicket"
        @click="myTicketClick"
        class="icon-vertical-center"
      />
    </van-cell-group>
  </div>
</template>

<script>
import permissions from "@/utils/permissions.js";
import defaultHeadImg from "./../../assets/portrait_bg.png";
import memberService from "./../../services/memberService.js";

export default {
  data() {
    return {
      permissions: permissions
    };
  },
  computed: {
    headImgUrl() {
      return this.member.headImgUrl || defaultHeadImg;
    },
    member() {
      return memberService.getMember();
    }
  },
  methods: {
    myTicketClick() {
      // wx.navigateTo({
      //   url: '/pages/orders/my-ticket/main'
      // });
      wx.navigateTo({
        url: "/pages/orders/my-ticket/main"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.poster {
  height: 100px;
  color: white;
  background-color: #19a0f0;
  display: flex;
  align-items: center;

  &-headimg {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 15px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-name {
    font-weight: bold;
    margin-left: 15px;
  }
}
.icon-vertical-center {
  /deep/ .van-cell__left-icon {
    margin-top: -2px;
  }
}
</style>
