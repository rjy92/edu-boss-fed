const express = require('express')
const path = require('path')
const app = express()

const { createProxyMiddleware } = require('http-proxy-middleware')

// 托管了 dist 目录，当访问 / 的时候，默认会返回托管目录中的 index.html 文件
app.use(express.static(path.join(__dirname, '../dist')))


app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagou.com',
  changeOrigin: true
}))

app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagou.com',
  changeOrigin: true
}))

app.use
app.listen(3000,()=>{
  console.log('running')
})