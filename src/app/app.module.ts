import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';

import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkAccordionModule } from '@angular/cdk/accordion';

import { AppComponent } from './app.component';
import { ListAlumnosComponent } from './components/list-alumnos/list-alumnos.component';
import { CreateAlumnoComponent } from './components/create-alumno/create-alumno.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/enviroment';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { EnvioEmailComponent } from './components/envio-email/envio-email.component';
import { SeleccionAlumnosDialogComponent } from './components/seleccion-alumnos-dialog/seleccion-alumnos-dialog.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { LogoutDialogComponent } from './components/logout-dialog/logout-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { ReminderDialogComponent } from './components/reminder-dialog/reminder-dialog.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { CreateAlumnComponent } from './components/create-alumn/create-alumn.component';

@NgModule({
  declarations: [
    AppComponent,
    ListAlumnosComponent,
    CreateAlumnoComponent,
    NavbarComponent,
    ConfirmDialogComponent,
    EnvioEmailComponent,
    SeleccionAlumnosDialogComponent,
    LoginComponent,
    LogoutDialogComponent,
    HomeComponent,
    ReminderDialogComponent,
    FormatDatePipe,
    CreateAlumnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    CdkAccordionModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
