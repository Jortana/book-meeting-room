<template>
  <div>
    <div class="audit-table">
      <!-- 切换不同审核状态 -->
      <div class="audit-type">
        <el-radio-group v-model="curAuditType" size="medium">
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
                <el-form-item label="承办单位">
                  <span>{{ props.row.organizer }}</span>
                </el-form-item>
                <el-form-item label="会议类型">
                  <span>
                    {{ meetingTypeOptionsArr[props.row.meetingType] }}
                  </span>
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
            :label="recordType === 'normal' ? '日期' : '起始日期'"
            min-width="100"
          >
            <template slot-scope="scope">
              <div>
                {{
                  recordType === 'normal' ? scope.row.date : scope.row.startDate
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="recordType === 'batch'" label="结束日期">
            <template slot-scope="scope">
              <div>{{ scope.row.endDate }}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="recordType === 'batch'" label="每周时间">
            <template slot-scope="scope">
              <div>星期{{ weekZh[scope.row.weekday - 1] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="教室" min-width="90">
            <template slot-scope="scope">
              <div>{{ scope.row.buildingName }} {{ scope.row.roomName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="会议名称"
            prop="meetingName"
            min-width="90"
          ></el-table-column>
          <el-table-column
            label="开始时间"
            prop="startTime"
            min-width="90"
          ></el-table-column>
          <el-table-column
            label="结束时间"
            prop="endTime"
            min-width="90"
          ></el-table-column>
          <el-table-column label="申请人" prop="username"></el-table-column>
          <el-table-column
            v-if="curAuditType === '1'"
            label="审核状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.state === 1">
                预定成功
                <i class="el-icon-success"></i>
              </div>
              <div v-else>
                预定失败
                <i class="el-icon-error"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :min-width="curAuditType === '0' ? operationMinWidth : 130"
            label="操作"
          >
            <template slot-scope="scope">
              <div v-if="curAuditType === '0'">
                <div v-if="scope.row.editable">
                  <change-button
                    :type="'success'"
                    :record="scope.row"
                    :content="'通过'"
                    :state="1"
                    :page="curAuditType === '0' ? unCurPage : auCurPage"
                    @getRecords="getRecords"
                  ></change-button>
                  <change-button
                    :type="'danger'"
                    :record="scope.row"
                    :content="'不通过'"
                    :state="-1"
                    :page="curAuditType === '0' ? unCurPage : auCurPage"
                    @getRecords="getRecords"
                  ></change-button>
                </div>
                <div v-else>
                  <el-button type="text" size="small" disabled>
                    已过期
                  </el-button>
                </div>
              </div>
              <div v-else>
                <div v-if="scope.row.editable">
                  <change-button
                    v-if="scope.row.state === -1"
                    :type="'success'"
                    :record="scope.row"
                    :content="'更改为通过'"
                    :state="1"
                    :page="curAuditType === '0' ? unCurPage : auCurPage"
                    @getRecords="getRecords"
                  ></change-button>
                  <change-button
                    v-else
                    :type="'danger'"
                    :record="scope.row"
                    :content="'更改为不通过'"
                    :state="-1"
                    :page="curAuditType === '0' ? unCurPage : auCurPage"
                    @getRecords="getRecords"
                  ></change-button>
                </div>
                <div v-else>
                  <el-button type="text" size="small" disabled>
                    已过期
                  </el-button>
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
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="getRecords"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ChangeButton from './ChangeButton'
export default {
  name: 'AuditTable',
  components: {
    ChangeButton
  },
  props: {
    recordType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curAuditType: '0',
      total: 0,
      record: [],
      unCurPage: 1,
      auCurPage: 1,
      recordLoading: false,
      meetingTypeOptionsArr: ['上课', '会议', '报告'],
      weekZh: ['一', '二', '三', '四', '五', '六', '日'],
      screenWidth: document.body.clientWidth,
      timer: false
    }
  },
  computed: {
    operationMinWidth() {
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
  watch: {
    curAuditType(type) {
      const page = type === '0' ? this.unCurPage : this.auCurPage
      this.getRecords(page)
    },
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val
        this.timer = true
        setTimeout(() => {
          // 打印screenWidth变化的值
          // console.log(this.screenWidth)
          this.timer = false
        }, 400)
      }
    }
  },
  created() {
    this.getRecords(1)
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    getRecords(page) {
      this.curAuditType === '0'
        ? (this.unCurPage = page)
        : (this.auCurPage = page)
      this.recordLoading = true
      const url =
        this.recordType === 'normal'
          ? '/getRecByAuditor'
          : '/getMultiRecByAuditor'
      this.$axios
        .post(url, {
          userNum: this.$store.state.user.userNum,
          page: page,
          state: this.curAuditType
        })
        .then((successResponse) => {
          // console.log(successResponse.data)
          const today = new Date().getTime()
          this.total = successResponse.data['recordNum']
          this.record = successResponse.data.record
          if (this.recordType === 'normal') {
            // 设置普通预定是否可修改
            this.record.forEach((record) => {
              const date = new Date(record.date).getTime()
              record.editable = date > today
            })
          } else {
            // 设置批量预定是否可修改
            this.record.forEach((record) => {
              const date = new Date(record.endDate).getTime()
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
  }
}
</script>

<style scoped>
.audit-table {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  padding-top: 1rem;
}

.audit-type {
  margin-left: 1rem;
}

.table {
  border-top: 1px solid #dcdfe6;
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

@media only screen and (max-width: 375px) {
  .table >>> thead {
    font-size: 0.9rem;
  }
}
</style>
