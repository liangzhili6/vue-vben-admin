<template>
  <div class="p-4 my-gantt">
    <!-- follow-up-list 随访 -->
    <Space direction="horizontal" class="FollowUpType-view">
      <Space>
        <RadioGroup v-model:value="FollowUpType" @change="changeFollowUpFinish">
          <RadioButton :value="'待随访'">待随访</RadioButton>
          <RadioButton :value="'已随访'">已随访</RadioButton>
        </RadioGroup>

        <!-- <Button type="primary" @click="handleOpenModal" :icon="h(PlusOutlined)">
          {{ '新增' }}
        </Button>
        <Button type="link" :icon="h(UploadOutlined)"> 导入 </Button>
        <Button type="link" :icon="h(DownloadOutlined)"> 导出 </Button> -->
        <Button type="link" :icon="h(DownloadOutlined)" @click="openDownloadOutlined">
          导出
        </Button>
      </Space>
      <Space>
        <Pagination
          v-model:current="BasicTableData.current"
          v-model:page-size="BasicTableData.size"
          :page-size-options="BasicTableData.pageSizeOptions"
          :total="BasicTableData.total"
          :defaultCurrent="1"
          show-size-changer
          show-less-items
          show-quick-jumper
          @showSizeChange="onShowSizeChange"
          @change="changePagination"
        >
          <template #buildOptionText="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </Pagination>
        <InputSearch
          ref="keywordRef"
          placeholder="请输入"
          v-model:value="keyword"
          :allowClear="true"
          @search="onSearchKeyword"
          class="keywordView"
          @pressEnter="onSearchKeyword"
        />
        <!-- <Button type="link" :icon="h(FunnelPlotOutlined)"> 筛选 </Button> -->
        <Popover trigger="click" placement="bottom" style="z-index: 9999">
          <template #content>
            <FilterDropdown
              ref="FilterDropdownRef"
              :BasicTableData="BasicTableData"
              :column="[]"
              :handleSearch="handleSearch"
            ></FilterDropdown>
          </template>
          <template #Footer>
            <Button type="primary" class="FilterDropdownButton" @click="props.handleSearch">
              筛选
            </Button>
            <span>Footer</span>
          </template>
          <Button type="link" :icon="h(FunnelPlotOutlined)"> 筛选 </Button>
        </Popover>
        <Button type="link" @click="initGantt" :icon="h(RedoOutlined)">
          {{ '刷新' }}
        </Button>
        <Dropdown placement="bottom" :arrow="{ pointAtCenter: true }">
          <Button>{{ data.timeList.find((v) => v.code === data.timeState).name }}</Button>
          <template #overlay>
            <Menu>
              <MenuItem
                v-for="(time, t_index) in data.timeList"
                @click="changeTime(time)"
                :key="t_index"
                :value="time.code"
                :label="time.code"
              >
                {{ time.name }}
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </Space>
    </Space>
    <!--     <Modal v-model:open="openDownloadOutlined" title="导出" @ok="handleOk">
      <Divider style="height: 1px" />

      <Form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
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
      </Form>
    </Modal> -->
    <div id="gantt_herefour" class="gantt-container"></div>
    <VFormAddValue
      ref="eFormAddValue"
      :key="formConfig.title"
      :formConfig="formConfig"
      :handleGetDatas="handleGetDatas"
      :updateDynamicValue="updateDynamicValue"
    />
    <ExportData
      ref="DownloadOutlinedRef"
      :keyList="JSON.stringify(BasicTableData.columns)"
    ></ExportData>
  </div>
</template>

