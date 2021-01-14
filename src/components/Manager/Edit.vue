<template>
  <main>
    <h2>编辑楼宇和教室</h2>
    <el-tabs
      class="building-tab"
      v-model="curBuildingID"
      type="card"
      v-loading="buildingLoading"
    >
      <el-tab-pane
        :lazy="true"
        v-for="(building, index) in buildings"
        :key="index"
        :label="building.name"
        :name="String(building.id)">
        <!-- 教室列表 -->
        <room-table :building.sync="building" @getNewRoomInfo="getAllRoom"></room-table>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script>
import RoomTable from './Edit/RoomTable'
export default {
  name: 'Edit',
  created () {
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
      buildingLoading: false,
      curBuildingID: ''
    }
  },
  methods: {
    getAllRoom () {
      console.log('get all room')
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
      if (this.curBuildingID === '0' || this.curBuildingID === '') {
        this.curBuildingID = String(this.buildings[0].id)
      }
    }
  },
  components: {
    RoomTable
  }
}
</script>

<style scoped>
.building-tab {
  margin-right: 2rem;
}

.building-tab >>> .el-tabs__header {
  margin: 0;
}
</style>
