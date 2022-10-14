<template>
  <div>
    <h2 style="text-align: center">发布课程</h2>
    <el-steps :active="0" align-center finish-status="success">
      <el-step title="填写基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="课程标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="课程讲师" clearable prop="teacherId">
        <el-select v-model="form.teacherId" placeholder="请选择">
          <el-option
            v-for="item in teachers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程分类" prop="subject">
        <el-cascader
          v-model="form.subject"
          :options="subjectList"
          :props="{
            expandTrigger: 'hover',
            children: 'children',
            label: 'title',
            value: 'id'
          }"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="总课时" prop="lessonNum">
        <el-input-number
          v-model="form.lessonNum"
          :min="1"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="课程简介" prop="description">
        <tinymce v-model="form.description" />
      </el-form-item>
      <el-form-item label="课程价格" prop="price">
        <el-input-number
          v-model="form.price"
          :min="0"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="课程封面" prop="cover">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          action="http://localhost:9520/eduoss/upload"
        >
          <img v-if="form.cover" :src="form.cover" class="myCoverStyle" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('form')"
        >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import course from '@/api/edu/course'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      form: {
        title: '',
        lessonNum: 1,
        description: '',
        price: 0,
        teacherId: '',
        cover: '/static/default-img.gif',
        subjectId: '',
        subjectParentId: '',
        subject: []
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        lessonNum: [{ required: true, message: '请输入课时', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        teacherId: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur'
          }
        ],
        subject: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      teachers: [],
      subjectList: []
    }
  },
  watch: {
    $route(to, from) {
      this.$refs['form'].resetFields()
      this.$set(this.form, 'cover', '/static/default-img.gif')
    }
  },
  created() {
    this.initOptions()
    if (this.$route.params && this.$route.params.id) {
      this.getById(this.$route.params.id)
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.$route.params && this.$route.params.id) {
            this.form.id = this.$route.params.id
            const { data: res } = await course.update(this.form)
            if (res.courseId > 0) {
              this.$message.success('修改成功！')
              this.$router.push({ path: `/course/chapter/${res.courseId}` })
            }
          } else {
            const { data: res } = await course.add(this.form)
            if (res.courseId > 0) {
              this.$message.success('添加成功！')
              this.$router.push({ path: `/course/chapter/${res.courseId}` })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async initOptions() {
      const { data: res } = await teacher.getAll()
      this.teachers = res.list
      const { data: res2 } = await subject.getList()
      this.subjectList = res2.list
    },
    handleChange(val) {
      this.form.subjectParentId = val[0]
      this.form.subjectId = val[1]
    },
    handleAvatarSuccess({ data }, file) {
      this.$set(this.form, 'cover', data.url)
    },
    beforeAvatarUpload(file) {
      this.$set(this.form, 'cover', '')
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPng) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPng) && isLt2M
    },
    async getById(id) {
      const { data: res } = await course.getById(id)
      this.form = res.course
      this.form.subject = []
      this.form.subject[0] = res.course.subjectParentId
      this.form.subject[1] = res.course.subjectId
    }
  }
}
</script>

<style>
.tinymce-container {
  line-height: 29px;
}
.myCoverStyle {
  height: 357;
  width: 640;
}
</style>
