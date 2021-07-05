<template>
  <main>
    <h2>我的记录</h2>
    <el-tabs v-model="curRecordType" class="type-tab" type="card">
      <el-tab-pane label="普通预定" name="normal">
        <el-table
          v-loading="recordLoading"
          :data="record"
          class="record-table"
          cell-class-name="t-cell"
        >
          <el-table-column
            prop="date"
            label="日期"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="room"
            label="教室"
            min-width="100"
          ></el-table-column>
          <el-table-column prop="startTime" label="起始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column label="审核状态" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.state === 0">
                等待审核
                <i class="el-icon-warning"></i>
              </div>
              <div v-else-if="scope.row.state === 1">
                预定成功
                <i class="el-icon-success"></i>
              </div>
              <div v-else>
                预定失败
                <i class="el-icon-error"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.editable">
                <el-button
                  type="text"
                  size="small"
                  @click="editBorrow(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="showConfirm(scope.row)"
                >
                  取消申请
                </el-button>
              </div>
              <div v-else>
                <el-button type="text" size="small" disabled>
                  不可修改
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="批量预定" name="batch">
        <batch class="record-table"></batch>
      </el-tab-pane>
    </el-tabs>
    <apply-form
      v-if="editBorrowVisible"
      :visible.sync="editBorrowVisible"
      :roomInfo="roomInfo"
    ></apply-form>
    <hall-apply-form
      v-if="editHallBorrowVisible"
      :visible.sync="editHallBorrowVisible"
      :roomInfo="roomInfo"
    ></hall-apply-form>
    <el-dialog
      :visible.sync="confirmVisible"
      :center="true"
      title="确定取消"
      width="30%"
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
import HallApplyForm from '../BorrowForm/HallApplyForm'
import Batch from './Batch'
export default {
  name: 'Record',
  components: {
    ApplyForm,
    HallApplyForm,
    Batch
  },
  data() {
    return {
      record: [],
      recordLoading: true,
      editBorrowVisible: false,
      editHallBorrowVisible: false,
      roomInfo: {},
      curForm: {},
      confirmVisible: false,
      curRecordType: 'normal'
    }
  },
  mounted() {
    this.getRecord()
  },
  methods: {
    getRecord() {
      this.$axios
        .post('/getRecordByUser', {
          userNum: this.$store.state.user.userNum
        })
        .then((successResponse) => {
          this.recordLoading = false
          successResponse.data.forEach((record) => {
            const { date, buildingName, roomName } = record
            let todayDate = new Date()
            const today =
              todayDate.getFullYear() +
              '-' +
              (todayDate.getMonth() + 1) +
              '-' +
              todayDate.getDate()
            todayDate = new Date(today)
            const editable =
              new Date(date).getTime() - todayDate.getTime() >= 86400000
            record.editable = editable
            record.room = buildingName + ' ' + roomName
            this.record.push(record)
          })
        })
        .catch(() => {})
    },
    editBorrow(record) {
      // 修改借教室的信息
      const building = {
        id: record.buildingID,
        name: record.buildingName
      }
      this.roomInfo = {
        building: building,
        roomName: record.roomName,
        date: record.date,
        originInfo: record
      }
      if (building.id === 29) {
        this.editHallBorrowVisible = true
      } else {
        this.editBorrowVisible = true
      }
    },
    showConfirm(record) {
      // 取消借教室
      this.confirmVisible = true
      this.curForm = record
    },
    cancelBorrow() {
      this.$axios
        .post('/delByID', {
          ID: this.curForm['id']
        })
        .then((successResponse) => {
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
        .catch()
    }
  }
}
</script>

<style scoped>
main >>> thead {
  color: #000;
  font-size: 1rem;
}

.type-tab {
  margin-right: 2rem;
}

.type-tab >>> .el-tabs__header {
  margin-bottom: 0;
}

.record-table {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}

@media only screen and (max-width: 768px) {
  main >>> thead {
    font-size: 0.9rem;
  }
}
</style>
