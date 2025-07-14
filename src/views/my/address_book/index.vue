<template>
  <div>
    <!-- 查询卡片 -->
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="120px">
        <!-- 地址簿查询条件 -->
        <el-form-item :label="T('AddressBook')">
          <el-select v-model="listQuery.collection_id" clearable>
            <!-- 系统默认的地址簿 -->
            <el-option :value="0" :label="T('MyAddressBook')"></el-option>
            <!-- 用户自定义的地址簿 -->
            <el-option v-for="c in collectionListRes.list" :key="c.id" :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 客户端ID查询条件 -->
        <el-form-item :label="T('ID')">
          <el-input v-model="listQuery.id" clearable></el-input>
        </el-form-item>
        <!-- 用户名查询条件 -->
        <el-form-item :label="T('Username')">
          <el-input v-model="listQuery.username" clearable></el-input>
        </el-form-item>
        <!-- 主机名查询条件 -->
        <el-form-item :label="T('Hostname')">
          <el-input v-model="listQuery.hostname" clearable></el-input>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item>
          <!-- 查询按钮 -->
          <el-button type="primary" @click="handlerQuery">{{ T('Query') }}</el-button>
          <!-- 添加按钮 -->
          <el-button type="warning" @click="toAdd">{{ T('Add') }}</el-button>
          <!-- 批量编辑标签按钮 -->
          <el-button type="primary" @click="showBatchEditTags">{{ T('BatchEditTags') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据表格卡片 -->
    <el-card class="list-body" shadow="hover">
      <el-table :data="listRes.list" v-loading="listRes.loading" border @selection-change="handleSelectionChange">
        <!-- 选择框数据项 -->
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <!-- ID数据项 -->
        <el-table-column prop="id" label="ID" align="center" width="200">
          <template #default="{ row }">
            <div>
              <PlatformIcons :name="platformList.find(p => p.label === row.platform)?.icon"
                style="width: 20px;height: 20px;display: inline-block" color="var(--basicBlack)" />
              {{ row.id }}
              <el-icon @click="handleClipboard(row.id, $event)">
                <CopyDocument />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <!-- 地址簿数据项 -->
        <el-table-column prop="collection_id" :label="T('AddressBook')" align="center" width="150">
          <template #default="{ row }">
            <span v-if="row.collection_id === 0">{{ T('MyAddressBook') }}</span>
            <span v-else>{{collectionListRes.list.find(c => c.id === row.collection_id)?.name}}</span>
          </template>
        </el-table-column>
        <!-- 用户名数据项 -->
        <el-table-column prop="username" :label="T('Username')" align="center" width="150" />
        <!-- 主机名数据项 -->
        <el-table-column prop="hostname" :label="T('Hostname')" align="center" width="150" />
        <!-- 平台数据项 -->
        <el-table-column prop="platform" :label="T('Platform')" align="center" width="120" />
        <!-- 设备标签数据项 -->
        <el-table-column prop="tags" :label="T('Tags')" align="center" width="120" />
        <!-- 别名数据项 -->
        <el-table-column prop="alias" :label="T('Alias')" align="center" width="150" />
        <!-- 客户端版本数据项 -->
        <el-table-column prop="peer.version" :label="T('Version')" align="center" width="100" />
        <!-- 创建时间数据项 -->
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center" width="180" />
        <!-- 更新时间数据项 -->
        <el-table-column prop="updated_at" :label="T('UpdatedAt')" align="center" width="180" />
        <!-- 哈希数据项 -->
        <el-table-column prop="hash" :label="T('Hash')" align="center" width="150" show-overflow-tooltip />
        <!-- 操作列 -->
        <el-table-column :label="T('Actions')" align="center" class-name="table-actions" width="600" fixed="right">
          <template #default="{ row }">
            <!-- 打开APP按钮 -->
            <el-button type="success" @click="connectByClient(row.id)">{{ T('OpenAppLink') }}</el-button>
            <!-- WebClient按钮 -->
            <el-button v-if="appStore.setting.appConfig.web_client" type="success" @click="toWebClientLink(row)">Web
              Client</el-button>
            <!-- 分项按钮 -->
            <el-button v-if="appStore.setting.appConfig.web_client" type="primary" @click="toShowShare(row)">
              {{ T('ShareByWebClient') }}
            </el-button>
            <!-- 编辑按钮 -->
            <el-button @click="toEdit(row)">{{ T('Edit') }}</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" @click="del(row)">{{ T('Delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页卡片 -->
    <el-card class="list-page" shadow="hover">
      <el-pagination background layout="prev, pager, next, sizes, jumper" :page-sizes="[10, 20, 50, 100]"
        v-model:page-size="listQuery.page_size" v-model:current-page="listQuery.page" :total="listRes.total">
      </el-pagination>
    </el-card>
    <!-- 地址簿数据弹窗 -->
    <el-dialog v-model="formVisible" width="800" :title="!formData.row_id ? T('Create') : T('Update')">
      <el-form class="dialog-form" ref="form" :model="formData" label-width="120px">
        <el-form-item :label="T('AddressBookManage')" required prop="collection_id">
          <el-select v-model="formData.collection_id" clearable @change="changeCollectionForUpdate">
            <el-option :value="0" :label="T('MyAddressBook')"></el-option>
            <el-option v-for="c in collectionListResForUpdate.list" :key="c.id" :label="c.name"
              :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID" prop="id" required>
          <el-input v-model="formData.id"></el-input>
        </el-form-item>
        <el-form-item :label="T('Username')" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item :label="T('Alias')" prop="alias">
          <el-input v-model="formData.alias"></el-input>
        </el-form-item>
        <el-form-item :label="T('Hash')" prop="hash">
          <el-input v-model="formData.hash"></el-input>
        </el-form-item>
        <el-form-item :label="T('Hostname')" prop="hostname">
          <el-input v-model="formData.hostname"></el-input>
        </el-form-item>
        <!--        <el-form-item :label="T('LoginName')" prop="loginName">
                  <el-input v-model="formData.loginName"></el-input>
                </el-form-item>-->
        <!--        <el-form-item :label="T('Password')" prop="password">
                          <el-input v-model="formData.password"></el-input>
                        </el-form-item>-->
        <el-form-item :label="T('Platform')" prop="platform">
          <el-select v-model="formData.platform">
            <el-option v-for="item in platformList" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="T('Tags')" prop="tags">
          <el-select v-model="formData.tags" multiple>
            <el-option v-for="item in tagListRes.list" :key="item.name" :label="item.name"
              :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="强制中继" prop="forceAlwaysRelay" required>
                 <el-switch v-model="formData.forceAlwaysRelay"></el-switch>
               </el-form-item>
          <el-form-item label="在线" prop="online">
                 <el-switch v-model="formData.online"></el-switch>
               </el-form-item>
               <el-form-item label="rdp端口" prop="rdpPort">
                 <el-input v-model="formData.rdpPort"></el-input>
               </el-form-item>
               <el-form-item label="rdp用户名" prop="rdpUsername">
                 <el-input v-model="formData.rdpUsername"></el-input>
               </el-form-item>
               <el-form-item label="同一服务器" prop="sameServer">
                 <el-switch v-model="formData.sameServer"></el-switch>
               </el-form-item>-->


        <el-form-item>
          <el-button @click="formVisible = false">{{ T('Cancel') }}</el-button>
          <el-button @click="submit" type="primary">{{ T('Submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分享后的数据信息弹窗 -->
    <el-dialog v-model="shareToWebClientVisible" width="900" :close-on-click-modal="false">
      <shareByWebClient :id="shareToWebClientForm.id" :hash="shareToWebClientForm.hash"
        @cancel="shareToWebClientVisible = false" @success="" />
    </el-dialog>
    <!-- 批量编辑标签弹窗 -->
    <el-dialog v-model="batchEditTagVisible" width="500">
      <el-form :model="batchEditTagsFormData" label-width="120px" class="dialog-form">
        <el-form-item :label="T('Tags')" prop="tags">
          <el-select v-model="batchEditTagsFormData.tags" multiple>
            <el-option v-for="item in tagListResForBatchEdit.list" :key="item.name" :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="batchEditTagVisible = false">{{ T('Cancel') }}</el-button>
          <el-button @click="submitBatchEditTags" type="primary">{{ T('Submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onActivated, onMounted, reactive, ref, watch } from 'vue'
import { useBatchUpdateTagsRepositories, useRepositories } from '@/views/address_book'
import { toWebClientLink } from '@/utils/webclient'
import { T } from '@/utils/i18n'
import shareByWebClient from '@/views/address_book/components/shareByWebClient.vue'
import { useAppStore } from '@/store/app'
import { connectByClient } from '@/utils/peer'
import { handleClipboard } from '@/utils/clipboard'
import { CopyDocument } from '@element-plus/icons'
import PlatformIcons from '@/components/icons/platform.vue'

const appStore = useAppStore()
const {
  listRes,
  listQuery,
  getList,
  handlerQuery,
  collectionListRes,
  getCollectionList,
  del,
  formVisible,
  platformList,
  formData,
  toEdit,
  toAdd,
  submit,
  tagListRes,
  changeCollectionForUpdate,
  getCollectionListForUpdate,
  collectionListResForUpdate,
} = useRepositories('my')

onMounted(getCollectionList)
onMounted(getCollectionListForUpdate)
onMounted(getList)
onActivated(getList)

watch(() => listQuery.page, getList)

watch(() => listQuery.page_size, handlerQuery)

const shareToWebClientVisible = ref(false)
const shareToWebClientForm = reactive({
  id: '',
  hash: '',
})
const toShowShare = (row) => {
  shareToWebClientForm.id = row.id
  shareToWebClientForm.hash = row.hash
  shareToWebClientVisible.value = true
}
const {
  tagListRes: tagListResForBatchEdit,
  getTagList: getTagListForBatchEdit,
  visible: batchEditTagVisible,
  show: showBatchEditTags,
  formData: batchEditTagsFormData,
  submit: _submitBatchEditTags,
} = useBatchUpdateTagsRepositories()
onMounted(getTagListForBatchEdit)
const submitBatchEditTags = async () => {
  const res = await _submitBatchEditTags().catch(_ => false)
  if (res) {
    getList()
  }
}

const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val

  batchEditTagsFormData.value.row_ids = val.map(v => v.row_id)
}


</script>

<style scoped lang="scss">
.colors {
  display: flex;
  justify-content: center;
  align-items: center;

  .colorbox {
    width: 50px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    .dot {
      width: 10px;
      height: 10px;
      display: block;
      border-radius: 50%;
    }
  }

}
</style>
