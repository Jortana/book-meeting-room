<template>
  <main>
    <h2>用户管理</h2>
    <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
    <el-table
      :data="users"
      class="user-table">
      <el-table-column
        prop="userNum"
        label="工号">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        label="用户类型">
        <template slot-scope="scope">
          <span v-if="scope.row.isManager === 1">管理员</span>
          <span v-else-if="scope.row.isManager === 0">普通用户</span>
          <span v-else>物业管理人员</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button
            v-popover:removeConfirm
            size="mini"
            type="danger"
            @click="showConfirm(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 确认删除用户的的dialog -->
    <el-dialog
      title="确认删除"
      :visible.sync="confirmVisible"
      width="28%"
      center>
      <span>确认退出吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="confirmVisible = false">取 消</el-button>
          <el-button type="primary" @click="removeUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 添加用户的表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserVisible"
      width="28%"
      center>
      <el-form
        class="password-form"
        :model="addUserForm"
        :rules="addUserRules"
        ref="passwordForm"
        label-width="80px">
        <el-form-item label="工号" prop="userNum">
          <el-input v-model="addUserForm.userNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addUserForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select class="full-width" v-model="addUserForm.userType" placeholder="请选择用户类型">
            <el-option
              v-for="type in userTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser('passwordForm')">确 定</el-button>
        </span>
    </el-dialog>
  </main>
</template>

<script>
export default {
  name: 'Users',
  created () {
    this.getAllUser()
  },
  data () {
    return {
      users: [],
      confirmVisible: false,
      curUser: {},
      addUserVisible: false,
      addUserForm: {},
      userTypes: [
        { label: '普通用户', value: 0 },
        { label: '管理员', value: 1 },
        { label: '物业管理人员', value: 2 }
      ],
      addUserRules: {
        userNum: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getAllUser () {
      this.$axios
        .get('/getAllUser')
        .then(successResponse => {
          this.users = successResponse.data
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
    showConfirm (user) {
      this.confirmVisible = true
      this.curUser = user
    },
    removeUser () {
      this.$axios
        .post('/delUser', {
          userNum: this.curUser.userNum
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
            this.getAllUser()
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
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
      this.confirmVisible = false
    },
    addUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/addUser', {
              userNum: this.addUserForm.userNum,
              username: this.addUserForm.username,
              isManager: this.addUserForm.userType
            })
            .then(successResponse => {
              if (successResponse.data === true) {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success',
                  duration: 1500,
                  offset: 80
                })
                this.getAllUser()
                this.addUserVisible = false
                this.$refs[formName].resetFields()
              } else {
                this.$message({
                  showClose: true,
                  message: '用户已存在',
                  type: 'warning',
                  duration: 1500,
                  offset: 80
                })
                this.$refs[formName].resetFields()
              }
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
        } else {
          this.$message({
            showClose: true,
            message: '请填写完整表单',
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
main >>> thead {
  color: #000;
  font-size: 1rem;
}

.user-table {
  border-top: 1px solid #DCDFE6;
  margin-top: 1rem;
}

.full-width {
  width: 100%;
}
</style>
