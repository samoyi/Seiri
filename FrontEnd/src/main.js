import Vue from 'vue';
import App from './App.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);


import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import VueOnsen from 'vue-onsenui';
Vue.use(VueOnsen);



// router

import login from './components/login';
import projectList from './components/projectList';
import project from './components/project';

const routes = [
  { path: '/', component: login },
  { path: '/login', component: login },
  { path: '/projectList', component: projectList },
  { path: '/project', component: project }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})



new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
