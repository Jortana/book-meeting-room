<template>
    <div>
      <!-- 切换按钮 -->
      <div class="switch-container">
        <el-button class="switch-btn" type="info" plain @click="changeWeek(-1)">上一周</el-button>
        <el-button class="switch-btn" type="info" plain @click="changeWeek(0)">本周</el-button>
        <el-button class="switch-btn" type="info" plain @click="changeWeek(1)">下一周</el-button>
      </div>
      <div id="timetable" v-loading="timetableLoading">
        <!-- 表头 -->
        <div class="t-head">
          <div>会议室</div>
          <div v-for="(day, index) in week" :key="index"> 星期{{ weekZh[index] }} <br> {{ day | formatDate }}</div>
        </div>
        <div id="table">
          <div class="t-row" v-for="(room, index) in timetable" :key="index">
            <div class="room-info">
              <el-popover
                placement="top"
                width="300"
                trigger="hover">
                <div class="room-img">
                  <img :src="building.room[index].picture">
                </div>
                <div class="pop-info"><span class="pop-sub">地点：</span><span v-if="building.id !== 29">{{ building.name }}</span>{{room.roomName}}</div>
                <div class="pop-info"><span class="pop-sub">容纳人数：</span>{{ building.room[index].capacity }}人</div>
                <div class="pop-info"><span class="pop-sub">设备信息：</span>{{ building.room[index].explain }}</div>
                <!-- 需要使用slot方法，不然显示不出来 -->
                <span slot="reference"><span v-if="building.id !== 29">{{ building.name }}</span> {{ room.roomName }}</span>
              </el-popover>
            </div>
            <table-cell
              v-for="(dayTimetable, recordIndex) in room.record"
              :key="recordIndex"
              :dayTimetable="dayTimetable"
              :building="building"
              :roomName="room.roomName"
              :ban="building.room[index]['ban']"
              :date="week[recordIndex]"
              @refresh="getBusyTime"
            >
            </table-cell>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import TableCell from './TableCell'
export default {
  name: 'TimeTable',
  props: {
    building: {
      type: Object,
      default () {
        return null
      }
    }
  },
  created () {
    this.setDays()
    this.getBusyTime()
  },
  data () {
    this.$emit('testEmit')
    let curDate = new Date()
    return {
      curDate: curDate,
      week: [],
      weekZh: ['一', '二', '三', '四', '五', '六', '日'],
      timetable: [],
      timetableLoading: false
    }
  },
  methods: {
    // 设置表头的星期和日期
    setDays () {
      let date = this.curDate
      // 年份
      let year = date.getFullYear()
      // 月份
      let month = date.getMonth()
      // 日
      let day = date.getDate()
      // 一周中的第几天
      let dayOfWeek = date.getDay()
      // 当前周的开始日期，从周一开始
      let weekStartDate = new Date(year, month, day - dayOfWeek + 1)
      // 当前周的结束日期
      // let weekEndDate = new Date(year, month, day + (6 - dayOfWeek))
      this.week = []
      for (let i = 0; i < 7; i++) {
        let curDay = new Date(weekStartDate)
        curDay.setDate(curDay.getDate() + i)
        this.week.push(curDay)
      }
    },
    // 根据buildingID和当前日期取得各个房间的借用情况
    getBusyTime () {
      this.timetableLoading = true
      let curDate = this.$options.filters['formatDate'](this.curDate)
      this.$axios
        .post('getRecordByDate', {
          buildingID: this.building.id,
          date: curDate
        })
        .then(successResponse => {
          this.timetable = successResponse.data
        })
        .catch(failResponse => {
          this.$message({
            showClose: true,
            message: '服务器出错',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
      this.timetableLoading = false
    },
    // 改变当前想看的周
    changeWeek (week) {
      switch (week) {
        case -1:
          this.curDate.setDate(this.curDate.getDate() - 7)
          break
        case 0:
          this.curDate = new Date()
          break
        case 1:
          this.curDate.setDate(this.curDate.getDate() + 7)
          break
      }
      // 尝试使用watch属性，但是使用setDate时watch无法监听，这样写复杂一点但是性能稍微好一点
      this.setDays()
      this.getBusyTime()
    }
  },
  components: {
    TableCell
  }
}
</script>

<style scoped>
.t-head {
  display: flex;
  text-align: center;
  font-weight: bold;
  background-color: #F7FAF8;
}

.t-head > div {
  display: flex;
  flex: 1;
  padding-top: 18px;
  padding-bottom: 18px;
  justify-content: center;
  align-items: center;
}

.t-head:first-child {
  border-top: 1px solid #D9E5DF;
}

.t-head:first-child,  .room-info{
  border-left: 1px solid #D9E5DF;
}

.t-head > div, .t-row > div {
  border-right: 1px solid #D9E5DF;
  border-bottom: 1px solid #D9E5DF;
}

.t-row {
  display: flex;
  height: 20vh;
}

.t-row div {
  flex: 1;
}

.room-info {
  display: flex;
  /* 解决稍微莫名其妙对不齐的bug */
  /*width: 99%;*/
  justify-content: center;
  align-items: center;
  color: #409EFF;
}

.switch-container {
  display: flex;
}

.switch-container button {
  flex: 1;
}

.switch-container:first-child {
  border-left: 1px solid #d3d4d6;
}

.switch-btn {
  margin: 0 !important;
  border-top: none;
  border-bottom: none;
  border-left: none;
  border-radius: unset;
}

.room-img > img {
  width: 100%;
}

.pop-sub {
  color: #99a9bf;
}

.pop-info {
  height: 1.2rem;
  line-height: 1.2rem;
}

@media only screen and (max-width : 768px) {
  #timetable {
    overflow: scroll;
  }

  .t-head div,
  .t-row div {
    min-width: 100px;
  }
}
</style>
