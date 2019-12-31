import ajax from "@/utils/ajax.js";
import tokenService from "@/services/tokenService.js";

export default {
  async loginFromWeChatAsync(input) {
    const response = await ajax.post("/member/LoginFromWeChatAsync", input);
    this.setMember(response);
  },
  async loginFromMiniAsync(userInfo) {
    let self = this;
    await wx.login({
      async success(res) {
        if (res.code) {
          // 封装的缓存方法
          if (userInfo) {
            let params = {
              code: res.code,
              userInfo: userInfo
            }
            const response = await ajax.post('/member/LoginFromMiniAsync', params)
              .then((res) => {

                self.setMember(res);
              });
          } else {
            await wx.getUserInfo({
              async success(rest) {

                let params = {
                  code: res.code,
                  userInfo: rest.userInfo
                }
                const response = await ajax.post('/member/LoginFromMiniAsync', params)
                  .then((res) => {

                    self.setMember(res);
                  });
              }
            })
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户的当前设置。本项目里判断用户是否已授权登录
  },
  async bindStaffAsync(input) {
    const response = await ajax.post("/member/BindStaffAsync", input);
    this.setMember(response);
  },
  async registMemberCardAsync(input) {
    return await ajax.post("/member/RegistMemberCardAsync", input);
  },
  async getElectronicMemberCardAsync() {
    let response = await ajax.get("/member/GetElectronicMemberCardAsync");
    return response.result;
  },
  async renewMemberCardAsync(id) {
    return await ajax.post("/member/RenewMemberCardAsync", {
      id: id
    });
  },
  setMember(response) {
    let member = response.result.member;
    member.permissions = response.result.permissions;
    wx.setStorageSync("member", JSON.stringify(member));
    tokenService.setToken(response.result.token);
  },
  getMember() {
    const member = wx.getStorageSync("member");
    if (member) {
      return JSON.parse(member);
    }
    return null;
  }
};
