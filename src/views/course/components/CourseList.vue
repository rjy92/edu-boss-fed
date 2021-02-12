<template>
  <div class="course-list">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button style="float:right"
          @click="$router.push({
          name:'course-create'})">添加课程</el-button>
          <el-form
        ref="form"
        label-width="70px"
        label-position="left"
        :model="filterParams"
        :inline="true"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="loading"
            @click="handleReset"
          >重置</el-button>
          <el-button
            type="primary"
            :disabled="loading"
            @click="handleFilter"
          >查询</el-button>
        </el-form-item>
        </el-form>
        </div>
        <el-table
        :data="courses"
        v-loading="loading"
        style="width: 100%; margin-bottom: 20px">
        <el-table-column
          prop="id"
          label="ID"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          min-width="150">
        </el-table-column>
        <el-table-column
          pprop="price"
          label="价值"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态"
          min-width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              :disabled = "scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          align="center"
          min-width="150">
          <template>
          <el-button
            size="mini"
          >编辑</el-button>
          <el-button
            size="mini"
          >内容管理</el-button>
        </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :disabled="loading"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getQueryCourses, changeState } from '@/services/course'
export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      courses: [],
      totalCount: 0,
      loading: true
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async loadCourses () {
      this.loading = true
      const { data } = await getQueryCourses(this.filterParams)
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.loading = false
    },
    handleCurrentChange (page: number) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleReset () {
      (this.$refs.form as Form).resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    async onStateChange (course: any) {
      course.isStatusLoading = true
      // console.log(course)
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      // console.log(data)
      this.$message.success(course.status === 0 ? '下架成功' : '上架成功')
      course.isStatusLoading = false
    }
  }
})
</script>
<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
