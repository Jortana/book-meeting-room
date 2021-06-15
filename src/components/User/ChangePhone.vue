<template>
  <!-- 修改电话号码的dialog -->
  <el-dialog
    title="修改手机号码"
    :visible.sync="visible"
    width="28%"
    :before-close="close"
    :close-on-click-modal="false"
    center>
    <el-form
      class="phone-form"
      :model="phoneForm"
      :rules="phoneRules"
      ref="passwordForm"
      label-width="80px">
      <el-form-item label="新号码" prop="phone">
        <el-input v-model="phoneForm.phone" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="changePhone('passwordForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChangePhone',
  props: {
    visible: Boolean
  },
  data () {
    return {
      phoneForm: {
        phone: ''
      },
      phoneRules: {
        phone: [
          { required: true, message: '请填写手机号码', trigger: 'blur' },
          { pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/, message: '请正确填写手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    changePhone (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            userNum: this.$store.state.user.userNum,
            phone: this.phoneForm.phone
          }
          this.$axios
            .post('/changeContact', data)
            .then(successResponse => {
              if (successResponse.data === true) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success',
                  duration: 1500,
                  offset: 80
                })
                setTimeout(() => {
                  this.$router.go(0)
                }, 80)
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
        } else {
          this.$message({
            showClose: true,
            message: '请正确填写所需信息',
            type: 'warning',
            duration: 1500,
            offset: 80
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
