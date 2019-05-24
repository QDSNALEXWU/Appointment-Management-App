<template lang="html">
  <div>
    <span 
      class="arrow-block-left"
      v-if="dateIndex>1" 
      v-on:click="minusIndex">
      <i class="el-icon-caret-left"></i>
    </span>
    <span 
      class="arrow-block-right" 
      v-on:click="addIndex">
      <i class="el-icon-caret-right"></i>
    </span>
    <div class="vue-time-slot-container">
      <div class="vue-time-slot-table-row-header">
        <span class="vue-time-slot-column-header">Time</span>
        <span class="vue-time-slot-row-header" v-for="value in dateRange">
          {{value.label}}
        </span>
      </div>
      <div class="vue-time-slot-calendar-table" id="vue-time-slot-calendar-table">
        <div class="vue-time-slot-day-header" v-for="day in dayIndex">
          <span class="vue-time-slot-column-header">{{day.label}}</span>
          <span class="vue-time-slot-cell" v-for="(value, key) in dateRange" v-on:click="slot($event, value, day)">
            {{value.label}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: 7
    },
    activeSlots: [],
  },
  watch: {},
  data() {
    return {
      dateRange: [
        {
          label: "9 - 10 AM",
          start_time: "09:00:00",
          end_time: "10:00:00"
        },
        {
          label: "10 - 11 AM",
          start_time: "10:00:00",
          end_time: "11:00:00"
        },
        {
          label: "11 - 12 PM",
          start_time: "11:00:00",
          end_time: "12:00:00"
        },
        {
          label: "12 - 1 PM",
          start_time: "12:00:00",
          end_time: "13:00:00"
        },
        {
          label: "1 - 2 PM",
          start_time: "13:00:00",
          end_time: "14:00:00"
        },
        {
          label: "2 - 3 PM",
          start_time: "14:00:00",
          end_time: "15:00:00"
        },
        {
          label: "3 - 4 PM",
          start_time: "15:00:00",
          end_time: "16:00:00"
        },
        {
          label: "4 - 5 PM",
          start_time: "16:00:00",
          end_time: "17:00:00"
        },
      ],
      dayIndex: [],
      todaysDate: this.formatDate(new Date(), "long"),
      dateIndex: 1,
    };
  },
  mounted() {
    let todaysDate = new Date(new Date().getTime() + 0 * 24 * 60 * 60 * 1000);
    this.populateDayIndex();
  },
  methods: {
    formatDate(date, type) {
      let monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      let month =
        type == "short"
          ? monthNames[monthIndex].slice(0, 3)
          : monthNames[monthIndex];
      return {
        label: day + ", " + month + " ",
        value: date
      };
    },
    addDate() {
      this.dayIndex.push(
        this.formatDate(this.nextDate(this.dateIndex), "short")
      );
      this.dateIndex++;
    },
    nextDate(index) {
      return new Date(new Date().getTime() + index * 24 * 60 * 60 * 1000);
    },
    addIndex() {
      this.dateIndex = this.dateIndex + 7
      this.dayIndex = []
      this.populateDayIndex()

    },
    minusIndex() {
      this.dateIndex = this.dateIndex - 7
      this.dayIndex = []
      this.populateDayIndex()
    },
    populateDayIndex() {
      for (var index = 0; index < this.min; index++) {
      this.dayIndex.push(
        this.formatDate(this.nextDate(this.dateIndex + index), "short")
      );
    }
    },
    slot(event, value, day) {
      // set active
      event.target.classList.toggle("vue-time-slot-active-cell");
      value.date = day.value;
      //console.log(value,day);
      this.$emit("callback", value);
    }
  }
};
</script>

<style lang="css">
.vue-time-slot-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 13px;
  margin-bottom:20px;
}
.vue-time-slot-row-header {
  border: none !important;
  text-align: right;
  cursor: pointer;
  font-size: 13px;
  padding: 7px;
  padding-top: 8px;
  color: #000;
  width: 100%;
  height: 17px;
  position: relative;
  right: 20px;
}
.vue-time-slot-column-header {
  border: none !important;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  padding: 5px 0;
  color: #000;
}
.vue-time-slot-cell{
  padding: 7px;
  border-style: solid;
  border-color: #ccc;
  border-width: 1px 1px 0 0;
  text-align: center;
  cursor: pointer;
  color: #fff;
  font-size: 11px;
}
.vue-time-slot-cell:last-child{
  border-width: 1px 1px 1px 0;
}
.vue-time-slot-cell:hover{
  background-color: #49b1ff;
}
.vue-time-slot-active-cell {
  background-color: #ef4144;
  color: #fff;
}
.vue-time-slot-active-cell:hover{
  background-color: #ef4144;
}
.vue-time-slot-table-row-header {
  display: flex;
  flex-direction: column;
  width: 70px;
}
.vue-time-slot-day-header {
  display: flex;
  flex-direction: column;
  width: 70px;
}
.vue-time-slot-calendar-table {
  background-color: transparent;
  overflow: auto;
  white-space: nowrap;
  width: 85%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.vue-time-slot-calendar-table .vue-time-slot-day-header:first-child{
  border-style: solid;
  border-color: #ccc;
  border-width: 0 0 0 1px;
}
.arrow-block {
  font-size: 25px;
  font-weight: bolder;
  color: #ef4144;
  cursor: pointer;
  margin: -10px 15px;
}

.arrow-block-left {
  position: absolute;
  font-size: 25px;
  font-weight: bolder;
  color: #20a0ff;
  cursor: pointer;
  left: 10%;
  top:60%;
}

.arrow-block-right {
  position: absolute;
  font-size: 25px;
  font-weight: bolder;
  color: #20a0ff;
  cursor: pointer;
  right: 10%;
  top:60%;
}
</style>