// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  feedback?: T[];
  galleryItems?: T[];
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

// Blog Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author?: string;
  category?: string;
  readTime?: string;
  tags: string[];
  sections?: Array<{ title?: string; content: string; image?: string }>;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metaDescription?: string;
  seoKeywords?: string[];
  metaTags?: string[];
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author?: string;
  category?: string;
  readTime?: string;
  tags?: string[];
  sections?: Array<{ title?: string; content: string; image?: string }>;
  status?: 'draft' | 'published';
  metaDescription?: string;
  seoKeywords?: string[];
  metaTags?: string[];
}

// Subscriber Types
export interface Subscriber {
  _id: string;
  email: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

// Feedback Types
export interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
  treatment: string;
  review: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  isApproved: boolean;
  approvedAt?: string;
  featured: boolean;
  tags: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackFormData {
  name: string;
  email: string;
  rating: number;
  treatment: string;
  review: string;
  image?: string;
}

export interface FeedbackUpdateData {
  status?: 'pending' | 'approved' | 'rejected';
  isApproved?: boolean;
  featured?: boolean;
  tags?: string[];
  adminNotes?: string;
}

export interface FeedbackStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  featured: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

// Gallery Types
export interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  category: 'before-after' | 'clinic';
  beforeUrl?: string;
  afterUrl?: string;
  url?: string;
  status: 'active' | 'inactive';
  order: number;
  tags: string[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryFormData {
  title: string;
  description: string;
  category: 'before-after' | 'clinic';
  beforeUrl?: string;
  afterUrl?: string;
  url?: string;
  status?: 'active' | 'inactive';
  order?: number;
  tags?: string[];
  adminNotes?: string;
}

export interface GalleryUpdateData {
  title?: string;
  description?: string;
  category?: 'before-after' | 'clinic';
  beforeUrl?: string;
  afterUrl?: string;
  url?: string;
  status?: 'active' | 'inactive';
  order?: number;
  tags?: string[];
  adminNotes?: string;
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
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
      cache: 'no-cache',
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

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

  // Blog API Methods
  async createBlog(data: BlogFormData): Promise<ApiResponse<Blog>> {
    return this.request<Blog>('/api/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBlogs(params?: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'published';
    search?: string;
    category?: string;
  }): Promise<ApiResponse<{ blogs: Blog[]; pagination: PaginationInfo }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/blog?${queryString}` : '/api/blog';
    return this.request<{ blogs: Blog[]; pagination: PaginationInfo }>(endpoint);
  }

  async getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/api/blog/${slug}`);
  }

  async updateBlog(id: string, data: BlogFormData): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/api/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlog(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/blog/${id}`, {
      method: 'DELETE',
    });
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

  // Feedback API Methods
  async createFeedback(data: FeedbackFormData): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFeedback(params?: {
    page?: number;
    limit?: number;
    status?: string;
    rating?: number;
    treatment?: string;
    featured?: boolean;
    admin?: boolean;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<PaginatedResponse<Feedback>>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/feedback?${queryString}` : '/api/feedback';
    
    return this.request<PaginatedResponse<Feedback>>(endpoint);
  }

  async getFeedbackById(id: string): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>(`/api/feedback/${id}`);
  }

  async updateFeedback(id: string, data: FeedbackUpdateData): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>(`/api/feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFeedback(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/feedback/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeaturedFeedback(limit?: number): Promise<ApiResponse<Feedback[]>> {
    const endpoint = limit ? `/api/feedback/featured?limit=${limit}` : '/api/feedback/featured';
    return this.request<Feedback[]>(endpoint);
  }

  async getFeedbackStats(): Promise<ApiResponse<FeedbackStats>> {
    return this.request<FeedbackStats>('/api/feedback/stats/summary');
  }

  async approveFeedback(id: string): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>(`/api/feedback/${id}/approve`, {
      method: 'POST',
    });
  }

  async toggleFeedbackFeatured(id: string): Promise<ApiResponse<Feedback>> {
    return this.request<Feedback>(`/api/feedback/${id}/feature`, {
      method: 'POST',
    });
  }

  // Gallery API Methods
  async createGalleryItem(data: GalleryFormData): Promise<ApiResponse<GalleryItem>> {
    return this.request<GalleryItem>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGalleryItems(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<ApiResponse<{ galleryItems: GalleryItem[]; pagination: PaginationInfo }>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/gallery?${queryString}` : '/api/gallery';
    return this.request<{ galleryItems: GalleryItem[]; pagination: PaginationInfo }>(endpoint);
  }

  async getGalleryItem(id: string): Promise<ApiResponse<GalleryItem>> {
    return this.request<GalleryItem>(`/api/gallery/${id}`);
  }

  async updateGalleryItem(id: string, data: GalleryUpdateData): Promise<ApiResponse<GalleryItem>> {
    return this.request<GalleryItem>(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGalleryItem(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  async updateGalleryItemOrder(id: string, order: number): Promise<ApiResponse<GalleryItem>> {
    return this.request<GalleryItem>(`/api/gallery/${id}/order`, {
      method: 'PUT',
      body: JSON.stringify({ order }),
    });
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

// Blog exports
export const createBlog = (data: BlogFormData) => apiService.createBlog(data);
export const getBlogs = (params?: {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published';
  search?: string;
  category?: string;
}) => apiService.getBlogs(params);
export const getBlogBySlug = (slug: string) => apiService.getBlogBySlug(slug);
export const updateBlog = (id: string, data: BlogFormData) => apiService.updateBlog(id, data);
export const deleteBlog = (id: string) => apiService.deleteBlog(id);

// Feedback exports
export const createFeedback = (data: FeedbackFormData) => apiService.createFeedback(data);
export const getFeedback = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  rating?: number;
  treatment?: string;
  featured?: boolean;
  admin?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}) => apiService.getFeedback(params);
export const getFeedbackById = (id: string) => apiService.getFeedbackById(id);
export const updateFeedback = (id: string, data: FeedbackUpdateData) => apiService.updateFeedback(id, data);
export const deleteFeedback = (id: string) => apiService.deleteFeedback(id);
export const getFeaturedFeedback = (limit?: number) => apiService.getFeaturedFeedback(limit);
export const getFeedbackStats = () => apiService.getFeedbackStats();
export const approveFeedback = (id: string) => apiService.approveFeedback(id);
export const toggleFeedbackFeatured = (id: string) => apiService.toggleFeedbackFeatured(id);

// Gallery exports
export const createGalleryItem = (data: GalleryFormData) => apiService.createGalleryItem(data);
export const getGalleryItems = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
  sort?: string;
}) => apiService.getGalleryItems(params);
export const getGalleryItem = (id: string) => apiService.getGalleryItem(id);
export const updateGalleryItem = (id: string, data: GalleryUpdateData) => apiService.updateGalleryItem(id, data);
export const deleteGalleryItem = (id: string) => apiService.deleteGalleryItem(id);
export const updateGalleryItemOrder = (id: string, order: number) => apiService.updateGalleryItemOrder(id, order);
