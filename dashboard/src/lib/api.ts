import { User, Project, Agent, Task, Analytics } from '../types'

const API_BASE = 'http://localhost:3001/api'

class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token')
    }
    return this.token
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const url = `${API_BASE}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const result = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(result.token)
    return result
  }

  async register(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
    const result = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    this.setToken(result.token)
    return result
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request('/auth/me')
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' })
    this.clearToken()
  }

  // Project endpoints
  async getProjects(): Promise<{ projects: Project[] }> {
    return this.request('/projects')
  }

  async getProject(id: string): Promise<{ project: Project }> {
    return this.request(`/projects/${id}`)
  }

  async createProject(data: {
    name: string
    description: string
    repository?: string
    framework: string
  }): Promise<{ project: Project }> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProjectTasks(id: string): Promise<{ tasks: Task[] }> {
    return this.request(`/projects/${id}/tasks`)
  }

  async getProjectAnalytics(id: string): Promise<{ analytics: Analytics }> {
    return this.request(`/projects/${id}/analytics`)
  }

  // Agent endpoints
  async getAgents(): Promise<{ agents: Agent[] }> {
    return this.request('/agents')
  }

  async getAgent(id: string): Promise<{ agent: Agent }> {
    return this.request(`/agents/${id}`)
  }

  // Task endpoints
  async getTasks(): Promise<{ tasks: Task[] }> {
    return this.request('/tasks')
  }

  async createTask(data: {
    title: string
    description: string
    type: string
    projectId: string
    agentId: string
  }): Promise<{ task: Task }> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient()