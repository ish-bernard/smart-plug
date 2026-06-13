import { BatteryMonitor } from "@/components/battery-monitor"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectInfo } from "@/components/project-info"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <BatteryMonitor />
        </div>
        <div className="w-full md:w-1/3">
          <ProjectInfo />
        </div>
      </div>
      <Footer />
    </main>
  )
}
