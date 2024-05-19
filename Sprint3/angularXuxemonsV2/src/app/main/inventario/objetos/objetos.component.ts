import { Component } from '@angular/core';
import { Curas } from '../../../models/curas/curas.model';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-objetos',
  templateUrl: './objetos.component.html',
  styleUrls: ['./objetos.component.css']
})
export class ObjetosComponent {
  curas: Curas[] = [];
  // Filtro //
  categoria: string = "";
  // Pasar páginas //
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    public userService: UsersService,
  ) {
  }

  ngOnInit(): void {
    this.updateItems();
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
   * Nombre: conseguirCategorias
   * Función: consigue las categorias existentes para hacer el filtro
   */
  conseguirCategorias(): string[] {
    const categorias = this.curas.map(value => value.categoria);
    return categorias.filter((value: string, idx: number) => categorias.indexOf(value) == idx);
  }
  /**
     * Nombre: obtenerItemsPorCategoria
     * Función: obtiene las categorias de los items para poder hacer el filtraje con estas
     */
  obtenerItemsPorCategoria(): Curas[] {
    return this.curas.filter(value => (value.categoria.toLowerCase()).indexOf(this.categoria.toLowerCase()) != -1);
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
      case 'curacion': border = curas; break;
      case 'dinero': border = dinero; break;
      case 'otros': border = otros; break;
      default: border = '3px solid black'; break;
    }
    return {
      'border': border,
    };
  }
}
