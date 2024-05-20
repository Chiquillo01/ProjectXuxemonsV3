import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../../services/token/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../../models/users/users.model';
import { XuxemonsUsers } from '../../models/xuxemons/xuxemons-user.model';

@Injectable({
  providedIn: 'root',
})
export class IntercambioService {
  constructor(private http: HttpClient, public tokenService: TokenService) {}

  getUsuario(userToken: string): Observable<Users[]> {
    console.log(`http://127.0.0.1:8000/api/usuario/${userToken}`);
    return this.http.get<Users[]>(
      `http://127.0.0.1:8000/api/usuario/${userToken}`
    );
  }

  getOtherUsuario(idUser: string): Observable<Users[]> {
    console.log(`http://127.0.0.1:8000/api/otherUsuario/${idUser}`);
    return this.http.get<Users[]>(
      `http://127.0.0.1:8000/api/otherUsuario/${idUser}`
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  getAllXuxemonsUser(userToken: string): Observable<XuxemonsUsers[]> {
    console.log(`http://127.0.0.1:8000/api/xuxemonsUser/${userToken}`);
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsUser/${userToken}`
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  getAllXuxemonsOtherUser(id: string): Observable<XuxemonsUsers[]> {
    console.log(`http://127.0.0.1:8000/api/xuxemonsOtherUser/${id}`);
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsOtherUser/${id}`
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  getShowTrade(userToken: string): Observable<XuxemonsUsers[]> {
    console.log(`http://127.0.0.1:8000/api/showTrade/${userToken}`);
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/showTrade/${userToken}`
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  acceptTrade(
    userToken: string,
    xuxemon1: number,
    idUser2: string,
    xuxemon2: number
  ): Observable<XuxemonsUsers[]> {
    const body = {
      token: userToken,
      iduser2: idUser2,
      xuxemon1: xuxemon1,
      xuxemon2: xuxemon2,
    };
    console.log(`http://127.0.0.1:8000/api/acceptTrade`, body);
    return this.http.post<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/acceptTrade`,
      body
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  solicitudTrade(
    userToken: string,
    xuxemon1: number,
    idUser2: string,
    xuxemon2: number
  ): Observable<XuxemonsUsers[]> {
    const body = {
      token: userToken,
      iduser2: idUser2,
      xuxemon1: xuxemon1,
      xuxemon2: xuxemon2,
    };
    console.log(`http://127.0.0.1:8000/api/trade`, body);
    return this.http.post<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/trade`,
      body
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  Intercambio1(
    userToken: string,
    idUser2: string
  ): Observable<XuxemonsUsers[]> {
    console.log(
      `http://127.0.0.1:8000/api/xuxemonsTrade1/${userToken}/${idUser2}`
    );
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsTrade1/${userToken}/${idUser2}`
    );
  }

  /**
   * Nombre: getAllXuxemonsUser
   * Función: Realizar la solicitud HTTP GET para obtener todos los XuxemonsUsers
   * @returns Un observable que emite un arreglo de XuxemonsUsers
   */
  Intercambio2(
    userToken: string,
    idUser2: string
  ): Observable<XuxemonsUsers[]> {
    console.log(
      `http://127.0.0.1:8000/api/xuxemonsTrade2/${userToken}/${idUser2}`
    );
    return this.http.get<XuxemonsUsers[]>(
      `http://127.0.0.1:8000/api/xuxemonsTrade2/${userToken}/${idUser2}`
    );
  }
}
