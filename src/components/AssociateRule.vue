<template>
  <div class="bg-surface-container rounded-xl overflow-hidden mb-6 elevation-1">
    <!-- 右上角按钮区域 -->
    <div class="flex justify-end p-5 border-b border-outline-variant">
      <button 
        @click="openAddRuleModal"
        class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-200 elevation-1"
      >
        <i class="fas fa-plus text-sm"></i>
        <span>添加规则</span>
      </button>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto">
      <table class="w-full table-fixed">
        <thead>
          <tr class="bg-surface-container-high">
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">规则名称</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">标题</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">描述</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">标签</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">封面</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">分区</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">up主</th>
            <th class="px-6 py-4 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant">
          <tr 
            v-for="item in rulelist" 
            :key="item.id" 
            class="hover:bg-surface-container-high/50 transition-colors duration-150"
          >
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface">{{ item.info }}</td>
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface-variant">{{ valueJoin(item.title) }}</td>
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface-variant">{{ valueJoin(item.desc) }}</td>
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface-variant">{{ valueJoin(item.tag) }}</td>
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface-variant">{{ valueJoin(item.cover) }}</td>
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface-variant">{{ valueJoin(item.tid) }}</td>
            <td class="px-6 py-4 text-ellipsis-cell text-sm text-on-surface-variant">{{ valueJoin(item.mid) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button 
                @click="editItem(item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-primary hover:bg-primary-container/30 rounded-lg transition-all duration-150 mr-2"
              >
                <i class="fas fa-edit text-xs"></i>
                <span class="text-xs">编辑</span>
              </button>
              <button 
                @click="deleteItem(item)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-error hover:bg-error-container/30 rounded-lg transition-all duration-150"
              >
                <i class="fas fa-trash-alt text-xs"></i>
                <span class="text-xs">删除</span>
              </button>
            </td>
          </tr>
          <!-- 空状态 -->
          <tr v-if="rulelist.length === 0">
            <td colspan="8" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center">
                <div class="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
                  <i class="fas fa-layer-group text-on-surface-variant/30 text-2xl"></i>
                </div>
                <p class="text-sm text-on-surface-variant">暂无复合规则</p>
                <p class="text-xs text-on-surface-variant/70 mt-1">点击右上角添加规则按钮创建</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 添加/编辑白名单项模态框 -->
    <div 
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div class="bg-surface-container rounded-2xl w-2/3 max-h-[90vh] overflow-y-auto border border-outline-variant elevation-3">
        <!-- 模态框头部 -->
        <div class="flex items-center justify-between p-6 border-b border-outline-variant">
          <h3 class="text-xl font-medium text-on-surface">
            {{ showAddModal ? '添加白名单' : '编辑白名单' }}
          </h3>
          <button 
            @click="closeModal"
            class="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 模态框内容 -->
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-on-surface-variant mb-2" for="ruleName">规则名称</label>
            <input 
              type="text" 
              id="ruleName" 
              v-model="currentItem.info"
              class="w-full bg-surface-container-highest text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary transition-all duration-200 text-sm"
              placeholder="请输入规则名称"
            >
          </div>

          <TagInput
            v-for="dictType in dictTypeEnum"
            :key="dictType"
            :label="dictTypeDesc[dictType]"
            :tags="currentItem[dictType]"
            :dict-type="dictType"
            :on-add="addDict"
            :on-remove="removeDict"
          />
        </div>

        <!-- 模态框底部 -->
        <div class="flex justify-end gap-3 p-6 border-t border-outline-variant">
          <button 
            @click="closeModal"
            class="px-5 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-full font-medium text-sm transition-all duration-200"
          >
            取消
          </button>
          <button 
            @click="updateItem"
            class="px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-200 elevation-1"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 添加规则模态框（仅输入规则名称） -->
    <div 
      v-if="showAddRuleModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div class="bg-surface-container rounded-2xl w-96 border border-outline-variant elevation-3">
        <!-- 模态框头部 -->
        <div class="flex items-center justify-between p-6 border-b border-outline-variant">
          <h3 class="text-xl font-medium text-on-surface">添加规则</h3>
          <button 
            @click="closeAddRuleModal"
            class="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- 模态框内容 -->
        <div class="p-6">
          <div class="mb-2">
            <label class="block text-sm font-medium text-on-surface-variant mb-2" for="newRuleName">规则名称</label>
            <input 
              type="text" 
              id="newRuleName" 
              v-model="newRuleName"
              class="w-full bg-surface-container-highest text-on-surface px-4 py-3 rounded-xl border border-outline-variant focus:outline-none focus:border-primary transition-all duration-200 text-sm"
              placeholder="请输入规则名称"
              @keyup.enter="confirmAddRule"
            >
          </div>
        </div>

        <!-- 模态框底部 -->
        <div class="flex justify-end gap-3 p-6 border-t border-outline-variant">
          <button 
            @click="closeAddRuleModal"
            class="px-5 py-2.5 text-on-surface-variant hover:bg-surface-container-high rounded-full font-medium text-sm transition-all duration-200"
          >
            取消
          </button>
          <button 
            @click="confirmAddRule"
            class="px-5 py-2.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:bg-primary/90 transition-all duration-200 elevation-1"
          >
            确定
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
  watch: {
    accessType: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getAssociateRule()
        }
      },
      immediate: false
    }
  },
  computed: {},
  data() {
    return {
      searchQuery: '',
      showAddModal: false,
      showEditModal: false,
      showAddRuleModal: false,
      newRuleName: '',
      pageNo: 1,
      pageSize: 999,
      currentItem: {
        "id": "",
        "access_type": "WHITE",
        "title": [],
        "desc": [],
        "cover": [],
        "tid": [],
        "mid": [],
        tag: []
      },
      rulelist: [],
      dictTypeEnum: [
        'title',
        'desc',
        'tag',
        'cover',
        'tid',
        'mid',
      ],
      dictTypeDesc: {
        tag: '视频标签',
        desc: '视频简介',
        title: '标题',
        cover: '封面',
        mid: 'up主id',
        tid: '分区id',
        search_keyword: '搜索词',
        keyword: '通用关键词',
        stop_words: '停顿词',
        ai_judgment_prompt: 'ai判断提示词'
      },
    };
  },
  mounted() {
    this.getAssociateRule()
  },
  methods: {
    openAddRuleModal() {
      this.newRuleName = '';
      this.showAddRuleModal = true;
    },

    closeAddRuleModal() {
      this.showAddRuleModal = false;
      this.newRuleName = '';
    },

    async confirmAddRule() {
      if (!this.newRuleName || !this.newRuleName.trim()) {
        this.$message('请输入规则名称', 'warning');
        return;
      }

      try {
        const response = await api.addAssociateRule({
          info: this.newRuleName.trim(),
          access_type: this.accessType,
        });

        if (response.code === 200) {
          this.$message('添加规则成功', 'success');
          await this.getAssociateRule();
          this.closeAddRuleModal();
        } else {
          this.$message(response.message || '添加规则失败', 'error');
        }
      } catch (error) {
        console.error('添加规则失败:', error);
        this.$message('添加规则失败', 'error');
      }
    },

    editItem(item) {
      this.currentItem = {...item};
      this.showEditModal = true;
    },

    async deleteItem(item) {
      if (confirm(`确定要删除名为"${item.info}"的白名单规则吗？`)) {
        const response = await api.delAssociateRule(item.id);
        if (response.code === 200) {
          this.$message('删除成功', 'success');
          this.rulelist = this.rulelist.filter(i => i.id !== item.id);
        } else {
          this.$message(response.message, 'error');
        }
      }
    },

    async addDict(dictType, input) {
      const keywordItem = {
        value: input,
        access_type: this.accessType,
        dict_type: dictType.toUpperCase(),
        outer_id: this.currentItem.id,
        desc: '',
        status: 'NORMAL'
      };
      const resp = await api.addDict(keywordItem);
      if (resp.code === 200) {
        this.$message('添加成功', 'success');
        keywordItem.id = resp.data;
        this.currentItem[dictType].push(keywordItem);
      }
    },

    async removeDict(dictType, index, id) {
      this.currentItem[dictType].splice(index, 1);
      const resp = await api.delDictById(id);
      if (resp.code === 200) {
        this.$message('删除成功', 'success');
      }
    },

    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
    },

    valueJoin(arr) {
      return arr.map(i => i.value).join(",")
    },

    async getAssociateRule() {
      try {
        const response = await api.getAssociateRule(this.accessType, this.pageNo, this.pageSize);
        this.rulelist = response.data.records;
      } catch (error) {
        console.error('Failed to fetch keywords:', error);
      }
    },

    async updateItem() {
      this.closeModal();

      const response = await api.updateRule(this.currentItem);
      if (response.code===200) {
        this.$message('保存成功', 'success');
        await this.getAssociateRule();
      } else {
        this.$message('保存失败', 'error');
      }
    }
  }
}
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.elevation-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
}

.elevation-3 {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12), 0 3px 5px rgba(0, 0, 0, 0.2);
}

/* 表格固定布局 */
.table-fixed {
  table-layout: fixed;
  width: 100%;
}

/* 文本溢出显示省略号 */
.text-ellipsis-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;
}

/* Backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
