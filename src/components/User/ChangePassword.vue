<template>
  <!-- 修改密码的dialog -->
  <el-dialog
    :visible.sync="visible"
    :before-close="close"
    :close-on-click-modal="false"
    title="修改密码"
    width="28%"
    center>
    <el-form
      ref="passwordForm"
      :model="passwordForm"
      :rules="passwordRules"
      class="password-form"
      label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" type="password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" type="password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="passwordForm.checkPassword" type="password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="changePassword('passwordForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChangePassword',
  props: {
    visible: Boolean
  },
  data() {
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    const noSamePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.passwordForm.oldPassword) {
        callback(new Error('新旧密码不能相同'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度要求为6-18位', trigger: 'blur' },
          { validator: noSamePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    changePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            userNum: this.$store.state.user.userNum,
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          }
          this.$axios
            .post('/changePwd', data)
            .then(successResponse => {
              if (successResponse.data === true) {
                this.$message({
                  showClose: true,
                  message: '修改成功，请重新登录',
                  type: 'success',
                  duration: 1500,
                  offset: 80
                })
                setTimeout(() => {
                  this.$store.commit('logOut')
                  this.$router.go(0)
                }, 80)
              } else {
                this.$message({
                  showClose: true,
                  message: '请检查旧密码是否正确',
                  type: 'error',
                  duration: 1500,
                  offset: 80
                })
                this.$refs[formName].resetFields()
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
