"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useCategories } from "@/hooks/use-categories"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function CategorySelector({ value, onValueChange, placeholder = "Select category...", className }: CategorySelectorProps) {
    const [open, setOpen] = useState(false)
    const { categories, loading } = useCategories()

    const selectedCategory = categories.find(cat => cat.name === value)

    if (loading) {
        return (
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={false}
                className={cn("w-full justify-between", className)}
                disabled
            >
                Loading categories...
            </Button>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedCategory ? (
                        <div className="flex items-center gap-2">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: selectedCategory.color }}
                            >
                            </span>
                            {selectedCategory.name}
                        </div>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup heading="Default Categories">
                            {categories
                                .filter(cat => cat.isDefault)
                                .map((category) => (
                                    <CommandItem
                                        key={category.id}
                                        value={category.name}
                                        onSelect={(currentValue) => {
                                            onValueChange(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === category.name ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{ backgroundColor: category.color }}
                                        >
                                        </span>
                                        {category.name}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                        {categories.filter(cat => !cat.isDefault).length > 0 && (
                            <CommandGroup heading="Custom Categories">
                                {categories
                                    .filter(cat => !cat.isDefault)
                                    .map((category) => (
                                        <CommandItem
                                            key={category.id}
                                            value={category.name}
                                            onSelect={(currentValue) => {
                                                onValueChange(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === category.name ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span
                                                className="w-4 h-4 rounded-full mr-2"
                                                style={{ backgroundColor: category.color }}
                                            >
                                            </span>
                                            {category.name}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
