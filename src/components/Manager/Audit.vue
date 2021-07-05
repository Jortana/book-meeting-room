<template>
  <main>
    <h2>会议室预定审核</h2>
    <el-tabs v-model="curRecordType" class="type-tab" type="card">
      <el-tab-pane
        v-for="(recordType, index) in recordTypes"
        :lazy="true"
        :key="index"
        :label="recordType.label"
        :name="recordType.value"
      >
        <div class="record-table">
          <audit-table :recordType="curRecordType"></audit-table>
        </div>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="报告厅" name="hall">
        <hall-audit-table></hall-audit-table>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script>
import AuditTable from './Audit/AuditTable'
import HallAuditTable from './Audit/HallAuditTable'
export default {
  name: 'Audit',
  components: {
    AuditTable,
    HallAuditTable
  },
  data() {
    return {
      recordTypes: [
        {
          label: '普通预定审核',
          value: 'normal'
        },
        {
          label: '批量预定审核',
          value: 'batch'
        }
      ],
      curRecordType: 'normal'
    }
  },
  methods: {}
}
</script>

<style scoped>
.type-tab {
  margin-right: 2rem;
}

.type-tab >>> .el-tabs__header {
  margin: 0;
}
</style>
