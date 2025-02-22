import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/dashboard/settings/profile-settings";
import { BillingSettings } from "@/components/dashboard/settings/billing-settings";
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings";
import { cookies } from 'next/headers'
 
async function getCookieData() {
  const cookieData = (await cookies()).getAll()
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData)
    }, 1000)
  )
}

export default async function SettingsPage() {
  await getCookieData()
  return (
    <div className="space-y-8">
      <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="billing">
          <BillingSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 