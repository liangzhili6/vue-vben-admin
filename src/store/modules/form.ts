import { defineStore } from 'pinia';
// import { store } from '@/store';
// defineStore方法接收两个参数
// 第一个参数接收：仓库的名字
// 第二个参数：仓库的配置对象
// 返回一个函数作用就是让组件可以获取到仓库的数据
export const  useFormStore = defineStore({
  id: 'Form',
  state: (): any => ({
    addchildrenData: 0,
    isPreview: true,
    RandomOneData: 0,
    childrenSubmit: {
      text:'',
      id:''
    },
    previewView: false,
  }),
  actions: {
    updateAddChildrenData(val) {
      this.addchildrenData = val;
    },
    updateIsPreview(val) {
      this.isPreview = val;
    },
    updateRandomOneData(val) {
      this.RandomOneData = val;
    },
    updatePreviewView(val) {
      this.previewView = val;
    },
    updateChildrenSubmit(val: any, id?:'') {
      this.childrenSubmit.text = val;
      this.childrenSubmit.id = id;
      // console.log('this.childrenSubmit', this.childrenSubmit)
    },
  },
  getters: {
    getAddChildrenData(state) {
      return state.addchildrenData;
    },
    getIsPreview(state) {
      return state.isPreview;
    },
    getRandomOneData(state) {
      return state.RandomOneData;
    },
    getChildrenSubmit(state) {
      return state.childrenSubmit;
    }
  },
});

// 对外暴露出去
// export default useFormStore;
