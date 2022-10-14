<template>
  <div>
    <br >
    <!-- query begin -->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item label="教师名称">
        <el-input v-model="teacherQuery.name" placeholder="教师名称" />
      </el-form-item>
      <el-form-item label="教师头衔">
        <el-select
          v-model="teacherQuery.level"
          placeholder="教师头衔"
          clearable
        >
          <el-option label="高级讲师" value="1" />
          <el-option label="首席讲师" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker
            v-model="teacherQuery.gmtCreateBegin"
            type="datetime"
            placeholder="选择日期"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-col>
        <el-col :span="2" class="line">--------</el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="teacherQuery.gmtCreateEnd"
            type="datetime"
            placeholder="选择日期"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- query end -->
    <!-- table begin -->
    <el-table :data="list" style="width: 100%" stripe>
      <el-table-column prop="id" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="level" label="头衔">
        <template slot-scope="scope">
          {{ scope.row.level == 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column prop="career" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link
            :to="'/teacher/save/' + scope.row.id"
          ><el-button size="mini">编辑</el-button></router-link
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- table end -->
    <!-- pagination begin -->
    <el-pagination
      :current-page="current"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- pagination end -->
  </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
export default {
  data() {
    return {
      list: [],
      current: 1,
      pageSize: 10,
      teacherQuery: {
        name: '',
        gmtCreateBegin: '',
        gmtCreateEnd: '',
        level: ''
      },
      total: 0
    }
  },
  created() {
    this.initTable()
  },
  methods: {
    onSubmit() {
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
        const { res: success } = await teacher.deleteTeacher(row.id)
        if (success) {
          this.$message.success('删除成功！')
          this.initTable()
        } else {
          this.$message.success('删除失败！')
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange(val) {
      this.current = val
      this.initTable()
    },
    async initTable() {
      const { data: res } = await teacher.getList(
        this.current,
        this.pageSize,
        this.teacherQuery
      )
      this.list = res.records
      this.total = res.total
    }
  }
}
</script>

<style></style>
