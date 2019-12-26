import appConsts from "./../consts.js";
// import orderService from "@/services/orderService.js";

export default {
  namespaced: true,
  state: {
      options: {
        shouldLoad: true,
        dates: undefined,
        disabledWeeks: undefined,
        groupOrderMaxQuantity: 0,
        individualOrderMaxAdultQuantity: 0,
        individualOrderMaxChildrenQuantity: 0,
        perAdultMaxChildrenQuantity: 0,
        travelDate: "",
        entryTime: undefined,
        touristArray: [],
        totalPrice: 0.0,
        touristNum: undefined,
        ticketArray: [],
        phoneNum: "",
        listNo: "01",
        payRemain: 0,
        payMode: "1",
        orderDetailId: "01",
        bookType: "0"
      },
      input: null
  },
  mutations: {
    setOptions(state, input) {
      state.options = input;
    },
    setInput(state, input) {
      state.input = input;
    }
  },
  actions: {
    async [appConsts.loadOrderOptionsAsync](context) {
      if (context.state.options.shouldLoad) {
        // let options = await orderService.getOrderOptionsAsync();
        options.shouldLoad = false;

        context.commit("setOptions", options);
      }
    }
  }
};
