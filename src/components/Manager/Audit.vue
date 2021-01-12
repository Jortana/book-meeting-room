<template>
  <main>
    <h2>会议室预定审核</h2>
    <el-tabs
      class="type-tab"
      v-model="curRecordType"
      type="card"
    >
      <el-tab-pane
        :lazy="true"
        v-for="(recordType, index) in recordTypes"
        :key="index"
        :label="recordType.label"
        :name="recordType.value"
      >
        <div class="record-table">
          <audit-table :recordType="curRecordType"></audit-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script>
import AuditTable from './Audit/AuditTable'
export default {
  name: 'Audit',
  data () {
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
  methods: {
  },
  components: {
    AuditTable
  }
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
