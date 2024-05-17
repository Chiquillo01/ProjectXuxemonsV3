import { Component, EventEmitter, Output } from '@angular/core';
// Imports extras //
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from './../../../../services/users/users.service';
import { XuxemonsService } from './../../../../services/xuxemons/xuxemons.service';
import { Xuxemons } from '../../../../models/xuxedex/xuxedex.model';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class CrearComponent {
  // Variables //
  xuxemonForm!: FormGroup;
  xuxemon: Xuxemons | undefined;

  @Output() enviarFormulario: EventEmitter<Xuxemons> =
    new EventEmitter<Xuxemons>();
  @Output() ocultarForm = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    public userService: UsersService,
    public xuxemonsService: XuxemonsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Restricciones que se espera que tenga el FormGroup //
    this.xuxemonForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      tipo: new FormControl('', [Validators.required]),
      archivo: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Nombre: crearXuxemon
   * Función: Envia los valores del formulario al servicio para enviarlos a la api
   */
  crearXuxemon() {
    if (this.xuxemonForm.valid) {
      this.xuxemonsService.createXuxemon(this.xuxemonForm.value).subscribe({
        next: () => {
          alert('Xuxemon creado con exito');
          this.router.navigate(['/xuxedex']);
        },
        error: (error) => {
          alert('No se pudo crear el Xuxemon');
          throw new Error(error);
        },
      });
    }
  }
}
