<template>
  <div>
    <el-dialog
      title="教育科学学院会议室申请"
      class="apply-dialog"
      :visible.sync="visible"
      :width="width"
      center
      :before-close="close"
      :close-on-click-modal="false"
    >
      <div>
        <!-- 申请会议室的表单 -->
        <el-form :model="applyForm" :rules="applyFormRules" ref="applyForm" label-width="80px">
          <!-- 会议名称 -->
          <el-form-item label="会议名称" prop="meetingName">
            <el-input v-model="applyForm.meetingName"></el-input>
          </el-form-item>
          <!-- 申请人和主持人 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item label="申请人" prop="userName">
                <el-input v-model="userName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="主持人" prop="hostName">
                <el-input v-model="applyForm.hostName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 承办单位 -->
          <el-form-item label="承办单位" prop="organizer">
            <el-input v-model="applyForm.organizer"></el-input>
          </el-form-item>
          <!-- 会议类型和会议人数 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item label="会议类型" prop="meetingType">
                <el-select class="full-width" v-model="applyForm.meetingType" placeholder="请选择会议类型">
                  <el-option value="上课"></el-option>
                  <el-option value="会议"></el-option>
                  <el-option value="报告"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="会议人数" prop="meetingNumber">
                <el-input type="number" v-model="applyForm.meetingNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 会议内容 -->
          <el-form-item label="会议内容" prop="meetingContent">
            <el-input type="textarea" v-model="applyForm.meetingContent" :autosize="{ minRows: 2 }"></el-input>
          </el-form-item>
          <!-- 会议室和日期 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item label="楼宇" prop="buildingID">
                <el-select
                  class="full-width"
                  v-model="applyForm.buildingID"
                  placeholder="请选择楼宇"
                  ref="curBuilding"
                  @change="setCurBuilding">
                  <el-option
                    v-for="(building, index) in buildings"
                    :key="index"
                    :label="building.name"
                    :value="building.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item label="会议室" prop="roomName">
                <el-select
                  class="full-width"
                  v-model="applyForm.roomName"
                  placeholder="请选择会议室"
                  no-data-text="请先选择楼宇">
                  <el-option
                    v-for="(room, index ) in curBuilding.room"
                    :key="index"
                    :value="room.roomName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 日期 -->
          <el-form-item prop="date" label="起止日期">
            <el-date-picker
              class="full-width"
              v-model="applyForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="起始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <!-- 每周几 -->
          <el-form-item prop="weekday" label="借用天数">
            <el-radio-group class="full-width week-radio" v-model="applyForm.weekday" v-if="false">
              <el-radio-button
                v-for="(day, index) in weekZh"
                :key="index"
                :label="index + 1">
                每周{{ day }}
              </el-radio-button>
            </el-radio-group>
            <el-select class="full-width" v-model="applyForm.weekday" placeholder="请选择" v-else>
              <el-option label="每一天" value="0"></el-option>
              <el-option
                v-for="(day, index) in weekZh"
                :key="index"
                :label="'每周' + day"
                :value="index + 1">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 会议时间 -->
          <el-row>
            <el-col :span="colNum">
              <el-form-item prop="startTime" label="起始时间">
                <el-time-select
                  class="full-width"
                  placeholder="选择起始时间"
                  v-model="applyForm.startTime"
                  :picker-options="{
                    start: '06:00',
                    step: '00:05',
                    end: '22:50',
                    maxTime: applyForm.endTime
                  }"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="colNum">
              <el-form-item prop="endTime" label="结束时间">
                <el-time-select
                  class="full-width"
                  placeholder="选择结束时间"
                  v-model="applyForm.endTime"
                  :picker-options="{
                    start: '06:05',
                    step: '00:05',
                    end: '22:55',
                    minTime: applyForm.startTime
                  }"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 审批人 -->
          <el-form-item label="审批人" prop="auditor" v-if="auditors.length > 0">
            <el-select
              class="full-width"
              v-model="applyForm.auditor"
              placeholder="请选择审批人"
              no-data-text="请先选择楼宇和会议室">
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
        <el-button type="primary" @click="validateAndSubmit('applyForm')">申 请</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ApplyForm',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roomInfo: {
      type: Object,
      default () {
        return null
      }
    }
  },
  mounted () {
    // 如果state为空就获取
    if (this.$store.state.buildings.length === 0) {
      this.getAllRoom()
    } else {
      this.saveBuildingAndRoom()
    }
    this.initApplyForm()
  },
  computed: {
    curRoomName () {
      return this.applyForm.roomName
    },
    colNum () {
      return document.body.clientWidth > 375 ? 12 : 24
    },
    width () {
      return document.body.clientWidth > 375 ? '510px' : '90vw'
    }
  },
  watch: {
    curRoomName () {
      this.getAuditor()
    }
  },
  data () {
    return {
      isEdit: false,
      buildings: [],
      applyForm: {
        meetingName: '',
        userNum: this.$store.state.user.userNum,
        hostName: '',
        organizer: '',
        meetingType: '',
        meetingNumber: '',
        meetingContent: '',
        buildingID: '',
        roomName: '',
        date: [],
        weekday: null,
        startTime: '',
        endTime: '',
        auditor: ''
      },
      curBuilding: {},
      weekZh: ['一', '二', '三', '四', '五', '六', '日'],
      meetingTypeOptions: {
        '上课': 0,
        '会议': 1,
        '报告': 2,
        '开题': 3,
        '答辩': 4
      },
      meetingTypeOptionsArr: ['上课', '会议', '报告', '开题', '答辩'],
      userName: this.$store.state.user.name,
      auditors: [],
      applyFormRules: {
        meetingName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' }
        ],
        hostName: [
          { required: true, message: '请输入主持人名称', trigger: 'blur' }
        ],
        organizer: [
          { required: true, message: '请输入承办单位', trigger: 'blur' }
        ],
        meetingType: [
          { required: true, message: '请选择会议类型', trigger: 'change' }
        ],
        meetingNumber: [
          { required: true, message: '请输入会议人数', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '人数需要是大于0的数字', trigger: 'blur' }
        ],
        meetingContent: [
          { required: true, message: '请输入会议内容', trigger: 'blur' }
        ],
        buildingID: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        roomName: [
          { required: true, message: '请选择会议室', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
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
  methods: {
    close () {
      this.$emit('update:visible', false)
      this.$emit('close')
      this.$emit('refresh')
    },
    getAllRoom () {
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
      let buildings = [...this.$store.state.buildings]
      buildings.forEach((building, index, buildings) => {
        if (building.id === 29) {
          buildings.splice(index, 1)
        }
      })
      this.buildings = buildings
    },
    initApplyForm () {
      if (this.roomInfo !== null) {
        // 修改
        this.isEdit = true
        this.applyForm = this.roomInfo
        this.applyForm.meetingType = this.meetingTypeOptionsArr[this.roomInfo.meetingType] || this.roomInfo.meetingType
        this.applyForm.date = []
        this.applyForm.date[0] = new Date(this.roomInfo.startDate)
        this.applyForm.date[1] = new Date(this.roomInfo.endDate)
      }
    },
    getAuditor () {
      this.$axios
        .post('/getAuditor', {
          buildingID: this.applyForm.buildingID,
          roomName: this.applyForm.roomName
        })
        .then(successResponse => {
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
    setCurBuilding (building) {
      this.applyForm.roomName = ''
      for (let i = 0; i < this.buildings.length; i++) {
        if (this.buildings[i].id === building) {
          this.curBuilding = this.buildings[i]
          break
        }
      }
    },
    validateAndSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, this.applyForm)
          data.startDate = this.$options.filters['formatDate'](data.date[0])
          data.endDate = this.$options.filters['formatDate'](data.date[1])
          data.meetingType = this.meetingTypeOptions[data.meetingType]
          // data.buildingID = this.roomInfo.building.id
          // data.roomName = this.roomInfo.roomName
          // data.date = this.$options.filters['formatDate'](this.roomInfo.date)
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
    submit (data) {
      let url = this.isEdit ? '/updateMultiRecord' : '/addMultiRecord'
      this.$axios
        .post(url, data)
        .then(successResponse => {
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

.week-radio {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.week-radio >>> span {
  width: 100%;
}
</style>
