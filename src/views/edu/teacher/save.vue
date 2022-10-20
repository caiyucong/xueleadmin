<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="教师姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="教师排序" prop="sort">
        <el-input-number
          v-model="form.sort"
          :min="1"
          :max="10"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="讲师资历" prop="career">
        <el-input v-model="form.career" />
      </el-form-item>
      <el-form-item label="教师头衔" prop="level">
        <el-select v-model="form.level" placeholder="请选择教师头街">
          <el-option label="高级讲师" value="1" />
          <el-option label="首席讲师" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="教师简介" prop="intro">
        <el-input v-model="form.intro" type="textarea" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="http://localhost:9520/eduoss/upload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">{{
          form.id ? '修改' : '添加'
        }}</el-button>
        <el-button @click="onCancel('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'

export default {
  data() {
    return {
      form: {
        name: '',
        sort: '',
        career: '',
        level: '',
        intro: '',
        avatar: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入教师名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入简介', trigger: 'blur' },
          { max: 500, message: '长度最多500个字符', trigger: 'blur' }
        ],
        level: {
          required: true,
          message: '请选择',
          trigger: 'blur'
        },
        career: [{ required: true, message: '请输入资历', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route(to, from) {
      this.onCancel('form')
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id
      this.getInfo(id)
    }
  },
  methods: {
    async getInfo(id) {
      const { data } = await teacher.getById(id)
      this.form = data.teacher
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (!this.form.id) {
            const { success: success } = await teacher.saveTeacher(this.form)
            if (success) {
              this.$message.success('添加成功！')
              this.$router.push({ path: `/teacher/list/` })
            } else {
              this.$message.error('添加失败！')
            }
          } else {
            const { success: success } = await teacher.updateTeacher(this.form)
            if (success) {
              this.$message.success('修改成功！')
              this.$router.push({ path: `/teacher/list/` })
            } else {
              this.$message.error('修改失败！')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel(formName) {
      this.$refs[formName].resetFields()
      this.$set(this.form, 'avatar', undefined)
    },
    handleAvatarSuccess({ data }, file) {
      this.$set(this.form, 'avatar', data.url)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
