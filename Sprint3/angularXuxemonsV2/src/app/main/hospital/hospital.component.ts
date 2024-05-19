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
        this.hospitalizados = value[0];
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
      ['/inventario']
    );
  }
}
