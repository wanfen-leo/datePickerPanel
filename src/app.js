/**
 * @description 全局注册 Element-ui 组件
 */

import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'

const install = (app) => {
  app.use(ElementPlus, {
    size: 'default'
    // zIndex: 1000,
  })
}
export { ElementPlus, install }
