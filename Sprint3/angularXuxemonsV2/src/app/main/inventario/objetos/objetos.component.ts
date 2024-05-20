import { Component } from '@angular/core';
import { Curas } from '../../../models/curas/curas.model';
import { Hospital } from '../../../models/hospital/hospital.model';
import { UsersService } from '../../../services/users/users.service';
import { TokenService } from '../../../services/token/token.service';
import JSONPRequest from 'pusher-js/types/src/runtimes/web/dom/jsonp_request';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-objetos',
  templateUrl: './objetos.component.html',
  styleUrls: ['./objetos.component.css'],
})
export class ObjetosComponent {
  curas: Curas[] = [];
  hospitalizados: Hospital[] = [];
  // Filtro //
  categoria: string = '';
  // Pasar páginas //
  currentPage: number = 1;
  itemsPerPage: number = 10;

  enfermedad: string | undefined;

  constructor(
    private tokenService: TokenService,
    public userService: UsersService
  ) {}

  ngOnInit(): void {
    this.updateItems();
    this.updateHospital();
  }

  /**
   * Nombre: updateXuxemons
   * Función: obtener todos los Xuxemons de la BD
   */
  updateItems() {
    this.userService.getAllInvertario().subscribe({
      next: (value: any) => {
        this.curas = value[0];
      },
      error: (error) => {
        console.error('Error fetching inventori:', error);
      },
    });
  }

  /**
   * Nombre: E1Curar
   * Función: curan todas las enfermedades del chuchemon
   */
  E1Curar() {
    const userToken = this.tokenService.getToken();
    this.userService.curarEnf1(userToken!).subscribe({
      next: (value: any) => {
        window.alert(JSON.stringify(value));
      },
      error: (error) => {
        console.error(error);
        window.alert(JSON.stringify(error));
      },
    });
  }
  E2Curar() {
    const userToken = this.tokenService.getToken();
    this.userService.curarEnf2(userToken!).subscribe({
      next: (value: any) => {
        window.alert(JSON.stringify(value));
      },
      error: (error) => {
        console.error(error);
        window.alert(JSON.stringify(error));
      },
    });
  }
  E3Curar() {
    const userToken = this.tokenService.getToken();
    this.userService.curarEnf3(userToken!).subscribe({
      next: (value: any) => {
        console.log(value);
        window.alert('Todos tus Xuxemons se han currado de ATRACÓN');
      },
      error: (error) => {
        console.error(error);
        // window.alert(JSON.stringify(error));
      },
    });
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
        this.enfermedad = this.hospitalizados[0].enfermedad_nombre;
      },
      error: (error) => {
        console.error('Error fetching hospitalizados:', error);
      },
    });
  }

  /**
   * Nombre: conseguirCategorias
   * Función: consigue las categorias existentes para hacer el filtro
   */
  conseguirCategorias(): string[] {
    const categorias = this.curas.map((value) => value.categoria);
    return categorias.filter(
      (value: string, idx: number) => categorias.indexOf(value) == idx
    );
  }
  /**
   * Nombre: obtenerItemsPorCategoria
   * Función: obtiene las categorias de los items para poder hacer el filtraje con estas
   */
  obtenerItemsPorCategoria(): Curas[] {
    return this.curas.filter(
      (value) =>
        value.categoria.toLowerCase().indexOf(this.categoria.toLowerCase()) !=
        -1
    );
  }
  /**
   * Nombre: getCurrentPagItems
   * Función: devuelve los items correspondientes a la página actual
   */
  getCurrentPagItems(): Curas[] {
    const filteredXuxemons = this.obtenerItemsPorCategoria();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredXuxemons.slice(startIndex, endIndex);
  }

  /**
   * Nombre: prevPage, nextPage, totalPages
   * Función: controlan la paginación del inventario
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
    const filteredItems = this.obtenerItemsPorCategoria();
    return Math.ceil(filteredItems.length / this.itemsPerPage);
  }

  getStyle(categoria: string) {
    let border: string;

    const curas = '3px solid rgb(10, 90, 220)';
    const dinero = '3px solid rgb(245, 94, 7)';
    const otros = '3px solid rgb(2, 254, 212)';

    switch (categoria) {
      case 'curacion':
        border = curas;
        break;
      case 'dinero':
        border = dinero;
        break;
      case 'otros':
        border = otros;
        break;
      default:
        border = '3px solid black';
        break;
    }
    return {
      border: border,
    };
  }
}
