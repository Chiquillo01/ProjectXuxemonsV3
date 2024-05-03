import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XuxemonsUsers } from '../../models/xuxemons/xuxemons-user.model';
import { TokenService } from '../../services/token/token.service';
import { XuxemonsService } from '../../services/xuxemons/xuxemons.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent {
  xuxemonsUser: XuxemonsUsers[] = [];

  constructor(
    private tokenService: TokenService,
    private xuxemonsService: XuxemonsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getXuxemonsEnfermos();
  }

  /**
   * Nombre: getXuxemonsEnfermos
   * Función: obtiene todos los Xuxemons que son del usuario que esta en sessión
   */
  getXuxemonsEnfermos() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.xuxemonsService.getAllXuxemonsEnfermosUser(userToken).subscribe({
        next: (xuxemonsUser: any) => {
          this.xuxemonsUser = xuxemonsUser;
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  /**
   * Nombre: curar
   * Función: Envia los valores necesarios para añadir o quitar al xuxemon 
   * seleccionado como favorito
   * @param xuxeUser
   */
  curar() {
    this.router.navigate(
      ['/home/home/inventario/objetos']
    );
  }

  /**
  * Nombre: getImageStyle
  * Función: Modificar el tamaño de la imagen segun el tamaño del xuxemon
  * @param tamano
  * @returns width
  */
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
}
