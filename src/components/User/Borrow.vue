<template>
  <main>
    <h2>会议室预定申请</h2>
    <!-- 显示选择的一周教室的借用情况，默认为当前一周 -->
    <div class="panel-container">
      <el-dropdown trigger="click" class="batch-btn" @command="showNotification">
        <el-button type="primary" size="medium">
          批量预定 <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="normal">会议室</el-dropdown-item>
          <el-dropdown-item command="hall">报告厅</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 切换楼宇 -->
      <el-tabs
        class="building-tab"
        v-model="curBuildingID"
        type="card"
        @tab-click="changeBuilding"
        v-loading="buildingLoading"
      >
        <el-tab-pane
          :lazy="true"
          v-for="(building, index) in buildings"
          :key="index"
          :label="building.name"
          :name="String(building.id)">
          <!-- 教室借用时间表 -->
          <div class="timetable">
            <time-table :building="building"></time-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <notification
      v-if="notificationVisible"
      :visible.sync="notificationVisible"
      :is-batch="true"
      :type="type">
    </notification>
<!--    <batch-apply-form-->
<!--      v-if="editFormVisible"-->
<!--      :visible.sync="editFormVisible"-->
<!--    ></batch-apply-form>-->
  </main>
</template>

<script>
import TimeTable from '../Common/TimeTable/TimeTable'
import Notification from '../BorrowForm/Notification'
import BatchApplyForm from '../BorrowForm/BatchApplyForm'
export default {
  name: 'Borrow',
  mounted () {
    // 如果state为空就获取
    if (this.$store.state.buildings.length === 0) {
      this.getAllRoom()
    } else {
      this.saveBuildingAndRoom()
    }
  },
  data () {
    return {
      buildings: [],
      curBuildingID: '',
      buildingLoading: false,
      notificationVisible: false,
      editFormVisible: false,
      type: ''
    }
  },
  methods: {
    getAllRoom () {
      this.buildingLoading = true
      // 获取所有的建筑和房间号
      this.$axios
        .get('/getAllRoom')
        .then(successResponse => {
          this.$store.commit('saveBuildings', successResponse.data)
          this.saveBuildingAndRoom()
        })
        .catch(() => {
        })
      this.buildingLoading = false
    },
    saveBuildingAndRoom () {
      this.buildings = this.$store.state.buildings
      this.curBuildingID = String(this.buildings[0].id)
    },
    changeBuilding (tab, event) {
      // 点击楼宇的选项卡切换当前楼宇
      // console.log(tab, event)
    },
    showNotification (type) {
      this.type = type
      this.notificationVisible = true
    }
  },
  components: {
    TimeTable,
    Notification,
    BatchApplyForm
  }
}
</script>

<style scoped>
.search {
  width: 50vw;
}

.search >>> .el-input {
  width: 30vw;
}

.building-tab {
  margin-right: 2rem;
}

.building-tab >>> .el-tabs__header {
  margin: 0;
}

.timetable {
  /*height: 130px;*/
  width: 100%;
}

.panel-container {
  position: relative;
}

.batch-btn {
  position: absolute;
  right: 2rem;
  top: 2px;
  z-index: 10;
}

@media only screen and (max-width : 376px) {
  .batch-btn {
    top: -50px;
  }
}
</style>
