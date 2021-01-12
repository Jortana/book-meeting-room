<template>
  <el-dialog
    :title="room === '' ? '添加房间' : '修改房间'"
    :visible.sync="visible"
    width="30%"
    :modal="true"
    class="left-align"
    :before-close="closeRoomForm"
    :close-on-click-modal="false">
    <el-form
      :model="roomForm"
      label-position="top"
      :rules="roomRules"
      ref="roomForm"
      v-loading="loading"
    >
      <el-form-item prop="roomName">
        <label>房间号</label>
        <el-input v-model="roomForm.roomName" auto-complete="off" :disabled="room!==''"></el-input>
      </el-form-item>
      <el-form-item prop="capacity">
        <label>可容纳人数</label>
        <el-input type="number" v-model="roomForm.capacity" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="explain">
        <label>设备</label>
        <el-input v-model="roomForm.explain" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="auditor">
        <label>负责人</label>
        <el-input v-model="roomForm.auditor" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="img">
        <label>图片</label>
        <el-upload
          ref="upload"
          action="http://localhost:8443/api/updateImage"
          :limit="1"
          :file-list="img"
          list-type="picture"
          :auto-upload="false"
          :on-change="setImgFile">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1个jpg/png文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeRoomForm">取 消</el-button>
      <el-button type="primary" @click="editRoom('roomForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditRoom',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    room: {
      type: String,
      default: ''
    },
    buildingID: {
      type: Number
    },
    info: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      roomForm: {
        roomName: this.room,
        buildingID: this.buildingID,
        capacity: this.info === null ? '' : this.info.capacity,
        explain: this.info === null ? '' : this.info.explain,
        auditor: this.info === null ? '' : this.info.auditor
      },
      roomRules: {
        roomName: [
          { required: true, message: '请填写房间号', trigger: 'change' },
          { type: 'string', pattern: '[0-9]', message: '请正确填写房间号', trigger: 'change' }
        ],
        capacity: [
          { required: true, message: '请填写可容纳人数', trigger: 'change' }
        ],
        auditor: [
          { required: true, message: '请填写该教室负责人', trigger: 'change' }
        ]
      },
      img: []
    }
  },
  methods: {
    closeRoomForm () {
      this.$emit('update:visible', false)
    },
    editRoom (roomForm) {
      if (this.roomForm.explain === '') {
        this.roomForm.explain = '无'
      }
      this.$refs[roomForm].validate((valid) => {
        let url = 'updateRoom'
        if (valid) {
          this.loading = true
          // 构造FormData
          let data = new FormData()
          for (let key in this.roomForm) {
            data.append(key, this.roomForm[key])
          }
          data.append('img', this.roomForm.imgFile)
          let config = {
            // 添加请求头
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$axios
            .post(url, data, config)
            .then(successResponse => {
              this.loading = false
              if (successResponse.data === true) {
                this.$message({
                  showClose: true,
                  message: this.room === '' ? '添加成功' : '修改成功',
                  type: 'success',
                  duration: 1500,
                  offset: 80
                })
                this.closeRoomForm()
                this.$router.go(0)
              } else {
                this.$message({
                  showClose: true,
                  message: '添加失败，请联系管理员',
                  type: 'error',
                  duration: 1500,
                  offset: 80
                })
                this.roomForm.roomName = ''
              }
            })
            .catch(failResponse => {
              this.$message({
                showClose: true,
                message: '服务器无响应',
                type: 'error',
                duration: 1500,
                offset: 80
              })
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    setImgFile (file) {
      this.roomForm.imgFile = file.raw
    }
  }
}
</script>

<style scoped>

</style>
