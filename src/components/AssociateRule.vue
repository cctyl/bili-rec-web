<template>
  <div class="bg-gray-800 rounded-lg overflow-hidden mb-6">
    <table class="w-full whitelist-management__table table-fixed">
      <thead>
      <tr class="bg-gray-700">
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">规则名称</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">标题</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">描述</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">标签</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">封面</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">分区</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">up主</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
      </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
      <tr v-for="item in rulelist" :key="item.id" class="hover:bg-gray-750 table-row-fixed">
        <td class="px-6 py-4 text-ellipsis-cell">{{ item.info }}</td>
        <td class="px-6 py-4 text-ellipsis-cell">{{ valueJoin(item.title) }}</td>
        <td class="px-6 py-4 text-ellipsis-cell">{{ valueJoin(item.desc) }}</td>
        <td class="px-6 py-4 text-ellipsis-cell">{{ valueJoin(item.tag) }}</td>
        <td class="px-6 py-4 text-ellipsis-cell">{{ valueJoin(item.cover) }}</td>
        <td class="px-6 py-4 text-ellipsis-cell">{{ valueJoin(item.tid) }}</td>
        <td class="px-6 py-4 text-ellipsis-cell">{{ valueJoin(item.mid) }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button @click="editItem(item)"
                  class="text-blue-400 hover:text-blue-300 mr-3 !rounded-button whitespace-nowrap">
            <i class="fas fa-edit mr-1"></i>编辑
          </button>
          <button @click="deleteItem(item)"
                  class="text-red-400 hover:text-red-300 !rounded-button whitespace-nowrap">
            <i class="fas fa-trash-alt mr-1"></i>删除
          </button>
        </td>
      </tr>
      </tbody>
    </table>


    <!-- 添加/编辑白名单项模态框 -->
    <div v-if="showAddModal || showEditModal"
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4">{{ showAddModal ? '添加白名单' : '编辑白名单' }}</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="ruleName">规则名称</label>
          <input type="text" id="ruleName" v-model="currentItem.info"
                 class="w-full bg-gray-700 text-white px-3 py-2 rounded-md !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <TagInput
            label="标题关键词"
            :tags="currentItem.title"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="视频描述关键词"
            :tags="currentItem.desc"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="封面关键词(开发中)"
            :tags="currentItem.cover"
            type="coverKeyword"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="标签关键词"
            :tags="currentItem.tag"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="分区ID"
            :tags="currentItem.tid"
            :on-add="addTag"
            :on-remove="removeTag"
        />
        <TagInput
            label="up猪ID"
            :tags="currentItem.mid"
            :on-add="addTag"
            :on-remove="removeTag"
        />


        <div class="flex justify-end space-x-4">
          <button @click="closeModal"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md !rounded-button hover:bg-gray-500 whitespace-nowrap">
            取消
          </button>
          <button @click="saveItem"
                  class="px-4 py-2 bg-blue-500 text-white rounded-md !rounded-button hover:bg-blue-600 whitespace-nowrap">
            {{ showAddModal ? '添加' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>

import api from "@/api";
import TagInput from "@/components/TagInput.vue";

export default {
  name: 'AssociateRule',
  components: {TagInput},
  props: {

    accessType: {
      type: String,
      required: true
    },
  },
  computed: {

  },
  data() {
    return {
      searchQuery: '',
      showAddModal: false,
      showEditModal: false,
      pageNo: 1,
      pageSize: 999,
      currentItem: {
        "id": "1728619296294227969",
        "access_type": "WHITE",
        "title": [
          {
            "id": "1883457919115169800",
            "value": "解说",
            "access_type": "WHITE",
            "dict_type": "TITLE",
            "outer_id": "1728619296294227969",
            "created_date": "2025-01-26T10:12:15.539Z",
            "last_modified_date": "2025-01-26T10:12:15.539Z",
            "desc": null,
            "status": "NORMAL"
          },
        ],
        "desc": [
          {
            "id": "1883457919115169798",
            "value": "谷歌",
            "access_type": "WHITE",
            "dict_type": "DESC",
            "outer_id": "1728619296294227969",
            "created_date": "2025-01-26T10:12:15.539Z",
            "last_modified_date": "2025-01-26T10:12:15.539Z",
            "desc": null,
            "status": "NORMAL"
          },

        ],
        "cover": [],
        "tid": [],
        "mid": [],
        tag: []
      },

      rulelist: [
        {
          "id": "1728619296294227969",
          "access_type": "WHITE",
          "title": [
            {
              "id": "1883457919115169800",
              "value": "解说",
              "access_type": "WHITE",
              "dict_type": "TITLE",
              "outer_id": "1728619296294227969",
              "created_date": "2025-01-26T10:12:15.539Z",
              "last_modified_date": "2025-01-26T10:12:15.539Z",
              "desc": null,
              "status": "NORMAL"
            },
          ],
          "desc": [
            {
              "id": "1883457919115169798",
              "value": "谷歌",
              "access_type": "WHITE",
              "dict_type": "DESC",
              "outer_id": "1728619296294227969",
              "created_date": "2025-01-26T10:12:15.539Z",
              "last_modified_date": "2025-01-26T10:12:15.539Z",
              "desc": null,
              "status": "NORMAL"
            },

          ],
          "cover": [],
          "tid": [],
          "mid": [],
          tag: []
        }
      ],

    };
  },

  mounted() {
    this.getAssociateRule()
  },
  methods: {
    editItem(item) {
      this.currentItem = {...item};
      this.showEditModal = true;
    },
    async deleteItem(item) {
      if (confirm(`确定要删除名为"${item.info}"的白名单规则吗？`)) {

        const response = await api.delAssociateRule(item.id);
        if (response.code ===200) {
          this.$message('删除成功',
              'success'
          );
          this.rulelist = this.rulelist.filter(i => i.id !== item.id);
        } else {
          this.$message(response.message,
              'error'
          );
        }

      }
    },
    addTag(type, input) {
      this.currentItem[type].push(input);
    },
    removeTag(type, index) {
      this.currentItem[type].splice(index, 1);
    },
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
    },
    /**
     * 拼接dict数组的value
     */
    valueJoin(arr) {

      return arr.map(i => i.value).join(",")
    },

    async getAssociateRule() {

      try {
        const response = await api.getAssociateRule(this.accessType, this.pageNo, this.pageSize,);
        this.rulelist = response.data.records;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },


    /**
     * 保存白名单
     * @returns {Promise<void>}
     */
    async saveItem() {
      const newItem = {
        ...this.currentItem,
      };
      for (const [key, value] of Object.entries(newItem)) {
        //如果newItem[key]是数组,那么过滤掉数组内的空字符串
        if (Array.isArray(value)) {
          newItem[key] = value.filter(item => item !== '');
        }
      }


      const response = await api.addOrUpdateWhiteRule(newItem);
      if (response.success) {
        this.$message('保存成功',
            'success'
        );


        if (this.showAddModal) {
          newItem.id = this.rulelist.length + 1;
          this.rulelist.push(newItem);
        } else {
          const index = this.rulelist.findIndex(item => item.id === this.currentItem.id);
          if (index !== -1) {
            this.rulelist[index] = newItem;
            this.$set(this.rulelist, index, newItem)
          }
        }
        this.closeModal();
        this.fetchWhitelist();
      } else {
        this.$message('保存失败',
            'error'
        );

      }


    }
  }
}
</script>

<style scoped>
/* 表格固定布局，让列宽均匀分布 */
.table-fixed {
  table-layout: fixed;
  width: 100%;
}

/* 固定行高 */
.table-row-fixed {
  height: 64px; /* 可根据需要调整行高 */
}

/* 文本溢出显示省略号 */
.text-ellipsis-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* 确保内容不会撑开单元格 */
  max-width: 0;
}
</style>