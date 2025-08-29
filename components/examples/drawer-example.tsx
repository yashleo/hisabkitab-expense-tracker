"use client"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export function DrawerExample() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent side="right">
                <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>
                        This is a drawer implemented with Radix UI Dialog instead of vaul.
                        It's fully compatible with React 19!
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    <p>Your drawer content goes here...</p>
                </div>
                <DrawerFooter>
                    <Button>Save changes</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

// Example with different sides
export function DrawerExampleBottom() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Bottom Drawer</Button>
            </DrawerTrigger>
            <DrawerContent side="bottom">
                <DrawerHeader>
                    <DrawerTitle>Bottom Drawer</DrawerTitle>
                    <DrawerDescription>
                        This drawer slides in from the bottom.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    <p>Bottom drawer content...</p>
                </div>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button>Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
