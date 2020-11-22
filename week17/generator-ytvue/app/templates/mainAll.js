import HelloYuntong from "./HelloYuntong.vue";
import Vue from "Vue";
import store from "./store";
import router from "./router";

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(HelloYuntong)
});