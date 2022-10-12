<template>
  <div class="the-table">
    <div class="table-title">
      <span>{{ title }}</span>
      {{ currenColumnForSorting }}
    </div>
    <div class="table-content" v-if="table && table.length">
      <div class="table-column" v-for="column in columns" :key="column">
        <div
          class="title"
          @click="sort(column)"
          :style="{ cursor: column === TableColumnTitlesEnum.date ? 'not-allowed' : 'pointer' }"
        >
          <span>{{ InterpretationService.getTableColumnTitlesInterpretation(column) }}</span>
          <UISort v-if="currenColumnForSorting === column" />
        </div>
        <div class="row" v-for="row in table" :key="row">{{ row[column] }}</div>
      </div>
    </div>
    <span class="no-result" v-else>Нет результатов!</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TheTable',
});
</script>

<script setup lang="ts">
import UISort from '@/components/UI/UISort.vue';

import { InterpretationService } from '@/services/interpretation.service';

import { TableDataType } from '@/helpers/types/requests/table-data.type';
import { TableColumnTitlesEnum } from '@/helpers/enums/table-column-titles.enum';

import { defineProps, computed, PropType, Ref } from 'vue';

import { useTablePageStore } from '@/stores/table-page.store';
import { SortConditionsEnum } from '@/helpers/enums/sort-conditions.enum';

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: () => '',
  },
  table: {
    type: Array as PropType<TableDataType[]>,
    required: true,
  },
  columnSizes: {
    type: String,
    required: false,
    default: () => '',
  },
});

const tablePageStore = useTablePageStore();

const sort = (column: TableColumnTitlesEnum | string): void => {
  if (column === TableColumnTitlesEnum.date) {
    return;
  } else {
    if (tablePageStore.sort.column !== column) {
      tablePageStore.sort.column = column;
      tablePageStore.sort.param = SortConditionsEnum.asc;
      tablePageStore.sortTable();
    } else {
      if (tablePageStore.sort.param === SortConditionsEnum.asc) {
        tablePageStore.sort.param = SortConditionsEnum.desc;
        tablePageStore.sortTable();
      } else {
        tablePageStore.sort.param = SortConditionsEnum.asc;
        tablePageStore.sortTable();
      }
    }
  }
};

const currenColumnForSorting: Ref<TableColumnTitlesEnum> | Ref<string> = computed(
  () => tablePageStore.sort.column,
);

const columnSizes: Ref<string> = computed(() => {
  if (props.columnSizes) {
    return props.columnSizes;
  } else {
    const columnAmount = Object.keys(props.table[0]).length;
    return `repeat(${columnAmount}, 1fr)`;
  }
});

const columns: Ref<TableColumnTitlesEnum[]> = computed(() => {
  const columnTitles = Object.keys(props.table[0]);
  return columnTitles as TableColumnTitlesEnum[];
});
</script>

<style scoped lang="scss">
.the-table {
  width: 100%;

  .table-title {
    width: 100%;
    font-size: 1.8rem;
    margin: 12px;
  }

  .table-content {
    display: grid;
    gap: 5px;
    grid-template-columns: v-bind(columnSizes);

    .table-column {
      .title {
        display: flex;
        justify-content: center;
        border: 1px solid slategray;
        font-size: 1.2rem;
        cursor: v-bind(cursor);
      }
      .row {
        border: 1px solid slategray;
        font-size: 1.1rem;
        margin: 5px 0;
      }
    }
  }
}
</style>