<template>
  <el-form
    class="add-form"
    :model="addForm"
    :rules="addRules"
    :show-message="false"
    ref="addForm">
    <el-form-item prop="roomName" class="input-cell narrow-cell">
      <el-input size="medium" v-model="addForm.roomName" placeholder="房间号"></el-input>
    </el-form-item>
    <el-form-item prop="explain" class="input-cell">
      <el-input size="medium" v-model="addForm.explain" placeholder="设备描述"></el-input>
    </el-form-item>
    <el-form-item prop="capacity" class="input-cell narrow-cell">
      <el-input size="medium" v-model="addForm.capacity"><span slot="suffix" class="sup">人</span></el-input>
    </el-form-item>
    <el-form-item prop="auditor" class="input-cell">
      <el-button :class="redBorder ? 'red-border' : ''" size="medium" plain @click="showEditAuditor">
        <span v-if="addForm.auditor.length !== 0">
          <span
            v-for="(auditor, index) in addForm.auditor"
            :key="index">
            <span v-if="index !== 0">，</span>{{ auditor.userName }}
          </span>
        </span>
        <span v-else>点击选择管理员</span>
      </el-button>
    </el-form-item>
    <el-form-item prop="picture" class="input-cell img-cell">
      <el-upload
        action=""
        :limit="1"
        :show-file-list="false"
        :before-upload="getFile">
        <el-button size="medium" plain>点击选择图片</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item prop="picture" class="input-cell">
      <el-button size="mini" type="primary" @click="validateRoom('addForm')">
        确认添加
      </el-button>
      <el-button size="mini" type="primary" plain @click="close">
        取消
      </el-button>
    </el-form-item>
    <!-- 管理员选择器 -->
    <audit-edit
      v-if="auditEditVisible"
      :visible.sync="auditEditVisible"
      :auditor.sync="addForm.auditor"
      :allAuditor="allAuditor"
      :redBorder.sync="redBorder">
    </audit-edit>
  </el-form>
</template>

<script>
import AuditEdit from './AuditEdit'
export default {
  name: 'AddRoom',
  props: {
    isAdding: Boolean,
    buildingID: Number
  },
  mounted () {
    this.getAllAuditor()
  },
  watch: {
    auditorLength () {
      this.redBorder = this.addForm.auditor.length === 0
    }
  },
  computed: {
    auditorLength () {
      return this.addForm.auditor.length
    }
  },
  data () {
    return {
      addForm: {
        buildingID: this.buildingID,
        roomName: '',
        explain: '',
        capacity: '',
        auditor: [],
        img: ''
      },
      addRules: {
        roomName: [
          { required: true, message: '请填写房间号', trigger: 'blur' }
        ],
        explain: [
          { required: true, message: '请填写设备描述', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请填写可容纳人数', trigger: 'blur' },
          { pattern: /^[0-9]+$/, message: '人数需要是大于0的数字', trigger: 'blur' }
        ],
        auditor: [
          { required: true, message: '请选择管理员', trigger: 'change' }
        ]
      },
      auditEditVisible: false,
      allAuditor: [],
      redBorder: false
    }
  },
  methods: {
    close () {
      this.$emit('update:isAdding', false)
    },
    getAllAuditor () {
      this.$axios
        .get('/getAllAuditor')
        .then(successResponse => {
          this.allAuditor = successResponse.data
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
    getFile (file) {
      this.addForm.img = file
      return false
    },
    validateRoom (formName) {
      this.redBorder = this.addForm.auditor.length === 0
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRoom()
        } else {
          this.$message({
            showClose: true,
            message: '请至少填写完整红框中的表单',
            type: 'warning',
            duration: 1500,
            offset: 80
          })
          return false
        }
      })
    },
    addRoom () {
      let headers = { 'Content-Type': 'multipart/form-data' }
      let data = new FormData()
      let { buildingID, roomName, explain, capacity, auditor, img } = this.addForm
      data.append('buildingID', String(buildingID))
      data.append('roomName', roomName)
      data.append('explain', explain)
      data.append('capacity', capacity)
      data.append('auditor', JSON.stringify(auditor))
      if (img !== '') {
        data.append('img', img)
      }
      this.$axios({
        method: 'POST',
        url: '/addRoom',
        headers: headers,
        data: data
      })
        .then(successResponse => {
          console.log(successResponse.data)
          if (successResponse.data === true) {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
            setTimeout(() => {
              this.$router.go(0)
            }, 100)
          } else {
            this.$message({
              showClose: true,
              message: '添加失败',
              type: 'error',
              duration: 1500,
              offset: 80
            })
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '服务器错误',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
    },
    showEditAuditor () {
      this.auditEditVisible = true
    }
  },
  components: {
    AuditEdit
  }
}
</script>

<style scoped>
.input-cell {
  margin: 0 auto;
  min-width: 130px;
  width: 75%;
}

.input-cell >>> input {
  text-align: center;
}

.narrow-cell {
  min-width: 100px;
  width: 4vw;
}

.sup {
  margin-left: 5px;
  margin-right: 5px;
}

.red-border {
  border-color: #F56C6C;
}
</style>
