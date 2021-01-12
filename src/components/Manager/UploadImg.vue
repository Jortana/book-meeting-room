<template>
  <el-dialog
    :title="firstUpdate === true ? '上传图片' : '修改图片'"
    :visible.sync="visible"
    width="30%"
    :modal="true"
    class="left-align"
    :before-close="closeImgForm">
    <el-upload
      ref="upload"
      action="http://223.2.48.121:8443/api/updateImage"
      :limit="1"
      :file-list="img"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传1个jpg/png文件</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeImgForm">取 消</el-button>
      <el-button type="primary" @click="upLoadImg">上 传</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'UploadImg',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    firstUpdate: {
      type: Boolean,
      default: true
    },
    buildingID: {
      type: Number
    },
    room: {
      type: String
    }
  },
  data () {
    return {
      img: [],
      imgUrl: ''
    }
  },
  methods: {
    closeImgForm () {
      this.$emit('update:visible', false)
    },
    upLoadImg () {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped>

</style>
