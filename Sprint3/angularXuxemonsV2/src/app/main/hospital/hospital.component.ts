import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from '../../models/hospital/hospital.model';
import { UsersService } from '../../services/users/users.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent {
  hospitalizados: Hospital[] = [];

  constructor(
    private tokenService: TokenService,
    public userService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.updateHospital();
  }

  /**
   * Nombre: updateHospital
   * Función: obtener todos los Xuxemons del usuario que estan enfermos
   */
  updateHospital() {
    const userToken = this.tokenService.getToken();
    this.userService.getAllHospital(userToken!).subscribe({
      next: (value: any) => {
        this.hospitalizados = value.xuxemonsEnfermos;
        console.log(value);
        console.log(this.hospitalizados);
      },
      error: (error) => {
        console.error('Error fetching hospitalizados:', error);
      },
    });
  }

  /**
   * Nombre: curar
   * Función: Envia los valores necesarios para añadir o quitar al xuxemon 
   * seleccionado como favorito
   * @param xuxeUser
   */
  curar() {
    this.router.navigate(
      ['/objetos']
    );
  }

  getStyle(tipo: string) {
    const borderStyle = this.getBorderStyle(tipo);
    const backgroundStyle = this.getBackgrounStyle(tipo);

    return Object.assign({}, borderStyle, backgroundStyle);
  }

  getBorderStyle(tipo: string) {
    let border: string;

    const agua = '4px solid rgb(9, 91, 243)';
    const tierra = '4px solid rgb(245, 94, 7)';
    const aire = '4px solid rgb(2, 254, 212)';


    switch (tipo) {
      case 'Agua': border = agua; break;
      case 'Tierra': border = tierra; break;
      case 'Aire': border = aire; break;
      default: border = '4px solid black'; break;
    }
    return {
      'border': border,
    };
  }

  getBackgrounStyle(tipo: string) {
    let background: string;

    const agua = 'linear-gradient(to bottom, #6193EA, #FFFFFF)';
    const tierra = 'linear-gradient(to bottom, #EA8A60, #FFFFFF)';
    const aire = 'linear-gradient(to bottom, #81FFF7 , #FFFFFF)';


    switch (tipo) {
      case 'Agua': background = agua; break;
      case 'Tierra': background = tierra; break;
      case 'Aire': background = aire; break;
      default: background = 'linear-gradient(to bottom, #ff0000, #FFFFFF);'; break;
    }
    return {
      'background': background,
    };
  }

  getTipeStyle(tipo: string) {
    let color: string;

    const agua = 'rgb(9, 91, 243)';
    const tierra = 'rgb(245, 94, 7)';
    const aire = 'rgb(2, 254, 212)';


    switch (tipo) {
      case 'Agua': color = agua; break;
      case 'Tierra': color = tierra; break;
      case 'Aire': color = aire; break;
      default: color = 'black'; break;
    }
    return {
      'color': color,
    };
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
