"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "@/hooks/use-toast"
import { Category } from "@/lib/types"

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#6b7280"
]

export function CategoriesManager() {
    const { 
        categories, 
        loading, 
        error,
        addCategory, 
        updateCategory, 
        deleteCategory, 
        getGroupedCategories,
        
    } = useCategories()
    
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        color: "#6b7280"
    })

    const { default: defaultCategories, custom: customCategories } = getGroupedCategories()

    const handleAddCategory = async () => {
        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Please enter a category name",
                variant: "destructive",
            })
            return
        }

        const result = await addCategory(formData)
        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Success",
                description: "Category added successfully",
            })
            setIsAddDialogOpen(false)
            setFormData({ name: "", color: "#6b7280" })
        }
    }

    const handleEditCategory = async () => {
        if (!editingCategory || !formData.name.trim()) return

        const result = await updateCategory(editingCategory.id, {
            name: formData.name,
            color: formData.color,
        })

        if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        } else {
            toast({
                title: "Success",
                description: "Category updated successfully",
            })
            setIsEditDialogOpen(false)
            setEditingCategory(null)
            setFormData({ name: "", color: "#6b7280" })
        }
    }

    const handleDeleteCategory = async (categoryId: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const result = await deleteCategory(categoryId)
            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Success",
                    description: "Category deleted successfully",
                })
            }
        }
    }

    const openEditDialog = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            color: category.color || "#6b7280"
        })
        setIsEditDialogOpen(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
                    <p>Loading categories...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center text-red-600">
                    <p>Error loading categories: {error}</p>
                    <Button 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                        variant="outline"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                    <p className="text-gray-600">Manage your expense categories</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                                Create a custom category for your expenses
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <div className="grid grid-cols-9 gap-2">
                                    {PRESET_COLORS.map((color, index) => (
                                        <button
                                            key={`add-color-${index}-${color}`}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full border-2 ${
                                                formData.color === color ? 'ring-2 ring-gray-400' : 'border-gray-200'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddCategory} className="bg-rose-600 hover:bg-rose-700">
                                Add Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Default Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Default Categories</CardTitle>
                    <CardDescription>Built-in categories for common expenses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {defaultCategories.map((category) => (
                            <div
                                key={`default-${category.id}`}
                                className="flex items-center gap-3 p-3 border rounded-lg"
                            >
                                <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: category.color }}
                                >
                                </span>
                                <span className="font-medium text-sm">{category.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Custom Categories */}
            <Card>
                <CardHeader>
                    <CardTitle>Custom Categories</CardTitle>
                    <CardDescription>Your personalized expense categories</CardDescription>
                </CardHeader>
                <CardContent>
                    {customCategories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No custom categories yet</p>
                            <p className="text-sm">Add your first custom category to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {customCategories.map((category) => (
                                <div
                                    key={`custom-${category.id}`}
                                    className="flex items-center justify-between p-3 border rounded-lg group hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: category.color }}
                                        >
                                        </span>
                                        <span className="font-medium text-sm">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEditDialog(category)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update your custom category
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Category Name</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter category name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="grid grid-cols-9 gap-2">
                                {PRESET_COLORS.map((color, index) => (
                                    <button
                                        key={`edit-color-${index}-${color}`}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                                        className={`w-8 h-8 rounded-full border-2 ${
                                            formData.color === color ? 'ring-2 ring-gray-400' : 'border-gray-200'
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditCategory} className="bg-rose-600 hover:bg-rose-700">
                            Update Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}