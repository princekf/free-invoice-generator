import { Component, Input } from '@angular/core';
import { ItemCellEditorComponent } from "../../common/item-cell-editor/item-cell-editor.component";
import { CellClassParams, ColDef, ColGroupDef, GridApi, GridReadyEvent, ICellRendererParams, ValueFormatterParams } from "ag-grid-community";
import { CreateInvoiceSummaryComponent } from "./create-invoice-summary.component";
import { FormColumnDef } from "../../../../util/form-column-def.type";
import { InvoiceDetailsFormItem } from './create-invoice-details.component';


@Component({
  selector: 'app-create-invoice-items',
  standalone: true,
  template: '',
})

export class CreateInvoiceItemsComponent extends CreateInvoiceSummaryComponent {
  columnApi!: { setColumnDefs: (defs: any) => void };
  itemDescriptionEnabled = false;
  discountEnabled = false;
  public cgstSgstEnabled = false;
  public igstEnabled = false;

  @Input()
  invoiceRowData: FormColumnDef[] = [];

  ngOnChanges(): void {
    const taxOpt = this.getTaxOption();
    this.handleTaxOptionToggle(taxOpt);
  }

  currentTaxOption: string = '';
  get itemdetailsColumnDefs(): (ColDef | ColGroupDef)[] {
    const baseCols: (ColDef | ColGroupDef)[] = [
      {
        headerName: 'Item Details',
        children: [
          {
            headerName: 'Item',
            field: 'item',
            flex: 2,
            editable: true,
            cellEditor: ItemCellEditorComponent,
            valueFormatter: (params: ValueFormatterParams) =>
              params.value?.trim() || 'Enter item here',
            cellClass: (params: CellClassParams) =>
              !params.value?.trim() ? 'item-placeholder' : ''
          },
          ...(this.itemDescriptionEnabled ? [
            {
              headerName: 'Description',
              field: 'discription',
              flex: 1,
              editable: true,
              cellClass: 'right-align'
            }
          ] : []),
          { headerName: 'Price', field: 'price', flex: 1, editable: true, cellClass: 'right-align' },
          { headerName: 'Quantity', field: 'quantity', flex: 1, editable: true, cellClass: 'right-align' },
          { headerName: 'Item Total', field: 'total', flex: 1, cellClass: 'right-align' }
        ]
      }
    ];

    if (this.discountEnabled) {
      baseCols.push({
        headerName: 'Discount',
        children: [
          { headerName: '%', field: 'discount', flex: 1, editable: true, cellClass: 'right-align' },
          { headerName: 'Value', field: 'value', flex: 1, cellClass: 'right-align' },
          { headerName: 'Sub Total', field: 'sub_total', flex: 1, cellClass: 'right-align' }
        ]
      });
    }
    if (this.cgstSgstEnabled) {
      baseCols.push({
        headerName: 'Tax',
        children: [
          { headerName: 'CGST', field: 'cgst', flex: 1, editable: true, cellClass: 'right-align' },
          { headerName: 'SGST', field: 'sgst', flex: 1, editable: true, cellClass: 'right-align' },
          { headerName: 'Grand Total', field: 'grand_total', flex: 1, cellClass: 'right-align' }
        ]
      });
    } else if (this.igstEnabled) {
      baseCols.push({
        headerName: 'Tax',
        children: [
          { headerName: 'IGST', field: 'igst', flex: 1, editable: true, cellClass: 'right-align' },
          { headerName: 'Grand Total', field: 'grand_total', flex: 1, editable: true, cellClass: 'right-align' }
        ]
      });
    }
    baseCols.push({
      headerName: '',
      field: 'delete',
      flex: 0.5,
      cellRenderer: (params: ICellRendererParams) => {
        const rowCount = params.api.getDisplayedRowCount();
        return rowCount === 1
          ? ''
          : `<button class="delete-btn" data-clear="true" aria-label="Delete">
          <span class="material-icons" style="color: red;">delete</span></button>`;
      }
    });
    return baseCols;
  }

  itemdetailsRowData: {
    item: string;
    price: number | null;
    quantity: number | null;
    total: number | null;
    discount: number | null;
    value: number | null;
    sub_total: number | null;
    cgst: number | null;
    sgst: number | null;
    igst: number | null;
    grand_total: number | null;
  }[] = [
      {
        item: '',
        price: null,
        quantity: null,
        total: null,
        discount: null,
        value: null,
        sub_total: null,
        cgst: null,
        sgst: null,
        igst: null,
        grand_total: null
      }
    ];
  getTaxOption(): string {
    const taxOption = this.invoiceRowData.find(r => r.label === 'Tax Option');
    return typeof taxOption?.value === 'string' ? taxOption.value : '';
  }
  onInvoiceDetailsCellValueChanged(event: any): void {
    if (event.data.label === InvoiceDetailsFormItem.TAX_OPTION) {
      const newValue = event.data.value as string;
      this.handleTaxOptionToggle(newValue);
    }
  }
   updateTaxOption(): void {
    const taxOption = this.getTaxOption();
    if (taxOption !== this.currentTaxOption) {
      this.currentTaxOption = taxOption;
      this.cgstSgstEnabled = taxOption === 'CGST/SGST';
      this.igstEnabled = taxOption === 'IGST';
      this.columnApi?.setColumnDefs(this.itemdetailsColumnDefs);
    }
  }
  public handleTaxOptionToggle = (option: string): void => {
  this.cgstSgstEnabled = option === 'CGST/SGST';
  this.igstEnabled = option === 'IGST';

  this.itemdetailsRowData = this.itemdetailsRowData.map(row => {
    const hasValidPriceQty = Number(row.price) > 0 && Number(row.quantity) > 0;
    return {
      ...row,
      cgst: option === 'CGST/SGST' && hasValidPriceQty ? 9 : null,
      sgst: option === 'CGST/SGST' && hasValidPriceQty ? 9 : null,
      igst: option === 'IGST' && hasValidPriceQty ? 18 : null,
    };
  });

  this.columnApi?.setColumnDefs(this.itemdetailsColumnDefs);
};

}