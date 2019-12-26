export default {
  getToken() {
    const token = wx.getStorageSync("access_token");
    if (token) {
      return JSON.parse(token);
    }
    return null;
  },
  setToken(value) {
    wx.setStorageSync("access_token", value);
  }
};
