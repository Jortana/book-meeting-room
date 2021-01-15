<template>
  <main>
    <h2>编辑楼宇和教室</h2>
    <el-tabs
      class="building-tab"
      v-model="curBuildingID"
      type="card"
      v-loading="buildingLoading"
      @tab-remove="showConfirm"
    >
      <el-tab-pane
        :lazy="true"
        v-for="(building, index) in buildings"
        :key="index"
        :label="building.name"
        :name="String(building.id)"
        closable>
        <!-- 教室列表 -->
        <room-table :building.sync="building" @getNewRoomInfo="getAllRoom"></room-table>
      </el-tab-pane>
      <!-- 添加楼宇的panel和表单 -->
      <el-tab-pane name="add">
        <span slot="label"><i class="el-icon-circle-plus"></i></span>
        <el-form class="add-building" :model="addBuildingForm" :rules="addBuildingRules" ref="ruleForm" :inline="true" label-width="100px">
          <el-form-item label="建筑名称" prop="buildingName">
            <el-input v-model="addBuildingForm.buildingName"></el-input>
          </el-form-item>
          <el-button type="primary" @click="addBuilding('ruleForm')">添加建筑</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 确认删除建筑的dialog -->
    <el-dialog
      title="确认删除"
      :visible.sync="confirmVisible"
      width="28%"
      center>
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="confirmVisible = false">取 消</el-button>
          <el-button type="primary" @click="removeBuilding">确 定</el-button>
        </span>
    </el-dialog>
  </main>
</template>

<script>
import RoomTable from './Edit/RoomTable'
export default {
  name: 'Edit',
  created () {
    // 如果state为空就获取
    if (this.$store.state.buildings.length === 0) {
      this.getAllRoom()
    } else {
      this.saveBuildingAndRoom()
    }
  },
  data () {
    return {
      buildings: [],
      buildingLoading: false,
      curBuildingID: '',
      addBuildingForm: {
        buildingName: ''
      },
      addBuildingRules: {
        buildingName: [
          { required: true, message: '请输入建筑名称', trigger: 'blur' }
        ]
      },
      removeBuildingID: '',
      confirmVisible: false
    }
  },
  methods: {
    getAllRoom () {
      this.buildingLoading = true
      // 获取所有的建筑和房间号
      this.$axios
        .get('/getAllRoom')
        .then(successResponse => {
          this.$store.commit('saveBuildings', successResponse.data)
          this.saveBuildingAndRoom()
        })
        .catch(() => {
        })
      this.buildingLoading = false
    },
    saveBuildingAndRoom () {
      this.buildings = this.$store.state.buildings
      if (this.curBuildingID === '0' || this.curBuildingID === '') {
        this.curBuildingID = String(this.buildings[0].id)
      }
    },
    addBuilding (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post('/addBuilding', this.addBuildingForm)
            .then(successResponse => {
              if (successResponse.data.success === true) {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success',
                  duration: 1500,
                  offset: 80
                })
                this.getAllRoom()
                this.curBuildingID = String(successResponse.data.buildingID)
                this.$refs[formName].resetFields()
              } else {
                this.$message({
                  showClose: true,
                  message: '建筑已存在',
                  type: 'error',
                  duration: 1500,
                  offset: 80
                })
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
            message: '请填写建筑信息',
            type: 'warning',
            duration: 1500,
            offset: 80
          })
        }
      })
    },
    showConfirm (buildingID) {
      this.removeBuildingID = buildingID
      this.confirmVisible = true
    },
    removeBuilding () {
      this.$axios
        .post('/delBuilding', {
          buildingID: this.removeBuildingID
        })
        .then(successResponse => {
          if (successResponse.data === true) {
            this.$router.go(0)
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
            message: '服务器无响应',
            type: 'error',
            duration: 1500,
            offset: 80
          })
        })
    }
  },
  components: {
    RoomTable
  }
}
</script>

<style scoped>
.building-tab {
  margin-right: 2rem;
}

.building-tab >>> .el-tabs__header {
  margin: 0;
}

.el-icon-circle-plus {
  color: #409EFF;
}

.add-building {
  margin-top: 1rem;
}
</style>
