import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AlumnoService } from 'src/services/alumno.service';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionAlumnosDialogComponent } from '../seleccion-alumnos-dialog/seleccion-alumnos-dialog.component';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-envio-email',
  templateUrl: './envio-email.component.html',
  styleUrls: ['./envio-email.component.css'],
  providers: [UserService],
})
export class EnvioEmailComponent {
  listaCorreosSeleccionada: string = '';

  listaCorreosCategoriaA: string = '';
  listaCorreosCategoriaB: string = '';
  listaCorreosCategoriaC: string = '';

  listaCorreos: string = '';

  alumnos: any[] = [];
  datosCorreo: FormGroup;
  loading = false;

  constructor(
    private _alumnoService: AlumnoService,
    private httpclient: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.datosCorreo = new FormGroup({
      correo: new FormControl('', Validators.email),
      asunto: new FormControl('', Validators.required),
      mensaje: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getCorreos();
  }

  getCorreos() {
    this._alumnoService.getAlumnos().subscribe((data) => {
      this.alumnos = [];
      data.forEach((element: any) => {
        this.alumnos.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      //A traves del metodo getAlumnos() se obtiene tanto la lista de alumnos como la lista de correos(listaCorreos)
      this.listaCorreos = this.alumnos.map((alumno) => alumno.email).join(', ');

      // Filtrar los correos de alumnos con categoría A
      const alumnosCategoriaA = this.alumnos.filter(
        (alumno) => alumno.categoria === 'Categoria A'
      );
      this.listaCorreosCategoriaA = alumnosCategoriaA
        .map((alumno) => alumno.email)
        .join(', ');

      // Filtrar los correos de alumnos con categoría B
      const alumnosCategoriaB = this.alumnos.filter(
        (alumno) => alumno.categoria === 'Categoria B'
      );
      this.listaCorreosCategoriaB = alumnosCategoriaB
        .map((alumno) => alumno.email)
        .join(', ');

      // Filtrar los correos de alumnos con categoría C
      const alumnosCategoriaC = this.alumnos.filter(
        (alumno) => alumno.categoria === 'Categoria C'
      );
      this.listaCorreosCategoriaC = alumnosCategoriaC
        .map((alumno) => alumno.email)
        .join(', ');
    });
  }

  seleccionarDestinatarios(opcion: string) {
    if (opcion === 'todos') {
      this.listaCorreosSeleccionada = this.listaCorreos;
    } else if (opcion === 'categoriaA') {
      this.listaCorreosSeleccionada = this.listaCorreosCategoriaA;
    } else if (opcion === 'categoriaB') {
      this.listaCorreosSeleccionada = this.listaCorreosCategoriaB;
    } else if (opcion === 'categoriaC') {
      this.listaCorreosSeleccionada = this.listaCorreosCategoriaC;
    }
  }

  envioCorreo() {
    if (this.datosCorreo.invalid) {
      this.toastr.error('Todos los campos son obligatorios', 'Error', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }
    let params = {
      email: this.listaCorreosSeleccionada,
      asunto: this.datosCorreo.value.asunto,
      mensaje: this.datosCorreo.value.mensaje,
    };
    this.loading = true;
    this.userService.enviarCorreo(params).subscribe(
      (resp) => {
        // Verificar si la respuesta del servidor tiene ok: true
        if (resp && resp.ok === true) {
          this.toastr.success(
            'El mensaje se envió correctamente',
            'Mensaje Enviado',
            { positionClass: 'toast-bottom-right' }
          );
          this.router.navigate(['/list-alumnos']);
        } else {
          // Mostrar un mensaje de error si ok: false o no hay respuesta
          this.toastr.error('Hubo un error al enviar el mensaje', 'Error', {
            positionClass: 'toast-bottom-right',
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.toastr.error('Hubo un error al enviar el mensaje', 'Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loading = false;
      }
    );
  }

  abrirDialogoSeleccionAlumnos(): void {
    const dialogRef = this.dialog.open(SeleccionAlumnosDialogComponent, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe((alumnosSeleccionados: any[]) => {
      if (alumnosSeleccionados && alumnosSeleccionados.length > 0) {
        // Aquí puedes manejar los alumnos seleccionados
        // Por ejemplo, puedes almacenar sus correos en listaCorreosSeleccionada
        this.listaCorreosSeleccionada = alumnosSeleccionados
          .map((alumno) => alumno.email)
          .join(', ');
      }
    });
  }

  limpiarEmails() {
    this.datosCorreo.get('correo')?.setValue('');
  }
}
