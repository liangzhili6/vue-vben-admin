<template>
  <div>
    <!-- export-data.vue 导出数据 -->
    <Modal v-model:open="openDownloadOutlined" title="导出" @ok="handleOk">
      <Divider style="height: 1px" />

      <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- 

     @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
   -->
        <FormItem label="数据选择" name="region">
          <Select v-model:value="formState.type" placeholder="please select your zone">
            <SelectOption value="全部数据">全部数据</SelectOption>
            <SelectOption value="选中的数据">选中的数据</SelectOption>
            <SelectOption value="筛选排序后的数据">筛选排序后的数据</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="字段选择" name="region">
          <Select v-model:value="formState.key" placeholder="please select your zone">
            <SelectOption value="shanghai">全部字段</SelectOption>
            <SelectOption value="beijing">列设置中的字段</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="关联导出" name="region" v-if="props.showLink">
          <Select v-model:value="formState.link" placeholder="please select your zone">
            <SelectOption value="shanghai">全部字段</SelectOption>
            <SelectOption value="beijing">列设置中的字段</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import {
    Button,
    Input,
    InputSearch,
    Popconfirm,
    message,
    Radio,
    RadioGroup,
    RadioButton,
    Dropdown,
    Menu,
    MenuItem,
    Pagination,
    Space,
    Popover,
    Modal,
    Form,
    FormItem,
    SelectOption,
    Select,
    Divider,
  } from 'ant-design-vue';
  import { useFormStore } from '@/store/modules/form';
  import {
    reactive,
    toRefs,
    onBeforeMount,
    onMounted,
    watchEffect,
    defineExpose,
    h,
    ref,
  } from 'vue';

  import {
    downloadByUrl,
    downloadByData,
    downloadByBase64,
    downloadByOnlineUrl,
  } from '@/utils/file/download';
  //
  import { ExportExcelApi } from '@/api/sys/data';
  import type { UnwrapRef } from 'vue';
  interface FormState {
    type: string;
    key: string;
    link?: string;
    linkList?: any;
    fieldJson?: any;
  }
  const props = defineProps({
    showLink: { type: Boolean, default: false },
    linkList: { type: Array, default: [] },
    keyList: { type: String, default: '' },
  });
  const formRef = ref();
  const labelCol = { span: 5 };
  const wrapperCol = { span: 18 };
  const formState: UnwrapRef<FormState> = reactive({
    type: '全部数据',
    key: '全部字段',
    link: '',
    linkList: [],
    fieldJson: props.keyList,
  });
  const openDownloadOutlined = ref<boolean>(false);
  const handleOk = async () => {
    //导出
    const content = await ExportExcelApi({
      conditions: [
        {
          id: '',
          op: '',
          value: '',
        },
      ],
      fieldJson: props.keyList,
      formInfo: [
        {
          followUpFinish: 2,
          followUpStatus: 4,
          formId: 0,
          formName: '随访记录',
        },
      ],
      param: '',
    });
    /* let link = document.createElement("a");
    link.style.display = "none";
    link.href = content;
    let excelName = "随访记录.xlsx";
    link.setAttribute("download", excelName);
    document.body.appendChild(link);
    //模拟点击事件
    link.click();
    //导出成功后删除这个标签并释放blob对象
    link.remove(); */
    // console.log('props.keyList', props.keyList);
    // console.log('content', content);
    await downloadByData(content, '随访记录.xlsx');
  };

  defineExpose({ handleOk, openDownloadOutlined, formState });
</script>
