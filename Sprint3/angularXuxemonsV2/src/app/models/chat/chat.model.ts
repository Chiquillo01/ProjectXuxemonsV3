export interface Chat {
    id?: number;
    idUser: string;
    user1: string;
    user2: string;
    estado: number;
    nick:string;
    mensajes: string;
    rol: number;
    rememberToken?: string;
    created_at?: string;
    updated_at?: string;
  }