import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Imports extras //
import { TokenService } from '../../services/token/token.service';
import { IntercambioService } from '../../services/intercambio/intercambio.service';
import { XuxemonsUsers } from '../../models/xuxemons/xuxemons-user.model';
import { UsersService } from 'src/app/services/users/users.service';
import { Users } from 'src/app/models/users/users.model';

@Component({
  selector: 'app-intercambio',
  templateUrl: './intercambio.component.html',
  styleUrls: ['./intercambio.component.css'],
})
export class IntercambioComponent implements OnInit {
  xuxemonsUser: XuxemonsUsers[] = [];
  xuxemonsOtherUser: XuxemonsUsers[] = [];
  idOtherUser!: string;
  User: any = [];
  OtherUser: any = [];
  xuxemon1: any;
  xuxemon2: any;
  xuxemonOferta1: XuxemonsUsers | undefined;
  xuxemonOferta2: XuxemonsUsers | undefined;
  xuxemonId1: any;
  xuxemonId2: any;
  Ofertas: boolean = false;

  constructor(
    private tokenService: TokenService,
    private IntercambioService: IntercambioService,
    private UsersService: UsersService,
    private router: Router,
    private route: ActivatedRoute // Nuevo servicio agregado aquí
  ) {}

  ngOnInit(): void {
    // Captura el parámetro 'id' de la ruta
    this.route.queryParams.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.idOtherUser = userId;
        this.getXuxemonsOtherUser(this.idOtherUser); // Llamar aquí después de asignar el ID
      }
    });

    console.log(this.idOtherUser);
    this.getXuxemonsUser();
  }

  verOfertas() {
    if (this.Ofertas) {
      this.Ofertas = false;
    } else {
      this.Ofertas = true;
    }

    if (this.Ofertas) {
      this.getShowTrade();
    }

    console.log(this.Ofertas);
    console.log(this.getShowTrade);
  }

  getXuxemon1(xuxemon: XuxemonsUsers) {
    this.xuxemon1 = xuxemon;
    this.xuxemonId1 = xuxemon.xuxemon_id;
  }

  getXuxemon2(xuxemon: XuxemonsUsers) {
    this.xuxemon2 = xuxemon;
    this.xuxemonId2 = xuxemon.xuxemon_id;
  }

  getImageStyle(tamano: string): any {
    let width: number;
    const paqueno = 50;
    const mediano = 100;
    const grande = 150;

    switch (tamano) {
      case 'pequeno':
        width = paqueno;
        break;
      case 'mediano':
        width = mediano;
        break;
      case 'grande':
        width = grande;
        break;
      default:
        width = paqueno;
        break;
    }
    return {
      'width.px': width,
    };
  }

  getXuxemonsUser() {
    const userToken = this.tokenService.getToken();
    if (userToken !== null) {
      this.IntercambioService.getAllXuxemonsUser(userToken).subscribe({
        next: (xuxemonsUser: any) => {
          this.xuxemonsUser = xuxemonsUser[0];
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });

      this.IntercambioService.getUsuario(userToken).subscribe({
        next: (user: Users[]) => {
          this.User = user[0].nick;
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        },
      });
    } else {
      console.error('User token is null');
    }
  }

  getXuxemonsOtherUser(idUser: string) {
    if (idUser !== null) {
      this.IntercambioService.getAllXuxemonsOtherUser(idUser).subscribe({
        next: (xuxemonsUser: any) => {
          this.xuxemonsOtherUser = xuxemonsUser[0];
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });

      this.IntercambioService.getUsuario(idUser).subscribe({
        next: (otherUser: Users[]) => {
          // this.OtherUser = otherUser[0].nick;
        },
        error: (error) => {
          console.error('Error fetching other user:', error);
        },
      });
    } else {
      console.error('Other user ID is null');
    }
  }

  getShowTrade() {
    const userToken = this.tokenService.getToken();

    if (this.idOtherUser && userToken) {
      this.IntercambioService.Intercambio1(
        userToken,
        this.idOtherUser
      ).subscribe({
        next: (xuxemonsUser1: any) => {
          console.log(xuxemonsUser1);
          // Asignar los Xuxemons a las variables correspondientes
          this.xuxemonOferta1 = xuxemonsUser1;
          console.log('Xuxemon Oferta 1:', this.xuxemonOferta1);
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });

      this.IntercambioService.Intercambio2(
        userToken,
        this.idOtherUser
      ).subscribe({
        next: (xuxemonsUser2: any) => {
          console.log(xuxemonsUser2);
          // Asignar los Xuxemons a las variables correspondientes
          this.xuxemonOferta2 = xuxemonsUser2;
          console.log('Xuxemon Oferta 2:', this.xuxemonOferta2);
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    }
  }

  //pensar como mandar la peticion
  solicitudIntercambio() {
    const userToken = this.tokenService.getToken();

    if (this.idOtherUser && userToken) {
      this.IntercambioService.solicitudTrade(
        userToken,
        this.xuxemonId1,
        this.idOtherUser,
        this.xuxemonId2
      ).subscribe({
        next: (xuxemonsUser: any) => {
          this.xuxemonsOtherUser = xuxemonsUser[0];
          window.alert("Oferta de intercambio enviada");
          this.router.navigate(['/home'], {} );
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    }
  }

  acceptarIntercambio() {
    const userToken = this.tokenService.getToken();

    if (this.idOtherUser && userToken && this.xuxemonOferta1 && this.xuxemonOferta2) {
      this.IntercambioService.acceptTrade(
        userToken,
        this.xuxemonOferta1.xuxemon_id,
        this.idOtherUser,
        this.xuxemonOferta2.xuxemon_id
      ).subscribe({
        next: () => {
          this.router.navigate(['/home'], {} );
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    }
  }

  getStyle(tipo: string) {
    const borderStyle = this.getBorderStyle(tipo);
    const backgroundStyle = this.getBackgrounStyle(tipo);

    return Object.assign({}, borderStyle, backgroundStyle);
  }

  getBorderStyle(tipo: string) {
    let border: string;

    const agua = '5px solid rgb(9, 91, 243)';
    const tierra = '5px solid rgb(245, 94, 7)';
    const aire = '5px solid rgb(2, 254, 212)';

    switch (tipo) {
      case 'Agua':
        border = agua;
        break;
      case 'Tierra':
        border = tierra;
        break;
      case 'Aire':
        border = aire;
        break;
      default:
        border = '5px solid black';
        break;
    }
    return {
      border: border,
    };
  }

  getBackgrounStyle(tipo: string) {
    let background: string;

    const agua = 'linear-gradient(to bottom, #6193EA, #FFFFFF)';
    const tierra = 'linear-gradient(to bottom, #EA8A60, #FFFFFF)';
    const aire = 'linear-gradient(to bottom, #81FFF7 , #FFFFFF)';

    switch (tipo) {
      case 'Agua':
        background = agua;
        break;
      case 'Tierra':
        background = tierra;
        break;
      case 'Aire':
        background = aire;
        break;
      default:
        background = 'linear-gradient(to bottom, #ff0000, #FFFFFF);';
        break;
    }
    return {
      background: background,
    };
  }

  getTipeStyle(tipo: string) {
    let color: string;

    const agua = 'rgb(9, 91, 243)';
    const tierra = 'rgb(245, 94, 7)';
    const aire = 'rgb(2, 254, 212)';

    switch (tipo) {
      case 'Agua':
        color = agua;
        break;
      case 'Tierra':
        color = tierra;
        break;
      case 'Aire':
        color = aire;
        break;
      default:
        color = 'black';
        break;
    }
    return {
      color: color,
    };
  }
}
