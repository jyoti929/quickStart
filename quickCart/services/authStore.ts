export interface User {
  name: string;
  mobile: string;
  password?: string;
}

class AuthStore {
  // Simple in-memory storage of registered users.
  // Pre-populating a test user for easy testing.
  private users: Map<string, User> = new Map([
    ["1234567890", { name: "John Doe", mobile: "1234567890", password: "password123" }]
  ]);

  private currentUser: User | null = null;
  private tempSignupData: User | null = null;

  // Set signup data temporarily before OTP is verified
  setTempSignup(user: User) {
    this.tempSignupData = user;
  }

  getTempSignup(): User | null {
    return this.tempSignupData;
  }

  clearTempSignup() {
    this.tempSignupData = null;
  }

  // Register user upon successful OTP verification
  registerUser(): User | null {
    if (!this.tempSignupData) return null;
    
    const user = { ...this.tempSignupData };
    this.users.set(user.mobile, user);
    this.currentUser = { name: user.name, mobile: user.mobile }; // Don't keep password in currentUser
    this.tempSignupData = null;
    return this.currentUser;
  }

  // Login verification
  verifyUser(mobile: string, password: string): boolean {
    const user = this.users.get(mobile);
    if (user && user.password === password) {
      this.currentUser = { name: user.name, mobile: user.mobile };
      return true;
    }
    return false;
  }

  // Forgot password update
  resetPassword(mobile: string, newPassword: string): boolean {
    const user = this.users.get(mobile);
    if (user) {
      user.password = newPassword;
      this.users.set(mobile, user);
      return true;
    }
    // If the user doesn't exist in our memory, we'll allow registering them
    // to match a flexible demonstration, but normally we check if user exists.
    return false;
  }

  // Check if a user with given mobile number exists
  hasUser(mobile: string): boolean {
    return this.users.has(mobile);
  }

  // Get current logged-in user details
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Logout
  logout() {
    this.currentUser = null;
  }
}

export const authStore = new AuthStore();
