<template>
  <div id="editorElem">
    <div ref="editorElem"
         style="text-align:left"></div>
  </div>
</template>
<script>
import E from 'wangeditor'
import context from '@/service'
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    desc: {
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
    dialogFormVisible: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.createEditor()
          })
        }
      },
      immediate: true
    },
    // 接收父组件传递过来的值
    desc (value) {
      // console.log("desc",value)
      // 判断父组件传递过来的值跟当前编辑器内容是否一样
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.desc)
      }
    }
  },
  methods: {
    createEditor () {
      if (this.editor) {
        // 清除菜单高亮
        let arr = document.getElementsByClassName('w-e-menu')
        for (let i = 0; i < arr.length; i++) {
          arr[i].classList.remove('w-e-active')
        }
        // this.editor.txt.html('<h2 style="text-align: center;"><span style="font-size: small; font-family: 宋体;">我是标题一</span></h2><div><span style="font-size: small; font-family: 宋体; color: rgb(70, 172, 200);">1.特务他看了人口唐；</span></div><div><span style="font-size: large; font-family: Arial; color: rgb(194, 79, 74);">2.大大疯狂苦了我了了网络；</span></div><div><span style="font-family: 宋体; font-size: x-small; color: rgb(249, 150, 59);">3.而非微软他微软二伟 任务；</span></div><div><img src="http://dev-img.yunwutech.com/h4oNetZV0kSUvPdBCmsU" style="max-width:100%;"><span style="font-family: 宋体; font-size: x-small; color: rgb(249, 150, 59);"><br></span></div><table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><th>1&nbsp;</th><th>2&nbsp;</th><th>3&nbsp;</th><th>4&nbsp;</th><th>5&nbsp;</th></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p><br></p><div><span style="font-family: 宋体; font-size: x-small; color: rgb(249, 150, 59);"><br></span></div>')
        return
      }
      let that = this
      this.editor = new E(this.$refs.editorElem)
      // 配置菜单
      this.editor.config.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'list',  // 列表
        'justify',  // 对齐方式
        // 'quote',  // 引用
        'image',  // 插入图片
        // 'table',  // 表格
        'undo',  // 撤销
        'redo'  // 重复
      ]
      // 上传图片到服务器
      this.editor.config.uploadImgShowBase64 = true
      this.editor.config.uploadImgMaxLength = 5
      this.editor.config.uploadImgMaxSize = 3 * 1024 * 1024
      this.editor.config.customUploadImg = async (files, insert) => {
        let formData = new FormData()
        formData.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          insert(res.data)
        }).catch(error => {
          console.info(error)
        })
        // upload方法是后台提供的上传图片的接口
        // insert 是编辑器自带的 获取图片 url 后，插入到编辑器的方法 上传代码返回结果之后，将图片插入到编辑器中
      }
      // 自定义字体
      this.editor.config.onchange = html => {
        that.$emit('setEditor', html)
      }
      this.editor.create()
      if (!this.desc || this.desc === '') {
        this.editor.txt.clear()
      } else {
        this.editor.txt.html(this.desc)
      }
    }
  }
}
</script>
<style lang='scss'>
#editorElem {
  margin: 0 0 20px;
  .w-e-toolbar {
    flex-wrap: wrap;
    i {
      font-size: 14px !important;
    }
    .w-e-menu {
      padding: 0px 5px;
    }
  }
}
</style>
