import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { TokenService } from '../../services/token/token.service';
import { Users } from 'src/app/models/users/users.model';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css'],
})
export class ProfileUserComponent implements OnInit {
  User: Users[] = [];
  userForm: FormGroup;
  foto: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombre: [''],
      id: [''],
      correo: [''],
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.userService.getUsuario(userToken).subscribe({
        next: (user: Users) => {
          // this.User = user;
          this.userForm.patchValue({
            nombre: user.nick,
            id: user.id,
            correo: user.email,
          });
        },
        error: (error) => {
          console.error('Error al obtener tu usuario:', error);
        },
      });

      this.userService.getUsuarios(userToken).subscribe({
        next: (user: Users[]) => {
          this.User = user;
        },
        error: (error) => {
          console.error('Error al obtener tu usuario:', error);
        },
      });

    } else {
      console.error('User ID is null');
    }
  }

  onFileInputClick(): void {
    const inputElement = document.querySelector('input[type="file"]');
    if (inputElement) {
      (inputElement as HTMLInputElement).click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.foto = reader.result;
      this.saveImg(this.foto);
    };
    reader.readAsDataURL(file);
  }

  saveImg(img: any) {
    const userToken = this.tokenService.getToken();

    if (userToken !== null) {
      this.userService.saveImage(userToken, img).subscribe({
        next: () => {
          this.getUser();
        },
        error: (error) => {
          console.error('Error al subir la imagen:', error);
        },
      });
    } else {
      console.error('User ID is null');
    }
  }

  saveChanges() {
    if (this.User) {
      const updatedUser = {
        ...this.User,
        ...this.userForm.value,
      };

      this.userService.updateUsuario(updatedUser).subscribe({
        next: () => {
          console.log('Usuario actualizado');
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        },
      });
    }
  }

  logout() {
    this.tokenService.removeToken();
    this.tokenService.removeRole();
    this.router.navigate(['/landingPage']);
  }
}
