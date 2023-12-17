import { Component, OnInit, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/services/alumno.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seleccion-alumnos-dialog',
  templateUrl: './seleccion-alumnos-dialog.component.html',
  styleUrls: ['./seleccion-alumnos-dialog.component.css'],
})
export class SeleccionAlumnosDialogComponent implements OnInit {
  listaCorreosSeleccionados: string = '';
  alumnosSeleccionados: any[] = [];

  alumnos: any[] = [];
  displayedColumns: string[] = [
    'nombreCompleto',
    'categoria',
    'email',
    'mesAbonado',
    'seleccionar',
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _alumnoService: AlumnoService,
    private dialogRef: MatDialogRef<SeleccionAlumnosDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getAlumnos();
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

  seleccionarAlumno(event: any, alumno: any) {
    if (event.checked) {
      // Agregar alumno a la lista de seleccionados si está marcado
      this.alumnosSeleccionados.push(alumno);
    } else {
      // Eliminar alumno de la lista de seleccionados si se desmarca
      const index = this.alumnosSeleccionados.findIndex(
        (selectedAlumno) => selectedAlumno.id === alumno.id
      );
      if (index !== -1) {
        this.alumnosSeleccionados.splice(index, 1);
      }
    }
  }

  aplicarSeleccion() {
    this.dialogRef.close(this.alumnosSeleccionados);
  }

  cerrarDialogo() {
    this.dialogRef.close();
  }

  agregarCorreos() {
    const correosAlumnosSeleccionados = this.alumnosSeleccionados.map(
      (alumno) => alumno.email
    );
    this.listaCorreosSeleccionados = correosAlumnosSeleccionados.join(', ');
    // Puedes usar la lista de correos seleccionados como desees en tu lógica
    this.aplicarSeleccion();
  }
}
