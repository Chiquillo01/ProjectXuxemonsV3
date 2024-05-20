import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../services/token/token.service';
import { ContactosService } from '../../services/contactos/contactos.service';
import { UsersService } from '../../services/users/users.service';
import { Users } from '../../models/users/users.model';
import { UsersRequest } from '../../models/usersRequest/usersRequest.model';
import { Chat } from '../../models/chat/chat.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css'],
})
export class ContactosComponent implements OnInit {
  Users: Users[] = [];
  User: Users[] = [];
  Requests: UsersRequest[] = [];
  Friends: UsersRequest[] = [];
  Chat: Chat[] = [];
  idUserDos: string = '';
  userRol!: number;
  ContactosForm: FormGroup;
  otherUserId: any;
  message: string = '';
  messages: any[] = [];
  openChat = false;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private ContactosService: ContactosService,
    private UsersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.ContactosForm = this.fb.group({
      id: ['', Validators.required],
      texto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    Pusher.logToConsole = true;

    const pusher = new Pusher('070f21dbf126b2a0113c', {
      cluster: 'eu',
    });

    //revisar para que no se dupliquen los chats
    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: any) => {
      // data.mensajes.forEach((msg: any) => {
        // this.messages.push(msg);
        this.getMensajesUsers(this.idUserDos)
      // });
    });

    this.getUser();
    this.getRequest();
    this.route.queryParams.subscribe((params) => {
      this.otherUserId = {
        id: params['id'],
        texto: params['texto'],
      };
    });

