<template>
  <div class="description">
    <div class="description-title">
      <div>退改规则</div>
      <div class="description-close-btn" @click="onClose">
        <van-icon name="cuowu" />
      </div>
    </div>
    <div style="height: 100%; overflow-y: auto;">
      <div class="description-content">
        <div style="height:40px;">&nbsp;</div>
        <div v-if="ticketType.refundDescription" class="description-content-item">
          <div class="description-content-item-text" v-html="ticketType.refundDescription"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ticketTypeService from "@/services/ticketTypeService.js";

export default {
  name: "ScenicNotice",
  props: {
    ticketTypeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ticketType: {},
      hasLoaded: false
    };
  },
  async onShow() {
    await this.loadDescription();
  },
  methods: {
    async loadDescription() {
      const description = await ticketTypeService.getTicketTypeDescriptionAsync(
        this.ticketTypeId
      );
      this.ticketType = description;
      this.hasLoaded = true;
    },
    onClose() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
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
