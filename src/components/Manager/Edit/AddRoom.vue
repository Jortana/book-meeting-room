<template>
  <el-form
    ref="addForm"
    :model="addForm"
    :rules="addRules"
    :show-message="false"
    class="add-form"
  >
    <el-form-item prop="roomName" class="input-cell narrow-cell">
      <el-input
        v-model="addForm.roomName"
        size="medium"
        placeholder="房间号"
      ></el-input>
    </el-form-item>
    <el-form-item prop="explain" class="input-cell">
      <el-input
        v-model="addForm.explain"
        size="medium"
        placeholder="设备描述"
      ></el-input>
    </el-form-item>
    <el-form-item prop="capacity" class="input-cell narrow-cell">
      <el-input v-model="addForm.capacity" size="medium">
        <span slot="suffix" class="sup">人</span>
      </el-input>
    </el-form-item>
    <el-form-item prop="auditor" class="input-cell">
      <el-button
        :class="redBorder ? 'red-border' : ''"
        size="medium"
        plain
        @click="showEditAuditor"
      >
        <span v-if="addForm.auditor.length !== 0">
          <span v-for="(auditor, index) in addForm.auditor" :key="index">
            <span v-if="index !== 0">，</span>
            {{ auditor.userName }}
          </span>
        </span>
        <span v-else>点击选择管理员</span>
      </el-button>
    </el-form-item>
    <el-form-item prop="picture" class="input-cell img-cell">
      <el-upload
        :limit="1"
        :show-file-list="false"
        :before-upload="getFile"
        action=""
      >
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
      :redBorder.sync="redBorder"
    ></audit-edit>
  </el-form>
</template>

<script>
import AuditEdit from './AuditEdit'
export default {
  name: 'AddRoom',
  components: {
    AuditEdit
  },
  props: {
    isAdding: Boolean,
    buildingID: Number
  },
  data() {
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
          {
            pattern: /^[0-9]+$/,
            message: '人数需要是大于0的数字',
            trigger: 'blur'
          }
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
  computed: {
    auditorLength() {
      return this.addForm.auditor.length
    }
  },
  watch: {
    auditorLength() {
      this.redBorder = this.addForm.auditor.length === 0
    }
  },
  mounted() {
    this.getAllAuditor()
  },
  methods: {
    close() {
      this.$emit('update:isAdding', false)
    },
    getAllAuditor() {
      this.$axios
        .get('/getAllAuditor')
        .then((successResponse) => {
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
    getFile(file) {
      this.addForm.img = file
      return false
    },
    validateRoom(formName) {
      this.redBorder = this.addForm.auditor.length === 0
      this.$refs[formName].validate((valid) => {
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
    addRoom() {
      const headers = { 'Content-Type': 'multipart/form-data' }
      const data = new FormData()
      const {
        buildingID,
        roomName,
        explain,
        capacity,
        auditor,
        img
      } = this.addForm
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
        .then((successResponse) => {
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
    showEditAuditor() {
      this.auditEditVisible = true
    }
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
  border-color: #f56c6c;
}

.input-cell .el-input {
  max-width: 75%;
}

@media only screen and (max-width: 768px) {
  .add-form >>> * {
    font-size: 0.8rem;
  }

  .add-form {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-cell .el-button {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
