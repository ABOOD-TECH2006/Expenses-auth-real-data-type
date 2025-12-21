import axios from "axios";

// Firebase Auth API
const API_KEY = "AIzaSyAXBBxTh35DUg357njREct5CNWnOMwCN-M";
const BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

// Response type for all AuthController methods
export interface AuthResponse {
  status: boolean;
  token?: string;
  userId?: string;
  user?: any;
  message?: string; // Always a string if returned
}

export default class AuthController {
  // -----------------------------
  // Helper to format Firebase error messages
  // -----------------------------
private formatFirebaseError(err: any): string {
  const firebaseMsg = err.response?.data?.error?.message || err.message;
  return firebaseMsg
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

  // -----------------------------
  // Login
  // -----------------------------
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await axios.post(`${BASE_URL}:signInWithPassword?key=${API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      });

      return {
        status: true,
        token: res.data.idToken,
        userId: res.data.localId,
      };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }

  // -----------------------------
  // Register
  // -----------------------------
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await axios.post(`${BASE_URL}:signUp?key=${API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      });

      await this.sendVerificationEmail(res.data.idToken);

      return { status: true, token: res.data.idToken };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }

  // -----------------------------
  // Send email verification
  // -----------------------------
  async sendVerificationEmail(idToken: string): Promise<AuthResponse> {
    try {
      await axios.post(`${BASE_URL}:sendOobCode?key=${API_KEY}`, {
        requestType: "VERIFY_EMAIL",
        idToken,
      });
      return { status: true };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }

  // -----------------------------
  // Confirm email verification
  // -----------------------------
  async confirmEmailVerification(oobCode: string): Promise<AuthResponse> {
    try {
      await axios.post(`${BASE_URL}:update?key=${API_KEY}`, { oobCode });
      return { status: true };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }

  // -----------------------------
  // Get user data
  // -----------------------------
  async getUserData(idToken: string): Promise<AuthResponse> {
    try {
      const res = await axios.post(`${BASE_URL}:lookup?key=${API_KEY}`, { idToken });
      return { status: true, user: res.data.users[0] };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }

  // -----------------------------
  // Password reset
  // -----------------------------
  async sendPasswordResetEmail(email: string): Promise<AuthResponse> {
    try {
      await axios.post(`${BASE_URL}:sendOobCode?key=${API_KEY}`, {
        requestType: "PASSWORD_RESET",
        email,
      });
      return { status: true };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<AuthResponse> {
    try {
      await axios.post(`${BASE_URL}:resetPassword?key=${API_KEY}`, {
        oobCode,
        newPassword,
      });
      return { status: true, message: "Password reset successfully" };
    } catch (err: any) {
      return { status: false, message: this.formatFirebaseError(err) };
    }
  }
}
