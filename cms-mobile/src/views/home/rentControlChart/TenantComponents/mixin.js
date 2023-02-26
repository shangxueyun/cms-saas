const myMixin = {
  data: function () {
    return {
      active: 0 // 当前激活的导航索引
    }
  },
  created () {
  },
  mounted () {
    // 监听滚动事件
    window.addEventListener('scroll', this.onScroll, true)
  },
  beforeDestroy () {
    // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
    window.removeEventListener('scroll', this.onScroll, true)
  },
  methods: {
    // 滚动监听器
    onScroll () {
      // 获取所有锚点元素
      const navContents = document.querySelectorAll('#content > div')
      // 所有锚点元素的 offsetTop
      const offsetTopArr = []
      navContents.forEach(item => {
        offsetTopArr.push(item.offsetTop)
      })
      // 获取当前文档流的 scrollTop
      // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      const scrollTop = document.querySelector('#content').scrollTop
      // 定义当前点亮的导航下标
      let navIndex = 0
      for (let n = 0; n < offsetTopArr.length; n++) {
        // 如果 scrollTop 大于等于第n个元素的 offsetTop 则说明 n-1 的内容已经完全不可见
        // 那么此时导航索引就应该是n了
        if (scrollTop >= offsetTopArr[n] - 1) {
          navIndex = n
        }
      }
      this.active = navIndex
    },
    // 跳转到指定索引的元素
    scrollTo (index) {
      let _this = this
      // 获取目标的 offsetTop
      // css选择器是从 1 开始计数，我们是从 0 开始，所以要 +1
      const targetOffsetTop = document.querySelector(`.content > div:nth-child(${index + 1})`).offsetTop
      // 获取当前 offsetTop
      // let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      // let scrollTop = this.scrollTop
      let scrollTop = document.querySelector('#content').scrollTop
      // 定义一次跳 50 个像素，数字越大跳得越快，但是会有掉帧得感觉，步子迈大了会扯到蛋
      const STEP = 50
      // 判断是往下滑还是往上滑
      if (scrollTop > targetOffsetTop) {
        // 往上滑
        smoothUp()
      } else {
        // 往下滑
        smoothDown()
      }
      // 定义往下滑函数
      function smoothDown () {
        // 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
        if (scrollTop < targetOffsetTop) {
          // 如果和目标相差距离大于等于 STEP 就跳 STEP
          // 否则直接跳到目标点，目标是为了防止跳过了。
          if (targetOffsetTop - scrollTop >= STEP) {
            scrollTop += STEP
          } else {
            scrollTop = targetOffsetTop
          }
          // document.body.scrollTop = scrollTop
          // document.documentElement.scrollTop = scrollTop
          document.querySelector('#content').scrollTop = scrollTop
          // 关于 requestAnimationFrame 可以自己查一下，在这种场景下，相比 setInterval 性价比更高
          requestAnimationFrame(smoothDown)
        }
      }
      // 定义往上滑函数
      function smoothUp () {
        if (scrollTop > targetOffsetTop) {
          if (scrollTop - targetOffsetTop >= STEP) {
            scrollTop -= STEP
          } else {
            scrollTop = targetOffsetTop
          }
          // document.body.scrollTop = scrollTop
          // document.documentElement.scrollTop = scrollTop
          document.querySelector('#content').scrollTop = scrollTop
          requestAnimationFrame(smoothUp)
        }
      }
    }
  }
}
export default myMixin
