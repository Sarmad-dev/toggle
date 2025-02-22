import { TimeEntryList } from "@/components/dashboard/time-entry-list";
import { cookies } from 'next/headers'
 
async function getCookieData() {
  const cookieData = (await cookies()).getAll()
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData)
    }, 1000)
  )
}

export default async function DashboardPage() {
  await getCookieData()
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Time Entries</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your recent time entries
          </p>
        </div>
        <TimeEntryList />
      </div>
    </div>
  );
}