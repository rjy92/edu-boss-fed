<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang='ts'>
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null
    }
  },
  watch: {
    value () {
      (this.editor as any).txt.html(this.value)
    }
  },
  // 组件已经渲染好，可以初始化操作Dom了
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      console.log(this.value)
      const editor = new E(this.$refs.editor as any)
      this.editor = editor as any
      // // 注意：事件监听必须在 create 之前 配置 onchange 回调函数
      editor.config.onchange = (value: string) => {
        console.log('change 之后最新的 html', value)
        this.$emit('input', value)
      }
      editor.config.customUploadImg = async (resultFiles: any, insertImgFn: any) => {
        // resultFiles 是 input 中选中的文件列表 把用户选择的上传到服务端
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        // 上传图片，返回结果，将图片插入到编辑器中 根据图片地址生成 img 标签插入富文本编辑器内容中
        insertImgFn(data.data.name)
      }
      editor.create()
      // 注意：事件监听必须在 create 之前
      // console.log(this.value)
      // editor.txt.html(this.value)
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
