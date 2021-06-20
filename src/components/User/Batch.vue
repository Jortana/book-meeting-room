<template>
  <div class="table-container">
    <el-table
      class="record-table"
      :data="batchRecord"
      v-loading="recordLoading">
      <el-table-column
        label="教室">
        <template slot-scope="scope">
          <div>{{ scope.row.buildingName }} {{ scope.row.roomName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="起始日期">
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="结束日期">
      </el-table-column>
      <el-table-column
        label="每周时间">
        <template slot-scope="scope">
          <div v-if="scope.row['weekday'] === 0">每天</div>
          <div v-else>每周{{ weekZh[scope.row['weekday'] - 1] }}</div>
        </template>
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
        label="操作">
        <template slot-scope="scope">
          <div>
            <el-button @click="showEditForm(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="showConfirm(scope.row)" type="text" size="small">取消申请</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <batch-apply-form v-if="editFormVisible" :visible.sync="editFormVisible" :roomInfo="roomInfo"></batch-apply-form>
    <!-- 取消预定确认窗口 -->
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
  </div>
</template>

<script>
import Notification from '../BorrowForm/Notification'
import BatchApplyForm from '../BorrowForm/BatchApplyForm'
export default {
  name: 'Batch',
  created () {
    this.getRecord()
  },
  data () {
    return {
      batchRecord: [],
      recordLoading: false,
      weekZh: ['一', '二', '三', '四', '五', '六', '日'],
      confirmVisible: false,
      curRecord: {},
      roomInfo: {},
      editFormVisible: false
    }
  },
  methods: {
    getRecord () {
      this.recordLoading = true
      this.$axios
        .post('/getMultiRecByUser', {
          userNum: this.$store.state.user.userNum
        })
        .then(successResponse => {
          this.batchRecord = successResponse.data
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '服务器出错',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
      this.recordLoading = false
    },
    showConfirm (record) {
      this.confirmVisible = true
      this.curRecord = record
    },
    cancelBorrow () {
      this.$axios
        .post('/delMultiRecByID', {
          ID: this.curRecord.id
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
              message: '服务器出错',
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
        .catch(() => {
          this.$message({
            showClose: true,
            message: '服务器出错',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
    },
    showEditForm (record) {
      this.roomInfo = record
      this.editFormVisible = true
    }
  },
  components: {
    Notification,
    BatchApplyForm
  }
}
</script>

<style scoped>
.table-container >>> thead {
  color: #000;
  font-size: 1rem;
}

/*.record-table {*/
/*  border-top: 1px solid #DCDFE6;*/
/*  margin-top: 1rem;*/
/*}*/
</style>
