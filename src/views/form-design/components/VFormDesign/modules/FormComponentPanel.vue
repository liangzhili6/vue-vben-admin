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
    <Form v-bind="formConfig" style="height: 100%">
      <!-- <div class="draggable-box" :style="[formConfig.schemas.length?{height: (formConfig.schemas[formConfig.schemas.length-1])?.position?.height +(formConfig.schemas[formConfig.schemas.length-1])?.position?.top+200+'px'}:{height: 'calc(100vh - 120px)'}]"> -->
      <div class="draggable-box">
        <TypographyTitle style="display: flex; justify-content: center" :level="4">{{
          formConfig.title
        }}</TypographyTitle>
        <div style="height: calc(100% - 120px)">
<!--           <grid-layout
            :layout.sync="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[1, 1]"
            :use-css-transforms="true"
    >

        <grid-item v-for="item in layout"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :key="item.i" style="border: 1px red solid">
            {{item.i}}
        </grid-item>
    </grid-layout> -->
          <!-- <grid-layout
            :layout.sync="formConfig.schemas"
            :col-num="100"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[1, 1]"
            :use-css-transforms="true"
            @layout-created="layoutCreatedEvent"
                         @layout-before-mount="layoutBeforeMountEvent"
                         @layout-mounted="layoutMountedEvent"
                         @layout-ready="layoutReadyEvent"
                         @layout-updated="layoutUpdatedEvent"
          >
            <grid-item
              v-for="item in formConfig.schemas"
              :x="item.position.left"
              :y="item.position.top"
              :w="item.position.width"
              :h="item.position.height"
              :i="item.key"
              :key="item.key"
               style="border: 1px pink solid"
               @resize="resizeEvent"
                           @move="moveEvent"
                           @resized="resizedEvent"
                           @container-resized="containerResizedEvent"
                           @moved="movedEvent"
            >
                <LayoutItem
                  class="drag-move"
                  :schema="item"
                  :data="formConfig"
                  :current-item="formConfig.currentItem || {}"
                />
              {{ item.position }}
            </grid-item>
          </grid-layout> -->
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
          <Button type="primary" @click="submitFormTemplate">{{
            formConfig.submitFormTemplateTxt
          }}</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts">
  import draggable from 'vuedraggable';
  import LayoutItem from '../components/LayoutItem.vue';
  import { defineComponent, computed, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { Form, Empty, Button, TypographyTitle } from 'ant-design-vue';
  import gridLayout from 'vue-grid-layout';

  // 这个组件不是默认导出的，
  // 如果你之前是通过“app.use(Vue3DraggableResizable)”注册的，
  // 那么你这里就不需要再引入了，因为DraggableContainer这个已经被全局注册了，你可以直接使用
  import { DraggableContainer } from 'vue3-draggable-resizable';
  export default defineComponent({
    name: 'FormComponentPanel',
    components: {
      LayoutItem,
      draggable,
      Form,
      Empty,
      Button,
      TypographyTitle,
      DraggableContainer,
      GridLayout: gridLayout.GridLayout,
      GridItem: gridLayout.GridItem,
    },
    emits: ['handleSetSelectItem'],
    setup(_, { emit }) {
      const { formConfig } = useFormDesignState();
      const submitFormTemplate = () => {
        console.log('submitFormTemplate', formConfig.value);
      };
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
      const layout = ref([
        { x: 0, y: 0, w: 12, h: 2, i: '0' },
        { x: 2, y: 0, w: 2, h: 4, i: '1' },
        { x: 4, y: 0, w: 2, h: 5, i: '2' },
        { x: 6, y: 0, w: 2, h: 3, i: '3' },
        { x: 8, y: 0, w: 2, h: 3, i: '4' },
        { x: 10, y: 0, w: 2, h: 3, i: '5' },
        { x: 0, y: 5, w: 2, h: 5, i: '6' },
        { x: 2, y: 5, w: 2, h: 5, i: '7' },
        { x: 4, y: 5, w: 2, h: 5, i: '8' },
        { x: 6, y: 3, w: 2, h: 4, i: '9' },
        { x: 8, y: 4, w: 2, h: 4, i: '10' },
        { x: 10, y: 4, w: 2, h: 4, i: '11' },
        { x: 0, y: 10, w: 2, h: 5, i: '12' },
        { x: 2, y: 10, w: 2, h: 5, i: '13' },
        { x: 4, y: 8, w: 2, h: 4, i: '14' },
        { x: 6, y: 8, w: 2, h: 4, i: '15' },
        { x: 8, y: 10, w: 2, h: 5, i: '16' },
        { x: 10, y: 4, w: 2, h: 2, i: '17' },
        { x: 0, y: 9, w: 2, h: 3, i: '18' },
        { x: 2, y: 6, w: 2, h: 2, i: '19' },
      ])
      const draggable = ref(true)
      const resizable = ref(true)
      const index = ref(0)
      const eventLog = ref([])
      const moveEvent = (i, newX, newY) =>{
            const msg = "MOVE i=" + i + ", X=" + newX + ", Y=" + newY;
            eventLog.value.push(msg);
            console.log(msg);
            formConfig.value.schemas = formConfig.value.schemas.map(el=>{
              if(el.key === i){
                return {
                  ...el,
                  position: {
                    left: newX,
                    top: newY,
/*                     width: newW,
                    height: newH, */
                  }
                }
              }else{
                return el
              }
            })
        }
        const movedEvent = (i, newX, newY) =>{
            const msg = "MOVED i=" + i + ", X=" + newX + ", Y=" + newY;
            eventLog.value.push(msg);
            console.log(msg);
            formConfig.value.schemas = formConfig.value.schemas.map(el=>{
              if(el.key === i){
                return {
                  ...el,
                  position: {
                    left: newX,
                    top: newY,
                   /*  width: newW,
                    height: newH, */
                  }
                }
              }else{
                return el
              }
            })

        }
        const resizeEvent = (i, newH, newW, newHPx, newWPx) =>{
            const msg = "RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
            eventLog.value.push(msg);
            console.log(msg);
            formConfig.value.schemas = formConfig.value.schemas.map(el=>{
              if(el.key === i){
                return {
                  ...el,
                  position: {
/*                     left: newX,
                    top: newY, */
                    width: newW,
                    height: newH,
                  }
                }
              }else{
                return el
              }
            })
        }
        const resizedEvent = (i, newX, newY, newHPx, newWPx) =>{
            const msg = "RESIZED i=" + i + ", X=" + newX + ", Y=" + newY + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
            eventLog.value.push(msg);
            console.log(msg);

        }
        const containerResizedEvent = (i, newH, newW, newHPx, newWPx) =>{
            const msg = "CONTAINER RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
            eventLog.value.push(msg);
            console.log(msg);
        }
        const layoutCreatedEvent = (newLayout) =>{
            eventLog.value.push("Created layout");
            console.log("Created layout: ", newLayout)
        }
        const layoutBeforeMountEvent = (newLayout) =>{
            eventLog.value.push("beforeMount layout");
            console.log("beforeMount layout: ", newLayout)
        }
        const layoutMountedEvent = (newLayout) =>{
            eventLog.value.push("Mounted layout");
            console.log("Mounted layout: ", newLayout)
        }
        const layoutReadyEvent = (newLayout) =>{
            eventLog.value.push("Ready layout");
            console.log("Ready layout: ", newLayout)
        }
        const layoutUpdatedEvent = (newLayout) =>{
            eventLog.value.push("Updated layout");
            console.log("Updated layout: ", newLayout)
        }
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
      return {
        addItem,
        handleDragStart,
        formConfig,
        layoutTag,
        submitFormTemplate,
        layout,
        draggable,
        resizable,
        index,
        eventLog,
        moveEvent,
        movedEvent,
        resizeEvent,
        resizedEvent,
        containerResizedEvent,
        layoutCreatedEvent,
        layoutBeforeMountEvent,
        layoutMountedEvent,
        layoutReadyEvent,
        layoutUpdatedEvent,

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
