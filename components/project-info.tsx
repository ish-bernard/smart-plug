import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Users, Zap } from "lucide-react"

export function ProjectInfo() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Project Overview</CardTitle>
          <CardDescription>Smart Plug - A Smarter Way to Power Your Devices</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            This IoT-based battery management system monitors battery levels in real-time and automates the charging
            process to reduce energy wastage and extend battery life.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Zap className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Energy Efficiency</h4>
                <p className="text-xs text-gray-500">Automatically disconnects power when battery is fully charged</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Battery Longevity</h4>
                <p className="text-xs text-gray-500">
                  Prevents overcharging and deep discharging to extend battery life
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Team</CardTitle>
          <CardDescription>Group 9 - Department of Information Technology</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Tumusifu BYIRINGIRO</p>
                <p className="text-sm font-medium">Bernard ISHIMWE IRUMVA</p>
                <p className="text-sm font-medium">Jean Clovis NZASABIMFURA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
