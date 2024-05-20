import { Component } from '@angular/core';
// imports extras //
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { XuxemonsService } from '../../../../services/xuxemons/xuxemons.service';
import { TokenService } from '../../../../services/token/token.service';
import { ChuchesService } from '../../../../services/chuches/chuches.service';
import { CurarService } from '../../../../services/curar/curar.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alimentar',
  templateUrl: './alimentar.component.html',
  styleUrls: ['./alimentar.component.css']
})
export class AlimentarComponent {
  alimentForm: FormGroup;
  xuxeData: any;
  chuchesList: any[] = [];
  cumpleEvo1: boolean = false;
  cumpleEvo2: boolean = false;

  constructor(
    private fb: FormBuilder,
    public xuxemonsService: XuxemonsService,
    public curarService: CurarService,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private chuchesService: ChuchesService
  ) {
    this.alimentForm = this.fb.group({
      chucheSeleccionada: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getChuches()

    this.route.queryParams.subscribe((params) => {
      this.xuxeData = {
        id: params['id'],
        nombre: params['nombre'],
        archivo: params['archivo'],
        tamano: params['tamano'],
        tipo: params['tipo'],
      };
    });
  }

  /**
   * Nombre: alimentarXuxemon
   * Función: envia los parametros necesarios para ejecutar la evolución
   * @param newAlimentData
   */
  alimentarXuxemon(newAlimentData: number) {
    const newXuxeData = parseInt(this.xuxeData.id);

    this.xuxemonsService.alimentar(newXuxeData, newAlimentData).subscribe({
      next: (returns) => {
        this.cumpleEvo1 = returns.cumpleEvo1;
        this.cumpleEvo2 = returns.cumpleEvo2;
        this.getChuches();
      },
      error: (error) => {
        window.alert(JSON.stringify(error));
        console.log(error);
        alert('No quiere tu mierda de chuche.');
        throw new Error(error);
      },
    });
  }

  /**
   * Nombre: alimentarXuxemon
   * Función: para editar el Xuxemon
   * @param xuxeUser
   */
  accionCumpleEvo1() {
    const newXuxeData = parseInt(this.xuxeData.id);

    this.xuxemonsService
      .evolucionarXuxemon(newXuxeData, this.cumpleEvo1)
      .subscribe({
        next: () => {
          this.router.navigate(['/caja']);

        },
        error: (error) => {
          window.alert(JSON.stringify(error));
          throw new Error(error);
        },
      });
  }

  /**
   * Nombre: alimentarXuxemon
   * Función: para editar el Xuxemon
   * @param xuxeUser
   */
  accionCumpleEvo2() {
    const newXuxeData = parseInt(this.xuxeData.id);

    console.log(newXuxeData, this.cumpleEvo2);

    this.xuxemonsService
      .evolucionarXuxemon2(newXuxeData, this.cumpleEvo2)
      .subscribe({
        next: () => {
          this.router.navigate(['/caja']);
        },
        error: (error) => {
          console.log(error);
          window.alert(JSON.stringify(error));
          throw new Error(error);
          // console.log(error);
        },
      });
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
   * Nombre: alimentarXuxemon
   * Función: para editar el Xuxemon
   */
  getChuches() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.chuchesService.getAllChuchesUser(userToken).subscribe({
        next: (chuchesUser: any) => {
          this.chuchesList = chuchesUser[0];
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
