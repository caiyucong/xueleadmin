<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-tag
        ><i class="el-icon-download" />
        <a href="/static/test.xlsx">点击下载模板</a></el-tag
        >
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :before-upload="beforeExcelUpload"
          :on-success="uploadSuccess"
          :auto-upload="false"
          class="upload-demo"
          drag
          action="http://localhost:9520/eduservice/subject"
          multiple
          name="multipartFile"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传Excel文件
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    beforeExcelUpload(file) {
      const isExcelt =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcelt) {
        this.$message.error('请上传Excel表格')
      }
      return isExcelt
    },
    onSubmit() {
      this.$refs.upload.submit()
    },
    uploadSuccess() {
      this.$message.success('上传成功！')
      this.$router.push({ path: '/subject/table' })
    }
  }
}
</script>

<style>
.line {
  text-align: center;
}
</style>
