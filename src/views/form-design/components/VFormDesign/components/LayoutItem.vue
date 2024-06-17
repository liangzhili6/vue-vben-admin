<!--
 * @Description: 表单项布局控件
 * 千万不要在template下面的第一行加注释，因为这里拖动的第一个元素
-->

<template>
   <DraggableContainer :adsorbRows="[10,20,30]"  :referenceLineVisible="false">
  <!-- 拖拽组件
      v-model:active="dragData.active"-->
  <Vue3DraggableResizable
      classNameDraggable="draggable"
      :initW="schema.position.width"
      :initH="schema.position.height"
      v-model:x="schema.position.left"
      v-model:y="schema.position.top"
      v-model:w="schema.position.width"
      v-model:h="schema.position.height"
      :active="schema.key === currentItem.key"
      :draggable="true"
      :resizable="true"
      :parent="true"
      @activated="print('activated')"
      @deactivated="print('deactivated')"
      @drag-start="print('drag-start')"
      @resize-start="print('resize-start')"
      @dragging="print('dragging')"
      @resizing="print('resizing')"
      @drag-end="print('drag-end')"
      @resize-end="print('resize-end')"
  >
  
  <!-- {{schema.key === currentItem.key}} 
    <Col v-bind="colPropsComputed" > -->
    <div class="canvas">
    <!-- <VueDragResize
      contentClass="box-currentItem"
      :isActive="schema.key === currentItem.key?true:false"
      :w="schema.position.width"
      :h="schema.position.height"
      v-on:resizing="resize"
      v-on:dragging="resize"
      @clicked="onActivated"
    > -->
      <!-- <div> -->
      <template  v-if="['Grid'].includes(schema.component)">
        <div
          class="grid-box"
          :class="{ active: schema.key === currentItem.key }"
          @click.stop="handleSetSelectItem(schema)"
        >
          <Row class="grid-row" v-bind="schema.componentProps">
            <Col
              class="grid-col"
              v-for="(colItem, index) in schema.columns"
              :key="index"
              :span="colItem.span"
            >
             <!--  <draggable
                class="list-main draggable-box"
                :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
                v-bind="{
                  group: 'form-draggable',
                  ghostClass: 'moving',
                  animation: 180,
                  handle: '.drag-move',
                }"
                item-key="key"
                v-model="colItem.children"
                @start="$emit('dragStart', $event, colItem.children)"
                @add="$emit('handleColAdd', $event, colItem.children)"
              > -->
                <template #item="{ element }">
                  <LayoutItem
                    class="drag-move"
                    :schema="element"
                    :current-item="currentItem"
                    @handle-copy="$emit('handle-copy')"
                    @handle-delete="$emit('handle-delete')"
                  />
                </template>
  <!--             </draggable> -->
            </Col>
          </Row>
          <FormNodeOperate :schema="schema" :currentItem="currentItem" />
        </div>
      </template>
      <FormNode
        v-else
        :key="schema.key"
        :schema="schema"
        :current-item="currentItem"
        @handle-copy="$emit('handle-copy')"
        @handle-delete="$emit('handle-delete')"
      />
    <!-- </div> -->

    <!-- </VueDragResize> -->
  </div>
  <!-- </Col> -->
</Vue3DraggableResizable>
</DraggableContainer>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';
  import draggable from 'vuedraggable';
  import FormNode from './FormNode.vue';
  import FormNodeOperate from './FormNodeOperate.vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { IVFormComponent } from '../../../typings/v-form-component';
  import { Row, Col } from 'ant-design-vue';

// 这个组件不是默认导出的，
// 如果你之前是通过“app.use(Vue3DraggableResizable)”注册的，
// 那么你这里就不需要再引入了，因为DraggableContainer这个已经被全局注册了，你可以直接使用
import { DraggableContainer } from 'vue3-draggable-resizable'
  import VueDragResize from 'vue-drag-resize/src';
  import VueDraggableResizable from 'vue-draggable-resizable-gorkys/src';
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//需引入默认样式
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
// 导入默认样式
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css'
  export default defineComponent({
    name: 'LayoutItem',
    components: {
      FormNode,
      FormNodeOperate,
      draggable,
      Row,
      Col,
      VueDragResize,
      VueDraggableResizable,
      Vue3DraggableResizable,
      DraggableContainer,
    },
    props: {
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      currentItem: {
        type: Object,
        required: true,
      },
    },
    emits: ['dragStart', 'handleColAdd', 'handle-copy', 'handle-delete'],
    setup(props) {
      const {
        formDesignMethods: { handleSetSelectItem },
        formConfig,
      } = useFormDesignState();
      const state = reactive({
        width: 200,
        height: 120,
        top: 0,
        left: 0,
      });
      const resize = (newRect) => {
        console.log('resize', newRect);
        formConfig.value.currentItem!.position.width = newRect.width;
        formConfig.value.currentItem!.position.height = newRect.height;
        formConfig.value.currentItem!.position.top = newRect.top;
        formConfig.value.currentItem!.position.left = newRect.left;
        // formConfig.value.currentItem!.componentProps.style = `width:${newRect.width};height:${newRect.height};`
      };
      const onActivated = () => {
        console.log('onActivated')
      }
      const colPropsComputed = computed(() => {
        console.log('props.schema', props.schema, props.schema.colProps)
        const { colProps = {} } = props.schema;
        return colProps;
      });

      const print = (val) => {
      console.log(val)
    }
      const list1 = computed(() => props.schema.columns);

      // 计算布局元素，水平模式下为ACol，非水平模式下为div
      const layoutTag = computed(() => {
        return formConfig.value.layout === 'horizontal' ? 'Col' : 'div';
      });
      const onResize = (x, y, width, height) => {
      state.width = x
      state.height = y
      state.width = width
      state.height = height
    }
    const onDrag = (x, y) => {
      state.width = x
      state.height = y
    }
      return {
        ...toRefs(state),
        colPropsComputed,
        handleSetSelectItem,
        layoutTag,
        list1,
        resize,
        onActivated,
        onDrag,
        onResize,
        print,
      };
    },
  });
</script>
<style lang="less">
  @import url('../styles/variable.less');

  .layout-width {
    width: 100%;
  }

  .hidden-item {
    background-color: rgb(240 191 195);
  }
/*   .content-container {
    width: 100%;
    height: 100%;
  } */
  /* .vdr.active:before{
    outline: none
  }
  .canvas {
      height: calc(100% - 60px);
      border: 1px solid gray;
      position: relative;
      margin: 5px 10px 10px 10px;
      .item-canvas {
        border:1px solid #b5b5b5;
      }
      .title {
        top: 50%;
        left: 50%;
        color: #000;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        transform: translate(-50%,-50%);
      }
 
      .areaContainer {
        width: 100%;
        height: 100%;
      }
} */
.drag-move{
  width: unset !important;
  position: unset !important;
}
</style>
