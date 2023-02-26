<template>
  <div style="display: inline-block">
    <div id="tips">
        <span :class="{activeWeak: isWeak}"></span>
        <span :class="{activeSecondary: isSecondary}"></span>
        <span :class="{activeStrong: isStrong}"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'passwordStrength',
  props: ['newpsd'],
  data () {
    return {
      value: '',
      isWeak: false,
      isSecondary: false,
      isStrong: false
    }
  },
  watch: {
    newpsd: {
      handler: function (newValue, oldValue) {
        this.checkStrong()
      }
    }
  },
  methods: {
    checkStrong () {
      let val = this.newpsd
      let modes = 0
      if (val.length < 6) {
        modes = 0
      }
      if (/\d/.test(val) && val.length > 6) {
        modes = 1
        if (/[A-Za-z]/.test(val) && /\d/.test(val) && val.length > 6) {
          modes = 2 // 小写
          if (/[A-Za-z]/.test(val) && /\d/.test(val) && /\W/.test(val) && val.length > 12) {
            modes = 3 // 特殊字符
          }
        }
      }
      this.modes = modes
      this.inspect(this.modes)
    },
    inspect (modes) {
      switch (modes) {
        case 0:
          this.isWeak = false
          this.isSecondary = false
          this.isStrong = false
          break
        case 1:
          this.isWeak = true
          this.isSecondary = false
          this.isStrong = false
          break
        case 2:
          this.isWeak = true
          this.isSecondary = true
          this.isStrong = false
          break
        case 3:
          this.isStrong = true
          this.isWeak = true
          this.isSecondary = true
          break
        default:
          this.isWeak = false
          this.isSecondary = false
          this.isStrong = false
          break
      }
    }
  }
}
</script>
<style scoped>
    input {
        float: left;
        font-size: 12px;
        width: 150px;
        font-family: arial;
        padding: 3px;
        border: 1px solid black;
    }

    input.error {
        border: 1px solid red;
    }

    #tips {
        float: left;
        /* margin: 2px 0 0 20px; */
    }

    #tips span {
        float: left;
        width: 90px;
        height: 6px;
        color: white;
        background: #d2d2d2;
        margin-right: 2px;
        line-height: 20px;
        text-align: center;
    }
    .activeWeak {
      background: #f2a33a!important;
    }
    .activeSecondary {
      background: #00954d!important;
    }
    .activeStrong {
       background: #3ef414!important;
    }
</style>

