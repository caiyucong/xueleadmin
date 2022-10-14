<template>
  <div>
    <h2 style="text-align: center">发布课程</h2>
    <el-steps :space="1000" :active="2" align-center finish-status="success">
      <el-step title="填写基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <div class="publishDiv">
      <el-row>
        <el-col :span="13">
          <div class="block">
            <el-image
              :src="data.cover"
              :preview-src-list="images"
              class="myImageStyle"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
        </el-col>
        <el-col :span="11">
          <div>
            <h2>{{ data.title }}</h2>
            <p>
              <span>共{{ data.lessonNum }}课时</span>
            </p>
            <p>
              <span>所属分类：{{ data.subjectParent }}—{{ data.subject }}</span>
            </p>
            <p>
              <span>课程讲师：{{ data.teacher }}</span>
            </p>
            <h2 style="color: red">￥{{ data.price }}</h2>
            <router-link :to="'/course/chapter/' + courseId">
              <el-button type="primary" plain>返回修改</el-button>
            </router-link>
            <el-button type="primary" @click="publish">提交课程</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
  data() {
    return {
      images: ['/static/LOGO.gif'],
      data: {
        title: '标题',
        lessonNum: 0,
        subject: 'Java',
        subjectParent: '后端开发',
        teacher: '老师',
        price: '10.00',
        cover: '/static/LOGO.gif'
      },
      courseId: ''
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.init()
    }
  },
  methods: {
    async init() {
      const { data: data } = await course.getPublish(this.courseId)
      this.data = data.data
      this.data.price = data.data.price.toFixed(2)
    },
    async publish() {
      console.log(this.courseId)
      const { success: flag } = await course.publish(this.courseId)
      if (flag) {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.$router.push({ path: `/course/` })
      } else {
        this.$Message.error({
          content: '发布失败',
          duration: 1.5
        })
      }
    }
  }
}
</script>

<style>
.publishDiv {
  border: black 2px Dashed;
  background-color: rgb(236, 236, 236);
  border-radius: 4px;
  width: 65%;
  margin: 0px auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
}
.myImageStyle {
  width: 460px;
  height: 270px;
}
</style>
