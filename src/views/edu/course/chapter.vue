<template>
  <div>
    <h2 style="text-align: center">发布课程</h2>
    <el-steps :active="1" align-center finish-status="success">
      <el-step title="填写基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button
      type="primary"
      @click="dialogFormVisible = true"
    >添加章节</el-button
    >
    <ul v-for="l in list" :key="l.id" class="chanpterList">
      <li>
        <p>
          {{ l.title }}
          <span class="acts">
            <el-button
              type="text"
              @click="openDialog(l.id)"
            >添加小节</el-button
            >
            <el-button type="text" @click="editChapter(l.id)">编辑</el-button>
            <el-button type="text" @click="deleteChapter(l.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul v-for="v in l.videos" :key="v.id" class="chanpterList videoList">
          <li>
            <p>
              {{ v.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(v.id)">编辑</el-button>
                <el-button
                  type="text"
                  @click="deleteVideo(v.id)"
                >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <router-link :to="'/course/info/' + courseId">
      <el-button type="primary" plain>上一步</el-button>
    </router-link>
    <router-link :to="'/course/publish/' + courseId">
      <el-button type="primary">下一步</el-button>
    </router-link>

    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="(form.id ? '修改' : '添加') + '章节'"
    >
      <el-form ref="form" :model="form" :rules="formRules">
        <el-form-item
          :label-width="formLabelWidth"
          label="章节名称"
          prop="title"
        >
          <el-input v-model="form.title" autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="显示排序"
          prop="sort"
        >
          <el-input-number
            v-model="form.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('form')">取 消</el-button>
        <el-button type="primary" @click="addChapter">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisibleTow" title="添加小节">
      <el-form ref="formVideo" :model="formVideo" :rules="formVideoRules">
        <el-form-item
          :label-width="formLabelWidth"
          label="小节名称"
          prop="title"
        >
          <el-input v-model="formVideo.title" autocomplete="off" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="是否免费"
          prop="isFree"
        >
          <el-radio v-model="formVideo.isFree" :label="1">免费</el-radio>
          <el-radio v-model="formVideo.isFree" :label="0">收费</el-radio>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="显示排序"
          prop="sort"
        >
          <el-input-number
            v-model="formVideo.sort"
            :min="0"
            controls-position="right"
            pro
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="视频">
          <el-upload
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="handleSuccess"
            name="file"
            class="upload-demo"
            action="http://localhost:9520/eduvod/vod"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br >
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br >
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br >
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br >
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm('formVideo')">取 消</el-button>
        <el-button type="primary" @click="addVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data() {
    return {
      fileList: [],
      form: {
        id: undefined,
        title: '',
        sort: 0,
        courseId: ''
      },
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }]
      },
      formVideo: {
        id: undefined,
        title: '',
        sort: 0,
        isFree: 1,
        courseId: '',
        chapterId: '',
        videoSourceId: '',
        videoOriginalName: ''
      },
      formVideoRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        isFree: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      courseId: '',
      dialogFormVisible: false,
      dialogFormVisibleTow: false,
      formLabelWidth: '120px',
      list: []
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.form.courseId = this.courseId
      this.formVideo.courseId = this.courseId
      this.initUl()
    }
  },
  methods: {
    // 文件上传
    handleSuccess(req, file) {
      console.log(req)
      this.formVideo.videoSourceId = req.data.videoId
      this.formVideo.videoOriginalName = file.name
    },
    async handleRemove(file, fileList) {
      const { success: flag } = await video.deleteVideo(
        this.formVideo.videoSourceId
      )
      if (flag) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.formVideo.videoSourceId = ''
        this.formVideo.videoOriginalName = ''
        video.update(this.formVideo)
      }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件上传
    async initUl() {
      const { data: res } = await chapter.getList(this.courseId)
      this.list = res.list
    },
    async editVideo(id) {
      const { data: res } = await video.getById(id)
      this.dialogFormVisibleTow = true
      this.$nextTick(_ => {
        this.formVideo = res.video
        if (
          res.video.videoOriginalName != null &&
          res.video.videoOriginalName !== ''
        ) {
          this.fileList = [{ name: res.video.videoOriginalName }]
        }
      })
    },
    async deleteVideo(id) {
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { success: flag } = await video.delete(id)
        if (flag) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initUl()
        } else {
          this.$message({
            type: 'success',
            error: '删除成功!'
          })
        }
      })
    },
    async editChapter(id) {
      const { data: res } = await chapter.getById(id)
      this.dialogFormVisible = true
      this.$nextTick(_ => {
        this.form = res.chapter
      })
    },
    async deleteChapter(id) {
      this.$confirm('此操作将永久删除该小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { success: flag } = await chapter.delete(id)
        if (flag) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initUl()
        } else {
          this.$message({
            type: 'success',
            error: '删除成功!'
          })
        }
      })
    },
    addChapter() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.form.courseId = this.courseId
          if (this.form.id) {
            const { success: flag } = await chapter.update(this.form)
            if (flag) {
              this.$message.success('修改成功！')
              this.dialogFormVisible = false
              this.cancelForm('form')
              this.initUl()
            } else {
              this.$message.error('修改失败！')
            }
          } else {
            const { success: flag } = await chapter.save(this.form)
            if (flag) {
              this.$message.success('添加成功！')
              this.cancelForm('form')
              this.dialogFormVisible = false
              this.initUl()
            } else {
              this.$message.error('添加失败！')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async addVideo() {
      this.$refs['formVideo'].validate(async valid => {
        if (valid) {
          if (this.formVideo.id) {
            const { success: flag } = await video.update(this.formVideo)
            if (flag) {
              this.$message.success('修改成功')
              this.cancelForm('formVideo')
              this.dialogFormVisibleTow = false
              this.initUl()
            } else {
              this.$message.error('修改失败')
            }
          } else {
            const { success: flag } = await video.save(this.formVideo)
            if (flag) {
              this.$message.success('添加成功')
              this.cancelForm('formVideo')
              this.dialogFormVisibleTow = false
              this.initUl()
            } else {
              this.$message.error('添加失败')
            }
          }
        }
      })
    },
    openDialog(id) {
      this.dialogFormVisibleTow = true
      this.formVideo.courseId = this.courseId
      this.formVideo.chapterId = id
    },
    cancelForm(formName) {
      switch (formName) {
        case 'form':
          this.dialogFormVisible = false
          setTimeout(() => {
            this.form = {
              sort: 0
            }
          }, 200)
          break
        case 'formVideo':
          this.dialogFormVisibleTow = false
          setTimeout(() => {
            this.formVideo = {
              sort: 0,
              isFree: 1
            }
            this.fileList = []
          }, 200)
          break
      }
    }
  }
}
</script>

<style>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
