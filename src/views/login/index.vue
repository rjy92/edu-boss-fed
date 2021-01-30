<template>
  <div class="system">
    <div class="title">Edu boss 管理系统</div>
    <div class="login">
      <!--
        :model= "ruleForm"
        :rules="rules"
        ref="ruleForm"
        4 el-form-item 绑定prop属性
       -->
      <el-form class = "login-form demo-ruleForm" label-position="top"  label-width="80px"
      ref="form"
      :model="form"
      :rules="rules"
       >
        <div class="denglu">登录</div>
        <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="login-btn" :loading="isLoginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '',
        password: ''
      },
      isLoginLoading: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        await (this.$refs.form as Form).validate()

        this.isLoginLoading = true
        // 1.表单验证
        // 2 验证通过-提交表单
        // 3 处理请求结果
        //    成功-跳转到首页
        //    失败:
        /* const { data } = await request({
          method: 'POST',
          url: '/front/user/login',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(this.form) // axios发送请求，默认发送的是application/json格式的数据，但我们需要的是x-www-form-urlencoded
        }) */
        const { data } = await login(this.form)
        console.log(data)
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 1登录成功，记录登录状态，状态需要能够全局访问（放到vuex容器中）
          this.$store.commit('setUser', data.content)
          // 2然后在访问需要登录的页面的时候，判断有没有登录状态，(路由拦截器)
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登录成功')
        }
      } catch (err) {
        console.log('登录失败', err)
      }
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.system{
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  .title{
    display: flex;
    margin-bottom: 50px;
    text-align: center;
    font-size: 45px;
    width: 300px;
  }
  .login{
    .login-form{
        background: #fff;
        width: 300px;
        padding: 20px;
        border-radius: 5px
    }
    .login-btn{
        width: 100%
    }
    .denglu{
        font-weight: 1000;
        font-size: 20px;
        padding-bottom: 10px
    }
}
}

</style>
