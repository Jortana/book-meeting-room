<template>
  <el-dialog
    :visible.sync="visible"
    :before-close="close"
    :close-on-click-modal="false"
    title="选择管理员"
    width="650px"
    center
  >
    <div class="transfer">
      <el-transfer
        v-model="newAuditor"
        :data="transferAllAuditor"
        :titles="['所有管理员', '已选择管理员']"
      ></el-transfer>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="updateAuditor">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    auditor: Array,
    allAuditor: Array,
    redBorder: Boolean
  },
  data() {
    const transferAllAuditor = []
    const newAuditor = []
    this.allAuditor.forEach((auditor, index) => {
      transferAllAuditor.push({
        label: auditor.userName + ' ' + auditor.userNum,
        key: index,
        userNum: auditor.userNum
      })
      this.auditor.forEach((existAuditor) => {
        if (existAuditor.userNum === auditor.userNum) {
          newAuditor.push(index)
        }
      })
    })
    return {
      transferAllAuditor: transferAllAuditor,
      newAuditor: newAuditor
    }
  },
  methods: {
    close() {
      if (this.newAuditor.length === 0) {
        this.$emit('update:redBorder', true)
      }
      this.$emit('update:visible', false)
    },
    updateAuditor() {
      const updateAuditor = []
      this.newAuditor.forEach((index) => {
        updateAuditor.push(this.allAuditor[index])
      })
      this.$emit('update:auditor', updateAuditor)
      this.close()
    }
  }
}
</script>

<style scoped>
.transfer {
  margin-left: 10px;
}
</style>
