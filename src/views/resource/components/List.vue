<template>
  <div class="resource-list">
    <el-card class="box-card" shadow = "never">
      <div class="box-button">
        <el-button @click="onReset" :disabled="isLoading">重置</el-button>
        <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true">
        <el-form-item prop="name" label="资源名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="资源分类">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择资源分类"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategories"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div>
    <el-card class="box-card" shadow = "never">
      <div slot="header" class="clearfix">
        <el-button  @click="dialogFormVisible = true">添加</el-button>
        <el-button @click="$router.push(({name:'resource-category'}))">资源分类</el-button>
      </div>
      <el-table
        :data="resources"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column
          type="index"
          label="编号"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          min-width="180"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          min-width="180"
          label="描述">
        </el-table-column>
        <el-table-column
          min-width="180"
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          min-width="180"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    </div>
    <el-dialog title="添加资源" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="dialogform" ref="dialogform">
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="dialogform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" :label-width="formLabelWidth">
          <el-input v-model="dialogform.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="dialogform.categoryId" placeholder="请选择活动区域">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategories"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="dialogform.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--
      total:总记录数
      page-size:每页大小
      分页组件会自动根据total和page-size计算出一共多少页
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync ="form.current"
      :disabled="isLoading"
      :page-sizes="[5, 10, 20]"
      :page-size='form.size'
      layout="total, sizes, prev, pager, next, jumper"
      :total='totalCount'>
    </el-pagination>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { deleteResource, getResourcePages, createOrUpdateResource } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [], // 资源列表
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 5, // 每页大小
        categoryId: null, // 资源分类
        desc: ''
      },
      dialogform: {
        categoryId: null,
        url: '',
        description: '',
        name: ''
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: false, // 加载状态
      gridData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false
      console.log(data)
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    },
    handleEdit (item: any) {
      this.dialogFormVisible = true
      this.dialogform = item
      console.log('come in handleEdit')
    },
    handleDelete (item: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => { // 确认执行这里
          const { data } = await deleteResource(item.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadResources() // 更新数据列表
          }
        })
        .catch(err => { // 取消执行这里
          console.log(err)
          this.$message.info('已经取消删除')
        })
      console.log(item)
    },
    handleSizeChange (val: number) {
      console.log(`每页 ${val} 条`)
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val: number) {
      console.log(`当前页: ${val}`)
      this.form.current = val // 修改要查询的页面
      this.loadResources()
    },
    async dialogSubmit () {
      const { data } = await createOrUpdateResource(this.dialogform)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.dialogFormVisible = false
        this.loadResources()
      }
      console.log(data)
    }
  }
})
</script>

<style lang='scss' scoped>
  .box-button .el-button {
    float: right;
    margin-right: 20px;
  }
</style>
