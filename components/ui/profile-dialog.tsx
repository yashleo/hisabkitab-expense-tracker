"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/components/providers/auth-provider"
import { User, Edit2 } from "lucide-react"

interface ProfileDialogProps {
  trigger: React.ReactNode
}

export function ProfileDialog({ trigger }: ProfileDialogProps) {
  const { user, updateUserProfile } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
  })
  const [errors, setErrors] = useState({
    name: "",
  })

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required"
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long"
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters"
    }
    return ""
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }))
    setErrors(prev => ({ ...prev, name: validateName(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const nameError = validateName(formData.name)
    if (nameError) {
      setErrors({ name: nameError })
      return
    }

    setLoading(true)

    try {
      const result = await updateUserProfile({ name: formData.name.trim() })
      if (result.error) {
        setErrors({ name: result.error })
        return
      }
      
      setOpen(false)
      // Reset form to current user data
      setFormData({ name: formData.name.trim() })
      setErrors({ name: "" })
    } catch (error: any) {
      setErrors({ name: error.message || "Failed to update profile" })
    }

    setLoading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setFormData({ name: user?.name || "" })
      setErrors({ name: "" })
    }
    setOpen(newOpen)
  }

  const hasChanges = formData.name.trim() !== user?.name
  const hasErrors = errors.name !== ""

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || hasErrors || !hasChanges}
              className="flex-1"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
