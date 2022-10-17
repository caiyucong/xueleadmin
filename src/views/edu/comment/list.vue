<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="commentQuery.nickname" placeholder="用户昵称" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="commentQuery.teacherId" clearable placeholder="课程讲师">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="commentQuery.courseId" clearable placeholder="课程名称">
          <el-option v-for="course in courseList" :key="course.id" :label="course.title" :value="course.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="commentQuery.begin" :picker-options="pickerOptions" type="datetime" placeholder="选择日期时间" align="right" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="commentQuery.end" :picker-options="pickerOptions" type="datetime" placeholder="选择截止时间" align="right" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" width="170" />
      <el-table-column prop="courseTitle" label="评论课程" width="260" />
      <el-table-column prop="teacherName" label="课程讲师" width="120" />
      <el-table-column prop="content" label="评论内容" width="359" />
      <el-table-column prop="gmtCreate" label="评论时间" width="200" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page="page" :page-sizes="pageSizes" :page-size="limit" :total="total" style="padding: 30px 0; text-align: center;" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>
<script>
// 引入comment.js文件
import commentApi from '@/api/edu/comment'
import teacherApi from '@/api/edu/teacher'
import courseApi from '@/api/edu/course'
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      list: [], // 数据列表
      page: 1, // 当前页
      limit: 5, // 每页记录数
      total: 0, // 总页数
      pageSizes: [5, 15, 25, 30], // 每页记录数集合
      commentQuery: {}, // 条件封装对象
      teacherList: [],
      courseList: []
    }
  },
  // 钩子函数
  created() {
    this.getList()
    this.getTeacherList()
    this.getCourseList()
  },
  methods: {
    // 待条件的分页查询讲师信息
    getList() {
      commentApi.getPageList(this.page, this.limit, this.commentQuery)
        .then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
    },
    // 初始化讲师
    getTeacherList() {
      teacherApi.getAll().then(response => {
        this.teacherList = response.data.list
      })
    },
    // 初始化课程
    getCourseList() {
      courseApi.getCourseList().then(response => {
        this.courseList = response.data.items
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    // 清空条件搜索框
    resetData() {
      this.commentQuery = {}
      this.getList()
    },
    // 删除评论的方法
    removeDataById(id) {
      // 消息提示框
      this.$confirm('此操作将永久删除评论记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确认，执行方法
        // 调用删除的方法
        commentApi.deleteCommentById(id).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          // 刷新页面数据
          this.getList()
        })
      }).catch(() => { })
    }
  }
}
</script>
