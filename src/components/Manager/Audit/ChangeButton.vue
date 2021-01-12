<template>
  <el-button size="mini" :type="type" :loading="loading" @click="changeState">{{ content }}</el-button>
</template>

<script>
export default {
  name: 'ChangeButton',
  props: {
    type: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    record: {
      type: Object,
      default () {
        return null
      }
    },
    state: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    changeState () {
      let record = this.record
      this.loading = true
      let url = record.date !== undefined ? '/changeRecordState' : '/changeMultiRecState'
      this.$axios
        .post(url, {
          ID: record.id,
          state: this.state
        })
        .then(successResponse => {
          console.log(successResponse.data)
          if (successResponse.data === true) {
            this.$message({
              showClose: true,
              message: '操作成功',
              type: 'success',
              duration: 1500,
              offset: 80
            })
          } else {
            this.$message({
              showClose: true,
              message: '服务器错误',
              type: 'error',
              duration: 1500,
              offset: 80
            })
          }
          this.$emit('getRecords', this.page)
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
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>

<style scoped>

</style>
