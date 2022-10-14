<template>
  <div>
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.status" placeholder="状态" clearable>
          <el-option label="发布" value="Normal" />
          <el-option label="未发布" value="Draft" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" stripe>
      <el-table-column prop="id" label="序号" />
      <el-table-column prop="title" label="名称" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status == 'Normal' ? '发布' : '未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" />
      <el-table-column prop="gmtCreate" label="添加时间" />
      <el-table-column prop="buyCount" label="浏览数量" />
      <el-table-column label="操作" width="230px">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button size="mini" icon="el-icon-edit-outline">信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button size="mini" icon="el-icon-edit-outline">大纲</el-button>
          </router-link>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="current"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
  data() {
    return {
      list: [],
      courseQuery: {},
      total: 0,
      current: 1,
      pageSize: 5
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    onSubmit() {},
    async initTable() {
      const { data: res } = await course.page(
        this.current,
        this.pageSize,
        this.courseQuery
      )
      this.list = res.records
      this.total = res.total
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange(val) {
      this.current = val
      this.initTable()
    },
    async handleDelete(index, row) {
      const isDelete = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (isDelete === 'confirm') {
        const { success: flag } = await course.logicDelete(row.id)
        if (flag) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.initTable()
        } else {
          this.$Message.error({
            content: '删除失败',
            duration: 1.5
          })
        }
      }
    }
  }
}
</script>

<style></style>