<script lang="ts" setup>
  import { FilterDropdown } from '@/components/FilterDropdown';
  import ExportData from '@/views/follow-up/components/export-data.vue';

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
    PlusOutlined,
    ArrowLeftOutlined,
    EditOutlined,
    CopyOutlined,
    UploadOutlined,
    DownloadOutlined,
    DeleteOutlined,
    WarningOutlined,
    FunnelPlotOutlined,
    RedoOutlined,
  } from '@ant-design/icons-vue';
  import VFormAddValue from '@/views/form-design/components/VFormAddValue/index.vue';
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
  import dayjs from 'dayjs';
  import {
    getOneFieldApi,
    getAllDynamicValueApi,
    AddDynamicValueApi,
    getOneDynamicValueApi,
    UpdataDynamicValueApi,
    DeleTeDynamicValueApi,
  } from '@/api/sys/data';
  import type { UnwrapRef } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { IFormConfig } from '@/views/form-design/typings/v-form-component';
  import { cloneDeep } from 'lodash-es';
  import { gantt } from 'dhtmlx-gantt';
  import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
  import { useFormStore } from '@/store/modules/form';
  import { IToolbarMethods } from '@/views/form-design/typings/form-type';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Dayjs } from 'dayjs';
  import {
    downloadByUrl,
    downloadByData,
    downloadByBase64,
    downloadByOnlineUrl,
  } from '@/utils/file/download';
  const { notification } = useMessage();
  interface FormState {
    type: string;
    key: string;
  }
  const formRef = ref();
  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const formState: UnwrapRef<FormState> = reactive({
    type: '全部数据',
    key: '全部字段',
  });
  const FormStore = useFormStore();
  const eFormAddValue = ref<null | IToolbarMethods | any>(null);
  const RandomOneData = ref<any>(null);
  const recordValue = ref<any>(null);
  const DownloadOutlinedRef = ref<any>(null);
  const openDownloadOutlined = () => {
    DownloadOutlinedRef.value.openDownloadOutlined = true;
    console.log('openDownloadOutlined', DownloadOutlinedRef.value);
  };
  const handleOk = () => {
    //导出
    console.log('handleOk', formRef.value, formState);
    downloadByData('text content', 'testName.txt');
  };
  const formConfig = ref<IFormConfig>({
    title: '新增表单',
    submitFormTemplateTxt: '保存数据',
    // 表单配置
    schemas: [],
    layout: 'horizontal',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
    currentItem: {
      component: '',
      componentProps: {},
    },
    activeKey: 1,
  });
  const keyword = ref<any>('');
  const keywordRef = ref<any>(true);
  const FollowUpType = ref<any>('待随访');
  const FilterDropdownRef = ref<any>(null);
  const onShowSizeChange = (current: any, pageSize: any) => {
    console.log('current---175', current, 'pageSize', pageSize);
    BasicTableData.size = pageSize;
    BasicTableData.current = current;
  };
  const changePagination = (current: any, pageSize: any) => {
    console.log('current', current, 'pageSize', pageSize);
    BasicTableData.size = pageSize;
    BasicTableData.current = current;
  };
  const BasicTableData = reactive({
    list: [],
    versionList: [],
    columns: [],
    current: 1,
    size: 20,
    total: 0,
    pageSizeOptions: ['20', '50', '100'],
    followUpFinish: 1,
    conditions: [],
  });
  const handleSearch = async () => {
    BasicTableData.conditions = FilterDropdownRef.value.searchList.conditions.filter(
      (el) => el.id && el.op && el.value,
    );
    await initGantt();
  };
  const changeFollowUpFinish = (val) => {
    BasicTableData.followUpFinish = val.target.value === '待随访' ? 1 : 2;
    initGantt();
  };
  const data = reactive({
    timeList: [
      {
        name: '日视图',
        code: 'day',
      },
      {
        name: '周视图',
        code: 'week',
      },
      {
        name: '月视图',
        code: 'month',
      },
      {
        name: '季视图',
        code: 'quarter',
      },
      {
        name: '年视图',
        code: 'year',
      },
    ],
    timeState: 'day',
    demoData: {
      data: [
        /* {
          id: 520,
          _journal_number_49035263951: '111',
          projectName: '项目1',
          startTime: '2023-09-25',
          endTime: '2023-10-31',
          showEndTime: '2023-11-01',
          projectStatus: '暂无任务',
          projectProgress: 1,
          projectRatio: '',
          projectTotalTime: 0,
          projectUsedTime: 0,
          functionName: '',
          xmdj: '2',
          cityName: '成都',
          name: '1',
          projectMap: {},
          parent: 0,
          start_date: '2023-01-01 16:00:00.000',
          end_date: '2024-10-31 16:00:00.000',
          progress: 1,
          duration: 37,
        } */
      ],
    },
  });
  const onSearchKeyword = (searchValue: string) => {
    initGantt();
  };

  const zoomConfig = {
    levels: [
      {
        name: 'day',
        scale_height: 60,
        min_column_width: 60,
        scales: [
          { unit: 'month', format: '%Y-%m' },
          { unit: 'day', step: 1, format: '%d' },
        ],
      },
      {
        name: 'week',
        scale_height: 60,
        min_column_width: 60,
        scales: [
          {
            unit: 'month',
            step: 1,
            format: '%Y-%m',
          },
          {
            unit: 'week',
            step: 1,
            format: '%W周',
          },
        ],
      },
      {
        name: 'month',
        scale_height: 60,
        min_column_width: 60,
        scales: [
          { unit: 'year', format: '%Y年' },
          {
            unit: 'month',
            step: 1,
            format: '%M',
          },
        ],
      },
      {
        name: 'quarter',
        height: 60,
        min_column_width: 110,
        scales: [
          {
            unit: 'year',
            step: 1,
            format: '%Y年',
          },
          {
            unit: 'quarter',
            step: 1,
            format: function (date) {
              return (
                '第' +
                Math.floor(
                  gantt.date.date_to_str('%m')(date) % 3 == 0
                    ? gantt.date.date_to_str('%m')(date) / 3
                    : gantt.date.date_to_str('%m')(date) / 3 + 1,
                ) +
                '季'
              );
            },
          },
        ],
      },
      {
        name: 'year',
        scale_height: 60,
        min_column_width: 150,
        scales: [
          { unit: 'year', step: 1, format: '%Y年' },
          {
            unit: 'quarter',
            step: 2,
            format: function (date) {
              return gantt.date.date_to_str('%m')(date) <= 6 ? '上半年' : '下半年';
            },
            date: function (date) {},
          },
        ],
      },
    ],
  };
  const handleGetDatas = async (_data, id) => {
    /* const data = await AddDynamicValueApi({fieldValueJson: JSON.stringify(_data), fromId: id,joinValue: RandomOneData.value})
    notification.success({
      message: data,
      duration: 3,
    });
    getFormManagerList();
    handleBasicColumns();
    FormStore.updateIsPreview(true)
    // isEdit.value = false
    if(FormStore.childrenSubmit.text === '子表单提交'){
      FormStore.updateChildrenSubmit('')
    } */
  };
  const updateDynamicValue = async (_data, fromId) => {
    console.log(_data, fromId)
     const data = await UpdataDynamicValueApi({fieldValueJson: JSON.stringify(_data), formName: '随访记录', id: _data.id,joinValue: RandomOneData.value })
    notification.success({
      message: data,
      duration: 3,
    });
    initGantt();
    FormStore.updateIsPreview(true)
    // isEdit.value = false
    if(FormStore.childrenSubmit.text === '子表单提交'){
      FormStore.updateChildrenSubmit('')
    }
  };
  const handleAllDynamicValueApi = async (callback) => {
    try {
      const data = await getAllDynamicValueApi({
        current: BasicTableData.current,
        size: BasicTableData.size,
        fromId: 0,
        sortType: 0,
        param: keyword.value,
        fromName: '随访记录',
        followUpStatus: 2,
        conditions: BasicTableData.conditions,
        followUpFinish: BasicTableData.followUpFinish,
      });
      BasicTableData.list = data.records;
      BasicTableData.total = data.total;
      if (callback) {
        callback(data);
      }
    } catch (e) {}
    return BasicTableData.list;
  };
  const handleBasicColumns = async (callback) => {
    await getOneFieldApi({
      id: 0,
      // formVersion: history.state.formVersion,
      formName: '随访记录',
    })
      .then((res) => {
        if (res && res.schemas && res.schemas.length) {
          formConfig.value = res as any;
          if (callback) {
            callback(res);
          }
          let arr1 = res.schemas.map((item) => {
            return {
              title: item.label,
              dataIndex: item.key,
            };
          });
          BasicTableData.columns = [
            ...arr1,
            { title: '提交者', dataIndex: 'createBy' },
            { title: '提交时间', dataIndex: 'createTime' },
            { title: '更新者', dataIndex: 'modifiedBy' },
            { title: '更新时间', dataIndex: 'modifiedAt' },
          ].map((el: any) => {
            return {
              ...el,
              value: el.dataIndex,
              label: el.title,
              sorter: true,
              customFilterDropdown: true,
              onFilter: (value, record) => {
                return record.formName.toString().toLowerCase().includes(value.toLowerCase());
              },
              onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                  setTimeout(() => {
                    FilterDropdownRef.value.addSearchItem(el.dataIndex);
                  }, 100);
                }
              },
            };
          });
        }
      })
      .catch((e) => {
        console.log('e', e);
      });
  };
  //初始化甘特图
  const initGantt = async () => {
    gantt.clearAll();
    let dateToStr = gantt.date.date_to_str('%Y.%m.%d');
    gantt.config.grid_width = 150;
    gantt.config.add_column = false; //添加符号

    //时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
    gantt.config.autofit = true;
    gantt.config.row_height = 40;
    gantt.config.bar_height = 20;
    gantt.config.fit_tasks = true; //自动延长时间刻度，以适应所有显示的任务
    gantt.config.auto_types = true; //将包含子任务的任务转换为项目，将没有子任务的项目转换回任务
    gantt.config.xml_date = '%Y-%m-%d'; //甘特图时间数据格式
    gantt.config.readonly = true; //是否只读

    gantt.templates.task_text = function (start, end, task) {
      return (
        dayjs(start).format('YYYY-MM-DD') + '~' + dayjs(end).format('YYYY-MM-DD')
        // dayjs(start).format('YYYY-MM-DD hh:mm:ss') + '~' + dayjs(end).format('YYYY-MM-DD hh:mm:ss')
      );
    };
    await handleBasicColumns((res: any) => {
      let arr = [];
      arr = res.schemas.filter((el: any) => el.label === '患者编号' || el.label === '访视二备注');
      gantt.config.columns = arr.map((item: any) => {
        return {
          ...item,
          name: item.key,
          label: item.label,
          align: 'center',
          // tree: true,
          width: 120,
        };
      });
    });
    gantt.i18n.setLocale('cn'); //设置语言
    gantt.init('gantt_herefour'); //初始化
    let arr = [];
    await handleAllDynamicValueApi((data: any) => {
      arr = data?.records?.map((items: any) => {
        return {
          ...items,
          id: items.id,
          projectName: items._journal_number_34973387723,
          startTime: '2023-08-28',
          endTime: '2023-10-25',
          showEndTime: '2023-10-26',
          functionName: items._input_text_area_937637118210,
          start_date: items._date_picker_51823313086,
          end_date: items._date_picker_02245669357,
          // end_date: '2023-10-16 23:00:00:',
          /*     projectProgress: 1,
          projectRatio: 1,
          parent: 1,
          progress: 1, */
        };
      });
    });
    data.demoData.data = arr;
    var calendar1 = gantt.createCalendar();
    gantt.addCalendar(calendar1);
    await gantt.parse(data.demoData); //填充数据
    // 刷新数据
    // 添加今日的Marker
    gantt.plugins({
      marker: true,
    });
    gantt.addMarker({
      start_date: new Date(),
      text: '今日',
    });
    await gantt.refreshData();
    gantt.attachEvent('onTaskClick', async function (id) {
      // 在这里添加点击事件的处理逻辑
      // console.log('点击了行号为' + id + '的条目');
      if (FollowUpType.value === '待随访') {
        FormStore.updateIsPreview(false);
        recordValue.value = await getOneDynamicValueApi({ valueId: id });
        const config = await cloneDeep(formConfig.value);
        eFormAddValue!.value!.setFormModelfun(recordValue.value, true, config);
      }
    });
    await scrollInit();
    await gantt.ext.zoom.init(zoomConfig); //配置初始化扩展
    gantt.ext.zoom.setLevel(data.timeState); //切换到指定的缩放级别
  };

  //拖拽滚动视图
  const scrollInit = () => {
    const nav = document.querySelectorAll('.gantt_task')[0];
    const parNav = document.querySelectorAll('.gantt_hor_scroll')[0];
    // parNav?parNav.scrollLeft = 0: null
    let flag;
    let downX;
    let scrollLeft;
    nav.addEventListener('mousedown', function (event) {
      flag = true;
      downX = event.clientX; // 获取到点击的x下标
      scrollLeft = this.scrollLeft; // 获取当前元素滚动条的偏移量
    });
    nav.addEventListener('mousemove', function (event) {
      if (flag) {
        let moveX = event.clientX;
        let scrollX = moveX - downX;
        parNav.scrollLeft = scrollLeft - scrollX;
      }
    });
    // 鼠标抬起停止拖动
    nav.addEventListener('mouseup', function () {
      flag = false;
    });
    // 鼠标离开元素停止拖动
    nav.addEventListener('mouseleave', function (event) {
      flag = false;
    });
  };

  const changeTime = (time) => {
    data.timeState = time.code;
    gantt.ext.zoom.setLevel(time.code);
  };
  onBeforeMount(() => {
    gantt.clearAll();
  });
  onMounted(async () => {
    await initGantt();
  });
  watchEffect(() => {});
  defineExpose({
    ...toRefs(data),
  });
