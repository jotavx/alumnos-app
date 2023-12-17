import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {
  constructor(private firestore: AngularFirestore) {}

  agregarAlumno(alumno: any): Promise<any> {
    return this.firestore.collection('alumnos').add(alumno);
  }

  getAlumnos(): Observable<any> {
    return this.firestore
      .collection('alumnos', (ref) => ref.orderBy('mesAbonado', 'asc'))
      .snapshotChanges();
  }

  eliminarAlumno(id: string): Promise<any> {
    return this.firestore.collection('alumnos').doc(id).delete();
  }

  getAlumno(id: string): Observable<any> {
    return this.firestore.collection('alumnos').doc(id).snapshotChanges();
  }

  actualizarAlumno(id: string, data: any): Promise<any> {
    return this.firestore.collection('alumnos').doc(id).update(data);
  }
}
