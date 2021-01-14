<template>
  <div class="room-table">
    <div class="row t-head">
      <div>房间号</div>
      <div>设备描述</div>
      <div>可容纳人数</div>
      <div>管理员</div>
      <div>图片</div>
      <div>操作</div>
    </div>
    <room-table-row
      class="row"
      v-for="(roomInfo, index) in roomInfos"
      :key="index"
      :index="index"
      :roomInfo.sync="roomInfo"
      @updateRoom="updateRoom"
    ></room-table-row>
    <!-- 添加教室行 -->
    <div class="row" v-if="isAdding===false">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div>
        <el-button size="mini" type="primary" @click="isAdding=true">添加教室</el-button>
      </div>
    </div>
    <add-room v-else class="row" :isAdding.sync="isAdding" :buildingID="building.id"></add-room>
  </div>
</template>

<script>
import RoomTableRow from './RoomTableRow'
import AddRoom from './AddRoom'
export default {
  name: 'RoomTable',
  props: {
    building: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    console.log(this.building)
    return {
      roomInfos: this.building.room,
      isAdding: false
    }
  },
  methods: {
    updateRoom (roomInfo, index) {
      let { explain, capacity, auditor, picture } = roomInfo
      console.log(roomInfo)
      console.log(index)
      this.roomInfos[index].explain = explain
      this.roomInfos[index].capacity = capacity
      this.roomInfos[index].auditor = auditor
      this.roomInfos[index].picture = picture === undefined ? this.roomInfos[index].picture : picture
    }
  },
  components: {
    RoomTableRow,
    AddRoom
  }
}
</script>

<style scoped>
.room-table {
  display: grid;
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  /*border-bottom: 1px solid #DCDFE6;*/
}

.row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  text-align: center;
  height: 5vh;
  min-height: 50px;
  max-height: 50px;
  border-bottom: 1px solid #DCDFE6;
  justify-content: center;
  align-content: center;
}

.t-head {
  height: 6vh;
  font-weight: bold;
  background-color: #F7FAF8;
}

.t-head > div{
  padding-top: 18px;
  padding-bottom: 18px;
}
</style>
