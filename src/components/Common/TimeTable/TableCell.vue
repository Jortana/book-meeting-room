<template>
  <div>
    <div
      class="busy-time"
      @mouseenter="showApply = true"
      @mouseleave="showApply = false"
    >
      <el-scrollbar wrap-class="list">
        <div v-for="(time, index) in dayTimetable" :key="index" class="time">
          <div class="time-content bold">
            {{ time.startTime }} - {{ time.endTime }}
          </div>
          <!--            <div class="time-content">{{ time.reason }}</div>-->
          <div class="time-content">{{ time['meetingName'] }}</div>
          <div class="time-content">{{ time['hostName'] }}</div>
          <div v-if="time.state === 1" class="time-content">
            成功预定
            <i class="el-icon-success"></i>
          </div>
          <div v-else class="time-content">
            等待审核
            <i class="el-icon-warning"></i>
          </div>
        </div>
      </el-scrollbar>
      <transition
        v-if="this.$store.state.user.isManager !== 2"
        name="el-zoom-in-bottom"
      >
        <div v-show="showApply" class="apply-btn-container transition-box">
          <el-button
            v-if="ban === 0"
            class="apply-btn"
            type="success"
            plain
            @click="showNotificationDialog"
          >
            申请
          </el-button>
          <el-button v-else class="apply-btn" type="info" disabled plain>
            暂不可申请
          </el-button>
        </div>
      </transition>
    </div>
    <!-- 使用须知的dialog -->
    <notification
      v-if="showNotification"
      :visible.sync="showNotification"
      :roomInfo="roomInfo"
      :type="type"
      @refresh="$emit('refresh')"
    ></notification>
  </div>
</template>

<script>
import Notification from '../../BorrowForm/Notification'
export default {
  name: 'TableCell',
  components: {
    Notification
  },
  props: {
    dayTimetable: {
      type: Array,
      default() {
        return []
      }
    },
    building: {
      type: Object,
      default() {
        return null
      }
    },
    roomName: {
      type: String,
      default() {
        return ''
      }
    },
    ban: Number,
    date: {
      type: Date,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      showApply: false,
      showNotification: false
    }
  },
  computed: {
    roomInfo() {
      return {
        building: this.building,
        roomName: this.roomName,
        date: this.date
      }
    },
    type() {
      return this.building.id === 29 ? 'hall' : 'normal'
    }
  },
  methods: {
    showNotificationDialog() {
      const today = new Date().getTime()
      const tarDay = this.date.getTime()
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

.busy-time >>> .el-scrollbar__wrap {
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
  margin-bottom: 0.2rem;
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
