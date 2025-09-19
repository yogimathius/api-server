import { FastifyPluginAsync } from 'fastify'
import type { SocketStream } from '@fastify/websocket'

interface WebSocketMessage {
  type: string
  data: any
  timestamp: string
}

const connections = new Map<string, SocketStream[]>()

export const websocketHandler: FastifyPluginAsync = async (fastify) => {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const userId = req.query.userId as string || 'anonymous'
    
    // Add connection to user's connections
    if (!connections.has(userId)) {
      connections.set(userId, [])
    }
    connections.get(userId)!.push(connection)
    
    console.log(`WebSocket connection established for user ${userId}`)
    
    // Send welcome message
    connection.socket.send(JSON.stringify({
      type: 'welcome',
      data: { message: 'Connected to AI Engines Platform' },
      timestamp: new Date().toISOString(),
    }))
    
    // Handle incoming messages
    connection.socket.on('message', (message) => {
      try {
        const parsed: WebSocketMessage = JSON.parse(message.toString())
        handleWebSocketMessage(userId, parsed, connection)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
        connection.socket.send(JSON.stringify({
          type: 'error',
          data: { error: 'Invalid message format' },
          timestamp: new Date().toISOString(),
        }))
      }
    })
    
    // Handle connection close
    connection.socket.on('close', () => {
      console.log(`WebSocket connection closed for user ${userId}`)
      const userConnections = connections.get(userId)
      if (userConnections) {
        const index = userConnections.indexOf(connection)
        if (index > -1) {
          userConnections.splice(index, 1)
        }
        if (userConnections.length === 0) {
          connections.delete(userId)
        }
      }
    })
  })
  
  // Simulate real-time updates
  setInterval(() => {
    broadcastToAll({
      type: 'agent_status_update',
      data: {
        agentId: '1',
        status: 'active',
        performance: {
          tasksCompleted: Math.floor(Math.random() * 100),
          successRate: 0.9 + Math.random() * 0.1,
          uptime: 0.95 + Math.random() * 0.05,
        },
      },
      timestamp: new Date().toISOString(),
    })
  }, 10000) // Every 10 seconds
  
  setInterval(() => {
    broadcastToAll({
      type: 'task_progress_update',
      data: {
        taskId: '1',
        progress: Math.floor(Math.random() * 100),
        status: Math.random() > 0.5 ? 'running' : 'completed',
        logs: [
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: 'info',
            message: 'Task progress updated...',
          },
        ],
      },
      timestamp: new Date().toISOString(),
    })
  }, 5000) // Every 5 seconds
}

function handleWebSocketMessage(
  userId: string,
  message: WebSocketMessage,
  connection: SocketStream
) {
  switch (message.type) {
    case 'ping':
      connection.socket.send(JSON.stringify({
        type: 'pong',
        data: message.data,
        timestamp: new Date().toISOString(),
      }))
      break
      
    case 'subscribe_agent_updates':
      // Subscribe to agent updates
      connection.socket.send(JSON.stringify({
        type: 'subscription_confirmed',
        data: { subscription: 'agent_updates' },
        timestamp: new Date().toISOString(),
      }))
      break
      
    case 'subscribe_task_updates':
      // Subscribe to task updates
      connection.socket.send(JSON.stringify({
        type: 'subscription_confirmed',
        data: { subscription: 'task_updates' },
        timestamp: new Date().toISOString(),
      }))
      break
      
    default:
      connection.socket.send(JSON.stringify({
        type: 'error',
        data: { error: `Unknown message type: ${message.type}` },
        timestamp: new Date().toISOString(),
      }))
  }
}

function broadcastToAll(message: WebSocketMessage) {
  const messageString = JSON.stringify(message)
  
  for (const [userId, userConnections] of connections) {
    for (const connection of userConnections) {
      try {
        connection.socket.send(messageString)
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error)
      }
    }
  }
}

export function broadcastToUser(userId: string, message: WebSocketMessage) {
  const userConnections = connections.get(userId)
  if (userConnections) {
    const messageString = JSON.stringify(message)
    for (const connection of userConnections) {
      try {
        connection.socket.send(messageString)
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error)
      }
    }
  }
}