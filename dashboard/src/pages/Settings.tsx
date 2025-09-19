import { Settings as SettingsIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <SettingsIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
              <p className="text-muted-foreground">Configuration options and preferences coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}