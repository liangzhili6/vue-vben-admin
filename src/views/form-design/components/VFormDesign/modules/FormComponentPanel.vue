<!--
 * @Description: 中间表单布局面板
 * https://github.com/SortableJS/vue.draggable.next/issues/138
-->
<template>
  <div class="form-panel v-form-container">
    <Empty
      class="empty-text"
      v-show="formConfig.schemas.length === 0"
      description="从左侧选择控件添加"
    />
    <Form v-bind="formConfig" style="height: 100%;">
      <!-- <div class="draggable-box" :style="[formConfig.schemas.length?{height: (formConfig.schemas[formConfig.schemas.length-1])?.position?.height +(formConfig.schemas[formConfig.schemas.length-1])?.position?.top+200+'px'}:{height: 'calc(100vh - 120px)'}]"> -->
      <div class="draggable-box" >
          <TypographyTitle style="display: flex; justify-content: center;" :level="4">{{
          formConfig.title
        }}</TypographyTitle>
        <div style="height: calc(100% - 120px);">
        <DraggableContainer  :prevent_drag_overlapping="true">
        <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="formConfig.schemas"
          item-key="key"
          @add="addItem"
          @start="handleDragStart"
        >
          <template #item="{ element }">
            <LayoutItem
              class="drag-move"
              :schema="element"
              :data="formConfig"
              :current-item="formConfig.currentItem || {}"
            />
          </template>
        </draggable>
      </DraggableContainer>
    </div>
        <div
          style="
            display: flex;
            flex: 1;
            text-align: center;
            justify-content: center;
            padding: 10px 0;
          "
        >
          <Button type="primary" @click="submitFormTemplate">{{ formConfig.submitFormTemplateTxt }}</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts">
  import draggable from 'vuedraggable';
  import LayoutItem from '../components/LayoutItem.vue';
  import { defineComponent, computed, reactive, toRefs } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { Form, Empty, Button, TypographyTitle } from 'ant-design-vue';

// 这个组件不是默认导出的，
// 如果你之前是通过“app.use(Vue3DraggableResizable)”注册的，
// 那么你这里就不需要再引入了，因为DraggableContainer这个已经被全局注册了，你可以直接使用
import { DraggableContainer } from 'vue3-draggable-resizable'
  import VueDragResize from "vue-drag-resize/src";
  export default defineComponent({
    name: 'FormComponentPanel',
    components: {
      LayoutItem,
      draggable,
      Form,
      Empty,
      Button,
      TypographyTitle,
      VueDragResize,
      DraggableContainer
    },
    emits: ['handleSetSelectItem'],
    setup(_, { emit }) {
      const { formConfig } = useFormDesignState();
      const submitFormTemplate = () => {
        console.log('submitFormTemplate', formConfig.value)
      }
      /**
       * 拖拽完成事件
       * @param newIndex
       */
      const addItem = ({ newIndex }: any) => {
        formConfig.value.schemas = formConfig.value.schemas || [];

        const schemas = formConfig.value.schemas;
        schemas[newIndex] = cloneDeep(schemas[newIndex]);
        emit('handleSetSelectItem', schemas[newIndex]);
      };

      /**
       * 拖拽开始事件
       * @param e {Object} 事件对象
       */
      const handleDragStart = (e: any) => {
        emit('handleSetSelectItem', formConfig.value.schemas[e.oldIndex]);
      };

      // 获取祖先组件传递的currentItem

      // 计算布局元素，水平模式下为ACol，非水平模式下为div
      const layoutTag = computed(() => {
        return formConfig.value.layout === 'horizontal' ? 'Col' : 'div';
      });
      const styleObj = reactive({
        width: 0,
        height: 0,
        top: 200,
        left: 200
      });
      const resize = (newRect) => {
        console.log('resize', newRect)
                styleObj.width = newRect.width;
                styleObj.height = newRect.height;
                /* styleObj.top = newRect.top;
                styleObj.left = newRect.left; */
            }
      return {
        ...toRefs(styleObj),
        styleObj,
        addItem,
        handleDragStart,
        formConfig,
        layoutTag,
        submitFormTemplate,
        resize,
      };
    },
  });
</script>

<style lang="less" scoped>
  @import url('../styles/variable.less');
  @import url('../styles/drag.less');

  .v-form-container {
    height: calc(100vh - 120px);
    // 内联布局样式
    .ant-form-inline {
      .list-main {
        display: flex;
        flex-wrap: wrap;
        // position: relative;
        overflow: auto;
        place-content: flex-start flex-start;

        .layout-width {
          width: 100%;
        }
      }

      .ant-form-item-control-wrapper {
        min-width: 175px !important;
      }
    }
  }

  .form-panel {
    position: relative;
    height: 100%;
    height: 100vh;
    height: calc(100vh - 120px);
    .empty-text {
      position: absolute;
      z-index: 100;
      inset: -10% 0 0;
      height: 150px;
      margin: auto;
      color: #aaa;
    }

    .draggable-box {
      height: 100%;
      // height: calc(100vh - 120px);
      width: 100%;
      // overflow: auto;
      .drag-move {
        min-height: 62px;
        cursor: move;
      }

      .list-main {
        min-height: 100%;
        // position: relative;
        overflow: auto;
        // 列表动画
        .list-enter-active {
          transition: all 0.5s;
        }

        .list-leave-active {
          transition: all 0.3s;
        }

        .list-enter,
        .list-leave-to {
          transform: translateX(-100px);
          opacity: 0;
        }

        .list-enter {
          height: 30px;
        }
      }
    }
  }
</style>
