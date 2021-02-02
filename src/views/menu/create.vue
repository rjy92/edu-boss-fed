<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加菜单</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px"
      :rules="rules">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.region" placeholder="请选择上级菜单">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum" :min=1 label='描述文字'>
          </el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Form } from 'element-ui'
import { createOrUpdateMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuCreate',
  data () {
    return {
      form: {
        parentId: -1, // -1 表示没有上级菜单
        name: '123',
        href: '123',
        icon: '123',
        orderNum: 0,
        description: '123',
        shown: false
      },
      isSubmit: false,
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请输入前端图标', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      console.log('submit!')
      try {
        await (this.$refs.form as Form).validate()

        this.isSubmit = true

        // 表单验证
        // 验证通过，提交表单
        const { data } = await createOrUpdateMenu(this.form)
        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.$router.back()
        }
      } catch (error) {
        console.log('提交失败', error)
      }
      this.isSubmit = false
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
