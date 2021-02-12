<template>
  <el-card>
    <div slot="header">
      <el-steps :active="activeStep" simple>
        <el-step
          v-for="(step, index) in steps"
          :key="index"
          :title="step.title"
          :icon="step.icon"
          @click.native="activeStep =index"
        ></el-step>
      </el-steps>
    </div>
    <el-form label-width="100px">
      <div v-show="activeStep === 0">
        <el-form-item label="名称">
          <el-input v-model="course.courseName"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="course.brief"></el-input>
        </el-form-item>
        <el-form-item label="课程概述">
          <el-input v-model="course.previewFirstField" style="margin-bottom:10px" placeholder="概述1"></el-input>
          <el-input v-model="course.previewSecondField" placeholder="概述2"></el-input>
        </el-form-item>
        <el-form-item label="讲师姓名">
          <el-input v-model="course.teacherDTO.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="course.teacherDTO.position"></el-input>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="course.teacherDTO.description"></el-input>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number
          label="描述文字"
          v-model="course.sortNum"></el-input-number>
        </el-form-item>
      </div>
      <div v-show="activeStep === 1">
        <el-form-item label="课程封面">
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
          <!-- 组件需要根据绑定的数据进行图片预览
          组件需要把上传成功的图片地址同步到绑定的数据中
          v-model 的本质还是父子组件通信
            1. 它会给子组件传递一个名字叫 value 的数据（Props）
            2. 默认监听 input 事件，修改绑定的数据（自定义事件） -->
          <course-image v-model="course.courseListImg"/>
        </el-form-item>
        <el-form-item label="解锁封面">
          <course-image v-model="course.courseImgUrl"/>
          <!-- <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img  v-if="course.courseImgUrl" :src="course.courseImgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
        </el-form-item>
      </div>
      <div v-show="activeStep === 2">
        <el-form-item label="售卖价格">
          <el-input placeholder="请输入售卖价格" v-model.number="course.discounts" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input placeholder="请输入商品原价" v-model.number="course.price" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input placeholder="请输入销量" v-model.number="course.sales" type="number">
            <template slot="append">单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签">
          <el-input placeholder="请输入活动标签" v-model="course.discountsTag">
          </el-input>
        </el-form-item>
      </div>
      <div v-show="activeStep === 3">
        <el-form-item label="限时秒杀开关">
          <el-switch
            v-model="course.activityCourse"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <template v-if="course.activityCourse">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="course.activityCourseDTO.beginTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="course.activityCourseDTO.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀价">
            <el-input placeholder="请输入秒杀价" v-model.number="course.activityCourseDTO.amount" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存">
            <el-input placeholder="请输入秒杀库存" v-model.number="course.activityCourseDTO.stock" type="number">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </template>
      </div>
      <div v-show="activeStep === 4">
        <el-form-item label = "课程详情">
          <!-- <el-input type="textarea"></el-input> -->
          <text-editor v-model="course.courseDescriptionMarkDown"/>
        </el-form-item>
        <el-form-item label="是否发布">
          <el-switch
            v-model="course.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
        />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </el-form-item>
      </div>
      <el-form-item v-if="activeStep>=0 && activeStep<4">
        <el-button @click="activeStep++">下一步</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang='ts'>
import Vue from 'vue'
import { saveOrUpdateCourse, uploadCourseImage, getCourseById } from '@/services/course'
import { Form } from 'element-ui'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
import moment, { months } from 'moment'
export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  components: {
    CourseImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-upload' },
        { title: '销售信息', icon: 'el-icon-picture' },
        { title: '秒杀活动', icon: 'el-icon-picture' },
        { title: '课程详情', icon: 'el-icon-picture' }
      ],
      imageUrl: '',
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDe: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.$router.push('/course')
      } else {
        this.$message.error('保存失败')
      }
    },
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      const { activityCourseDTO } = data.data
      this.course = data.data
      if (activityCourseDTO) {
        activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
        activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYYY-MM-DD')
      } else {
        this.course.activityCourseDTO = { beginTime: '', endTime: '', amount: 0, stock: 0 }
      }
    }
  }
})
</script>

<style lang='scss' scoped>
.el-step {
  cursor: pointer
}
</style>
