<template>
  <main>
    <h2>发送通知</h2>
    <div class="main-container">
      <div class="select-container">
        <el-cascader-panel
          v-model="selectedUsers"
          :options="users"
          :props="{ multiple: true }">
        </el-cascader-panel>
      </div>
      <div class="message-container">
        <el-input
          type="textarea"
          placeholder="请输入信息内容"
          v-model="message">
        </el-input>
      </div>
<!--      {{ selectedUsers }}-->
    </div>
    <div class="send-button">
      <el-button
        type="primary"
        size="medium"
        :loading="sendLoading"
        @click="sendMessage"
      >
        <span v-if="sendLoading === false">发送</span>
        <span v-else>发送中</span>
      </el-button>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Message',
  mounted () {
    this.getAllUser()
  },
  data () {
    return {
      users: [],
      selectedUsers: [],
      message: '',
      sendLoading: false
    }
  },
  methods: {
    getAllUser () {
      this.$axios({
        method: 'GET',
        url: '/getByDepartment'
      })
        .then(response => {
          let users = response.data.map(users => {
            // console.log(users)
            return {
              value: users['departmentID'],
              label: users['departmentName'],
              children: users['userList'].map(user => {
                return {
                  value: user['userNum'],
                  label: user['username']
                }
              })
            }
          })
          this.users = users
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '服务器无响应',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
    },
    sendMessage () {
      if (this.selectedUsers.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择要通知的人',
          type: 'warning',
          duration: 1500,
          offset: 80
        })
        return
      } else if (this.message === '') {
        this.$message({
          showClose: true,
          message: '请输入信息内容',
          type: 'warning',
          duration: 1500,
          offset: 80
        })
        return
      }
      this.sendLoading = true
      let selectedUsers = []
      for (let users of this.selectedUsers) {
        selectedUsers.push(users[1])
      }
      this.$axios({
        method: 'POST',
        url: '/sendMes',
        data: {
          message: this.message,
          user: selectedUsers
        }
      })
        .then(response => {
          console.log(response)
          if (response.data.result > 0) {
            this.$message({
              showClose: true,
              message: '发送成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
            this.clearInfo()
          } else {
            this.$message({
              showClose: true,
              message: '发送失败',
              type: 'error',
              duration: 1500,
              offset: 80
            })
          }
          this.sendLoading = false
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '服务器无响应',
            type: 'error',
            duration: 1500,
            offset: 80
          })
          this.sendLoading = false
        })
    },
    clearInfo () {
      this.message = ''
      this.selectedUsers = []
    }
  }
}
</script>

<style scoped>
  .main-container {
    display: flex;
  }

  .select-container {
    /*width: 380px;*/
    /*min-width: 380px;*/
    /*max-width: 380px;*/
  }

  .message-container {
    margin-left: 1.2rem;
    margin-right: 1.6rem;
    width: 100%;
  }

  .message-container >>> .el-textarea,
  .message-container >>> textarea {
    height: 100%;
  }

  .send-button {
    margin-top: 1rem;
    text-align: right;
    margin-right: 1.6rem;
  }

  @media only screen and (max-width : 376px) {
    main {
      padding-left: 10px;
      padding-right: 10px;
    }

    .select-container {
      width: 350px;
      /*min-width: 380px;*/
      /*max-width: 380px;*/
    }

    .select-container >>> .el-cascader-panel {
      width: 315px;
    }

    .main-container {
      flex-direction: column;
    }

    .message-container {
      margin-left: 0;
      margin-right: 0;
      margin-top: 1rem;
      width: 100%;
      height: 200px;
    }

    .send-button {
      margin-right: 0;
    }
  }
</style>
