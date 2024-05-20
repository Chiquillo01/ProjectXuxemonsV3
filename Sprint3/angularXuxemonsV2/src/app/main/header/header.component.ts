import { Component } from '@angular/core';
// Imports extras //
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { XuxemonsService } from 'src/app/services/xuxemons/xuxemons.service';
import { TokenService } from '../../services/token/token.service';
import { Users } from 'src/app/models/users/users.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  userRole: Number | null;
  users: Users[] = [];

  constructor(
    public userService: UsersService,
    public xuxemonsService: XuxemonsService,
    public tokenService: TokenService,
    private router: Router
  ) {
    this.userRole = this.tokenService ? this.tokenService.getRole() : null;
  }

  ngOnInit(): void {
    this.getImage();
  }

  logout() {
    // Elimina el token de autenticación y el rol del usuario del localStorage
    this.tokenService.removeToken();
    this.tokenService.removeRole();

    // Redirige a la página de inicio de sesión
    this.router.navigate(['/landingPage']);
  }

  getImage() {
    const userToken = this.tokenService.getToken();

    if (userToken) {
      this.userService.getUsuarios(userToken).subscribe({
        next: (user: Users[]) => {
          this.users = user;
        },
        error: (error) => {
          console.error('Error fetching Xuxemons:', error);
        },
      });
    }
  }
}
