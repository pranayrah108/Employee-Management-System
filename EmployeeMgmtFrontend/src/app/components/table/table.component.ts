import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatCardModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: any[] = [];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  edit(rowData: any) {
    this.onEdit.emit(rowData);
  }

  delete(rowData: any) {
    this.onDelete.emit(rowData);
  }
}
