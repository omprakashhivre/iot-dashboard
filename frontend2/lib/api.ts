import axios from "axios"
import { authUtils } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const authData = authUtils.getAuthData()
  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`
  }
  return config
})

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authUtils.clearAuthData()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { username: email, password })
    return response.data
  },
  register: async (username: string, password: string) => {
    const response = await api.post("/api/auth/register", { username, password })
    return response.data
  },
}

export interface SensorData {
  _id: string
  deviceId: string
  temperature: number
  humidity: number
  powerUsage: number
  timestamp: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CreateSensorData {
  deviceId: string
  temperature: number
  humidity: number
  powerUsage: number
  timestamp?: string
}

export interface SensorFilters {
  limit?: number
  deviceId?: string
  from?: string
  to?: string
}

export const sensorAPI = {
  // Create new sensor data (admin only)
  createSensor: async (data: CreateSensorData) => {
    const response = await api.post("/api/sensors", data)
    return response.data
  },

  // Get latest sensor data
  getLatest: async (): Promise<SensorData> => {
    const response = await api.get("/api/sensors/latest")
    return response.data
  },

  // Get sensor history with filters
  getHistory: async (filters: SensorFilters = {}): Promise<SensorData[]> => {
    const params = new URLSearchParams()

    if (filters.limit) params.append("limit", filters.limit.toString())
    if (filters.deviceId) params.append("deviceId", filters.deviceId)
    if (filters.from) params.append("from", filters.from)
    if (filters.to) params.append("to", filters.to)

    const response = await api.get(`/api/sensors/history?${params.toString()}`)
    return response.data
  },

  // Delete sensor by ID (admin only)
  deleteSensor: async (id: string) => {
    const response = await api.delete(`/api/sensors/${id}`)
    return response.data
  },
}

export default api
