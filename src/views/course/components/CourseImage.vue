<template>
  <div class="course-image">
    <el-progress
      v-if="isUpdloading"
      type="circle"
      :percentage="percentage"
      :width ="178"
      :status="percentage === 100 ? 'success' : undefined"
    />
    <!--
    upload 上传文件组件，它支持自动上传，你只需要把上传需要参数配置一下就可以了
    -->
    <!--
    1. 组件需要根据绑定的数据进行图片预览
    2. 组件需要把上传成功的图片地址同步到绑定的数据中
    v-model 的本质还是父子组件通信
      1. 它会给子组件传递一个名字叫 value 的数据（Props）
      2. 默认监听 input 事件，修改绑定的数据（自定义事件）
    -->
    <el-upload
      v-else
      class="avatar-uploader"
      action=""
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request ="handleUpload">
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { uploadCourseImage } from '@/services/course'
export default Vue.extend({
  name: 'CourseImage',
  data () {
    return {
      isUpdloading: false,
      percentage: 0
    }
  },
  props: {
    value: {
      type: String
    }
  },
  methods: {
    beforeAvatarUpload (file: any) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async handleUpload (options: any) {
      this.isUpdloading = true
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await uploadCourseImage(fd, e => {
        this.percentage = Math.floor(e.loaded / e.total * 100)
      })
      this.percentage = 0
      this.isUpdloading = false
      this.$emit('input', data.data.name)
      console.log(data)
    }
  }
})
</script>

<style lang='scss' scoped>

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
