<template>
  <!-- 修改密码的dialog -->
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    width="28%"
    :before-close="close"
    :close-on-click-modal="false"
    center>
    <el-form
      class="password-form"
      :model="passwordForm"
      :rules="passwordRules"
      ref="passwordForm"
      label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="passwordForm.checkPassword" auto-complete="off"></el-input>
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
  data () {
    let checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    let noSamePassword = (rule, value, callback) => {
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
    close () {
      this.$emit('update:visible', false)
    },
    changePassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            userNum: this.$store.state.user.userNum,
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          }
          this.$axios
            .post('/changePwd', data)
            .then(successResponse => {
              console.log(successResponse.data)
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
