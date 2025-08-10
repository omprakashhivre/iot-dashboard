import CryptoJS from "crypto-js"

const SECRET_KEY = "iot-dashboard-secret-key-2024"

export interface AuthData {
  token: string
  role: "admin" | "user"
  username: string
}

export const authUtils = {
  // Encrypt and store auth data
  setAuthData: (data: AuthData) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
      localStorage.setItem("auth_data", encrypted)
      return true
    } catch (error) {
      console.error("Error storing auth data:", error)
      return false
    }
  },

  // Decrypt and get auth data
  getAuthData: (): AuthData | null => {
    try {
      const encrypted = localStorage.getItem("auth_data")
      if (!encrypted) return null

      const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error("Error retrieving auth data:", error)
      authUtils.clearAuthData()
      return null
    }
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem("auth_data")
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const authData = authUtils.getAuthData()
    return !!authData?.token
  },

  // Get current user role
  getUserRole: (): "admin" | "user" | null => {
    const authData = authUtils.getAuthData()
    return authData?.role || null
  },

  // Get current username
  getUsername: (): string | null => {
    const authData = authUtils.getAuthData()
    return authData?.username || null
  },
}
