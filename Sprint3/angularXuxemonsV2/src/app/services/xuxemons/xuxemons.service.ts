import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Xuxemons } from '../../models/xuxedex/xuxedex.model';
import { XuxemonsUsers } from '../../models/xuxemons/xuxemons-user.model';

@Injectable({
  providedIn: 'root'
})
export class XuxemonsService {
  constructor(
    private http: HttpClient,
    public tokenService: TokenService) { }

  /* --- Recojer los xuxemons --- */
  /* ---------------------------- */
  /**
   * Nombre: getAllXuxemons
   * Función: Realizar la solicitud HTTP GET para obtener todos los Xuxemons
   * @returns Un observable que emite un arreglo de Xuxemons
   */
  getAllXuxemons(): Observable<Xuxemons[]> {
    return this.http.get<Xuxemons[]>('http://127.0.0.1:8000/api/xuxemons/');
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  getAllXuxemonsUser(userToken: string): Observable<XuxemonsUsers[]> {
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsUser/${userToken}`
    );
  }

  /**
   * Nombre: getAllXuxemonsEnfermosUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  getAllXuxemonsEnfermosUser(userToken: string): Observable<XuxemonsUsers[]> {
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsEnfermosUser/${userToken}`
    );
  }

  /**
   * Nombre: getAllXuxemonsUserActivos
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * que estan activos
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  getAllXuxemonsUserActivos(userToken: string): Observable<XuxemonsUsers[]> {
    // const body={
    //   'userToken': userToken
    // }
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsUserActivos/${userToken}`
    );
  }

  /* ---Creación de xuxemons --- */
  /* --------------------------- */
  /**
   * Nombre: createXuxemon
   * Función: Envia los valores necesarios a la api para crear el nuevo xuxemon
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  createXuxemon(xuxemonData: any): Observable<any> {
    return this.http.post<any>(
      'http://127.0.0.1:8000/api/xuxemons/', xuxemonData
    );
  }

  /**
   * Nombre: createRandomXuxemon
   * Función: Crear un nuevo xuxemon al pc del usuario que esta la sesión
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  createRandomXuxemon(userToken: string): Observable<any> {
    const body = {
      token: userToken
    };

    return this.http.post<any>(
      'http://127.0.0.1:8000/api/xuxemons/pc/random', body
    );
  }

  /* --- Otros --- */
  /* ------------- */
  /**
   * Nombre: XuxeDelete
   * Función: Función para eliminar un xuxemon de la bd
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  XuxeDelete(id: any): Observable<any> {
    const authToken = this.tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.delete(`http://127.0.0.1:8000/api/xuxemons/${id}`, {
      headers,
    });
  }

  /* --- Actualizar parametros en la bd --- */
  /* -------------------------------------- */
  /**
   * Nombre: XuxeUpdate
   * Función: Función para actualizar datos del Xuxemon
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  XuxeUpdate(formDate: any, idXux: any): Observable<any> {
    const body = {
      xuxemonNewDate: formDate,
      id_Xuxemon: idXux
    };

    return this.http.put('http://127.0.0.1:8000/api/xuxemons/actualizar', body
    );
  }

  /**
   * Nombre: xuxemonActivo
   * Función: Función para actualizar si el pokemon esta en activo o no
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  xuxemonActivo(userToken: string, xuxemon_id: number): Observable<any> {
    const body = {
      id_xuxemon: xuxemon_id,
      tokenSesion: userToken,
    };

    return this.http.post<any>(
      'http://127.0.0.1:8000/api/xuxemons/activo', body
    );
  }

  /**
   * Nombre: xuxemonFav
   * Función: 
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  xuxemonFav(userToken: string, xuxemon_id: number): Observable<any> {
    const body = {
      userToken: userToken,
      xuxemon_id: xuxemon_id
    };

    return this.http.post<any>(
      'http://127.0.0.1:8000/api/xuxemons/favorito', body
    );
  }

  /* --- Alimentación --- */
  /* -------------------- */
  /**
  * Nombre: alimentar
  * Función: Función para actualizar el nivel evolutivo por defecto del juego
  * @returns Un observable que emite la respuesta de la solicitud HTTP.
  */
  alimentar(xuxemon_id: number, chuche_id: number): Observable<any> {
    const userToken = this.tokenService.getToken();
    const body = {
      userToken: userToken,
      xuxemon_id: xuxemon_id,
      chuche_id: chuche_id
    };

    console.log('http://127.0.0.1:8000/api/xuxemons/alimentar/user/', body);

    return this.http.put(
      'http://127.0.0.1:8000/api/xuxemons/alimentar/user', body
    );
  }

  /**
   * Nombre: evolucionarXuxemon
   * Función: uncion para enviar los datos necesarios para saber si el xuxemon 
   * es capaz de evolucionar
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  evolucionarXuxemon(xuxemonId: number, cumpleEvo1: boolean): Observable<any> {
    const userToken = this.tokenService.getToken();
    const body = {
      userToken: userToken,
      xuxemonId: xuxemonId,
      cumpleEvo1: cumpleEvo1
    };

    return this.http.put(
      'http://127.0.0.1:8000/api/xuxemons/evolucionar', body
    );
  }

  /**
   * Nombre: evolucionarXuxemon2
   * Función: uncion para enviar los datos necesarios para saber si el xuxemon 
   * es capaz de evolucionar por segunda vez
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  evolucionarXuxemon2(xuxemonId: number, cumpleEvo2: boolean): Observable<any> {
    const userToken = this.tokenService.getToken();
    const body = {
      userToken: userToken,
      xuxemonId: xuxemonId,
      cumpleEvo2: cumpleEvo2
    };

    console.log('http://127.0.0.1:8000/api/xuxemons/evolucionar2', body);

    return this.http.put(
      'http://127.0.0.1:8000/api/xuxemons/evolucionar2', body
    );
  }

  /* --- Configuraciones del admin --- */
  /* --------------------------------- */
  /**
   * Nombre: XuxeUpdate
   * Función: Función para actualizar el tamaño por defecto del juego
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  confTamDef(tamano: any): Observable<any> {
    const body = {
      newTamano: tamano
    };

    return this.http.put(
      'http://127.0.0.1:8000/api/xuxemons/tamano', body
    );
  }

  /**
   * Nombre: confEvo
   * Función: 
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  confEvo(evo: any): Observable<any> {
    const body = {
      evolucion: evo,
    };

    return this.http.put('http://127.0.0.1:8000/api/xuxemons/evos', body,
    );
  }

  /**
   * Nombre: XuxeUpdate
   * Función: Función para actualizar el nivel evolutivo por defecto del juego
   * @returns Un observable que emite la respuesta de la solicitud HTTP.
   */
  confEvo2(evo: any): Observable<any> {
    const body = {
      evolucion: evo,
    };

    return this.http.put('http://127.0.0.1:8000/api/xuxemons/evos2', body
    );
  }
}
