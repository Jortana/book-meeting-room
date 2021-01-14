<template>
  <div class="main">
    <div class="logo">
      <img src="../assets/logo_white.png" alt="logo">
    </div>
    <div class="menu">
    <el-menu
      :default-active="curIndex"
      router
      mode="horizontal"
      text-color="#BBCDC3"
      background-color="#30694A"
      active-text-color="#FDCA00">
      <el-menu-item class="bold-border" v-for="(item, i) in navList" :key="i" :index="item.index">
        {{ item.name }}
      </el-menu-item>
      <el-submenu index="user" id="user">
        <template slot="title"><span class="sub-title">{{ user.name }}</span></template>
        <el-menu-item class="sub-menu" @click="showChangePassword">修改密码</el-menu-item>
        <el-menu-item class="sub-menu" @click="showLogOut">退出</el-menu-item>
      </el-submenu>
      <!-- 确认退出的dialog -->
      <el-dialog
        title="确认退出"
        :visible.sync="logOutVisible"
        width="28%"
        center>
        <span>确认退出吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="logOutVisible = false">取 消</el-button>
          <el-button type="primary" @click="logOut">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改密码的dialog -->
      <change-password v-if="changePasswordVisible" :visible.sync="changePasswordVisible"></change-password>
    </el-menu>
    </div>
  </div>
</template>

<script>
import ChangePassword from './User/ChangePassword'
export default {
  name: 'NavMenu',
  computed: {
    curIndex () {
      return this.$route.path
    }
  },
  data () {
    let user = this.$store.state.user
    let navList = []
    if (user.isManager === false) {
      navList = [
        { index: '/borrow', name: '会议室预定申请' },
        { index: '/batch', name: '会议室批量预定' },
        { index: '/record', name: '我的记录' }
      ]
    } else if (user.isManager === true) {
      navList = [
        { index: '/borrow', name: '会议室预定申请' },
        { index: '/batch', name: '会议室批量预定' },
        { index: '/audit', name: '会议室预定审核' },
        { index: '/edit', name: '编辑教室' },
        { index: '/record', name: '我的记录' }
      ]
    }
    return {
      navList: navList,
      user: user,
      logOutVisible: false,
      changePasswordVisible: false
    }
  },
  methods: {
    showLogOut () {
      this.logOutVisible = true
    },
    logOut () {
      this.$store.commit('logOut')
      this.$router.go(0)
    },
    showChangePassword () {
      this.changePasswordVisible = true
    }
  },
  components: {
    ChangePassword
  }
}
</script>

<style scoped>
.main {
  position: relative;
  height: 7vh;
}

.menu {
  position: absolute;
  display: inline-block;
  right: 0;
}

.logo {
  position: absolute;
  top: 0.5rem;
  left: 0;
}

#user {
  /*float: right;*/
}

.el-menu > * {
  font-size: 1rem;
  font-weight: bold;
}

.sub-title {
  font-size: 1rem;
}

.sub-menu {
  font-size: 14px !important;
  font-weight: normal;
}
</style>
