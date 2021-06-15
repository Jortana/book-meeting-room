<template>
<div>
  <div class="audit-table">
    <!-- 切换不同审核状态 -->
    <div class="audit-type">
      <el-radio-group size="medium" v-model="curAuditType">
        <el-radio-button label="0">未审核</el-radio-button>
        <el-radio-button label="1">已审核</el-radio-button>
      </el-radio-group>
    </div>
    <div class="table">
      <el-table :data="record">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="主持人">
                <span>{{ props.row.hostName }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="承办单位">
                <span>{{ props.row.organizer }}</span>
              </el-form-item>
              <el-form-item label="参会校领导">
                <span>{{ props.row.leaderStr }}</span>
              </el-form-item>
              <el-form-item label="参加人">
                <span>{{ props.row.participant }}</span>
              </el-form-item>
              <el-form-item label="提供服务">
                <span>{{ props.row.provideStr }}</span>
              </el-form-item>
              <el-form-item label="会议人数">
                <span>{{ props.row.meetingNumber }}人</span>
              </el-form-item>
              <el-form-item label="主要用途">
                <span>{{ props.row.meetingContent }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remarks.length === 0 ? '无' : props.row.remarks }}</span>
              </el-form-item>
              <el-form-item label="专项经费">
                <span>{{ props.row.funds === true ? '是' : '否' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="日期"
          prop="date"
          min-width="100">
        </el-table-column>
        <el-table-column
          label="报告厅"
          prop="roomName"
          min-width="90">
        </el-table-column>
        <el-table-column
          label="会议名称"
          prop="meetingName"
          min-width="90">
        </el-table-column>
        <el-table-column
          label="会议类型"
          min-width="90">
          <template slot-scope="scope">
            <div>{{ meetingTypeOptionsArr[scope.row.meetingType] }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          prop="startTime"
          min-width="90">
        </el-table-column>
        <el-table-column
          label="结束时间"
          prop="endTime"
          min-width="90">
        </el-table-column>
        <el-table-column
          label="申请人"
          prop="username">
        </el-table-column>
        <el-table-column
          label="操作"
          :min-width="curAuditType === '0' ? operationMinWidth : 150">
          <template slot-scope="scope">
            <div v-if="curAuditType === '0'">
              <div v-if="scope.row.editable">
                <change-button
                  @getRecords="getRecords"
                  :type="'success'"
                  :record="scope.row"
                  :content="'通过'"
                  :state="1"
                  :page="curAuditType === '0' ? unCurPage : auCurPage"
                ></change-button>
                <change-button
                  @getRecords="getRecords"
                  :type="'danger'"
                  :record="scope.row"
                  :content="'不通过'"
                  :state="-1"
                  :page="curAuditType === '0' ? unCurPage : auCurPage"
                ></change-button>
              </div>
              <div v-else>
                <el-button type="text" size="small" disabled>已过期</el-button>
              </div>
            </div>
            <div v-else>
              <div v-if="scope.row.editable">
                <change-button
                  v-if="scope.row.state === -1"
                  @getRecords="getRecords"
                  :type="'success'"
                  :record="scope.row"
                  :content="'更改为通过'"
                  :state="1"
                  :page="curAuditType === '0' ? unCurPage : auCurPage"
                ></change-button>
                <change-button
                  v-else
                  @getRecords="getRecords"
                  :type="'danger'"
                  :record="scope.row"
                  :content="'更改为不通过'"
                  :state="-1"
                  :page="curAuditType === '0' ? unCurPage : auCurPage"
                ></change-button>
              </div>
              <div v-else>
                <el-button type="text" size="small" disabled>已过期</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</div>
</template>

<script>
import ChangeButton from './ChangeButton'
export default {
  name: 'HallAuditTable',
  created () {
    this.getRecords(1)
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })()
    }
  },
  watch: {
    curAuditType (type) {
      let page = type === '0' ? this.unCurPage : this.auCurPage
      this.getRecords(page)
    },
    screenWidth (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val
        this.timer = true
        setTimeout(() => {
          this.timer = false
        }, 400)
      }
    }
  },
  computed: {
    operationMinWidth () {
      if (this.screenWidth > 1600) {
        return 130
      }
      if (this.screenWidth <= 1600 && this.screenWidth > 1180) {
        return 130
      } else if (this.screenWidth > 970) {
        return 160
      } else {
        return 180
      }
    }
  },
  data () {
    return {
      curAuditType: '0',
      total: 0,
      record: [],
      unCurPage: 1,
      auCurPage: 1,
      recordLoading: false,
      meetingTypeOptionsArr: ['上课', '会议', '报告', '开题', '答辩'],
      weekZh: ['一', '二', '三', '四', '五', '六', '日'],
      screenWidth: document.body.clientWidth,
      timer: false
    }
  },
  methods: {
    getRecords (page) {
      this.curAuditType === '0' ? this.unCurPage = page : this.auCurPage = page
      this.recordLoading = true
      let url = 'auditoriumByAuditor'
      this.$axios
        .post(url, {
          userNum: this.$store.state.user.userNum,
          page: page,
          state: this.curAuditType
        })
        .then(successResponse => {
          let today = new Date().getTime()
          this.total = successResponse.data['recordNum']
          this.record = successResponse.data.record
          this.record.forEach((record) => {
            // 设置是否可修改
            let date = new Date(record.date).getTime()
            record.editable = date > today
            // 设置参会领导和提供服务的字符串
            let leaders = record['leaderStr'].split(',')
            let services = record['provideStr'].split(',')
            record['leaderStr'] = leaders.slice(0, leaders.length - 1).join('，')
            record['provideStr'] = services.slice(0, services.length - 1).join('，')
          })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '服务器无响应',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
      this.recordLoading = false
    }
  },
  components: {
    ChangeButton
  }
}
</script>

<style scoped>
.audit-table {
  border-left: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
  padding-top: 1rem;
}

.audit-type {
  margin-left: 1rem;
}

.table {
  border-top: 1px solid #DCDFE6;
  margin-top: 1rem;
}

.table >>> thead {
  color: #000;
  font-size: 1rem;
}

.table-expand {
  font-size: 0;
}

.table-expand >>> label {
  /*width: 90px;*/
  color: #99a9bf;
}

.table-expand >>> .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 20%;
}

@media only screen and (max-width : 375px) {
  .table >>> thead {
    font-size: .9rem;
  }
}
</style>
