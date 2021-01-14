<template>
<div>
  <div class="audit-table">
    <!-- 切换不同审核状态 -->
    <div class="audit-type">
      <el-radio-group v-model="curAuditType">
        <el-radio-button label="0">未审核</el-radio-button>
        <el-radio-button label="1">已审核</el-radio-button>
      </el-radio-group>
    </div>
    <div class="table">
      <el-table
        :data="record"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="主持人">
                <span>{{ props.row.hostName }}</span>
              </el-form-item>
              <el-form-item label="承办单位">
                <span>{{ props.row.organizer }}</span>
              </el-form-item>
              <el-form-item label="会议类型">
                <span>{{ meetingTypeOptionsArr[props.row.meetingType] }}</span>
              </el-form-item>
              <el-form-item label="会议人数">
                <span>{{ props.row.meetingNumber }}人</span>
              </el-form-item>
              <el-form-item label="会议内容">
                <span>{{ props.row.meetingContent }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :label="recordType === 'normal' ? '日期' : '起始日期'">
          <template slot-scope="scope">
            <div>{{ recordType === 'normal' ? scope.row.date : scope.row.startDate }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="recordType === 'batch'"
          label="结束日期">
          <template slot-scope="scope">
            <div>{{ scope.row.endDate }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="recordType === 'batch'"
          label="每周时间">
          <template slot-scope="scope">
            <div>星期{{ weekZh[scope.row.weekday - 1] }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="教室">
          <template slot-scope="scope">
            <div>{{ scope.row.buildingName }} {{ scope.row.roomName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="会议名称"
          prop="meetingName">
        </el-table-column>
        <el-table-column
          label="开始时间"
          prop="startTime">
        </el-table-column>
        <el-table-column
          label="结束时间"
          prop="endTime">
        </el-table-column>
        <el-table-column
          label="申请人"
          prop="username">
        </el-table-column>
        <el-table-column
          label="审核状态"
          v-if="curAuditType === '1'">
          <template slot-scope="scope">
            <div v-if="scope.row.state === 1">预定成功 <i class="el-icon-success"></i></div>
            <div v-else>预定失败 <i class="el-icon-error"></i></div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
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
  <div class="pages">
    <el-pagination
      v-if="total > 0"
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="getRecords">
    </el-pagination>
  </div>
</div>
</template>

<script>
import ChangeButton from './ChangeButton'
export default {
  name: 'AuditTable',
  props: {
    recordType: {
      type: String,
      default: ''
    }
  },
  created () {
    this.getRecords(1)
  },
  watch: {
    curAuditType (type) {
      let page = type === '0' ? this.unCurPage : this.auCurPage
      this.getRecords(page)
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
      meetingTypeOptionsArr: ['上课', '会议', '报告'],
      weekZh: ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  methods: {
    getRecords (page) {
      this.curAuditType === '0' ? this.unCurPage = page : this.auCurPage = page
      this.recordLoading = true
      let url = this.recordType === 'normal' ? '/getRecByAuditor' : '/getMultiRecByAuditor'
      this.$axios
        .post(url, {
          userNum: this.$store.state.user.userNum,
          page: page,
          state: this.curAuditType
        })
        .then(successResponse => {
          // console.log(successResponse.data)
          let today = new Date().getTime()
          this.total = successResponse.data['recordNum']
          this.record = successResponse.data.record
          if (this.recordType === 'normal') {
            // 设置普通预定是否可修改
            this.record.forEach((record) => {
              let date = new Date(record.date).getTime()
              record.editable = date > today
            })
          } else {
            // 设置批量预定是否可修改
            this.record.forEach((record) => {
              let date = new Date(record.startDate).getTime()
              record.editable = date > today
            })
          }
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

.pages {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.test >>> div {
  margin: 0;
}
</style>
