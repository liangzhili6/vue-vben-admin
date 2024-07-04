<!-- 
  子表单
 -->
<template>
  <div style="height: 100%; border: 1px solid #cccccc" class="form-panel v-form-container">
    <Empty
      class="empty-text"
      v-show="schema.children.length === 0"
      description="从左侧选择控件添加"
    />
    <Form v-bind="formConfig" style="height: 100%">
      <div class="draggable-box" v-if="!FormStore.previewView">
        <!-- v-if="['custom'].includes(formConfig?.currentItem.componentProps['SubformType'])" -->
        <!-- Subform 子表单 -->
        <grid-layout
          :layout.sync="schema.children"
          :col-num="100"
          :row-height="40"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="[1, 1]"
        >
          <grid-item
            v-for="item in schema.children"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
          >
            <LayoutItem
              class="drag-move"
              :key="item.key"
              :schema="item"
              :data="schema.children"
              :current-item="formConfig?.currentItem || {}"
              :static="
                formConfig &&
                formConfig.currentItem &&
                formConfig.currentItem.component === item.component
                  ? true
                  : false
              "
            />
          </grid-item>
        </grid-layout>
      </div>
      <div
        v-if="
          FormStore.previewView &&
          ['custom'].includes(formConfig.currentItem.componentProps['SubformType'])
        "
      >
        <!-- v-if="['table'].includes(formConfig?.currentItem.componentProps['SubformType'])" -->
        <draggable
          class="list-main ant-row"
          group="form-draggable"
          :component-data="{ name: 'list', tag: 'div', type: 'transition-group' }"
          ghostClass="moving"
          :animation="180"
          handle=".drag-move"
          v-model="childrenList"
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
      </div>
      <div
        v-if="
          FormStore.previewView &&
          ['table'].includes(formConfig.currentItem.componentProps['SubformType'])
        "
      >
        <BasicTable
          ref="tableElRef"
          :dataSource="dataSource"
          :columns="getColumns"
          :bordered="true"
          :canResize="true"
          :showIndexColumn="false"
          editable
          :showTableSetting="false"
          :pagination="false"
          :scroll="{ x: 800, y: 500 }"
        >
          <template #bodyCell="{ column }">
            <template v-if="column.dataIndex === 'edit'">
              <Dropdown :trigger="['click']">
                <EllipsisOutlined @click.prevent />
                <template #overlay>
                  <Menu @click="editForm(column )">
                    <MenuItem key="复制" :item="column">
                      <a href="javascript:;">复制</a>
                    </MenuItem>
                    <MenuItem key="删除" :item="column">
                      <a href="javascript:;">删除</a>
                    </MenuItem>
                    <MenuItem key="上移" :item="column">
                      <a href="javascript:;">上移</a>
                    </MenuItem>
                    <MenuItem key="下移" :item="column">
                      <a href="javascript:;">下移</a>
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </template>
            <template v-else>
              <div>
                <LayoutItem
                  class="drag-move"
                  :schema="column"
                  :data="formConfig"
                  :current-item="formConfig.currentItem || {}"
                />
              </div>
            </template>
          </template>
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'edit'">
              <Dropdown :trigger="['click']">
                <EllipsisOutlined @click.prevent />
                <template #overlay>
                  <Menu @click="editForm(column)">
                    <MenuItem key="全屏" :item="column">
                      <a href="javascript:;">全屏</a>
                    </MenuItem>
                    <MenuItem key="导入" :item="column">
                      <a href="javascript:;">导入</a>
                    </MenuItem>
                    <MenuItem key="导出" :item="column">
                      <a href="javascript:;">导出</a>
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </template>
          </template>
        </BasicTable>
      </div>
      <Button v-if="FormStore.previewView && ['table'].includes(formConfig.currentItem.componentProps['SubformType'])" type="dashed" block style="width: calc(100% - 4px); margin: 2px;" @click="AddDataSource">
          <template #icon>
            <PlusOutlined />
          </template>
        </Button>
      <Button v-if="FormStore.previewView && ['custom'].includes(formConfig.currentItem.componentProps['SubformType'])" type="dashed" block style="width: calc(100% - 4px); margin: 2px;" @click="AddDataSourceCustom">
          <template #icon>
            <PlusOutlined />
          </template>
        </Button>
    </Form>
  </div>
</template>

