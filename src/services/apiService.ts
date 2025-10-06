// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  contacts?: T[];
  appointments?: T[];
  subscribers?: T[];
  pagination: PaginationInfo;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assignedTo?: string;
  repliedAt?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactUpdateData {
  status?: 'new' | 'read' | 'replied' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  assignedTo?: string;
  notes?: string;
}

// Appointment Types
export interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  treatmentType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  priority: 'low' | 'medium' | 'high';
  confirmedDate?: string;
  confirmedTime?: string;
  actualDate?: string;
  actualTime?: string;
  duration: number;
  notes?: string;
  assignedTo?: string;
  tags: string[];
  reminderSent: boolean;
  reminderSentAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
  createdAt: string;
  updatedAt: string;
  referenceId: string;
}

export interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  treatmentType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface AppointmentUpdateData {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  priority?: 'low' | 'medium' | 'high';
  confirmedDate?: string;
  confirmedTime?: string;
  duration?: number;
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  cancelledReason?: string;
}

export interface AppointmentConfirmData {
  confirmedDate?: string;
  confirmedTime?: string;
  notes?: string;
}

// Statistics Types
export interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  noShow: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export interface TreatmentInfo {
  treatments: string[];
  timeSlots: string[];
}

// Subscriber Types
export interface Subscriber {
  _id: string;
  email: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      type Parsed = { message?: string } | null;
      let parsed: Parsed = null;
      try {
        parsed = await response.json();
      } catch {
        // ignore JSON parse error for empty responses
      }

      if (!response.ok) {
        const serverMessage = parsed?.message ? parsed.message : `HTTP error ${response.status}`;
        const error = new Error(serverMessage) as Error & { status?: number; payload?: Parsed };
        error.status = response.status;
        error.payload = parsed;
        throw error;
      }

  return parsed as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Contact API Methods
  async createContact(data: ContactFormData): Promise<ApiResponse<Contact>> {
    return this.request<Contact>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getContacts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<PaginatedResponse<Contact>>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/contact?${queryString}` : '/api/contact';
    
    return this.request<PaginatedResponse<Contact>>(endpoint);
  }

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/api/contact/${id}`);
  }

  async updateContact(id: string, data: ContactUpdateData): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/api/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/contact/${id}`, {
      method: 'DELETE',
    });
  }

  async getContactStats(): Promise<ApiResponse<ContactStats>> {
    return this.request<ContactStats>('/api/contact/stats/summary');
  }

  // Appointment API Methods
  async createAppointment(data: AppointmentFormData): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>('/api/appointment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    treatmentType?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/appointment?${queryString}` : '/api/appointment';
    
    return this.request<PaginatedResponse<Appointment>>(endpoint);
  }

  async getAppointment(id: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/api/appointment/${id}`);
  }

  async updateAppointment(id: string, data: AppointmentUpdateData): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/api/appointment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/appointment/${id}`, {
      method: 'DELETE',
    });
  }

  async confirmAppointment(id: string, data: AppointmentConfirmData): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/api/appointment/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAppointmentStats(): Promise<ApiResponse<AppointmentStats>> {
    return this.request<AppointmentStats>('/api/appointment/stats/summary');
  }

  async getTreatments(): Promise<ApiResponse<TreatmentInfo>> {
    return this.request<TreatmentInfo>('/api/appointment/treatments');
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<unknown>> {
    return this.request<unknown>('/health');
  }

  // Subscription
  async createSubscription(data: { email: string; source?: string }): Promise<ApiResponse<void>> {
    return this.request<void>('/api/subscriber', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubscribers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Subscriber>>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/subscriber?${queryString}` : '/api/subscriber';

    return this.request<PaginatedResponse<Subscriber>>(endpoint);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual methods as wrappers to preserve `this` binding
export const createContact = (data: ContactFormData) => apiService.createContact(data);
export const getContacts = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => apiService.getContacts(params);
export const getContact = (id: string) => apiService.getContact(id);
export const updateContact = (id: string, data: ContactUpdateData) => apiService.updateContact(id, data);
export const deleteContact = (id: string) => apiService.deleteContact(id);
export const getContactStats = () => apiService.getContactStats();

export const createAppointment = (data: AppointmentFormData) => apiService.createAppointment(data);
export const getAppointments = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  treatmentType?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => apiService.getAppointments(params);
export const getAppointment = (id: string) => apiService.getAppointment(id);
export const updateAppointment = (id: string, data: AppointmentUpdateData) => apiService.updateAppointment(id, data);
export const deleteAppointment = (id: string) => apiService.deleteAppointment(id);
export const confirmAppointment = (id: string, data: AppointmentConfirmData) => apiService.confirmAppointment(id, data);
export const getAppointmentStats = () => apiService.getAppointmentStats();
export const getTreatments = () => apiService.getTreatments();
export const healthCheck = () => apiService.healthCheck();
export const createSubscription = (data: { email: string; source?: string }) => apiService.createSubscription(data);
export const getSubscribers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => apiService.getSubscribers(params);
