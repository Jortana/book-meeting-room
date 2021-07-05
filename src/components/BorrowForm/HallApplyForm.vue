<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :width="width"
      :before-close="close"
      :close-on-click-modal="false"
      title="教育科学学院会议室申请"
      class="apply-dialog"
      center
    >
      <div>
        <!-- 申请会议室的表单 -->
        <el-form
          ref="applyForm"
          :model="applyForm"
          :rules="applyFormRules"
          label-width="90px"
        >
          <!-- 会议名称 -->
          <el-form-item label="会议名称" prop="meetingName">
            <el-input v-model="applyForm.meetingName"></el-input>
          </el-form-item>
          <!-- 申请人和主持人 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item label="申请人" prop="userName">
                <el-input v-model="username" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="主持人" prop="hostName">
                <el-input v-model="applyForm.hostName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系电话 -->
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="applyForm.phone"></el-input>
          </el-form-item>
          <!-- 承办单位 -->
          <el-form-item label="承办单位" prop="organizer">
            <el-input v-model="applyForm.organizer"></el-input>
          </el-form-item>
          <!-- 会议类型和参会人数 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item label="会议类型" prop="meetingType">
                <el-select
                  v-model="applyForm.meetingType"
                  class="full-width"
                  placeholder="请选择会议类型"
                >
                  <el-option value="上课"></el-option>
                  <el-option value="会议"></el-option>
                  <el-option value="报告"></el-option>
                  <el-option value="开题"></el-option>
                  <el-option value="答辩"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="参会人数" prop="meetingNumber">
                <el-input
                  v-model="applyForm.meetingNumber"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 参会校领导 -->
          <el-form-item label="参会校领导" prop="leader">
            <div class="leaders-container">
              <el-select
                :disabled="allLeaders"
                v-model="applyForm.leader"
                :placeholder="allLeaders ? '全体领导' : '无'"
                class="full-width"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="(leader, index) in leaders"
                  :key="index"
                  :label="leader"
                  :value="leader"
                ></el-option>
              </el-select>
              <el-checkbox v-model="allLeaders">全体领导</el-checkbox>
            </div>
          </el-form-item>
          <!-- 参加人 -->
          <el-form-item label="参加人" prop="participant">
            <el-input v-model="applyForm.participant"></el-input>
          </el-form-item>
          <!-- 提供服务 -->
          <el-form-item label="提供服务" prop="provide">
            <el-select
              v-model="applyForm.provide"
              class="full-width"
              multiple
              placeholder="无"
            >
              <el-option label="茶水服务" value="茶水服务"></el-option>
              <el-option label="音响话筒服务" value="音响话筒服务"></el-option>
            </el-select>
          </el-form-item>
          <!-- 主要用途 -->
          <el-form-item label="主要用途" prop="meetingContent">
            <el-input
              v-model="applyForm.meetingContent"
              :autosize="{ minRows: 2 }"
              type="textarea"
            ></el-input>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="applyForm.remarks"
              :autosize="{ minRows: 2 }"
              type="textarea"
            ></el-input>
          </el-form-item>
          <!-- 是否有专项经费支持 -->
          <el-form-item label="专项经费" prop="funds">
            <el-select
              v-model="applyForm.funds"
              class="full-width"
              placeholder="请选择"
            >
              <el-option value="true" label="是"></el-option>
              <el-option value="false" label="否"></el-option>
            </el-select>
          </el-form-item>
          <!-- 会议室和日期，如果不是批量预定就显示，否则需要选择 -->
          <el-row v-if="isBatch === false">
            <el-col :span="colNum">
              <el-form-item label="报告厅">
                <el-input :value="roomInfo.roomName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="会议日期">
                <el-input
                  :value="roomInfo.date | formatDate"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 批量借用 -->
          <div v-else>
            <!-- 报告厅 -->
            <el-form-item
              v-if="curRoomInfo !== null"
              label="报告厅"
              prop="curHall"
            >
              <el-select
                v-model="applyForm.curHall"
                class="full-width"
                placeholder="请选择"
              >
                <el-option
                  v-for="(hall, index) in curRoomInfo[0].room"
                  :key="index"
                  :value="hall.roomName"
                  :label="hall.roomName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 日期 -->
            <el-form-item prop="date" label="起止日期">
              <el-date-picker
                v-model="applyForm.date"
                class="full-width"
                type="daterange"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <!-- 每周几 -->
            <el-form-item prop="weekday" label="借用天数">
              <el-radio-group
                v-if="false"
                v-model="applyForm.weekday"
                class="full-width week-radio"
              >
                <el-radio-button
                  v-for="(day, index) in weekZh"
                  :key="index"
                  :label="index + 1"
                >
                  每周{{ day }}
                </el-radio-button>
              </el-radio-group>
              <el-select
                v-else
                v-model="applyForm.weekday"
                class="full-width"
                placeholder="请选择"
              >
                <el-option label="每一天" value="0"></el-option>
                <el-option
                  v-for="(day, index) in weekZh"
                  :key="index"
                  :label="'每周' + day"
                  :value="index + 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- 会议时间 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item label="起始时间" prop="startTime">
                <el-time-select
                  v-model="applyForm.startTime"
                  :picker-options="{
                    start: '06:00',
                    step: '00:05',
                    end: '22:50',
                    maxTime: applyForm.endTime
                  }"
                  class="full-width"
                  placeholder="选择起始时间"
                ></el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="结束时间" prop="endTime">
                <el-time-select
                  v-model="applyForm.endTime"
                  :picker-options="{
                    start: '06:05',
                    step: '00:05',
                    end: '22:55',
                    minTime: applyForm.startTime
                  }"
                  class="full-width"
                  placeholder="选择结束时间"
                ></el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 审批人 -->
          <el-form-item
            v-if="auditors.length > 0"
            label="审批人"
            prop="auditor"
          >
            <el-select
              v-model="applyForm.auditor"
              class="full-width"
              placeholder="请选择审批人"
            >
              <el-option
                v-for="(auditor, index) in auditors"
                :key="index"
                :label="auditor.userName"
                :value="auditor.userNum"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="validateAndSubmit('applyForm')">
          申 请
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HallApplyForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roomInfo: {
      type: Object,
      default() {
        return null
      }
    },
    isBatch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: false,
      curRoomInfo: null,
      orgStartTime: '',
      orgEndTime: '',
      applyForm: {
        meetingName: '',
        userNum: this.$store.state.user.userNum,
        hostName: '',
        phone: '',
        curHall: '',
        organizer: '',
        meetingType: '',
        meetingNumber: '',
        leader: [],
        participant: '',
        provide: [],
        meetingContent: '',
        remarks: '',
        funds: '',
        date: [],
        weekday: null,
        startTime: '',
        endTime: '',
        auditor: ''
      },
      allLeaders: false,
      meetingTypeOptions: {
        上课: 0,
        会议: 1,
        报告: 2,
        开题: 3,
        答辩: 4
      },
      meetingTypeOptionsArr: ['上课', '会议', '报告', '开题', '答辩'],
      weekZh: ['一', '二', '三', '四', '五', '六', '日'],
      username: this.$store.state.user.name,
      leaders: [],
      auditors: [],
      applyFormRules: {
        meetingName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' }
        ],
        hostName: [
          { required: true, message: '请输入主持人名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        organizer: [
          { required: true, message: '请输入承办单位', trigger: 'blur' }
        ],
        meetingType: [
          { required: true, message: '请选择会议类型', trigger: 'change' }
        ],
        meetingNumber: [
          { required: true, message: '请输入会议人数', trigger: 'blur' },
          {
            pattern: /^[0-9]+$/,
            message: '人数需要是大于0的数字',
            trigger: 'blur'
          }
        ],
        meetingContent: [
          { required: true, message: '请输入主要内容', trigger: 'blur' }
        ],
        funds: [
          {
            required: true,
            message: '请选择是否有专项经费支持',
            trigger: 'change'
          }
        ],
        curHall: [
          { required: true, message: '请选择报告厅', trigger: 'change' }
        ],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        weekday: [
          { required: true, message: '请选择借用天数', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择起始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        auditor: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    colNum() {
      return document.body.clientWidth > 375 ? 12 : 24
    },
    width() {
      return document.body.clientWidth > 375 ? '510px' : '90vw'
    },
    curHall() {
      return this.applyForm.curHall
    }
  },
  watch: {
    allLeaders() {
      this.applyForm.leader = []
    },
    curHall() {
      this.getAuditor()
    }
  },
  mounted() {
    this.getLeaders()
    this.initApplyForm()
    if (this.roomInfo !== null) {
      this.getAuditor()
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.$emit('refresh')
    },
    initApplyForm() {
      // 如果没有传roomInfo，说明是要批量预定，这里获取所有报告厅的列表
      if (this.roomInfo === null) {
        this.$axios
          .get('/auditorium')
          .then((response) => {
            this.curRoomInfo = response.data
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
      } else if (this.roomInfo['originInfo'] !== undefined) {
        // 修改
        this.isEdit = true
        const originInfo = this.roomInfo['originInfo']
        originInfo['funds'] = String(originInfo['funds'])
        // 校领导数组
        const originLeaders = originInfo['leaderStr'].split(',')
        if (originLeaders.length === this.leaders.length) {
          this.allLeaders = true
        } else {
          originInfo['leader'] = originInfo['leaderStr'].split(',')
          originInfo['leader'].pop()
        }
        // 提供服务
        const originProvide = originInfo['provideStr'].split(',')
        originProvide.pop()
        originInfo['provide'] = originProvide
        this.applyForm = originInfo
        this.applyForm.meetingType =
          this.meetingTypeOptionsArr[this.roomInfo.meetingType] ||
          this.roomInfo.meetingType
        this.orgStartTime = this.roomInfo.originInfo.startTime
        this.orgEndTime = this.roomInfo.originInfo.endTime
      }
    },
    getLeaders() {
      this.$axios
        .get('/leader')
        .then((successResponse) => {
          this.leaders = successResponse.data
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
    getAuditor() {
      const data = {}
      if (this.roomInfo === null) {
        data.buildingID = this.curRoomInfo[0].id
        data.roomName = this.curHall
      } else {
        data.buildingID = this.roomInfo.building.id
        data.roomName = this.roomInfo.roomName
      }
      this.$axios
        .post('/getAuditor', data)
        .then((successResponse) => {
          this.auditors = successResponse.data
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
    validateAndSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        valid = true
        if (valid) {
          const data = Object.assign({}, this.applyForm)
          if (this.roomInfo !== null) {
            // 普通借用
            data.buildingID = this.roomInfo.building.id
            data.roomName = this.roomInfo.roomName
            data.date = this.$options.filters['formatDate'](this.roomInfo.date)
          } else {
            // 批量借用
            data.buildingID = this.curRoomInfo[0].id
            data.roomName = this.curHall
            data.startDate = this.$options.filters['formatDate'](data.date[0])
            data.endDate = this.$options.filters['formatDate'](data.date[1])
          }
          data.meetingType = this.meetingTypeOptions[data.meetingType]
          if (this.allLeaders) {
            data.leader = this.leaders
          }
          if (this.isEdit) {
            data.ID = this.applyForm.id
          }
          this.submit(data)
        } else {
          this.$message({
            showClose: true,
            message: '请填写所需信息',
            type: 'warning',
            duration: 1500,
            offset: 80
          })
          return false
        }
      })
    },
    submit(data) {
      let url
      if (this.isBatch) {
        url = this.isEdit ? '/updateMultiRecord' : '/addMultiRecord'
      } else {
        url = this.isEdit ? '/updateRecord' : '/addRecord'
      }
      this.$axios
        .post(url, data)
        .then((successResponse) => {
          if (successResponse.data === true) {
            // 申请成功
            this.$message({
              showClose: true,
              message: this.isEdit ? '修改成功' : '申请成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
            this.close()
          } else {
            // 时间段有重合
            this.$message({
              showClose: true,
              message: '所选时间段已经被占用',
              type: 'error',
              duration: 1500,
              offset: 80
            })
            this.applyForm.startTime = ''
            this.applyForm.endTime = ''
          }
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
    }
  }
}
</script>

<style scoped>
.apply-dialog >>> .el-dialog__body {
  padding: 1rem 1.6rem 1rem 0.8rem;
}

.apply-dialog >>> .el-dialog {
  margin-top: 8vh !important;
}

.full-width {
  width: 100% !important;
}

.leaders-container {
  display: flex;
}

.leaders-container .full-width {
  margin-right: 15px;
}
</style>
