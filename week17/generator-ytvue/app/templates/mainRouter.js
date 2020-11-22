import HelloYuntong from "./HelloYuntong.vue";
import Vue from "Vue";
import router from "./router";

new Vue({
    el: '#app',
    router,
    render: h => h(HelloYuntong)
});