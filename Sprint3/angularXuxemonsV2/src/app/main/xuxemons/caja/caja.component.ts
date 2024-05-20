import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
// Imports extras //
import { TokenService } from '../../../services/token/token.service';
import { XuxemonsService } from '../../../services/xuxemons/xuxemons.service';
import { CurarService } from 'src/app/services/curar/curar.service';
import { XuxemonsUsers } from '../../../models/xuxemons/xuxemons-user.model';
import { EnfermedadesUser } from '../../../models/enfermedadesUser/enfermedadesUser.model';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  xuxemonsUser: XuxemonsUsers[] = [];
  xuxemonsUserActivos: XuxemonsUsers[] = [];
  enfermedades: EnfermedadesUser[] = [];
  // Filtro //
  categoria: string = "";
  // Pasar páginas //
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private tokenService: TokenService,
    private xuxemonsService: XuxemonsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getXuxemons();
    this.getXuxemonsActivos();
  }

  /**
   * Nombre: getXuxemons
   * Función: obtiene todos los Xuxemons que son del usuario que esta en sessión
   */
  getXuxemons() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.xuxemonsService.getAllXuxemonsUser(userToken).subscribe({
        next: (xuxemonsUser: any) => {
          this.xuxemonsUser = xuxemonsUser[0];
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
   * Nombre: getXuxemons
   * Función: obtiene todos los Xuxemons que son del usuario que esta en sessión
   */
  getXuxemonsActivos() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.xuxemonsService.getAllXuxemonsUserActivos(userToken).subscribe({
        next: (xuxemonsUserActivos: any) => {
          this.xuxemonsUserActivos = xuxemonsUserActivos[0];
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
   * Nombre: conseguirCategorias
   * Función: consigue las categorias existentes para hacer el filtro
   */
  conseguirCategorias(): string[] {
    const categorias = this.xuxemonsUser.map(value => value.categoria);
    return categorias.filter((value: string, idx: number) => categorias.indexOf(value) == idx);
  }
  /**
   * Nombre: obtenerXuxemonsPorCategoria
   * Función: obtiene las categorias de los xuxemons para poder hacer el filtraje con estas
   */
  obtenerXuxemonsPorCategoria(): XuxemonsUsers[] {
    return this.xuxemonsUser.filter(value => (value.categoria.toLowerCase()).indexOf(this.categoria.toLowerCase()) != -1);

  }

  /**
   * Nombre: getCurrentPageXuxemons
   * Función: devuelve los Xuxemons correspondientes a la página actual
   */
  getCurrentPageXuxemons(): XuxemonsUsers[] {
    const filteredXuxemons = this.obtenerXuxemonsPorCategoria();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredXuxemons.slice(startIndex, endIndex);
  }

  /**
   * Nombre: prevPage, nextPage, totalPages
   * Función: controlan la paginación de los xuxemons
   */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }
  totalPages(): number {
    const filteredXuxemons = this.obtenerXuxemonsPorCategoria();
    return Math.ceil(filteredXuxemons.length / this.itemsPerPage);
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

  /**
   * Nombre: debug
   * Función: crea aleatoriamente un Xuxemon pasandole el id del usuario de la sesión habierta.
   * Despues actualizara la lista de Xuxemons del Usuario
   */
  debug(): void {
    const userToken = this.tokenService.getToken();
    this.xuxemonsService.createRandomXuxemon(userToken!).subscribe({
      next: () => {
        this.getXuxemons();
      },
      error: (error) => {
        alert('No va el debug');
        throw new Error(error);
      },
    });
  }

  /**
   * Nombre: activo
   * Función: crea aleatoriamente un Xuxemon pasandole el id del usuario de la sesión habierta.
   * Despues actualizara la lista de Xuxemons del Usuario
   */
  activo(xuxeUser: any) {
    const userToken = this.tokenService.getToken();
    const xuxemon_id = xuxeUser.xuxemon_id;
    const ContadorActivo = this.xuxemonsUserActivos.length;

    if (ContadorActivo < 4 || xuxeUser.activo == 1) {
      this.xuxemonsService.xuxemonActivo(userToken!, xuxemon_id).subscribe({
        next: () => {
          this.getXuxemonsActivos();
          this.getXuxemons();
          if (xuxeUser.activo == 0) {
            xuxeUser.activo = 1;
          } else {
            xuxeUser.activo = 0;
          }
        },
        error: (error) => {
          alert('No quiere ser activo');
          throw new Error(error);
        },
      });
    } else {
      alert('No se permiten mas de 4 Xuxemons activos');
    }
  }

  /**
   * Nombre: favorito
   * Función: Envia los valores necesarios para añadir o quitar al xuxemon
   * seleccionado como favorito
   * @param xuxeUser
   */
  favorito(xuxeUser: any) {
    const userToken = this.tokenService.getToken();
    const xuxemon_id = xuxeUser.xuxemon_id;

    this.xuxemonsService.xuxemonFav(userToken!, xuxemon_id).subscribe({
      next: () => {
        // alert('Se ha podido modificar');
        this.getXuxemonsActivos();
        this.getXuxemons();
      },
      error: (error) => {
        alert('No quiere tu mierda de chuche.');
        throw new Error(error);
      },
    });
  }

  /**
   * Nombre: alimentar
   * Función: Envia al usuario a a ruta para alimentar al Xuxemon, a su vez esta enviando los datos del xuxuemon
   */
  alimentar(xuxeUser: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: xuxeUser.xuxemon_id,
        nombre: xuxeUser.nombre,
        archivo: xuxeUser.archivo,
        tamano: xuxeUser.tamano,
        tipo: xuxeUser.tipo,
      },
    };
    this.router.navigate(
      ['/alimentar'],
      navigationExtras
    );
  }

  /**
   * Nombre: favorito
   * Función: Envia los valores necesarios para añadir o quitar al xuxemon
   * seleccionado como favorito
   * @param xuxeUser
   */
  hospital() {
    this.router.navigate(['/hospital']);
  }

  /**
   * Nombre: eliminar
   * Función: Eliminar el xuxemon seleccionado
   */
  eliminar(xuxeUser: number) {
    if (window.confirm('¿Seguro que lo quieres eliminar?')) {
        this.xuxemonsService.XuxeDelete(xuxeUser).subscribe({
            next: () => {
                this.getXuxemons();
                alert('Xuxemon eliminado con éxito.');
            },
            error: (error) => {
                alert('No se puede eliminar el Xuxemon.');
                throw new Error(error);
            },
        });
    } else {
        alert('Eliminación cancelada.');
    }
}

}
