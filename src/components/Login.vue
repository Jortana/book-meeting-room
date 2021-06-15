<template>
  <div id="wrapper">
    <div id="main">
      <div id="login"  @keyup.enter="onSubmit('ruleForm')">
        <h2>会议室管理系统</h2>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
          <el-form-item class="a-left" prop="userNum">
            <label>学号/工号</label>
            <!--<input type="text" class="login-input" v-model="ruleForm.userNum">-->
            <el-input v-model="ruleForm.userNum"></el-input>
          </el-form-item>
          <el-form-item class="a-left" prop="password">
            <label>密码</label>
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item id="btn">
            <el-button type="primary" @click="onSubmit('ruleForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
let sha1 = require('js-sha1')
export default {
  name: 'Login',
  created () {
    if (window.sessionStorage.getItem('user' || '[]') !== null) {
      this.$router.replace({
        path: '/borrow'
      })
    }
  },
  data () {
    return {
      ruleForm: {
        userNum: '',
        password: ''
      },
      rules: {
        userNum: [
          { required: true, message: '请输入学号/工号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let password = sha1(this.ruleForm.password)
          this.$axios
            .post('/login', {
              userNum: this.ruleForm.userNum,
              password: password
            })
            .then(successResponse => {
              // console.log('a')
              let data = successResponse.data.data
              if (data['isLogin'] === true) {
                // 登录成功，进入borrow界面
                this.$store.commit('login', {
                  userNum: this.ruleForm.userNum,
                  name: data['username'],
                  phone: data['phone'],
                  email: data['email'],
                  isManager: data['isManager']
                })
                let path = this.$route.query.redirect
                this.$router.replace({
                  path: (path === '/' || path === undefined) ? '/borrow' : path
                })
              } else {
                alert('请检查用户名和密码')
                this.$router.go(0)
              }
            })
            .catch(() => {
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
#wrapper {
  margin: 0 auto;
}

#main {
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: url(../assets/background.jpg) no-repeat fixed;
  background-size: cover;
}

#login {
  color: #ffffff;
  display: flex;
  position: relative;
  width: 300px;
  height: 252px;
  flex-direction: column;
  padding: 40px 28px 36px;
  text-align: center;
  z-index: 2;
  background: inherit;
  border-radius: 18px;
  overflow: hidden;
}

#login::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  width: calc(100% + 20px);
  /* + 两边各有一个空格  否则 无效*/
  height: calc(100% + 20px);
  background: inherit;
  box-shadow: 0 0 0 200px rgba(255, 255, 255, .2) inset;
  z-index: -1;
  filter: blur(6px);
  overflow: hidden;
}

#login h2 {
  color: #fff;
  margin: -10px 0 0;
}

#login >>> input {
  background-color: transparent;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #dcdef6;
  padding: 2px;
  font-size: 1.2rem;
  height: 1.2rem;
  line-height: 1.2rem;
  color: #fff;
}

#login >>> .el-form-item__error {
  padding: 0;
  color: #ff8888;
}

.el-form-item {
  margin-bottom: 10px;
}

.a-left {
  text-align: left;
}

label {
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: -10px;
}

form {
  /*border: 1px solid #eaecef;*/
  /*border-radius: 5px;*/
  /*background-color: #f6f8fa;*/
  padding: 20px;
}

#btn {
  margin-top: 20px;
}

#btn >>> button {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
}

@media only screen and (max-width : 768px) {
  #login {
    margin: 0 2.5rem;
    padding-left: 10px;
    padding-right: 10px;
  }

  #footer {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
