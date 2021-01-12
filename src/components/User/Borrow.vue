<template>
  <main>
    <h2>会议室预定申请</h2>
    <!-- 搜索框 -->
    <!--
    <div class="search">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            ref="searchInput"
            placeholder="请输入会议室名称"
            prefix-icon="el-icon-search"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    -->
    <!-- 显示选择的一周教室的借用情况，默认为当前一周 -->
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
  </main>
</template>

<script>
import TimeTable from '../Common/TimeTable/TimeTable'
// const imgUrl = 'http://223.2.48.121:8443/image/'
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
      buildingLoading: false
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
      console.log(this.buildings)
      this.curBuildingID = String(this.buildings[0].id)
    },
    changeBuilding (tab, event) {
      // 点击楼宇的选项卡切换当前楼宇
      // console.log(tab, event)
    }
  },
  components: {
    TimeTable
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
</style>