</script>
<style scoped lang="scss">
  .my-gantt {
    // height: 100%;
    height: calc(100% - 20px);
    background: #ffffff;
    margin: 10px;
    padding: 10px;
    .FollowUpType-view {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .time-box {
      text-align: center;
      margin-bottom: 20px;
    }
    .gantt-container {
      width: 100%;
      height: 100%;
      height: calc(100% - 40px);
      .weekend {
        background: #f6f6f6;
        // color: #fff;
      }
    }
  }

  /* .gantt_container {
  border-color: transparent !important;
  .gantt_right {
    top: 0% !important;
    display: flex !important;
  }
  .gantt_side_content {
    overflow: visible !important;
  }
  .weekend {
    background: #ff9e2f;
    color: #fff !important;
  }
  // .gantt_selected {
  //   background: #f4f5fe !important;
  // }
  .gantt_grid_data .gantt_row.gantt_selected {
    background: #f4f5fe !important;
  }
  .gantt_task_row.gantt_selected {
    background: #f4f5fe !important;
  }
  .gantt_grid_data .gantt_row.odd:hover,
  .gantt_grid_data .gantt_row:hover {
    background: #f4f5fe !important;
  }
  .gantt_task_line.gantt_selected {
    box-shadow: 0 0 5px #f4f5fe;
  }
  .gantt_grid_scale .gantt_grid_head_cell {
    font-size: 14px;
    font-weight: 400;
    color: rgba(28, 28, 28, 0.76);
  }
  .gantt_task .gantt_task_scale .gantt_scale_cell {
    font-size: 12px;
    font-weight: 400;
    color: rgba(28, 28, 28, 0.76);
  }
  .gantt_side_content.gantt_right {
    padding-left: 5px;
    top: 20%;
  }
  .gantt_task_line.gantt_project {
    background: #656bff;
    border: none;
  }
  .gantt_task_line {
    border-radius: 5px;
    background: #b0bdff;
    border: none;
  }
  .gantt_task_content {
    color: #fff;
  }
  .gantt_task_progress {
    display: none;
  }
  .gantt_selected .weekend {
    background: #2f51ff;
  }
  .weekend-border-bottom {
    border-bottom: 1px solid rgba(217, 217, 217, 1);
  }
  .gantt_grid_scale .gantt_grid_head_cell {
    border-right: 1px solid #d9d9d9 !important;
    &:nth-last-child(1) {
      border-right: none !important;
    }
  }
  .gantt_row,
  .gantt_task_row {
    border-bottom: none;
  }
  .gantt_task_cell {
    border-right-color: rgba(28, 28, 28, 0.1);
  }
  .gantt_row_task {
    border-bottom: 1px solid rgba(217, 217, 217, 1);
  }
  .gantt_row_project {
    border-bottom: 1px solid rgba(217, 217, 217, 1) !important;
  }
  .gantt_cell {
    border-right: 1px solid rgba(217, 217, 217, 1) !important;
  }
  .gantt_last_cell {
    border-right: none !important;
  }
  // .day-item{
  //   width: 60px !important;
  // }、
  .gantt_marker {
    z-index: 99;
    background: #ff4141;
  }
  .gantt_tree_icon {
    width: 21px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% auto;
    margin-right: 5px;
  }
  .gantt_folder_open {
    background-image: url('./../img/gante/gantt_folder_open.png') !important;
    margin-right: 4px;
  }
  .gantt_folder_closed {
    background-image: url('./../img/gante/gantt_folder_closed.png') !important;
    margin-right: 4px;
  }
  .gantt_file {
    background-image: url('./../img/gante/gantt_file.png') !important;
    margin-right: 4px;
  }
  .gantt_close {
    width: 12px !important;
    background-image: url('./../img/gante/gantt_close.png') !important;
    margin-right: 6px;
  }
  .gantt_open {
    width: 12px !important;
    background-image: url('./../img/gante/gantt_close.png') !important;
    transform: rotate(-90deg);
  }
  .dont-show {
    display: none;
    height: 0 !important;
  }
  .gantt_task_line{
    min-width: 21px;
  }
  .gongxu{
    background-image: url('./../img/gante/gongxu.png') !important;
  }
}
.gantt-error {
  display: none !important;
}

.shadow-right {
  box-shadow: 1px 0px 4px 0px rgba(0, 0, 0, 0.15);
}

.lag-advane {
  display: flex;
  align-items: center;
  position: absolute;
  top: -50% !important;
  z-index: 12;
  // left: -100%;
  .icon {
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-right: 2px;
  }
  .lag {
    background-image: url('./../../assets/img/manage/icon_lag.png');
  }
  .lag-value {
    color: #ff4141;
  }
  .advane {
    background-image: url('./../../assets/img/manage/icon_advance.png');
  }
  .advane-value {
    color: #14cf20;
  }
}

//员工任务详情
.myself-project-bar {
  display: flex;
  align-items: center;
  .bar-right-item {
    width: 90px;
    height: 21px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
  }
  .myself-project-progress {
    position: absolute;
    left: 6px;
    width: 40px;
    text-align: center;
    color: #fff;
  }
  .myself-project-overTime {
    position: absolute;
    left: 71px;
    text-align: center;
    color: #000000;
  }
  .task-lag {
    background-image: url('./../img/gante/task_lag.png');
  }
  .task-finish {
    background-image: url('./../img/gante/task_finish.png');
  }
}

// 项目总视图
.tooltip-box {
  .project-name {
    font-size: 14px;
  }
}

.bar-right-item {
  display: flex;
  align-items: center;
  align-content: center;
}

// manage 页面 样式
.finish-state-icon {
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.finish-progress {
  width: 54px;
  height: 21px;
  line-height: 24px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
}
.finish-schedule {
  display: flex;
  align-items: center;
  margin-left: 4px;
}
.finish-finish {
  .finish-schedule {
    display: none;
  }
}
//任务超前右侧样式
.finish-advance {
  .finish-state-icon {
    background-image: url('./../../assets/img/manage/icon_finish.png');
  }
  .finish-progress {
    background-image: url('./../../assets/img/manage/back_advance.png');
  }
  .finish-schedule {
    color: #14cf20;
    .finish-schedule-icon {
      background-image: url('./../../assets/img/manage/icon_advance.png');
    }
  }
}
//滞后右侧样式
.finish-lag {
  .finish-state-icon {
    background-image: url('./../../assets/img/manage/icon_error.png');
  }
  .finish-progress {
    background-image: url('./../../assets/img/manage/back_lag.png');
  }
  .finish-schedule {
    color: #ff4141;
    .finish-schedule-icon {
      background-image: url('./../../assets/img/manage/icon_lag.png');
    }
  }
}
.finish-schedule-icon {
  width: 20px;
  height: 20px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-right: 2px;
}
.special-item {
  background: rgba(203, 212, 255, 0.5);
  border: 1px dashed #b0bdff;
  border-radius: 4px;
  padding: 0 4px;
  color: rgba(51, 51, 51, 1);
}
.task-progress-line {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  z-index: 999;
  height: 6px;
  background: #eeeeee;
  .line-bar {
    position: absolute;
    left: 0;
    height: 6px;
    background: #2f51ff;
  }

  .value {
    position: absolute;
    right: 2px;
    bottom: 7px;
    font-size: 12px;
    font-weight: 400;
    color: #979797;
    line-height: 1;
  }
} */
</style>

<style>
  .gantt_bars_area .gantt_task_content {
    color: #000000 !important;
    width: 160px !important;
    /* top: -10px; */
    overflow: visible;
  }

  .FilterDropdown-view {
    padding: 8px;
  }
  .FilterDropdownLi {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .FilterDropdownInput {
    width: 188px;
    margin-bottom: 8px;
    display: block;
  }
  .FilterDropdownButton {
    width: 90px;
  }
  .FilterDropdownBtn {
    display: flex;
    flex: 1;
    justify-content: end;
  }
  .FilterDropdownButtonTwo {
    width: 90px;
    margin-right: 8px;
  }
</style>
