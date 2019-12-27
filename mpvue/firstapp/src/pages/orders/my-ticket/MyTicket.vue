<template>
  <div class="ticket">
    <div v-if="dataLoaded && tickets.length === 0" class="no-data" :content-height="contentHeight">
      <i class="no-data-icon van-icon van-icon-wushuju" />
      <div>暂无数据</div>
    </div>
    <van-list v-else v-model="loading" :finished="finished" @load="getTickets">
      <van-panel
        v-for="(ticket, index) in tickets"
        :key="index"
        :title="ticket.ticketCode"
        :status="ticket.statusName"
        class="margin-bottom-10"
      >
        <van-cell-group>
          <van-cell :title="ticket.ticketTypeName" />
          <van-cell title="有效期" class="ticket-time">
            <span>{{ ticket.startDate }}</span>
            <span v-if="ticket.endDate !== ticket.startDate">至{{ ticket.endDate }}</span>
          </van-cell>
          <van-cell title="下单时间" :value="ticket.cTime" />
        </van-cell-group>
        <div class="ticket-qrcode">
          <img :src="ticket.qrcode" />
        </div>
      </van-panel>
    </van-list>
  </div>
</template>

<script>
import qrcodeHelper from "@/utils/qrcodeHelper.js";
import ticketService from "@/services/ticketService.js";
import NoData from "@/components/NoData.vue";

export default {
  components: {
    NoData
  },
  data() {
    return {
      loading: false,
      dataLoaded: false,
      finished: false,
      queryInput: {
        skipCount: 0,
        maxResultCount: 10
      },
      tickets: []
    };
  },
  computed: {
    contentHeight() {
      return this.$store.state.clientHeight - 46;
    }
  },
  async onLoad() {
    await this.getTickets();
  },
  methods: {
    async getTickets() {
      try {
        this.loading = true;
        this.dataLoaded = false;

        let result = await ticketService.getMemberTicketsForMobileAsync(
          this.queryInput
        );
        for (let i = 0; i < result.items.length; i++) {
          let ticket = result.items[i];
          ticket.qrcode = await qrcodeHelper.createQRCodeAsync(
            ticket.ticketCode
          );
          this.tickets.push(ticket);
        }

        this.queryInput.skipCount =
          this.queryInput.skipCount + result.items.length;

        this.finished = this.tickets.length === result.totalCount;
      } catch (err) {
        return;
      } finally {
        this.loading = false;
        this.dataLoaded = true;
      }
    }
  }
};
</script>

<style lang="scss">
.ticket {
  &-qrcode {
    width: 100%;
    text-align: center;
    image {
      width: 180px;
      height: 180px;
    }
  }

  &-time {
    /deep/ .van-cell__value {
      flex: 2;
    }
  }
  .no-data {
    margin-top: 300px;
  }
}
</style>
