import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { AlumnoService } from 'src/services/alumno.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-create-alumno',
  templateUrl: './create-alumno.component.html',
  styleUrls: ['./create-alumno.component.css'],
})
export class CreateAlumnoComponent {
  createAlumno: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = '';
  buttonText = '';

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.createAlumno = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(9)]],
      fechaNacimiento: ['', [Validators.required, this.fechaValida]],
      categoria: [''],
      dni: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{8,}$'),
          Validators.minLength(8),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      telefono: ['', Validators.required],
      mesAbonado: [''],
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  get nombreNoValido() {
    return (
      this.createAlumno.get('nombre')?.invalid &&
      this.createAlumno.get('nombre')?.touched
    );
  }

  get dniNoValido() {
    return (
      this.createAlumno.get('dni')?.invalid &&
      this.createAlumno.get('dni')?.touched
    );
  }

  get emailNoValido() {
    return (
      this.createAlumno.get('email')?.invalid &&
      this.createAlumno.get('email')?.touched
    );
  }

  get fechaNoValido() {
    return (
      this.createAlumno.get('fechaNacimiento')?.invalid &&
      this.createAlumno.get('fechaNacimiento')?.touched
    );
  }

  fechaValida(control: FormControl) {
    const fecha = new Date(control.value);
    const hoy = new Date();
    const minDate = new Date(1900, 0, 1); // 1 de enero de 1900

    // Verificar si la fecha de nacimiento es mayor que hoy o menor que 1900
    if (fecha > hoy || fecha < minDate) {
      return { fechaInvalida: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarTituloYBotonSegunRuta();
      });
    this.actualizarTituloYBotonSegunRuta();
    this.esEditar();
  }

  private actualizarTituloYBotonSegunRuta() {
    const rutaActual = this.router.url;
    if (rutaActual === '/create-alumno') {
      this.titulo = 'Agregar Alumno/a';
      this.buttonText = 'Agregar';
    } else {
      this.titulo = 'Editar Alumno/a';
      this.buttonText = 'Aplicar';
    }
  }

  agregarEditarAlumno() {
    this.submitted = true;

    if (this.createAlumno.invalid) {
      return;
    }

    if (this.id === null) {
      this.agregarAlumno();
      this.enviarCorreoSiMarcado();
    } else {
      this.editarAlumno(this.id);
      this.enviarCorreoSiMarcado();
    }
  }

  agregarAlumno() {
    const alumno: any = {
      nombre: this.createAlumno.value.nombre,
      fechaNacimiento: this.createAlumno.value.fechaNacimiento,
      categoria: this.createAlumno.value.categoria,
      dni: this.createAlumno.value.dni,
      email: this.createAlumno.value.email,
      direccion: this.createAlumno.value.direccion,
      telefono: this.createAlumno.value.telefono,
      mesAbonado: this.createAlumno.value.mesAbonado,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    this.alumnoService
      .agregarAlumno(alumno)
      .then(() => {
        this.toastr.success(
          'El registro se completo correctamente',
          'Alumno/a Registrado',
          { positionClass: 'toast-bottom-right' }
        );
        this.loading = false;
        this.router.navigate(['/list-alumnos']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  editarAlumno(id: string) {
    const alumno: any = {
      nombre: this.createAlumno.value.nombre,
      fechaNacimiento: this.createAlumno.value.fechaNacimiento,
      categoria: this.createAlumno.value.categoria,
      dni: this.createAlumno.value.dni,
      email: this.createAlumno.value.email,
      direccion: this.createAlumno.value.direccion,
      telefono: this.createAlumno.value.telefono,
      mesAbonado: this.createAlumno.value.mesAbonado,
      fechaActualizacion: new Date(),
    };
    this.loading = true;
    this.alumnoService.actualizarAlumno(id, alumno).then(() => {
      this.loading = false;
      this.toastr.info(
        'El registro fue modificado con exito',
        'Registro Modificado',
        { positionClass: 'toast-bottom-right' }
      );
      this.router.navigate(['/list-alumnos']);
    });
  }

  esEditar() {
    if (this.id !== null) {
      this.alumnoService.getAlumno(this.id).subscribe((data) => {
        this.createAlumno.setValue({
          nombre: data.payload.data()['nombre'],
          fechaNacimiento: data.payload.data()['fechaNacimiento'],
          categoria: data.payload.data()['categoria'],
          dni: data.payload.data()['dni'],
          email: data.payload.data()['email'],
          direccion: data.payload.data()['direccion'],
          telefono: data.payload.data()['telefono'],
          mesAbonado: data.payload.data()['mesAbonado'],
        });
      });
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.agregarEditarAlumno();
    }
  }

  enviarCorreoSiMarcado() {
    const checkbox = document.getElementById(
      'enviarCorreoCheckbox'
    ) as HTMLInputElement;

    // Si el checkbox está marcado, llama a la función enviarCorreoAlumno
    if (checkbox.checked) {
      this.enviarCorreoAlumno();
    }
  }

  enviarCorreoAlumno() {
    const email = this.createAlumno.get('email')?.value;

    const correoParams = {
      email: email, // Obtenemos el email del alumno del campo de entrada
      asunto: 'Pago registrado correctamente',
      mensaje: 'El pago del mes se ha registrado correctamente.',
    };

    this.userService.enviarCorreo(correoParams).subscribe(
      (resp) => {
        if (resp && resp.ok === true) {
          // Mensaje de éxito
          this.toastr.success(
            'Se ha enviado correctamente',
            'Email de Pago Registrado',
            { positionClass: 'toast-bottom-right' }
          );
        } else {
          // Mensaje de error
          this.toastr.error(
            'Se ha producido un error',
            'Email de Pago Registrado',
            {
              positionClass: 'toast-bottom-right',
            }
          );
        }
      },
      (error) => {
        this.toastr.error(
          'Se ha producido un error',
          'Email de Pago Registrado',
          {
            positionClass: 'toast-bottom-right',
          }
        );
      }
    );
  }
}
