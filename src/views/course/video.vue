<template>
  <div class="video-edit">
    <el-form :model="course" label-width="100px">
      <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="course.courseName"></el-input>
      </el-form-item>
      <el-form-item label="课程阶段" prop="lessonName">
          <el-input v-model="course.lessonName"></el-input>
      </el-form-item>
      <el-form-item label="课程课时" prop="courseName">
          <el-input v-model="course.courseName"></el-input>
      </el-form-item>
      <el-form-item label="视频">
          <input
            ref="video-file"
            type="file"
          >
        </el-form-item>
        <el-form-item label="封面">
          <input
            ref="image-file"
            type="file"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleUpload"
          >开始上传</el-button>
          <el-button>返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="isUpload">视频上传中: {{uploadPercent }}%</p>
          <p v-if="isUpLoadSuccess">视频转码中: {{isTransCodeSuccess ? '完成':'正在处理，请稍后' }}</p>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from 'vue'
import { getCourseById } from '@/services/course'
import axios from 'axios'
import { aliyunImagUploadAddressAdnAuth, aliyunVideoUploadAddressAdnAuth, transCodeVideo, getAliyunTransCodePercent } from '@/services/aliyun-oss'
export default Vue.extend({
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      course: {
      },
      uploader: null,
      videoId: null,
      imageUrl: '',
      fileName: '',
      uploadPercent: 0,
      isUpLoadSuccess: false,
      isTransCodeSuccess: false,
      isUpload: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.loadCourse()
    this.initUploader()
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.course = data.data
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
        userId: 1618139964448548,
        // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
        region: 'cn-shanghai',
        // 分片大小默认1M，不能小于100K
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          console.log('onUploadstarted', uploadInfo)
          // 1 通过我们的后端，获取上传凭证
          let uploadAddressAndAuth = null
          if (uploadInfo.isImage) {
            const { data } = await aliyunImagUploadAddressAdnAuth()
            console.log(data)
            this.imageUrl = data.data.imageURL
            uploadAddressAndAuth = data.data
          } else {
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl // 请确保一定是先上传图片
            })
            console.log(data)
            this.videoId = data.data.videoId
            uploadAddressAndAuth = data.data
          }
          // 2 调用UpLoader.setUploadAuthAndAddress设置上传凭证
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 3 设置好上传凭证,无问题时,才会有上传进度
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log('onUploadFailed', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUpLoadSuccess = true
          console.log('onUploadEnd', uploadInfo)
          console.log({
            lessonId: this.$route.query.lessonId,
            fileId: this.videoId,
            coverImageUrl: this.imageUrl,
            fileName: this.fileName
          })
          const { data } = await transCodeVideo({
            lessonId: this.$route.query.lessonId,
            fileId: this.videoId,
            coverImageUrl: this.imageUrl,
            fileName: this.fileName
          })
          console.log(data)

          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            console.log('转码进度', data.data)
            if (data.data === 100) {
              this.isTransCodeSuccess = true
              window.clearInterval(timer)
              console.log('转码成功')
            }
          }, 3000)
        }
      })
    },
    handleUpload () {
      // 获取上传的文件
      this.isUpload = true
      this.isTransCodeSuccess = false
      this.isUpLoadSuccess = false
      this.uploadPercent = 0
      const videoFile = this.video.files[0]
      const imageFile = this.image.files[0]
      this.fileName = videoFile.name
      console.log(videoFile, imageFile)
      const uploader = this.uploader
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')
      // 开始上传,触发onUploadstarted
      uploader.startUpload()
    }
  }
})
</script>
<style lang='scss' scoped>
.video-edit{
  width: 800px;
  margin: 0 auto
}
</style>
