// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store';
import axios from 'axios';

import VueBus from 'vue-bus'
import config from './common/config.js'
import dataSource from './common/data.source.js'
import formTags from './common/form.tags.js'
import formAction from './common/form.action.js'
import './assets/icon/iconfont.css'
import QRCode from 'qrcode'
import BreadCrumb from '@/components/breadCrumb'
import AForm from '@/components/common/a-form'
import ATable from '@/components/common/a-table'
import ADialog from '@/components/common/a-dialog'
import ASelect from '@/components/common/a-select'
import AOrgan from '@/components/common/a-organ'
import LessonSelector from'@/components/common/lesson-selector'
import { postUserLogin } from '@/api/sysUser'
import htmlToPdf from '@/util/htmlToPdf'

Vue.use(QRCode);
Vue.use(VueBus);
Vue.use(dataSource);
Vue.use(formAction);
Vue.use(htmlToPdf)
Vue.component('bread-crumb', BreadCrumb);
Vue.component('a-form', AForm);
Vue.component('a-table', ATable);
Vue.component('a-dialog', ADialog);
Vue.component('a-select', ASelect);
Vue.component('a-organ', AOrgan);
Vue.component('lesson-selector', LessonSelector)
Vue.prototype.$axios = axios;
Vue.prototype.config = config;

// 全局添加封装函数
import { utils } from '@/util'
Vue.use(utils)


Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(require('vue-moment'));
router.beforeEach((to, from, next) => {
	if(to.query.ahr) { //ERP报表跳转DUP
		postUserLogin(
			{
				LoginCode: to.query.LoginCode,
				PassWord: to.query.PassWord,
				response: '0697056754B0C13C745662D33E1AC555',
				os: 'ahr'
			},
			(response) => {
				sessionStorage.setItem('sysUserInfo', JSON.stringify(response));
				// next()
				next({ path: to.path })
			},
			(error) => {
				next({ path: '/login' });
      },
      (exception) => {
				next({ path: '/login' });
      })
			return
	}
  	const sysUserInfo = JSON.parse(sessionStorage.getItem('sysUserInfo'));
	if(to.name == 'login') {
		if(sysUserInfo != {} && sysUserInfo != undefined && sysUserInfo != null){
			next({ path: '/welcome' });
		}else{
			next();
		}
	}	else {
		if(sysUserInfo == null){
			// next(false)
      next({ path: '/login' });
		} else{
			next()
		}
	}
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
