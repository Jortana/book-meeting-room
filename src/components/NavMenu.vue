<template>
  <div class="main">
    <div class="logo">
      <img src="../assets/logo_white.png" alt="logo" />
    </div>
    <div class="menu">
      <el-menu
        :default-active="curIndex"
        class="lg-menu"
        router
        mode="horizontal"
        text-color="#BBCDC3"
        background-color="#30694A"
        active-text-color="#FDCA00"
      >
        <el-menu-item
          v-for="(item, i) in navList"
          :key="i"
          :index="item.index"
          class="bold-border"
        >
          {{ item.name }}
        </el-menu-item>
        <el-submenu id="user" index="user">
          <template slot="title">
            <span class="sub-title">{{ user.name }}</span>
          </template>
          <el-menu-item class="sub-menu" @click="showChangePassword">
            修改密码
          </el-menu-item>
          <el-menu-item class="sub-menu" @click="showChangePhone">
            修改号码
          </el-menu-item>
          <el-menu-item class="sub-menu" @click="showLogOut">退出</el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- 菜单按钮 -->
      <div class="menu-icon" @click="toggleMenu"></div>
      <!-- ------ -->
      <!-- 移动版小菜单 -->
      <div class="hide-menu">
        <transition name="el-fade-in-linear">
          <el-dialog :visible.sync="menuVisible">
            <div
              v-for="nav in navList"
              :key="nav.index"
              class="hide-submenu"
              @click="jumpTo(nav.index)"
            >
              <span>{{ nav.name }}</span>
            </div>
            <div class="hide-submenu border-top" @click="showChangePassword">
              <span>修改密码</span>
            </div>
            <div class="hide-submenu" @click="showChangePhone">
              <span>修改号码</span>
            </div>
            <div class="hide-submenu" @click="showLogOut">
              <span>退出</span>
            </div>
          </el-dialog>
        </transition>
      </div>
      <!-- ---------- -->
      <!-- 确认退出的dialog -->
      <div class="operation">
        <el-dialog
          :visible.sync="logOutVisible"
          title="确认退出"
          width="28%"
          center
        >
          <span>确认退出吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="logOutVisible = false">取 消</el-button>
            <el-button type="primary" @click="logOut">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改密码的dialog -->
        <change-password
          v-if="changePasswordVisible"
          :visible.sync="changePasswordVisible"
        ></change-password>
        <!-- 修改手机号码的dialog -->
        <change-phone
          v-if="changePhoneVisible"
          :visible.sync="changePhoneVisible"
        ></change-phone>
      </div>
    </div>
  </div>
</template>

<script>
import ChangePassword from './User/ChangePassword'
import ChangePhone from './User/ChangePhone'
export default {
  name: 'NavMenu',
  components: {
    ChangePassword,
    ChangePhone
  },
  data() {
    const user = this.$store.state.user
    let navList = []
    if (user.isManager <= 1) {
      navList = [
        { index: '/borrow', name: '预定申请' },
        { index: '/audit', name: '预定审核' },
        { index: '/edit', name: '编辑教室' },
        { index: '/users', name: '用户管理' },
        // { index: '/message', name: '发送通知' },
        { index: '/record', name: '修改预定' }
      ]
    } else if (user.isManager === 2) {
      navList = [
        { index: '/borrow', name: '预定申请' },
        { index: '/record', name: '修改预定' }
      ]
    } else {
      navList = [{ index: '/borrow', name: '预定申请' }]
    }
    return {
      navList: navList,
      user: user,
      logOutVisible: false,
      changePasswordVisible: false,
      changePhoneVisible: false,
      menuVisible: false
    }
  },
  computed: {
    curIndex() {
      return this.$route.path
    }
  },
  methods: {
    showLogOut() {
      this.logOutVisible = true
    },
    logOut() {
      this.$store.commit('logOut')
      this.$router.go(0)
    },
    showChangePassword() {
      this.changePasswordVisible = true
    },
    showChangePhone() {
      this.changePhoneVisible = true
    },
    jumpTo(index) {
      this.menuVisible = false
      this.$router.push({
        path: index
      })
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible
    }
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
  position: relative;
}

.logo img {
  position: absolute;
  top: 0.5rem;
  left: 0;
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

@media only screen and (max-width: 1440px) {
  .lg-menu {
    display: none;
  }

  .menu-icon {
    width: 25px;
    height: 3px;
    border-top: 3px solid #fff;
    border-bottom: 3px solid #fff;
    padding: 5px 0;
    background-clip: content-box;
    background-color: #fff;
    position: absolute;
    right: 0.3rem;
    top: 1rem;
  }

  .hide-menu {
    position: relative;
  }

  .hide-menu >>> .el-dialog {
    width: 200px;
    margin-top: 1rem !important;
    margin-right: 1rem;
  }

  .hide-menu >>> .el-dialog__header {
    padding: 0;
  }

  .hide-menu >>> .el-dialog__body {
    padding: 10px 20px 10px;
  }

  .hide-menu >>> .el-dialog__close {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }

  .hide-submenu {
    color: #606266;
    font-size: 1.1rem;
    height: 2.5rem;
    line-height: 2.5em;
    cursor: pointer;
  }

  .border-top {
    margin-top: 0.2rem;
    border-top: 1px solid #e4e7ed;
  }
}

@media only screen and (max-width: 768px) {
  .operation >>> .el-dialog {
    width: 90% !important;
  }

  .operation >>> .el-dialog__header {
    padding-top: 3rem;
  }

  .operation >>> .el-dialog__body {
    padding-top: 0;
  }
}

@media only screen and (max-width: 376px) {
  .logo img {
    width: 90%;
  }

  /*.hide-submenu >>> .el-dialog {*/
  /*  width: 90%;*/
  /*}*/
}
</style>
