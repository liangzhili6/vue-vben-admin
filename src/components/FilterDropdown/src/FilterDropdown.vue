<!-- 
  关联记录
 -->
 <template>
  <!-- <div> -->
    <div class="FilterDropdown-view">
          <ul>
            <li v-for="(item, index) in searchList.conditions" :key="item.id" class="FilterDropdownLi">
            <Select v-model:value="item.id" class="FilterDropdownInput" :options="props.BasicTableData.columns.map(pro => ({ value: pro.dataIndex, label: pro.title }))" :disabled="true">
            </Select>
            <Select v-model:value="item.op" class="FilterDropdownInput" :placeholder="`请选择 ${props.column.title?props.column.title: ''}`">
              <Select.Option v-for="(val) in searchList.opList" :key="val.op" :value="val.op"> {{val.title}} </Select.Option>
            </Select>
            <Input
                ref="searchInput"
                :placeholder="`请输入 ${props.column.title?props.column.title: ''}`"
                v-model:value="item.value"
                class="FilterDropdownInput"
              /> 
              <Button type="link" :icon="h(DeleteOutlined)" @click="delSearchItem(item, index)"></Button>
            </li>
            <li class="FilterDropdownLi">
              <Select v-model:value="searchList.id" class="FilterDropdownInput" placeholder="+ 添加筛选条件" @change="addSearchItem">
                <Select.Option v-for="(val) in props.BasicTableData.columns" :key="val.dataIndex" :value="val.dataIndex"  :disabled="searchList.conditions.some((re) => re.id === val.dataIndex)"> {{val.title}} </Select.Option>
              </Select>
              <div class="FilterDropdownBtn">
                
              <Popover v-if="showSave" trigger="click" placement="bottom" style="z-index: 9999;" @confirm="confirm" @cancel="cancel">
                <template #content>
                  <Input
                      ref="filterNameRef"
                      placeholder="请输入筛选器名称"
                      v-model:value="searchList.filterName"
                      class="FilterDropdownInput"
                    /> 
                    
              <Button
                type="text"
                class="FilterDropdownButton"
                @click="props.handleSearch"
              >
                取消
              </Button>
              
              <Button
                type="primary"
                class="FilterDropdownButton"
                @click="props.handleSearch"
              >
                确定
              </Button>
                </template>
                <template #Footer>
                  
              <Button
                type="primary"
                class="FilterDropdownButton"
                @click="props.handleSearch"
              >
                筛选
              </Button>
                  <span>Footer</span>
                </template>
                <Button class="FilterDropdownButtonTwo" @click="save('clearFilters')">
                  保存
                </Button>
              </Popover>
              
             <!--  <Button v-else class="FilterDropdownButtonTwo" @click="save('clearFilters')">
                取消
              </Button> -->
              <Button
                type="primary"
                class="FilterDropdownButton"
                @click="props.handleSearch"
              >
                筛选
              </Button>
              </div>
            </li>
            
          </ul>
          <Divider style="height: 1px;" v-if="showSave" />
          <ul v-if="showSave" >
            <li class="FilterDropdownLi">
              <Tag closable @close="closeOld">Tag 2</Tag>
            </li>
          </ul>
            
        </div>
  <!-- </div> -->
</template>

<script lang="ts" setup name="FilterDropdown">
  import {  reactive,  ref,  h } from 'vue';
  import { Button, Select, Input, Tag, Popover, Divider } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
const props = defineProps({
  BasicTableData: {
    type: Object,
    default: {
      columns: []
    }
  },
  column: {
    type: Object,
    default: {}
  },
  handleSearch: {
    type: Function,
    default: ()=>{}
  },
  conditions: {
    type: Array,
    default: []
  },
  showSave: {
    type: Boolean,
    default: false,
  }
})
  const searchList = reactive<any>({
    id: undefined,
    conditions:props.conditions,
    opList: [{
      op:'GT',
      title: '>',
    },
    {
      op:'LT',
      title: '<',
    },
    {
      op:'GE',
      title: '>=',
    },
    {
      op:'LE',
      title: '<=',
    },
    {
      op:'NE',
      title: '不包含',
    },
    {
      op:'EQ',
      title: '包含',
    },
  ],
    optionList: [{
      value:1,
      // title: 
    }],
    filterName: '',
  })
  
const cancel = (e: MouseEvent) => {
  // console.log('val', e)
}  
const confirm = (e: MouseEvent) => {
  // console.log('val', e)
}  
const closeOld = (e: MouseEvent) => {
  // console.log('val', e)
}  
const save = (val:any) => {
  // console.log('save', val, searchList.filterName, searchList.conditions)
}
  const addSearchItem = (val:any) => {
  if(val){
    const exist = searchList.conditions.some((item:any) => item.id === val);
    if (!exist) {
      searchList.conditions.push({
        "id": val,
        "op": "EQ",
        "value": ""
      })
      setTimeout(()=>{
        searchList.id = undefined;
      },100)
    }
    // console.log('addSearchItem', val, searchList.conditions);
  }
  
}
const delSearchItem = (val: any, index: number) => {
  // console.log('delSearchItem', val)
  searchList.conditions.splice(index, 1)
}

//导出给refs使用
defineExpose({ addSearchItem, delSearchItem, save, searchList  })
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
      padding: 3px 2px;
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
  .ant-descriptions-item{
    margin-bottom: 0px;
  }
</style>
<style>
.ant-popover, .ant-select-dropdown{
    z-index: 2032;
  }
</style>
