<template>
  <div class="progress-outer" :class="{'progressStart': start}">
    <div class="progress" :class="{'progress-striped active': animate}">
      <div class="progress-bar"
           :class="type && 'progress-bar-' + type"
            role="progressbar"
            :aria-valuenow="value"
            :aria-valuemin="0"
            :aria-valuemax="max"
            :style="{width: (percent < 100 ? percent : 100) + '%', 'animation-duration': animateTime + 's'}">
      </div>
    </div>
    <!-- <span class="progress-text">{{valueText}}</span> -->
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: ''
    },
    animate: {
      type: Boolean,
      default: false
    },
    animateTime: {
      type: Number,
      default: 0.6
    },
    start: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler: function (newValue, oldValue) {
      }
    }
  },
  computed: {
    percent () {
      return parseInt(this.value * 100 / this.max, 10)
    },
    valueText () {
      return this.percent + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-outer{
    opacity: 0;
  }
  .progressStart{
    opacity: 1!important;
  }
  .progress {
    height: 10px;
    width: 90%;
    margin-bottom: 10px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
  }
  .progress-bar {
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    -webkit-transition: width 1.5s ease;
    -o-transition: width 1.5s ease;
    transition: width 1.5s ease;
  }
  .progress-bar-info {
    background-color: #5bc0de;
  }
  .progress-bar-success {
    background-color: #4399fe;
  }
  .progress-bar-danger {
    background-color: #d9534f;
  }
  .progress-bar-warning {
    background-color: #f0ad4e;
  }
  .progress.active .progress-bar {
    -webkit-animation: progress-bar-stripes 2s linear infinite;
    -o-animation: progress-bar-stripes 2s linear infinite;
    animation: progress-bar-stripes 2s linear infinite;
  }
  @keyframes progress-bar-stripes {
    0% {
      background-position: 40px 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  .progress-striped .progress-bar {
    background-image: -webkit-linear-gradient(45deg, rgba(255,255,255,.15) 25%,
                      transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: -o-linear-gradient(45deg, rgba(255,255,255,.15) 25%,
                      transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%,
                      transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%,transparent 75%,transparent);
    -webkit-background-size: 40px 40px;
    background-size: 40px 40px;
  }
</style>

