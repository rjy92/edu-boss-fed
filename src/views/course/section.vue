<template>
  <div class="course-section">
    <el-card>
      <div slot="header">
        课程名称
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
      <div slot-scope="{ node, data }" class="inner">
        <span>{{ node.label}}</span>
        <span v-if="data.sectionName" class="actions">
          <el-button size="small">编辑</el-button>
          <el-button type="primary" size="small">添加课时</el-button>
          <el-button size="small">状态</el-button>
        </span>
        <span v-else class="actions">
          <el-button size="small">编辑</el-button>
          <el-button type="success" size="small">上传视频</el-button>
          <el-button size="small">状态</el-button>
        </span>
      </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateSection } from '@/services/course-section'
import { saveOrUpdateLesson } from '@/services/course-lesson'
export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  },
  created () {
    this.loadSections()
  },
  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      // console.log(data)
      this.sections = data.data
    },
    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      // draggingNode 拖动的节点
      // dropNode 放置的目标节点
      // type：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      // console.log(draggingNode, dropNode, type)
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },
    async handleSort (draggingNode: any, dropNode: any, type: any, event: any) {
      console.log('event')
      console.log(draggingNode)
      console.log(dropNode)
      console.log(dropNode.parent.childNodes)
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (draggingNode.data.lessonDTOS) {
            // 阶段
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (error) {
        console.log(error)
        this.$message.error('排序失败')
      }
      this.isLoading = false
    }
  }
})
</script>

<style lang='scss' scoped>
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