<script lang="ts" name="Subform">
  import draggable from 'vuedraggable';
  import { defineComponent, computed, unref, ref, defineAsyncComponent, reactive, onMounted, onBeforeMount } from 'vue';
  import { asyncComputed } from '@vueuse/core';
  import {
    Form,
    Empty,
    TypographyTitle,
    Dropdown,
    Menu,
    Button,
    Switch,
    MenuItem,
  } from 'ant-design-vue';
  import { IVFormComponent, IFormConfig } from '@/views/form-design/typings/v-form-component';
  import { useFormModelState } from '@/views/form-design/hooks/useFormDesignState';
  import { omit } from 'lodash-es';
  import { EllipsisOutlined, DownOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons-vue';
  import { IToolbarMethods } from '@/views/form-design/typings/form-type';
  import VFormPreviews from '@/views/form-design/components/VFormPreview/useForm.vue';
  import { GetOneFormApi } from '@/api/sys/form';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash-es';
  import { useFormStore } from '@/store/modules/form';
  import gridLayout from 'vue-grid-layout';
  import { Table, TableSummaryCell } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { ColumnType } from 'ant-design-vue/es/table/interface';

  export default defineComponent({
    name: 'Subform',
    components: {
      TableSummaryCell,
      SmileOutlined,
      EllipsisOutlined,
      MenuItem,
      Dropdown,
      Menu,
      Button,
      Switch,
      BasicTable,
      draggable,
      LayoutItem: defineAsyncComponent(
        () => import('@/views/form-design/components/VFormDesign/components/LayoutItem.vue'),
      ),
      Empty,
      Form,
      PlusOutlined,
      VFormPreviews,
      GridLayout: gridLayout.GridLayout,
      GridItem: gridLayout.GridItem,
    },
    props: {
      formData: {
        type: Object,
        default: () => ({}),
      },
      schema: {
        type: Object as PropType<IVFormComponent>,
        required: true,
      },
      formConfig: {
        type: Object as PropType<IFormConfig>,
        // required: true,
      },
    },
    emits: ['update:form-data', 'change'],
    setup(props, { emit }) {
      const FormStore = useFormStore();
      const { formConfig } = unref(props);
      const handleImportData = () => {
        console.log('handleImportData');
      };
      const handleExport = () => {
        console.log('handleExport');
      };
      const editForm = (column) => {
        console.log('editForm--click', column);
      };
      const schemaList = reactive({
        // childrenList: props.schema.children
        childrenList: []
      });
      const childrenList = ref([])
      const dataSourceObj = ref({})
      // const eFormPreview = ref<null | IToolbarMethods>(null);
      // const itemProp = unref(props.schema);
      // console.log('itemProp', props.formConfig, props.formConfig?.currentItem?.component);

      const addItem = ({ newIndex }: any) => {
        /* formConfig.value.schemas = formConfig.value.schemas || [];
        const schemas = formConfig.value.schemas;
        schemas[newIndex] = cloneDeep(schemas[newIndex]);
        emit('handleSetSelectItem', schemas[newIndex]); */ 
      };
      const handleDragStart = (e: any) => {
        // emit('handleSetSelectItem', formConfig.value.schemas[e.oldIndex]);
      };
      const dataSource = ref([]);
      onBeforeMount(()=>{
        childrenList.value = props.schema.children.map((el)=>{
          return{
            ...el
          }
        })
      })
      const AddDataSourceCustom = () => {
        console.log('AddDataSourceCustom',props.schema.children, 'schemaList.childrenList', schemaList.childrenList, childrenList.value)
        childrenList.value = [...childrenList.value, ...props.schema.children]
        console.log('AddDataSourceCustom---------',props.schema.children, 'schemaList.childrenList', schemaList.childrenList, childrenList.value)

      }
      const AddDataSource = () => {
        // dataSource.value.push(dataSourceObj)
        console.log('dataSourceObj.value', dataSourceObj.value, 'dataSource.value', dataSource.value)
        // dataSource.value = [...dataSource.value, dataSourceObj.value]
        dataSource.value.push(dataSourceObj.value)
      }
      const getColumns = computed(() => {
        let columns = [];
        console.log('schema', props.schema);
        columns = props.schema.children?.map((el) => {
          console.log('el', el, el.field);
          dataSourceObj.value[el.field] = ''
          return {
            ...el,
            title: el.label,
            dataIndex: el.field,
            key: el.field,
            itemProps: {
              ...el.itemProps,
              "hiddenLabel": true
            }
          };
        });
        // console.log('dataSourceArr', dataSourceArr)
        dataSource.value.push(dataSourceObj.value)
        // dataSource.value = [...dataSource.value, dataSourceObj.value]
        console.log('dataSource.value', dataSource.value)
        return [{title: "",dataIndex: 'edit', width: 80}, ...columns] as unknown as ColumnType[];
      });
      return {
        // ...toRefs(state),
        // componentItem,
        /* itemProp,
        formItemProps,
        handleClick,
        asyncProps,
        cmpProps,
        handleChange,
        colPropsComputed,
        push,
        go,
        goBack,
        replace,
        eFormPreview,
        childrenDataProp, */
        getColumns,
        dataSource,
        formConfig,
        addItem,
        AddDataSource,
        FormStore,
        handleDragStart,
        handleImportData,
        handleExport,
        AddDataSourceCustom,
        schemaList,
        childrenList,
        dataSourceObj,
        editForm,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.icon) {
    width: 1em;
    height: 1em;
    overflow: hidden;
    fill: currentcolor;
    vertical-align: -0.15em;
  }

  .rule-props-content {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }

    .rule-props-item {
      position: relative;
      margin-bottom: 5px;
      // padding: 3px 2px;
      border-radius: 5px;
      background-color: #f0eded;

      :deep(.ant-form-item) {
        border: 0 !important;
      }

      &-close {
        position: absolute;
        z-index: 999;
        top: -5px;
        right: -5px;
        border-radius: 7px;
        background-color: #a3a0a0;
        color: #ccc;
        cursor: pointer;

        &:hover {
          color: #00c;
        }
      }
    }
  }
  .ant-descriptions-item {
    margin-bottom: 0px;
  }
  .form-panel {
    position: relative;
    height: 100%;
    height: 100vh;
    height: calc(100vh - 120px);
    min-height: 165px;
    .empty-text {
      position: absolute;
      z-index: 100;
      inset: -10% 0 0;
      height: 150px;
      margin: auto;
      color: #aaa;
    }
  }
  .draggable-box {
    height: 100%;
    // height: calc(100vh - 120px);
    width: 100%;
    // overflow: auto;
    .drag-move {
      min-height: 102px;
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
</style>
<style>
  .ant-form-item-control-input {
    min-height: 165px;
  }
</style>
