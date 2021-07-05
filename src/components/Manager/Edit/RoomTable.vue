<template>
  <div class="room-table">
    <div class="row t-head">
      <div>房间号</div>
      <div>设备描述</div>
      <div>可容纳人数</div>
      <div>管理员</div>
      <div>图片</div>
      <div class="lg-cell">操作</div>
    </div>
    <room-table-row
      v-for="(roomInfo, index) in roomInfos"
      :key="index"
      :index="index"
      :roomInfo.sync="roomInfo"
      class="row"
      @updateRoom="updateRoom"
    ></room-table-row>
    <!-- 添加教室行 -->
    <div v-if="isAdding === false" class="row">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div>
        <el-button size="mini" type="primary" @click="isAdding = true">
          添加教室
        </el-button>
      </div>
    </div>
    <add-room
      v-else
      :isAdding.sync="isAdding"
      :buildingID="building.id"
      class="row"
    ></add-room>
  </div>
</template>

<script>
import RoomTableRow from './RoomTableRow'
import AddRoom from './AddRoom'
export default {
  name: 'RoomTable',
  components: {
    RoomTableRow,
    AddRoom
  },
  props: {
    building: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      roomInfos: this.building.room,
      isAdding: false
    }
  },
  methods: {
    updateRoom(roomInfo, index) {
      const { explain, capacity, auditor, picture } = roomInfo
      this.roomInfos[index].explain = explain
      this.roomInfos[index].capacity = capacity
      this.roomInfos[index].auditor = auditor
      this.roomInfos[index].picture =
        picture === undefined ? this.roomInfos[index].picture : picture
    }
  }
}
</script>

<style scoped>
.room-table {
  display: grid;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  /*border-bottom: 1px solid #DCDFE6;*/
  /*overflow: scroll;*/
}

.row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  text-align: center;
  height: 5vh;
  min-height: 50px;
  max-height: 50px;
  border-bottom: 1px solid #dcdfe6;
  justify-content: center;
  align-content: center;
}

.t-head {
  height: 6vh;
  font-weight: bold;
  background-color: #f7faf8;
}

.t-head > div {
  padding-top: 18px;
  padding-bottom: 18px;
  min-width: 100px;
}

.wide-cell {
  min-width: 150px !important;
}

.lg-cell {
  min-width: 260px !important;
}

@media only screen and (max-width: 768px) {
  .t-head div {
    font-size: 0.9rem;
  }

  .room-table {
    overflow: scroll;
  }

  .row {
    font-size: 0.8rem;
  }
}
</style>
