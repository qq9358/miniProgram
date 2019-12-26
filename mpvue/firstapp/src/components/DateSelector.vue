<template>
  <div>
    <div class="dategroup">
      <div type="flex" gutter="8" class="dategroup-div">
        <div span="6" v-for="(date, index) in showDates" :key="date.date">
          <div
            class="dategroup-date"
            :class="{
              'dategroup-selected': selectedDate === date.date,
              'dategroup-disabled': date.disable
            }"
            @click="dateChanged(index)"
          >
            <div>
              <div class="dategroup-date-text">{{ date.text }}</div>
              <div v-if="date.disable">不可订</div>
              <div v-else-if="date.price" class="dategroup-date-price">
                ¥
                {{ date.price }}
              </div>
            </div>
            <div v-if="selectedDate === date.date" class="triangle-right-bottom">
              <van-icon name="xuanzhong" />
            </div>
          </div>
        </div>
        <div v-if="moreDate" span="6" class="dategroup-col">
          <div class="dategroup-date" @click="selectMoreDate">
            <div>
              <div class="dategroup-date-text dategroup-date-more">
                <span>更多日期</span>
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDateTimePicker" position="bottom" class="div-popup">
      <calendar
        :ago-day-hide="minDateTime"
        :future-day-hide="maxDateTime"
        :prices="dates"
        :disabled-weeks="disabledWeeks"
        @choseDay="confirmMoreDate"
      ></calendar>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import calendar from "./calendar/calendar.vue";

const weekNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default {
  name: "date-selector",
  components: {
    calendar
  },
  data() {
    return {
      selectedDate: this.value,
      showDateTimePicker: false
    };
  },
  props: {
    value: {
      type: String,
      default: dayjs().toDateString()
    },
    dates: {
      type: Array,
      default() {
        let now = dayjs();
        let tomorrow = dayjs().addDays(1);
        let afterTomorrow = dayjs().addDays(2);
        return [
          {
            date: now.toDateString(),
            text: "今天" + now.format("MM-DD"),
            disable: false
          },
          {
            date: tomorrow.toDateString(),
            text: "明天" + tomorrow.format("MM-DD"),
            disable: false
          },
          {
            date: afterTomorrow.toDateString(),
            text:
              afterTomorrow.format("MM-DD") + weekNames[afterTomorrow.day()],
            disable: false
          }
        ];
      }
    },
    moreDate: {
      type: Boolean,
      default: true
    },
    disabledWeeks: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    showDates() {
      const today = dayjs().toDateString();
      const tomorrow = dayjs()
        .addDays(1)
        .toDateString();

      let dates = this.dates.slice(0, 3);
      if (this.selectedDate && !dates.some(d => d.date == this.selectedDate)) {
        const selectedDateObj = this.dates.filter(
          d => d.date == this.selectedDate
        )[0];
        if (selectedDateObj) {
          dates[dates.length - 1] = selectedDateObj;
        } else {
          dates[dates.length - 1] = {
            date: this.selectedDate,
            text: `${this.selectedDate.substr(5, 5)}${
              weekNames[dayjs(this.selectedDate).day()]
            }`,
            disable: false
          };
        }
      }

      dates.forEach(date => {
        if (!date.text) {
          if (date.date === today) {
            date.text = `今天${date.date.substr(5, 5)}`;
          } else if (date.date === tomorrow) {
            date.text = `明天${date.date.substr(5, 5)}`;
          } else {
            date.text = `${date.date.substr(5, 5)}${
              weekNames[dayjs(date.date).day()]
            }`;
          }
        }
      });
      return dates;
    },
    minDate() {
      let date = this.dates.filter(d => !d.disable)[0];
      if (date) {
        return new Date(date.date);
      }
      return new Date();
    },
    minDateTime() {
      return (this.minDate.getTime() / 1000).toString();
    },
    maxDate() {
      const date = this.dates[this.dates.length - 1];
      if (date) {
        return new Date(date.date);
      }
      return new Date();
    },
    maxDateTime() {
      return (this.maxDate.getTime() / 1000).toString();
    }
  },
  watch: {
    value: function(val, oldVal) {
      if (!oldVal && val) {
        this.selectedDate = val;
      }
    }
  },
  methods: {
    dateChanged(index) {
      let date = this.dates[index];
      if (date.disable) {
        return;
      }

      this.selectedDate = date.date;
      this.$emit("input", this.selectedDate);
    },
    selectMoreDate() {
      this.showDateTimePicker = true;
    },
    confirmMoreDate(value) {
      this.showDateTimePicker = false;

      this.selectedDate = dayjs(value).toDateString();
      this.$emit("input", this.selectedDate);
    },
    cancelMoreDate() {
      this.showDateTimePicker = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.dategroup {
  background-color: white;
  font-size: 12px;
  padding: 10px 15px;
  &-div {
    display: flex;
    justify-content: space-between;
  }

  &-date {
    height: 45px;
    width: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: #999 solid 1px;
    border-radius: 5px;

    &-text {
      font-size: 12px;
      line-height: 14px;
      color: #19a0f0;
    }

    &-price {
      font-weight: 400;
      line-height: 20px;
      font-size: 13px;
      color: #f40;

     &-span{
        margin-right: 2px;
      }
    }

    &-more {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &-selected {
    border: #19a0f0 solid 1px;
    background-size: 17px;
    position: relative;
  }

  &-disabled {
    color: #bbb;

    .dategroup-date-text {
      color: #bbb;
    }
  }
}

.div-popup {
  background-color: #474748;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 101;
  height: 100vh;
  display: flex;
  align-items: flex-end;
}
</style>
