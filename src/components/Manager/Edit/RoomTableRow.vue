<template>
  <div v-if="isEditing === false">
    <div class="cell">{{ curRoomInfo.roomName }}</div>
    <div class="cell">{{ curRoomInfo.explain }}</div>
    <div class="cell">{{ curRoomInfo.capacity }}人</div>
    <div class="cell">
      <span
        v-for="(auditor, index) in curRoomInfo.auditor"
        :key="index">
        <span v-if="index !== 0">，</span>{{ auditor.userName }}
      </span>
    </div>
    <div class="cell">
      <el-popover
        v-if="curRoomInfo['picture'] !== null"
        placement="top"
        ref="img"
        width="300"
        trigger="hover">
        <div class="img">
          <img :src="curRoomInfo['picture']" :alt="curRoomInfo['picture'].split('/').pop()">
        </div>
      </el-popover>
      <span v-popover:img>{{ curRoomInfo['picture'] !== null ? curRoomInfo['picture'].split('/').pop() : '无' }}</span>
    </div>
    <div>
      <el-button size="mini" type="primary" plain @click="isEditing = true">修改信息</el-button>
      <el-button size="mini" type="danger" plain @click="confirmDeleteVisible = true">删除</el-button>
    </div>
    <!-- 确认删除的dialog -->
    <el-dialog
      title="确认删除吗"
      :visible.sync="confirmDeleteVisible"
      width="30%"
      center>
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button size="medium" @click="confirmDeleteVisible = false">取 消</el-button>
    <el-button size="medium" type="danger" @click="removeRoom">确 定</el-button>
  </span>
    </el-dialog>
  </div>
  <el-form
    v-else
    class="edit-form"
    :model="editForm"
    :rules="editRules"
    :show-message="false"
    ref="editForm">
    <el-form-item prop="roomName" class="input-cell narrow-cell">
      <el-button size="medium" plain disabled>
        {{ editForm.roomName }}
      </el-button>
    </el-form-item>
    <el-form-item prop="explain" class="input-cell">
      <el-input size="medium" v-model="editForm.explain"></el-input>
    </el-form-item>
    <el-form-item prop="capacity" class="input-cell narrow-cell">
      <el-input size="medium" v-model.number="editForm.capacity"><span slot="suffix" class="sup">人</span></el-input>
    </el-form-item>
    <el-form-item prop="auditor" class="input-cell">
      <el-button size="medium" plain @click="showAuditEdit">
        <span
          v-for="(auditor, index) in editForm.auditor"
          :key="index">
        <span v-if="index !== 0">，</span>{{ auditor.userName }}
      </span>
      </el-button>
    </el-form-item>
    <el-form-item prop="picture" class="input-cell img-cell">
        <el-upload
          class="upload-demo"
          action=""
          :http-request="uploadImg"
          :on-success="imgSuccessRes"
          :limit="1"
          :show-file-list="false">
          <el-button size="medium" plain>{{ curRoomInfo['picture'] !== null ? '点击修改图片' : '点击上传图片' }}</el-button>
        </el-upload>
    </el-form-item>
    <el-form-item prop="picture" class="input-cell">
      <el-button size="mini" type="primary" @click="validateEdit('editForm')">
        完成编辑
      </el-button>
      <el-button size="mini" type="primary" plain @click="isEditing = false">
        取消
      </el-button>
    </el-form-item>
    <!-- 管理员选择器 -->
    <audit-edit
      v-if="auditEditVisible"
      :visible.sync="auditEditVisible"
      :auditor.sync="editForm.auditor"
      :allAuditor="allAuditor">
    </audit-edit>
  </el-form>
</template>

<script>
import AuditEdit from './AuditEdit'
export default {
  name: 'RoomTableRow',
  props: {
    roomInfo: {
      type: Object,
      default () {
        return null
      }
    },
    index: Number
  },
  watch: {
    isEditing (isEditing) {
      if (isEditing === true && this.allAuditor.length === 0) {
        this.getAllAuditor()
      }
    },
    roomInfo: {
      handler (newRoomInfo) {
        this.curRoomInfo = newRoomInfo
      },
      deep: true
    }
  },
  data () {
    return {
      isEditing: false,
      curRoomInfo: this.roomInfo,
      editForm: {
        roomName: this.roomInfo.roomName,
        explain: this.roomInfo.explain,
        capacity: this.roomInfo.capacity,
        auditor: this.roomInfo.auditor
      },
      allAuditor: [],
      editRules: {
        capacity: [
          { pattern: /^[0-9]+$/, message: '人数需要是大于0的数字', trigger: 'blur' }
        ]
      },
      auditEditVisible: false,
      confirmDeleteVisible: false
    }
  },
  methods: {
    removeRoom () {
      this.$axios
        .post('/delRoom', {
          ID: this.roomInfo.id
        })
        .then(successResponse => {
          if (successResponse.data === true) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
          } else {
            this.$message({
              showClose: true,
              message: '删除失败，请联系管理员',
              type: 'error',
              duration: 1500,
              offset: 80
            })
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
      this.confirmDeleteVisible = false
      setTimeout(() => {
        this.$router.go(0)
      }, 100)
    },
    getAllAuditor () {
      this.$axios
        .get('/getAllAuditor')
        .then(successResponse => {
          console.log(successResponse.data)
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
    validateEdit (formName) {
      let { capacity, explain, auditor } = this.editForm
      if (capacity === this.curRoomInfo.capacity && explain === this.curRoomInfo.explain &&
        auditor === this.curRoomInfo.auditor) {
        this.isEditing = false
        return true
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let roomInfo = {
            ID: this.curRoomInfo.id,
            capacity: this.editForm.capacity,
            explain: this.editForm.explain,
            auditor: this.editForm.auditor
          }
          this.$axios
            .post('/updateRoom', roomInfo)
            .then(successResponse => {
              if (successResponse.data === true) {
                this.$emit('updateRoom', roomInfo, this.index)
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success',
                  duration: 1500,
                  offset: 80
                })
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败，请联系管理员',
                  type: 'error',
                  duration: 1500,
                  offset: 80
                })
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
        } else {
          this.$message({
            showClose: true,
            message: '服务器出错',
            type: 'error',
            duration: 1500,
            offset: 80
          })
          return false
        }
      })
      this.isEditing = false
    },
    showAuditEdit () {
      this.auditEditVisible = true
    },
    uploadImg (param) {
      let headers = { 'Content-Type': 'multipart/form-data' }
      let data = new FormData()
      data.append('ID', this.curRoomInfo.id)
      data.append('file', param.file)
      this.$axios({
        method: 'POST',
        url: '/updateImage',
        headers: headers,
        data: data
      })
        .then(successResponse => {
          console.log(successResponse.data)
          if (successResponse.data === true) {
            // this.$emit('updateRoom', {picture: }, this.index)
            this.$message({
              showClose: true,
              message: '上传成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
          } else {
            this.$message({
              showClose: true,
              message: '上传失败',
              type: 'error',
              duration: 1500,
              offset: 80
            })
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
    },
    imgSuccessRes (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    }
  },
  components: {
    AuditEdit
  }
}
</script>

<style scoped>
.cell:first-child {
  display: grid;
}

.cell {
  justify-content: center;
  align-content: center;
}

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

.img > img {
  width: 100%;
}
</style>
