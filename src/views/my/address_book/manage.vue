<template>
  <div>
    <!-- 查询卡片 -->
    <el-card class="list-query" shadow="hover">
      <el-form inline label-width="80px">
        <el-form-item>
          <el-button type="primary" @click="handlerQuery">{{ T('Query') }}</el-button>
          <el-button type="warning" @click="toAdd">{{ T('Add') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据卡片 -->
    <el-card class="list-body" shadow="hover">
      <!-- 提示 -->
      <el-tag type="danger" effect="light" style="margin-bottom: 10px">{{ T('MyAddressBookTips') }}</el-tag>
      <el-table :data="list" v-loading="listRes.loading" border>
        <!-- ID数据项 -->
        <el-table-column prop="id" label="ID" align="center" />
        <!-- 名称数据项 -->
        <el-table-column prop="name" :label="T('Name')" align="center" />
        <!-- 创建时间数据项 -->
        <el-table-column prop="created_at" :label="T('CreatedAt')" align="center" />
        <!-- 更新时间数据项 -->
        <el-table-column prop="updated_at" label="更新时间" align="center" />
        <!-- 操作列 -->
        <el-table-column :label="T('Actions')" align="center" class-name="table-actions" width="300" fixed="right">
          <template #default="{ row }">
            <template v-if="row.id > 0">
              <!-- 分析规则按钮 -->
              <el-button type="primary" @click="showRules(row)">{{ T('ShareRules') }}</el-button>
              <!-- 编辑按钮 -->
              <el-button @click="toEdit(row)">{{ T('Edit') }}</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" @click="del(row)">{{ T('Delete') }}</el-button>
            </template>
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
    <!-- 地址簿信息弹窗 -->
    <el-dialog v-model="formVisible" width="600" :title="!formData.id ? T('Create') : T('Update')">
      <el-form class="dialog-form" ref="form" :model="formData" label-width="120px">
        <el-form-item :label="T('Name')" prop="name" required>
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="formVisible = false">{{ T('Cancel') }}</el-button>
          <el-button @click="submit" type="primary">{{ T('Submit') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分享规则数据弹窗 -->
    <el-dialog v-model="rulesVisible" :title="T('ShareRules')" destroy-on-close top="5vh" width="80%">
      <Rule :collection="clickRow" :is_my="1"></Rule>
    </el-dialog>
  </div>
</template>

<script setup>
import { T } from '@/utils/i18n'
import { computed, ref } from 'vue'
import { useRepositories } from '@/views/address_book/collection'
import { onMounted, watch } from 'vue'
import Rule from '@/views/address_book/rule.vue'

const {
  listRes,
  listQuery,
  getList,
  handlerQuery,
  del,
  formVisible,
  formData,
  toEdit,
  toAdd,
  submit,
} = useRepositories('my')

onMounted(getList)

watch(() => listQuery.page, getList)

watch(() => listQuery.page_size, handlerQuery)
const list = computed(_ => {
  if (listQuery.page > 1) {
    return listRes.list
  } else {
    return [
      { id: 0, name: T('MyAddressBook') },
      ...listRes.list,
    ]
  }
})
const clickRow = ref({})
const rulesVisible = ref(false)
const showRules = (row) => {
  clickRow.value = row
  rulesVisible.value = true
}

</script>

<style scoped lang="scss"></style>
