<template>
  <div>
    <div>
      <van-button
        plain
        type="primary"
        class="demo-margin-right"
        @click="onClickAlert"
      >
        消息提示
      </van-button>
      <van-dialog id="van-dialog" />
    </div>
 
    <div >
        <van-button
          plain
          type="danger"
          @click="showCustomDialog"
        >
          组件调用
        </van-button>
      <van-dialog
        use-slot
        async-close
        :show="show"
        show-cancel-button
        confirm-button-open-type="getUserInfo"
        @close="onClose"
        @getuserinfo="getUserInfo"
      >
        <van-field
          :value="username"
          label="用户名"
          placeholder="请输入用户名"
        />
        <van-field
          :value="password"
          type="password"
          label="密码"
          border="false"
          placeholder="请输入密码"
        />
      </van-dialog>
    </div>
  </div>
</template>
 
<script>
  import Dialog from '@/../static/vant/dialog/dialog'
  const message = '有赞是一家零售科技公司，致力于成为商家服务领域里最被信任的引领者'
  export default {
    data: {
      show: false,
      username: '',
      password: ''
    },
    methods:{
      onClickAlert(){
        Dialog.alert({
          title: '标题',
          message
        })
      },
      showCustomDialog() {
        this.show=true
      },
      getUserInfo(event) {

      },
      onClose(event) {
        if (event.mp.detail === 'confirm') {
          // 异步关闭弹窗
          setTimeout(() => {
            this.show=false
          }, 1000);
        } else {
          this.show=false
        }
      }
    }
  }
</script>