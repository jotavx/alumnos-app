import { Component, OnInit, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as XLSX from 'xlsx';
import { CreateAlumnComponent } from '../create-alumn/create-alumn.component';

@Component({
  selector: 'app-list-alumnos',
  templateUrl: './list-alumnos.component.html',
  styleUrls: ['./list-alumnos.component.css'],
})
export class ListAlumnosComponent implements OnInit {
  clickedRows = new Set<any>();
  fileName = 'ExcelSheet.xlsx';
  alumnos: any[] = [];
  displayedColumns: string[] = [
    'nombreCompleto',
    'fechaNacimiento',
    'categoria',
    'dni',
    'email',
    'direccion',
    'telefono',
    'mesAbonado',
    'acciones',
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _alumnoService: AlumnoService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAlumnos();
  }

  openDialog(alumnoId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.eliminarAlumno(alumnoId);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getAlumnos() {
    this._alumnoService.getAlumnos().subscribe((data) => {
      this.alumnos = [];
      data.forEach((element: any) => {
        this.alumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.dataSource.data = this.alumnos;
    });
  }

  eliminarAlumno(id: string) {
    this._alumnoService
      .eliminarAlumno(id)
      .then(() => {
        this.toastr.error(
          'El alumno/a fue eliminado con éxito',
          'Registro Eliminado',
          { positionClass: 'toast-bottom-right' }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  exportExcel() {
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  getColorForFechaAbonado(fechaAbonado: Date): string {
    const hoy = new Date();
    const fechaAbonadoPlus30Days = new Date(fechaAbonado);
    fechaAbonadoPlus30Days.setDate(fechaAbonadoPlus30Days.getDate() + 30);

    if (hoy > fechaAbonadoPlus30Days) {
      return '#8D2511'; // Si han pasado más de 30 días, devolvemos rojo
    } else {
      return '#376D06'; // Si está dentro de los 30 días, devolvemos verde
    }
  }

  openCreateDialog(row?: any): void {
    const dialogRef = this.dialog.open(CreateAlumnComponent, {
      width: '700px',
      data: row,
    });
  }
}
