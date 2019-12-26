<template>
  <van-popup :show="true" position="bottom">
    <div class="description">
      <div class="description-title">
        <div>购买须知</div>
        <div class="description-close-btn" @click="onClose">
          <van-icon name="cuowu" />
        </div>
      </div>
      <div style="height: 100%; overflow-y: auto;">
        <div class="description-content">
          <div style="height:40px;">&nbsp;</div>
          <div class="description-content-item description-content-title">
            <span>{{ ticketTypeName }}</span>
          </div>
          <div
            v-if="description.bookDescription"
            class="description-content-item"
          >
            <h3>预订说明</h3>
            <div
              class="description-content-item-text"
              v-html="description.bookDescription"
            ></div>
          </div>
          <div
            v-if="description.feeDescription"
            class="description-content-item"
          >
            <h3>费用说明</h3>
            <div
              class="description-content-item-text"
              v-html="description.feeDescription"
            ></div>
          </div>
          <div
            v-if="description.usageDescription"
            class="description-content-item"
          >
            <h3>使用说明</h3>
            <div
              class="description-content-item-text"
              v-html="description.usageDescription"
            ></div>
          </div>
          <div
            v-if="description.refundDescription"
            class="description-content-item"
          >
            <h3>退改说明</h3>
            <div
              class="description-content-item-text"
              v-html="description.refundDescription"
            ></div>
          </div>
          <div
            v-if="description.otherDescription"
            class="description-content-item"
          >
            <h3>其他说明</h3>
            <div
              class="description-content-item-text"
              v-html="description.otherDescription"
            ></div>
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
</template>

<script>
import ticketTypeService from "@/services/ticketTypeService.js";
import { mobileMixin } from "@/mixins/mobileMixin.js";

export default {
  name: "ticket-type-description",
  mixins: [mobileMixin],
  props: {
    ticketTypeId: {
      type: Number,
      default: 0
    },
    ticketTypeName: {
      type: String
    },
    price: {
      type: Number,
      default: 0
    },
    showBuy: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      description: {
        bookDescription: "",
        feeDescription: "",
        usageDescription: "",
        refundDescription: "",
        otherDescription: ""
      },
      show: this.value,
      hasLoaded: false
    };
  },
  computed: {
    ticketTypePrice() {
      return this.price * 100;
    }
  },
  watch: {
    ticketTypeId() {
      this.hasLoaded = false;
    },
    async value(val) {
      this.show = val;
      if (val && !this.hasLoaded) {
        await this.loadDescription();
      }
    },
    show(val) {
      if (!val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    onClose() {
      this.show = false;
    },
    onBuy() {
      this.$router.push({
        name: "buyticket",
        params: { ticketTypeId: this.ticketTypeId }
      });
    },
    async loadDescription() {
      const description = await ticketTypeService.getTicketTypeDescriptionAsync(
        this.ticketTypeId
      );
      this.description = description;
      this.hasLoaded = true;

      this.$nextTick(() => {
        this.normalizeImage(".description-content-item");
      });
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
