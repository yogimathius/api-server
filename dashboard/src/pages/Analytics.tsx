import { BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Detailed analytics and reporting features coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}