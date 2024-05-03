import { Component } from '@angular/core';
// Imports necesarios //
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  // Valores que espera y validadores de estos que espera del formulario //
  registroForm: FormGroup = new FormGroup({
    nick: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    password_confirmation: new FormControl('', [Validators.required]),
    rol: new FormControl(false)
  });

  constructor(
    public userService: UsersService,
    private router: Router) { }

  /**
   * Función: Registrar
   * Explicación: Comprueba que sean la misma contraseña, 
   * envia lis datos al servicio del usuario y
   * muestra alertas del tipo de resultado que ha tenido el servicio
   */
  Registrar() {
    if (this.registroForm.value.contraseña === this.registroForm.value.RepetirContraseña) {
      this.userService.Registrar(this.registroForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          alert('Usuario registrado correctamente.');
        },
        error: (error) => {
          alert('No se pudo registrar el usuario correctamente' + error);
          throw new Error(error);
        }
      });
    } else {
      alert("Las contraseñas no coinciden, repitela");
    }
  }
}