    // Seteamos los valores
    this.ContactosForm.patchValue({
      id: this.otherUserId?.id || '',
      texto: this.otherUserId?.texto || '',
    });
  }

  openChatUser(idUser: string) {
    this.openChat = true;
    console.log(this.openChat);
    this.getMensajesUsers(idUser);
    this.idUserDos = idUser;
  }

  mostrarUserInfo(mensaje: any, index: number): boolean {
    if (index > 0 && mensaje && mensaje[index] && mensaje[index - 1]) {
      const mensajeActual = mensaje[index];
      const mensajeAnterior = mensaje[index - 1];
  
      // Extraer la hora y el minuto de las fechas
      const horaMinutoActual =
        new Date(mensajeActual.created_at).getHours() +
        ':' +
        new Date(mensajeActual.created_at).getMinutes();
      const horaMinutoAnterior =
        new Date(mensajeAnterior.created_at).getHours() +
        ':' +
        new Date(mensajeAnterior.created_at).getMinutes();
  
      if (
        mensajeActual.usuario === mensajeAnterior.usuario && // Misma persona
        horaMinutoActual === horaMinutoAnterior // Misma hora y minuto
      ) {
        return false;
      }
    }
    return true;
  }
  

  mostrarDateInfo(created_at: string): string {
    const mensajeFecha = new Date(created_at);
    const hoy = new Date();

    // Obtener la fecha de ayer
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    ayer.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00:00 para una comparación precisa

    if (mensajeFecha.getDate() === hoy.getDate()) {
      // El mensaje fue enviado hoy
      return (
        'Hoy ' +
        mensajeFecha.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } else if (mensajeFecha.getTime() >= ayer.getTime()) {
      // El mensaje fue enviado ayer
      return (
        'Ayer ' +
        mensajeFecha.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } else {
      // El mensaje fue enviado hace más de un día
      return mensajeFecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  getRequest() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.ContactosService.getAllRequest(userToken).subscribe({
        next: (requests: any[]) => {
          // Cambia any por el tipo correcto si lo conoces
          this.Requests = requests; // Asigna toda la matriz de solicitudes
          console.log('Info request:');
          console.log(requests); // Muestra toda la matriz en la consola
        },
        error: (error) => {
          console.error('Error error al enviar la solicitud:', error);
        },
      });

      this.ContactosService.getAllFriends(userToken).subscribe({
        next: (friends: any[]) => {
          // Cambia any por el tipo correcto si lo conoces
          this.Friends = friends; // Asigna toda la matriz de solicitudes
          console.log('Info request:');
          console.log(friends); // Muestra toda la matriz en la consola
        },
        error: (error) => {
          console.error('Error al obtener todos los amigos:', error);
        },
      });
    }
  }

  // getUsuario
  getUser() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.UsersService.getUsuarios(userToken).subscribe({
        next: (user: any[]) => {
          this.User = user;
          this.getRequest();
        },
        error: (error) => {
          console.error('Error al obtener tu usuario:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  getUsers() {
    const userToken = this.tokenService.getToken();
    const id = this.ContactosForm.value;
    console.log('userToken getChuches: ' + userToken);
    console.log('Id del formulario:', id);

    if (userToken !== null && id !== null) {
      this.ContactosService.getAllUsers(userToken, id).subscribe({
        next: (users: any) => {
          alert('Solicitud enviada');
          this.Users = users[0];
          this.getRequest();
          this.getUser();
        },
        error: (error) => {
          console.error('Error al enviar la solicitud:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  acceptar(id: string) {
    const userToken = this.tokenService.getToken();
    // const id = this.ContactosForm.value;
    console.log('userToken getChuches: ' + userToken);
    console.log('Id del usuario:', id);

    if (userToken !== null && id !== null) {
      this.ContactosService.acceptar(userToken, id).subscribe({
        next: (response: any) => {
          alert('Tienes un nuevo amigo');
          console.log(response.message);
          this.getRequest();
          this.getUser();
        },
        error: (error) => {
          console.error('Error al acceptar:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  denegar(id: string) {
    const userToken = this.tokenService.getToken();
    // const id = this.ContactosForm.value;
    console.log('userToken getChuches: ' + userToken);
    console.log('Id del usuario:', id);

    if (userToken !== null && id !== null) {
      this.ContactosService.denegar(userToken, id).subscribe({
        next: (response: any) => {
          alert('No quiero amigos solo Xuxemons');
          console.log(response.message);
          this.getRequest();
          this.getUser();
        },
        error: (error) => {
          console.error('Error al denegar:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  getMensajesUsers(idUser: string) {
    const userToken = this.tokenService.getToken();
    // const idUser = "AAAAA1";

    if (userToken !== null) {
      this.ContactosService.getAllChat(userToken, idUser).subscribe({
        next: (chat: any[]) => {
          // Cambia any por el tipo correcto si lo conoces
          this.Chat = chat; // Asigna toda la matriz de solicitudes
        },
        error: (error) => {
          console.error('Error en el chat:', error);
        },
      });
    }
  }

  // Esta función convierte la cadena de mensajes JSON en un objeto JavaScript
  parseMensajes(mensajesString: string): any[] {
    try {
      if (!mensajesString) {
        return []; // O devuelve un valor predeterminado adecuado si es necesario
      }
      return JSON.parse(mensajesString);
    } catch (error) {
      console.error('Error al analizar mensajes JSON:', error);
      return []; // O devuelve un valor predeterminado adecuado si es necesario
    }
  }

  guardarMensajes(id2: string) {
    const userToken = this.tokenService.getToken();
    const texto = this.ContactosForm.get('texto')?.value;

    if (userToken !== null && id2 !== null && texto !== null && texto !== '') {
      this.ContactosService.guardarMensajes(userToken, id2, texto).subscribe({
        next: (response: any) => {
          this.ContactosForm.reset();
        },
        error: (error) => {
          console.error('Error al aceptar:', error);
        },
      });
      // this.chatVivo(id2);
    } else {
      console.error('User ID is null');
    }
  }

  intercambio(idUser: string) {

    this.ContactosService.getId(idUser).subscribe({
      next: (id: any) => {
        this.router.navigate(['/intercambio'], { queryParams: { id: id} });
      },
    });
  }
}
