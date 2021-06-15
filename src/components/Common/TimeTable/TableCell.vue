<template>
  <div>
    <div
      class="busy-time"
      @mouseenter="showApply = true"
      @mouseleave="showApply = false"
    >
        <el-scrollbar wrap-class="list">
          <div class="time" v-for="(time, index) in dayTimetable" :key="index">
            <div class="time-content bold">{{ time.startTime }} - {{ time.endTime }}</div>
<!--            <div class="time-content">{{ time.reason }}</div>-->
            <div class="time-content">{{ time['meetingType'] }}</div>
            <div class="time-content">{{ time['userName'] }}</div>
            <div class="time-content" v-if="time.state === 1">成功预定 <i class="el-icon-success"></i></div>
            <div class="time-content" v-else>等待审核 <i class="el-icon-warning"></i></div>
          </div>
        </el-scrollbar>
        <transition name="el-zoom-in-bottom" v-if="this.$store.state.user.isManager !== 2">
          <div v-show="showApply" class="apply-btn-container transition-box">
            <el-button v-if="ban === 0" class="apply-btn" type="success" plain @click="showNotificationDialog">申请</el-button>
            <el-button v-else class="apply-btn"  type="info" disabled plain>暂不可申请</el-button>
          </div>
        </transition>
    </div>
    <!-- 使用须知的dialog -->
    <notification
      v-if="showNotification"
      :visible.sync="showNotification"
      :roomInfo="roomInfo"
      @refresh="$emit('refresh')"
    >
    </notification>
  </div>
</template>

<script>
import Notification from '../../BorrowForm/Notification'
export default {
  name: 'TableCell',
  props: {
    dayTimetable: {
      type: Array,
      default () {
        return []
      }
    },
    building: {
      type: Object,
      default () {
        return null
      }
    },
    roomName: {
      type: String,
      default () {
        return ''
      }
    },
    ban: Number,
    date: {
      type: Date,
      default () {
        return null
      }
    }
  },
  computed: {
    roomInfo () {
      return {
        building: this.building,
        roomName: this.roomName,
        date: this.date
      }
    }
  },
  data () {
    return {
      showApply: false,
      showNotification: false
    }
  },
  methods: {
    showNotificationDialog () {
      let today = new Date().getTime()
      let tarDay = this.date.getTime()
      if (tarDay > today) {
        this.showApply = false
        this.showNotification = true
      } else {
        this.$message({
          showClose: true,
          message: '至少提前一天预定会议室',
          type: 'warning',
          duration: 1500,
          offset: 100
        })
      }
    }
  },
  components: {
    Notification
  }
}
</script>

<style scoped>
.busy-time {
  display: grid;
  height: 20vh;
  max-height: 20vh;
  /*padding: 1rem 0 1rem 1rem;*/
  overflow: visible;
  overflow-x: hidden;
  position: relative;
}

.busy-time >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}

.time {
  /*margin-bottom: 1rem;*/
  padding: 1rem 0 1rem 1rem;
}

.bold {
  font-weight: bold;
}

.time-content {
  margin-bottom: 0.1rem;
}

.apply-btn-container {
  width: 100%;
  position: absolute;
  bottom: 0;
}

.apply-btn {
  width: 100%;
  border-bottom: none;
  border-left: none;
  border-right: none;
  border-bottom-left-radius: unset;
  border-bottom-right-radius: unset;
}
</style>
