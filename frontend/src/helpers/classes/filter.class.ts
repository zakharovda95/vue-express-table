import { FilterType, TableDataType } from '@/helpers/types/table-page-store.type';
import { FiltrationConditionTitlesEnum } from '@/helpers/enums/filtration-conditions.enum';
import { TableColumnTitlesEnum } from '@/helpers/enums/table-column-titles.enum';

import moment from 'moment';

export class Filter {
  private array: TableDataType[];
  private filter: FilterType;

  constructor(array: TableDataType[], filter: FilterType) {
    this.array = array;
    this.filter = filter;
  }

  public filterTable() {
    return this.array.filter(obj => {
      const elem: { [key: string]: any } = obj;

      if (this.filter.condition === FiltrationConditionTitlesEnum.equal) {
        if (
          this.filter.column === TableColumnTitlesEnum.date ||
          this.filter.column === TableColumnTitlesEnum.name
        ) {
          return elem[this.filter.column].toUpperCase() === this.filter.value.toUpperCase();
        } else {
          return +elem[this.filter.column] === +this.filter.value;
        }
      }

      if (elem.amount && this.filter.condition === FiltrationConditionTitlesEnum.includes) {
        const res = String(elem[this.filter.column])
          .toLowerCase()
          .includes(String(this.filter.value).toLowerCase());
        return +res;
      }

      if (elem.amount && this.filter.condition === FiltrationConditionTitlesEnum.more) {
        if (this.filter.column === TableColumnTitlesEnum.date) {
          const date1 = moment(elem.date);
          const date2 = moment(this.filter.value);

          return date1 > date2;
        } else {
          return elem[this.filter.column] > this.filter.value;
        }
      }

      if (elem.amount && this.filter.condition === FiltrationConditionTitlesEnum.less) {
        if (this.filter.column === TableColumnTitlesEnum.date) {
          const date1 = moment(elem.date);
          const date2 = moment(this.filter.value);

          return date1 < date2;
        } else {
          return elem[this.filter.column] < this.filter.value;
        }
      }
    });
  }
}
