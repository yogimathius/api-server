export interface User {
  id: string
  email: string
  name: string
  tier: 'individual' | 'team' | 'enterprise'
}

export interface Project {
  id: string
  name: string
  description: string
  repository?: string
  framework: string
  status: 'active' | 'paused' | 'completed'
  tasksCount: number
  agents: string[]
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  type: 'coder' | 'researcher' | 'designer' | 'analyst'
  status: 'idle' | 'running' | 'error'
  capabilities: string[]
  currentTask?: string
  lastActivity: string
}

export interface Task {
  id: string
  title: string
  description: string
  type: 'scaffold' | 'implement' | 'test' | 'deploy'
  status: 'pending' | 'running' | 'completed' | 'failed'
  agentId: string
  projectId: string
  progress: number
  createdAt: string
  completedAt?: string
}

export interface Analytics {
  projectId: string
  timeRange: string
  data: {
    totalTasks: number
    completedTasks: number
    successRate: number
    averageTaskDuration: number
    activeAgents: number
    dailyActivity: {
      date: string
      tasks: number
      success: number
    }[]
  }
}