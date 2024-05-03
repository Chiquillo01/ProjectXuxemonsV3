import { Component } from '@angular/core';
// Imports agregados //
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { XuxemonsService } from '../../../services/xuxemons/xuxemons.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  configTam: FormGroup;
  configEvo: FormGroup;
  configEvo2: FormGroup;

  constructor(
    private fb: FormBuilder,
    private xuxemonsService: XuxemonsService
  ) {
    this.configTam = this.fb.group({
      tamano: ['', [Validators.required]],
    });
    this.configEvo = this.fb.group({
      evo1: ['', [Validators.required]],
    });
    this.configEvo2 = this.fb.group({
      evo2: ['', [Validators.required]],
    });
  }

  /**
   * Nombre: editarTamanoDef
   * Función: Envia la información necesaria al servicio especificado 
   */
  editarTamanoDef() {
    this.xuxemonsService.confTamDef(this.configTam.value).subscribe({
      next: () => {
        alert('Tamaño por defecto de los Xuxemnos actualizado con exito rotundo.');
      },
      error: () => {
        alert('Fallo estrepitoso al actualizar el tamaño por defecto');
      }
    });
  }

  /**
   * Nombre: editarEvoDef
   * Función: Envia la información necesaria al servicio especificado 
   */
  editarEvoDef() {
    this.xuxemonsService.confEvo(this.configEvo.value).subscribe({
      next: () => {
        alert('Evos actualizado con exito rotundo.');
      },
      error: () => {
        alert('Fallo estrepitoso al actualizar las eevoluciones  por defecto');
      }
    });
  }

  /**
   * Nombre: editarEvoDef
   * Función: Envia la información necesaria al servicio especificado 
   */
  editarEvoDef2() {
    this.xuxemonsService.confEvo2(this.configEvo2.value).subscribe({
      next: () => {
        alert('Evos actualizado con exito rotundo.');
      },
      error: () => {
        alert('Fallo estrepitoso al actualizar las eevoluciones  por defecto');
      }
    });
  }
}
