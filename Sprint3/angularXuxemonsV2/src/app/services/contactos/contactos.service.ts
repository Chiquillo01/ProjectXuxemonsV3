import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Users } from '../../models/users/users.model';
import { Chat } from '../../models/chat/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  constructor(private http: HttpClient, public tokenService: TokenService) {}

  /**
   * Nombre: getAllUsers
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  getAllUsers(userToken: string, SearchUser: string): Observable<Users[]> {
    //console.log(userToken, SearchUser);

    const body = {
      token: userToken,
      searchUser: SearchUser,
    };

    return this.http.post<Users[]>('http://127.0.0.1:8000/api/usuarios', body);
  }

  /**
   * Nombre: getAllChuchesUser
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  getAllFriends(userToken: string): Observable<Users[]> {
    //console.log(userToken, SearchUser);

    return this.http.get<Users[]>(
      `http://127.0.0.1:8000/api/show/${userToken}`
    );
  }

  /**
   * Nombre: getAllChuchesUser
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  getAllRequest(userToken: string): Observable<Users[]> {
    //console.log(userToken, SearchUser);

    return this.http.get<Users[]>(
      `http://127.0.0.1:8000/api/showSolicitudes/${userToken}`
    );
  }

  /**
   * Nombre: acceptar
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  acceptar(userToken: string, SearchUser: string): Observable<Users[]> {
    //console.log(userToken, SearchUser);

    const body = {
      token: userToken,
      searchUser: SearchUser,
    };

    return this.http.post<Users[]>('http://127.0.0.1:8000/api/acceptar', body);
  }

  /**
   * Nombre: denegar
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  denegar(userToken: string, SearchUser: string): Observable<Users[]> {
    //console.log(userToken, SearchUser);

    const body = {
      token: userToken,
      searchUser: SearchUser,
    };

    return this.http.post<Users[]>('http://127.0.0.1:8000/api/denegar', body);
  }

  /**
   * Nombre: getAllChat
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  getAllChat(userToken: string, idUser: string): Observable<Chat[]> {
    //console.log(userToken, SearchUser);
    // console.log(`http://127.0.0.1:8000/api/show/${userToken}/&/${idUser}`);
    return this.http.get<Chat[]>(
      `http://127.0.0.1:8000/api/show/${userToken}/&/${idUser}`
    );

  }

  /**
   * Nombre: getAllChat
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  getId(idUser: string): Observable<Chat[]> {
    return this.http.get<any>(
      `http://127.0.0.1:8000/api/getId/${idUser}`
    );

  }

  /**
   * Nombre: denegar
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  guardarMensajes(userToken: string, SearchUser: string, Texto:string): Observable<Users[]> {
    //console.log(userToken, SearchUser);

    const body = {
      token: userToken,
      searchUser: SearchUser,
      text: Texto
    };
    console.log('http://127.0.0.1:8000/api/guardarmensaje', body);
    return this.http.post<Users[]>('http://127.0.0.1:8000/api/guardarmensaje', body);
  }

  /**
   * Nombre: denegar
   * Función: Obtener todas las chuches que tiene un usuario
   * @returns la url de la api
   */
  // liveChat(userToken: string, id2:string): Observable<any> {
  //   //console.log(userToken, SearchUser);

  //   const body = {
  //     token: userToken,
  //     searchUser: id2
  //   };

  //   return this.http.post<any>('http://127.0.0.1:8000/api/messages', body);
  // }

}
