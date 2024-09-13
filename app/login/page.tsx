import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center relative">
      <Image
        src="https://res.cloudinary.com/dsbsn3nap/image/upload/v1726000825/Lushuous_Landscape_ghgau1.png"
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        className="z-0"
      />
      <Card className="w-full max-w-md mx-auto z-10 bg-transparent backdrop-blur-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription className="text-lg text-pretty text-foreground">Please sign in to your account or create a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" formAction={login} className="flex-1">
                Log in
              </Button>
              <Button type="submit" formAction={signup} variant="outline" className="flex-1">
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
