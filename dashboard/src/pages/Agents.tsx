import { useQuery } from '@tanstack/react-query'
import { Bot, Activity, Clock, AlertCircle } from 'lucide-react'
import { api } from '../lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export default function Agents() {
  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => api.getAgents(),
  })

  const agents = agentsData?.agents || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600'
      case 'idle': return 'text-blue-600'
      case 'error': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4" />
      case 'idle': return <Clock className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Agents</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agents</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <div className={`flex items-center gap-1 ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                  <span className="text-sm capitalize">{agent.status}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground capitalize">{agent.type}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Capabilities</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((capability, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                
                {agent.currentTask && (
                  <div>
                    <p className="text-sm font-medium mb-1">Current Task</p>
                    <p className="text-xs text-muted-foreground">{agent.currentTask}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-muted-foreground">
                    Last active: {new Date(agent.lastActivity).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No agents available</h3>
          <p className="text-muted-foreground">Agents will appear here when they are registered</p>
        </div>
      )}
    </div>
  )
}