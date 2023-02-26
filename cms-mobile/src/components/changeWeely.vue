<template>
  <van-picker     
    show-toolbar
    :columns="columns"
    @cancel="cancel"
    @confirm="onConfirm"
    @change="onChange"
   />
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import Vue from 'vue'
import { Picker } from 'vant'
Vue.use(Picker)
// 获取一年的周次列表
const weelys = y => {
  const oneDay = moment(y + '-01-01')
  let oneWeely = null
  if (oneDay.format('wo') === '1周') {
    oneWeely = oneDay.startOf('week').format('YYYY-MM-DD')
  } else {
    console.log('weeks')
    oneDay.add(1, 'weeks')
    oneWeely = oneDay.startOf('week').format('YYYY-MM-DD')
  }
  const arr = []
  let weelyStr = '1周'
  do {
    const d = {}
    let time = moment(oneWeely)
    d.value = time.format('YYYY-MM-DD')
    d.text =
      time.format('第wo') +
      '(' +
      time.startOf('week').format('MM/DD') +
      '-' +
      time.endOf('week').format('MM/DD') +
      ')'
    arr.push(d)
    oneDay.add(1, 'weeks')
    oneWeely = oneDay.startOf('week').format('YYYY-MM-DD')
    weelyStr = oneDay.format('wo')
  } while (weelyStr !== '1周' && oneWeely.indexOf(y) > -1)
  return arr
}

export default {
  props: {
    defaults: {
      type: [Object, String, Date],
      default: () => {
        return moment()
        // return new Date()
      }
    }
  },
  data () {
    return {
      columns: [
        {
          values: [],
          className: 'column1'
        },
        {
          values: [],
          className: 'column2'
        }
      ]
    }
  },
  created () {
    this.setData()
  },
  methods: {
    setData () {
      const defaultData = moment(this.defaults)
      let year = Number(moment().format('YYYY'))
      this.columns[0].values = []
      for (let i = year - 10; i < year - 0 + 10; i++) {
        this.columns[0].values.unshift(i)
      }
      for (let i = 0; i < this.columns[0].values.length; i++) {
        if (this.columns[0].values[i] === year) {
          this.columns[0].defaultIndex = i
          this.columns[0].valueKey = i
          break
        }
      }
      // console.log(this.columns)
      this.columns[1].values = weelys(year)
      for (let i = 0; i < this.columns[1].values.length; i++) {
        if (
          moment(this.columns[1].values[i].value).format('wo') ===
          defaultData.format('wo')
        ) {
          this.columns[1].defaultIndex = i
          this.columns[1].valueKey = i
          break
        }
      }
    },
    onConfirm (value, index) {
      this.$emit('onConfirm', value)
    },
    onChange (picker, values) {
      picker.setColumnValues(1, weelys(values[0]))
      this.$emit('onChange', values)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>



<style>
</style>

