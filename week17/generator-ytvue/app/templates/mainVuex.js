import HelloYuntong from "./HelloYuntong.vue";
import Vue from "Vue";
import store from "./store";

new Vue({
    el: '#app',
    store,
    render: h => h(HelloYuntong)
});