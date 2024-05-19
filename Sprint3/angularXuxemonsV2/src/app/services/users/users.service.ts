import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Curas } from '../../models/curas/curas.model';
import { Hospital } from 'src/app/models/hospital/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    public tokenService: TokenService,
    private router: Router) { }


  /**
 * Nombre: Login
 * Función: Envia al servicio los valores introducidos en el formulario
 * @returns Un observable que emite la respuesta de la solicitud HTTP
 */
  Login(user: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/login', user);
  }
  /**
   * Nombre: Registrar
   * Función: Envia al servicio los valores introducidos en el formulario
   * @returns Un observable que emite la respuesta de la solicitud HTTP
   */
  Registrar(user: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/register', user);
  }

  isUserAdmin(): boolean {
    const role = localStorage.getItem('userRole') || 'default';

    if (role == 'default') {
      this.router.navigateByUrl('/landingPage');
      return false;
    } else {
      return true;
    }
  }

  /* --- Recojer los items --- */
  /* ---------------------------- */
  /**
   * Nombre: getAllInvertario
   * Función: Realizar la solicitud HTTP GET para obtener todos los items del juego
   * @returns Un observable que emite un arreglo de los items
   */
  getAllInvertario(): Observable<Curas[]> {
    return this.http.get<Curas[]>('http://127.0.0.1:8000/api/inventario');
  }

  /**
   * Nombre: getAllHospital
   * Función: Realizar la solicitud HTTP GET para obtener todos los xuxemons enfermos del usuario
   * @returns Un observable que emite un arreglo de los items
   */
  getAllHospital(userToken: string): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(
      `http://127.0.0.1:8000/api/xuxemonsUser/${userToken}`
    );
  }
}
