import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
// Imports extras //
import { Xuxemons } from '../../../models/xuxedex/xuxedex.model';
import { UsersService } from '../../../services/users/users.service';
import { XuxemonsService } from '../../../services/xuxemons/xuxemons.service';
import { TokenService } from '../../../services/token/token.service';

@Component({
  selector: 'app-xuxedex',
  templateUrl: './xuxedex.component.html',
  styleUrls: ['./xuxedex.component.css'],
})
export class XuxedexComponent {
  xuxemons: Xuxemons[] = [];
  userRole: Number | null;
  // Filtro //
  categoria: string = "";
  // Pasar páginas //
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    public userService: UsersService,
    public xuxemonsService: XuxemonsService,
    private router: Router,
    public tokenService: TokenService
  ) {
    this.userRole = this.tokenService ? this.tokenService.getRole() : null;
  }

  ngOnInit(): void {
    this.updateXuxemons();
  }

  /**
   * Nombre: updateXuxemons
   * Función: obtener todos los Xuxemons de la BD
   */
  updateXuxemons() {
    this.xuxemonsService.getAllXuxemons().subscribe({
      next: (value: any) => {
        this.xuxemons = value[0];
      },
      error: (error) => {
        console.error('Error fetching Xuxemons:', error);
      },
    });
  }

  /**
   * Nombre: conseguirCategorias
   * Función: consigue las categorias existentes para hacer el filtro
   */
  conseguirCategorias(): string[] {
    const categorias = this.xuxemons.map(value => value.categoria);
    return categorias.filter((value: string, idx: number) => categorias.indexOf(value) == idx);
  }
  /**
   * Nombre: obtenerXuxemonsPorCategoria
   * Función: obtiene las categorias de los xuxemons para poder hacer el filtraje con estas
   */
  obtenerXuxemonsPorCategoria(): Xuxemons[] {
    return this.xuxemons.filter(value => (value.categoria.toLowerCase()).indexOf(this.categoria.toLowerCase()) != -1);
  }

  /**
   * Nombre: getCurrentPageXuxemons
   * Función: devuelve los Xuxemons correspondientes a la página actual
   */
  getCurrentPageXuxemons(): Xuxemons[] {
    const filteredXuxemons = this.obtenerXuxemonsPorCategoria();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredXuxemons.slice(startIndex, endIndex);
  }

  /**
   * Nombre: crear
   * Función: crar que envia al usuario a la vista para crear Xuxemons
   */
  crear() {
    this.router.navigate(['/crear']);
  }

  /**
   * Nombre: editar
   * Función: editar el Xuxemon seleccionado
   */
  editar(xuxe: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: xuxe.id,
        nombre: xuxe.nombre,
        tipo: xuxe.tipo,
        archivo: xuxe.archivo,
        categoria: xuxe.categoria,
      },
    };
    this.router.navigate(
      ['/editar'], navigationExtras
    );
  }

  /**
   * Nombre: eliminar
   * Función: envia el id del xuxemon al service, esto lo hace para saber que xuxemon eliminar
   */
  eliminar($id: any) {
    this.xuxemonsService.XuxeDelete($id).subscribe({
      next: () => {
        this.router.navigate(['/xuxedex']);
        alert('Xuxemon eliminado con exito.');
        this.updateXuxemons();
      },
      error: (error) => {
        alert('Ha fallado algo, el Xuxemon no pudo ser eliminado');
        throw new Error(error);
      },
    });
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

    const agua = '5px solid rgb(9, 91, 243)';
    const tierra = '5px solid rgb(245, 94, 7)';
    const aire = '5px solid rgb(2, 254, 212)';


    switch (tipo) {
      case 'Agua': border = agua; break;
      case 'Tierra': border = tierra; break;
      case 'Aire': border = aire; break;
      default: border = '5px solid black'; break;
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
}

