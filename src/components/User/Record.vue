<template>
  <main>
    <h2>我的记录</h2>
    <el-table
      class="record-table"
      :data="record"
      v-loading="recordLoading"
    >
      <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="room"
        label="教室">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="起始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间">
      </el-table-column>
      <el-table-column
        label="审核状态">
        <template slot-scope="scope">
          <div v-if="scope.row.state === 0">等待审核 <i class="el-icon-warning"></i></div>
          <div v-else-if="scope.row.state === 1">预定成功 <i class="el-icon-success"></i></div>
          <div v-else>预定失败 <i class="el-icon-error"></i></div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.editable">
            <el-button @click="editBorrow(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="showConfirm(scope.row)" type="text" size="small">取消申请</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="small" disabled>不可修改</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <apply-form v-if="editBorrowVisible" :visible.sync="editBorrowVisible" :roomInfo="roomInfo"></apply-form>
    <el-dialog
      title="确定取消"
      :visible.sync="confirmVisible"
      width="30%"
      :center="true"
    >
      <span>确定取消借教室吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancelBorrow">确 定</el-button>
      </span>
    </el-dialog>
  </main>
</template>

<script>
import ApplyForm from '../BorrowForm/ApplyForm'
export default {
  name: 'Record',
  mounted () {
    this.getRecord()
  },
  data () {
    return {
      record: [],
      recordLoading: true,
      editBorrowVisible: false,
      roomInfo: {},
      curForm: {},
      confirmVisible: false
    }
  },
  methods: {
    getRecord () {
      this.$axios
        .post('/getRecordByUser', {
          userNum: this.$store.state.user.userNum
        })
        .then(successResponse => {
          this.recordLoading = false
          successResponse.data.forEach((record) => {
            let { date, buildingName, roomName } = record
            let todayDate = new Date()
            let today = todayDate.getFullYear() + '-' + (todayDate.getMonth() + 1) + '-' + todayDate.getDate()
            todayDate = new Date(today)
            let editable = new Date(date).getTime() - todayDate.getTime() >= 86400000
            record.editable = editable
            record.room = buildingName + ' ' + roomName
            this.record.push(record)
          })
        })
        .catch(() => {
        })
    },
    editBorrow (record) {
      // 修改借教室的信息
      let building = {
        id: record.buildingID,
        name: record.buildingName
      }
      this.roomInfo = {
        building: building,
        roomName: record.roomName,
        date: record.date,
        originInfo: record
      }
      this.editBorrowVisible = true
    },
    showConfirm (record) {
      // 取消借教室
      this.confirmVisible = true
      this.curForm = record
    },
    cancelBorrow () {
      this.$axios
        .post('/delByID', {
          ID: this.curForm['id']
        })
        .then(successResponse => {
          if (successResponse.data === true) {
            this.$message({
              showClose: true,
              message: '取消成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
          } else {
            this.$message({
              showClose: true,
              message: '取消失败',
              type: 'error',
              duration: 1500,
              offset: 80
            })
          }
          setTimeout(() => {
            this.confirmVisible = false
            this.$router.go(0)
          }, 300)
        })
        .catch(failResponse => {
        })
    }
  },
  components: {
    ApplyForm
  }
}
</script>

<style scoped>
main >>> thead {
  color: #000;
  font-size: 1rem;
}
</style>
