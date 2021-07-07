<template>
  <div v-if="isEditing === false">
    <div class="cell">{{ curRoomInfo.roomName }}</div>
    <div class="cell">{{ curRoomInfo.explain }}</div>
    <div class="cell">{{ curRoomInfo.capacity }}人</div>
    <div class="cell">
      <span v-for="(auditor, index) in curRoomInfo.auditor" :key="index">
        <span v-if="index !== 0">，</span>
        {{ auditor.userName }}
      </span>
    </div>
    <div class="cell">
      <el-popover
        v-if="curRoomInfo['picture'] !== null"
        ref="img"
        placement="top"
        width="300"
        trigger="click"
      >
        <div class="img">
          <img
            :src="curRoomInfo['picture']"
            :alt="curRoomInfo['picture'].split('/').pop()"
          />
        </div>
      </el-popover>
      <span v-popover:img>
        {{ curRoomInfo['picture'] !== null ? '查看图片' : '无' }}
      </span>
    </div>
    <div class="lg-cell">
      <el-button
        v-if="curRoomInfo['ban'] === 0"
        size="mini"
        type="danger"
        plain
        @click="banRoom(1)"
      >
        禁用
      </el-button>
      <el-button v-else size="mini" type="success" plain @click="banRoom(0)">
        启用
      </el-button>
      <el-button size="mini" type="primary" plain @click="isEditing = true">
        修改信息
      </el-button>
      <el-button
        size="mini"
        type="danger"
        plain
        @click="confirmDeleteVisible = true"
      >
        删除
      </el-button>
    </div>
    <!-- 确认删除的dialog -->
    <el-dialog
      :visible.sync="confirmDeleteVisible"
      title="确认删除吗"
      width="30%"
      class="notification-container"
      center
    >
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="confirmDeleteVisible = false">
          取 消
        </el-button>
        <el-button size="medium" type="danger" @click="removeRoom">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
  <el-form
    v-else
    ref="editForm"
    :model="editForm"
    :rules="editRules"
    :show-message="false"
    class="edit-form"
  >
    <el-form-item prop="roomName" class="input-cell narrow-cell">
      <el-button size="medium" plain disabled>
        {{ editForm.roomName }}
      </el-button>
    </el-form-item>
    <el-form-item prop="explain" class="input-cell">
      <el-input v-model="editForm.explain" size="medium"></el-input>
    </el-form-item>
    <el-form-item prop="capacity" class="input-cell narrow-cell">
      <el-input v-model.number="editForm.capacity" size="medium">
        <span slot="suffix" class="sup">人</span>
      </el-input>
    </el-form-item>
    <el-form-item prop="auditor" class="input-cell">
      <el-button
        v-if="editForm.auditor.length > 0"
        size="medium"
        plain
        @click="showAuditEdit"
      >
        <span v-for="(auditor, index) in editForm.auditor" :key="index">
          <span v-if="index !== 0">，</span>
          {{ auditor.userName }}
        </span>
      </el-button>
      <el-button v-else size="medium" plain @click="showAuditEdit">
        点击设置管理员
      </el-button>
    </el-form-item>
    <el-form-item prop="picture" class="input-cell img-cell">
      <el-upload
        :http-request="uploadImg"
        :limit="1"
        :show-file-list="false"
        action=""
      >
        <el-button size="medium" plain>
          {{
            curRoomInfo['picture'] !== null ? '点击修改图片' : '点击上传图片'
          }}
        </el-button>
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
      :allAuditor="allAuditor"
    ></audit-edit>
  </el-form>
</template>

<script>
import AuditEdit from './AuditEdit'
export default {
  name: 'RoomTableRow',
  components: {
    AuditEdit
  },
  props: {
    roomInfo: {
      type: Object,
      default() {
        return null
      }
    },
    index: Number
  },
  data() {
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
          {
            pattern: /^[0-9]+$/,
            message: '人数需要是大于0的数字',
            trigger: 'blur'
          }
        ]
      },
      auditEditVisible: false,
      confirmDeleteVisible: false
    }
  },
  computed: {
    changedRoomInfo() {
      return this.roomInfo
    }
  },
  watch: {
    isEditing(isEditing) {
      if (isEditing === true && this.allAuditor.length === 0) {
        this.getAllAuditor()
      }
    },
    roomInfo: {
      handler(newRoomInfo) {
        this.curRoomInfo = newRoomInfo
      },
      deep: true
    }
  },
  methods: {
    removeRoom() {
      this.$axios
        .post('/delRoom', {
          ID: this.roomInfo.id
        })
        .then((successResponse) => {
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
    validateEdit(formName) {
      const { capacity, explain, auditor } = this.editForm
      if (
        capacity === this.curRoomInfo.capacity &&
        explain === this.curRoomInfo.explain &&
        auditor === this.curRoomInfo.auditor
      ) {
        this.isEditing = false
        return true
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const roomInfo = {
            ID: this.curRoomInfo.id,
            capacity: this.editForm.capacity,
            explain: this.editForm.explain,
            auditor: this.editForm.auditor
          }
          this.$axios
            .post('/updateRoom', roomInfo)
            .then((successResponse) => {
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
            message: '请填写红框中的内容',
            type: 'warning',
            duration: 1500,
            offset: 80
          })
          return false
        }
      })
      this.isEditing = false
    },
    showAuditEdit() {
      this.auditEditVisible = true
    },
    uploadImg(param) {
      const headers = { 'Content-Type': 'multipart/form-data' }
      const data = new FormData()
      data.append('ID', this.curRoomInfo.id)
      data.append('file', param.file)
      this.$axios({
        method: 'POST',
        url: '/updateImage',
        headers: headers,
        data: data
      })
        .then((successResponse) => {
          if (successResponse.data.success === true) {
            // this.curRoomInfo = this.changedRoomInfo
            const roomInfo = Object.assign({}, this.editForm)
            roomInfo.picture = successResponse.data.url
            this.$emit('updateRoom', roomInfo, this.index)
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
              message: '图片过大，上传失败',
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
    banRoom(ban) {
      this.$axios
        .post('/ban', {
          id: this.roomInfo.id,
          ban: ban
        })
        .then((successResponse) => {
          if (successResponse.data === true) {
            const roomInfo = this.roomInfo
            roomInfo['ban'] = ban
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
    }
  }
}
</script>

<style scoped>
.cell:first-child {
  display: grid;
}

.cell {
  display: flex;
  /*flex-direction: column;*/
  justify-content: center;
  align-items: center;
}

.input-cell {
  margin: 0 auto;
  min-width: 130px;
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

.wide-cell {
  min-width: 150px !important;
}

.lg-cell {
  min-width: 260px !important;
}

.edit-form {
  display: flex;
}

.edit-form div {
  flex: 1;
}

.row {
  justify-content: center;
  align-items: center;
}

.input-cell .el-input {
  max-width: 75%;
}

.input-cell .el-button {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

@media only screen and (max-width: 768px) {
  .edit-form >>> * {
    font-size: 0.8rem;
  }

  .notification-container >>> .el-dialog {
    width: 90% !important;
  }

  .notification-container >>> .el-dialog__header {
    padding-top: 3rem;
  }

  .notification-container >>> .el-dialog__body {
    padding-top: 0;
  }
}
</style>
