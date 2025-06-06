import axios from "axios";
import type {
  Application,
  ApplicationWithPagination,
  CreateApplicationData,
} from "../utils/types";
import { ApiError, Err, NetworkError, Ok, type Result } from "../errorHandling";

// Ajouter /api à la baseURL
const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jobtracker_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const applicationApi = {
  // GET /api/applications
  getAll: async (params?: {
    page?: number;
    limit?: number;
    statut?: string;
    sourceReseau?: string;
  }): Promise<Result<ApplicationWithPagination, ApiError | NetworkError>> => {
    const response = await api.get("/applications", { params });
    if (response.data) {
      return Ok.of(response.data);
    }
    return Err.of(new ApiError("Réponse vide"));
  },

  // POST /api/applications
  create: async (
    data: CreateApplicationData
  ): Promise<Result<Application, ApiError | NetworkError>> => {
    const response = await api.post("/applications", data);
    if (response.data) {
      return Ok.of(response.data);
    }
    return Err.of(new ApiError("Échec de création"));
  },

  // PUT /api/applications/:id
  update: async (
    id: string,
    data: Partial<CreateApplicationData>
  ): Promise<Result<Application, ApiError | NetworkError>> => {
    const response = await api.put(`/applications/${id}`, data);
    if (response.data) {
      return Ok.of(response.data);
    }
    return Err.of(new ApiError("Échec de modification"));
  },

  // DELETE /api/applications/:id
  delete: async (
    id: string
  ): Promise<Result<void, ApiError | NetworkError>> => {
    await api.delete(`/applications/${id}`);
    return Ok.of(undefined);
  },
};

// Wrapper pour gérer automatiquement les erreurs
export const safeApiCall = async <T>(
  apiCall: () => Promise<Result<T, ApiError | NetworkError>>
): Promise<Result<T, ApiError | NetworkError>> => {
  const result = await apiCall();
  return result;
};
