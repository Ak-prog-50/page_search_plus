class User {
  userName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;

  constructor(name: string, email: string, avatarUrl: string | null) {
    this.userName = name;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.createdAt = new Date();
  }

  // Business logic to validate the user's email
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Business logic to check if the user has an avatar
  hasAvatar(): boolean {
    return this.avatarUrl !== null;
  }
}

export { User };
