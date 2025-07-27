import type React from "react"
import { AdminHeader } from "@/components/layout/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
