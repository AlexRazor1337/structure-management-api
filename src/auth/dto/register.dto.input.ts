enum Role {
  ADMIN,
  BOSS,
  USER,
}

export class RegisterDto {
  email: string;
  password: string;
  role: Role;
  bossId: number;
}
