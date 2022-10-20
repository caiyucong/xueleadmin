<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户昵称">
        <el-input v-model="searchObj.nickname" placeholder="用户昵称" />
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-input v-model="searchObj.teacherName" placeholder="用户昵称" />
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="fetchData()"
      >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称" width="200" />
      <el-table-column prop="mobile" label="用户手机">
        <template slot-scope="scope">
          {{
            scope.row.mobile === '' || scope.row.mobile === null
              ? '未绑定'
              : scope.row.mobile
          }}
        </template>
      </el-table-column>
      <el-table-column prop="courseTitle" label="购买课程" width="130" />
      <el-table-column prop="teacherName" label="课程讲师" width="100" />
      <el-table-column label="课程价格" width="100">
        <template slot-scope="scope">
          {{ scope.row.totalFee }}￥
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="160" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import order from '@/api/edu/order'
export default {
  name: 'Paylist',

  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {
        nickname: '',
        status: 1 // 默认查询已支付的
      } // 查询条件
    }
  },

  mounted() {
    this.fetchData()
    // 初始化分类列表
    this.initSubjectList()
  },

  methods: {
    fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      console.log('加载列表')
      this.page = page
      this.listLoading = true
      order
        .getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          // debugger 设置断点调试
          if (response.success === true) {
            this.list = response.data.rows
            this.total = response.data.total
          }
          this.listLoading = false
        })
    },
    resetData() {
      this.searchObj = { status: 1 } // 默认查询已支付的
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
