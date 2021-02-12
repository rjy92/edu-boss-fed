<template>
  <div class="alloc-resource">
    <el-card>
      <div v-for="resource in resources" :key='resource.id'>
        <el-row class="table-layout" style="background: rgb(242, 246, 252)">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <el-checkbox :indeterminate="itemIndeterminate(resource)" v-model="resource.checkAll" @change="val => handleCheckAllChange(val, resource)">{{resource.name}}</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-row class="table-layout">
          <el-col :span="8" v-for="category in resource.children" :key="category.id" style="padding: 4px 0px;">
            <div class="grid-content bg-purple-dark">
              <el-checkbox-group v-model="defaultCheckedKeys" @change="handleCheckedCitiesChange">
                <el-checkbox :label="category.id" >{{category.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="text-align:center">
        <el-button>清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tree } from 'element-ui'
import {
  getAllResources,
  allocateRoleResources,
  getRoleResources
} from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

const cityOptions = ['上海', '北京', '广州', '深圳']
export default Vue.extend({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      checkAll: [],
      // checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      defaultCheckedKeys: [],
      resources: []
    }
  },
  async created () {
    await this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    async loadResources () {
      const ret = await Promise.all([getAllResources(), getResourceCategories()])
      const resources = ret[0].data.data
      const resourceCategories = ret[1].data.data
      resources.forEach((r: any) => {
        // this.$set(r, 'checkAll', false)
        // r.checkAll = false
        const category = resourceCategories.find((c: any) => c.id === r.categoryId)
        if (category) {
          category.children = category.children || []
          category.children.push(r)
        }
      })
      // 修改顶层分类 ID：因为分类 ID 和资源 ID 冲突
      resourceCategories.forEach((item: any) => {
        item.checkAll = false
        item.id = Math.random()
      })

      this.resources = resourceCategories
    },
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      this.getCheckedResources(data.data)
    },
    getCheckedResources (resources: any) {
      resources.forEach((r: any) => {
        debugger
        r.checkAll = false
        let count = 0
        r.resourceList && r.resourceList.forEach((c: any) => {
          if (c.selected) {
            this.defaultCheckedKeys = [...this.defaultCheckedKeys, c.id] as any
            count++
          }
        })
        if (r.resourceList && (count === r.resourceList.length)) {
          r.checkAll = true
        }
      })
    },
    async onSave () {
      console.log(this.defaultCheckedKeys)
      await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList: this.defaultCheckedKeys
      })
      this.$message.success('保存成功')
      this.$router.back()
    },
    handleCheckAllChange (val: any, item: any) {
      const arr: any = []
      if (item.children) {
        item.children.forEach((element: any) => {
          arr.push(element.id)
        })
      }
      const filterArr = this.defaultCheckedKeys.filter(v => arr.indexOf(v) === -1)

      this.defaultCheckedKeys = val ? filterArr.concat(arr) : filterArr

      // const arr: any = []
      // // console.log(filterArr)
      // // console.log(arr)
      // this.defaultCheckedKeys = arr

      // const checkAll = this[('checkAll' + val) as never]
      // this.defaultCheckedKeys = val || []
    },
    handleCheckedCitiesChange (value: any) {
      console.log('handleCheckedCitiesChange')
      console.log(value)
      const checkedCount = value.length

      this.resources.forEach((element: any) => {
        const a = element.children && element.children.every((v: any) => this.defaultCheckedKeys.indexOf(v.id as never) !== -1)
        element.checkAll = a
      })

      // this.checkAll = checkedCount === this.cities.length
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 判断是否是不确定 条件1：当前item.items里至少有一个选上   条件2：当前item.items里至少有一个没有被选上
    itemIndeterminate (item: any) {
      // console.log(item)
      if (item.children) {
        return item.children.some((v: any) => {
          // console.log(v)
          return (this.defaultCheckedKeys.indexOf(v.id as never) > -1) && !item.children.every(
            (v: any) => this.defaultCheckedKeys.indexOf(v.id as never) > -1)
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .table-layout{
    padding:20px;
    border-left:1px solid #dcdfe6;
    border-right:1px solid #dcdfe6;
    border-bottom:1px solid #dcdfe6;
  }
</style>
