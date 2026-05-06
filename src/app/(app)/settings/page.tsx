"use client"

import { useUser } from "@clerk/nextjs"
import { TopBar } from "@/components/layout/top-bar"
import {
  Link2,
  Zap,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function SettingsPage() {
  const { user } = useUser()
  const googleAccount = user?.externalAccounts?.find(a => a.provider === "google")

  return (
    <div>
      <TopBar title="Settings" description="Manage your account, integrations, and preferences" />

      <div className="p-6">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai">AI Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="max-w-2xl space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Profile Information</CardTitle>
                  <CardDescription className="text-xs">Update your name, email, and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-gradient-to-br from-[#5e6ad2] to-[#a78bfa] flex items-center justify-center text-xl font-bold text-white">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <Button variant="secondary" size="sm" className="text-xs">Change photo</Button>
                      <p className="text-[10px] text-[#62666d] mt-1.5">JPG, PNG, GIF up to 5MB</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#8a8f98]">First name</label>
                      <Input defaultValue={user?.firstName ?? ""} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#8a8f98]">Last name</label>
                      <Input defaultValue={user?.lastName ?? ""} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Email</label>
                    <Input defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""} type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Job title</label>
                    <Input placeholder="e.g. Senior Account Executive" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Company</label>
                    <Input placeholder="Your company name" />
                  </div>
                  <Button className="mt-2">Save changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sender Identity</CardTitle>
                  <CardDescription className="text-xs">ColdHook uses this to personalize emails from your perspective</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Your value proposition (1-2 sentences)</label>
                    <Input placeholder="I help [ICP] achieve [outcome] using [method]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">LinkedIn URL</label>
                    <Input placeholder="linkedin.com/in/yourprofile" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#8a8f98]">Preferred email tone</label>
                    <Select defaultValue="conversational">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="bold">Bold & Direct</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Save identity</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Connected accounts</CardTitle>
                  <CardDescription className="text-xs">Third-party accounts linked to your ColdHook login</CardDescription>
                </CardHeader>
                <CardContent>
                  {googleAccount ? (
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-lg border border-[#23252a] bg-[#141516] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#f7f8f8]">Google</p>
                        <p className="text-xs text-[#62666d] truncate">{googleAccount.emailAddress}</p>
                      </div>
                      <Badge variant="success" className="text-[9px] h-4 gap-0.5 shrink-0">
                        <Check className="size-2.5" />
                        Connected
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-[#62666d]">No connected accounts.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <div className="max-w-2xl space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="size-4 text-[#5e6ad2]" />
                    AI Model Settings
                  </CardTitle>
                  <CardDescription className="text-xs">Configure how the AI generates your emails</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Include social proof",
                      desc: "Automatically reference relevant customer wins",
                      enabled: true,
                    },
                    {
                      label: "Emoji in subject lines",
                      desc: "Use 1 emoji to boost open rates",
                      enabled: true,
                    },
                    {
                      label: "Personalization from news",
                      desc: "Search recent news mentions of the prospect",
                      enabled: true,
                    },
                    {
                      label: "Spam score check",
                      desc: "Automatically flag emails with high spam risk",
                      enabled: true,
                    },
                    {
                      label: "Auto A/B subject lines",
                      desc: "Generate 3 subject variants for every email",
                      enabled: false,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-[#d0d6e0]">{item.label}</p>
                        <p className="text-xs text-[#62666d]">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Link2 className="size-4 text-[#62666d]" />
                    Integrations coming soon
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Native integrations are in development. Here&apos;s what&apos;s planned:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Outreach", "Slack", "Apollo.io"].map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center px-2.5 py-1 rounded-md border border-[#23252a] bg-[#141516] text-xs text-[#62666d]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[#62666d] mt-4">
                    Want a specific integration prioritized? Reply to your welcome email and let us know.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Email Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Prospect replies to your email", enabled: true },
                    { label: "Weekly performance summary", enabled: true },
                    { label: "New buying signal detected", enabled: true },
                    { label: "A/B test has a winner", enabled: false },
                    { label: "Monthly AI insights report", enabled: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[#1a1b1f] last:border-0">
                      <span className="text-sm text-[#d0d6e0]">{item.label}</span>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="max-w-2xl space-y-4">
              <Card className="border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.04)]">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-[#f7f8f8]">Free Beta Plan</span>
                        <Badge variant="default" className="text-[10px] h-4">Active</Badge>
                      </div>
                      <p className="text-sm text-[#8a8f98]">You&apos;re on the free beta plan — all features included.</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-xs text-[#62666d] leading-relaxed">
                    During beta, ColdHook is completely free. Paid plans will be introduced once we graduate from beta. You&apos;ll receive advance notice before any charges begin.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
