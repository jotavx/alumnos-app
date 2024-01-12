import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginError = false;
  formLogin: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.userService
      .login(this.formLogin.value)
      .then((response) => {
        //Se agrega la persistencia session que al cerrar la pestaña o el navegador cierra la sesión
        this.afAuth.setPersistence('session').then(() => {
          console.log('Persistencia de sesión establecida correctamente');
        });
        this.router.navigate(['/list-alumnos']);
      })
      .catch((error) => {
        this.loginError = true;
      });
  }
}
