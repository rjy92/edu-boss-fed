<template>
  <div class="category">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="dialogFormVisible = true">添加</el-button>
      </div>
      <el-table
      :data="categories"
      style="width: 100%">
        <el-table-column
          label="编号"
          type="index"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="150">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="150">
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
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="dialogform" ref="dialogform">
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="dialogform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="dialogform.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourceCategories, deleteCategory, createOrUpdateCategory } from '@/services/resource-category'
export default Vue.extend({
  name: 'CategoryIndex',
  data () {
    return {
      categories: [],
      dialogform: {
        name: '',
        sort: 0
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  created () {
    this.loadAllCategories()
  },
  methods: {
    async loadAllCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.categories = data.data
      }
    },
    handleEdit (item: any) {
      this.dialogFormVisible = true
      this.dialogform = item
      console.log('come in handleEdit')
    },
    handleDelete (item: any) {
      this.$confirm('是否要删除该分类？', '提示', {})
        .then(async () => { // 确认执行这里
          const { data } = await deleteCategory(item.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadAllCategories() // 更新数据列表
          }
        })
        .catch(err => { // 取消执行这里
          console.log(err)
          this.$message.info('已经取消删除')
        })
      console.log(item)
    },
    async dialogSubmit () {
      try {
        const { data } = await createOrUpdateCategory(this.dialogform)
        debugger
        this.dialogFormVisible = false
        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.loadAllCategories()
        } else {
          this.$message.error(data.mesg)
        }
      } catch (error) {
        this.dialogFormVisible = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
