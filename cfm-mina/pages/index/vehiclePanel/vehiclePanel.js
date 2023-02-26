Component({

  externalClasses: ['v-panel'],

  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    buttonBorder: {
      type: String,
      value: ""
    },
    backgroundColor: {
      type: String,
      value: "#fff"
    },
    //1为省份键盘，其它为英文键盘
    keyBoardType: {
      type: Number,
      value: 1,
    }
  },
  data: {
    keyVehicle1: '京津渝沪冀晋辽吉黑苏',
    keyVehicle2: '浙皖闽赣鲁豫鄂湘粤琼',
    keyVehicle3: '川贵云陕甘青蒙桂宁新',
    keyVehicle4: '藏使领警学港澳',

    keyNumber: '1234567890',
    keyEnInput1: 'QWERTYUIOP',
    keyEnInput2: 'ASDFGHJKL',
    keyEnInput3: 'ZXCVBNM'
  },
  methods: {
    vehicleTap: function (event) {
      let val = event.target.dataset.value;
      switch (val) {
        case 'delete':
          this.triggerEvent('delete');
          this.triggerEvent('inputchange');
          break;
        case 'ok':
          this.triggerEvent('ok');
          break;
        default:
          this.triggerEvent('inputchange', val);
      }
    },
    changeValTap: function () {
      console.log(this.data.keyBoardType)
      if (this.data.keyBoardType == 1) {
        this.setData({ keyBoardType: 2 })
      } else if (this.data.keyBoardType == 2) {
        this.setData({ keyBoardType: 1 })
      }
    }
  }
});