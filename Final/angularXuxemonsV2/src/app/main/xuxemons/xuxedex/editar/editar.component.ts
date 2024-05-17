import { Component } from '@angular/core';
// imports extras //
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { XuxemonsService } from '../../../../services/xuxemons/xuxemons.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent {
  // Variables especificas //
  xuxemonForm: FormGroup;
  xuxeData: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.xuxeData = {
        id: params['id'],
        nombre: params['nombre'],
        tipo: params['tipo'],
        archivo: params['archivo'],
        categoria: params['categoria'],
      };
    });
    
    // Seteamos los valores //
    this.xuxemonForm.setValue({
      nombre: this.xuxeData.nombre || '',
      tipo: this.xuxeData.tipo || '',
      archivo: this.xuxeData.archivo || '',
      categoria: this.xuxeData.categoria || '',
    });
  }

  constructor(
    private fb: FormBuilder,
    public xuxemonsService: XuxemonsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Restricciones que se espera que tenga el FormGroup //
    this.xuxemonForm = this.fb.group({
      nombre: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      archivo: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
    });
  }

  /**
   * Nombre: editarXuxemon
   * Función: para editar el Xuxemon
   */
  editarXuxemon() {    
    this.xuxemonsService
      .XuxeUpdate(this.xuxemonForm.value, this.xuxeData.id)
      .subscribe({
        next: () => {
          alert('Xuxemon modificado con exito.');
          this.router.navigate(['/xuxedex']);
        },
        error: (error) => {
          alert('No se pudo editar el Xuxemon');
          throw new Error(error);
        },
      });
  }
}