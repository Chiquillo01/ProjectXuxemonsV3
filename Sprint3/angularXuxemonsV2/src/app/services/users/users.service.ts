import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

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
}
