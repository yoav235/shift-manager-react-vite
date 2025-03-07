
import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Badge } from "./components/ui/badge"
import { Calendar, Clock, Save, LogOut, User, ChevronDown, Check } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { toast } from "./hooks/use-toast"
import  Toaster from "./components/ui/toaster"

export default function AvailabilityScheduler() {
    const [username, setUsername] = useState("Alice")
    const [availability, setAvailability] = useState(
        Array(7)
            .fill()
            .map(() => ({
                morning: false,
                afternoon: false,
                evening: false,
                night: false,
            })),
    )
    const [selectedCount, setSelectedCount] = useState(0)

    const days = [
        { short: "Sun", long: "Sunday" },
        { short: "Mon", long: "Monday" },
        { short: "Tue", long: "Tuesday" },
        { short: "Wed", long: "Wednesday" },
        { short: "Thu", long: "Thursday" },
        { short: "Fri", long: "Friday" },
        { short: "Sat", long: "Saturday" },
    ]

    const shifts = [
        { id: "morning", label: "Morning", time: "6am - 12pm", color: "bg-amber-100 hover:bg-amber-200 border-amber-300" },
        { id: "afternoon", label: "Afternoon", time: "12pm - 5pm", color: "bg-blue-100 hover:bg-blue-200 border-blue-300" },
        {
            id: "evening",
            label: "Evening",
            time: "5pm - 10pm",
            color: "bg-indigo-100 hover:bg-indigo-200 border-indigo-300",
        },
        { id: "night", label: "Night", time: "10pm - 6am", color: "bg-purple-100 hover:bg-purple-200 border-purple-300" },
    ]

    useEffect(() => {
        let count = 0
        availability.forEach((day) => {
            Object.values(day).forEach((selected) => {
                if (selected) count++
            })
        })
        setSelectedCount(count)
    }, [availability])

    const toggleShift = (dayIndex, shiftId) => {
        const newAvailability = [...availability]
        newAvailability[dayIndex] = {
            ...newAvailability[dayIndex],
            [shiftId]: !newAvailability[dayIndex][shiftId],
        }
        setAvailability(newAvailability)
    }

    const handleSave = () => {
        console.log("Saving availability:", availability)
        toast({
            title: "Availability saved",
            description: `You've selected ${selectedCount} shifts for the week.`,
        })
    }

    const clearAll = () => {
        setAvailability(
            Array(7)
                .fill()
                .map(() => ({
                    morning: false,
                    afternoon: false,
                    evening: false,
                    night: false,
                })),
        )
        toast({
            title: "All selections cleared",
            description: "Your availability has been reset.",
        })
    }

    const selectAll = (dayIndex) => {
        const newAvailability = [...availability]
        const allSelected = shifts.every((shift) => newAvailability[dayIndex][shift.id])

        shifts.forEach((shift) => {
            newAvailability[dayIndex][shift.id] = !allSelected
        })

        setAvailability(newAvailability)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Toaster />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                            <AvatarImage src="/placeholder.svg" alt={username} />
                            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-xl font-semibold">Welcome back, {username}!</h1>
                            <p className="text-sm text-muted-foreground">Set your availability for the upcoming week</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <User size={16} />
                                Account
                                <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                                <LogOut size={16} className="mr-2" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Availability Schedule
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Select the shifts you're available to work</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="week">
                            <TabsList className="mb-4">
                                <TabsTrigger value="week">Week View</TabsTrigger>
                                <TabsTrigger value="list">List View</TabsTrigger>
                            </TabsList>
                            <TabsContent value="week">
                                <div className="overflow-x-auto rounded-md border">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="bg-muted/50">
                                            <th className="p-3 text-left font-medium">Shifts</th>
                                            {days.map((day) => (
                                                <th key={day.short} className="p-3 text-center font-medium">
                                                    <div>{day.short}</div>
                                                    <button
                                                        onClick={() => selectAll(days.indexOf(day))}
                                                        className="text-xs text-muted-foreground hover:text-primary mt-1"
                                                    >
                                                        Select all
                                                    </button>
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {shifts.map((shift) => (
                                            <tr key={shift.id} className="border-t">
                                                <td className="p-3 border-r">
                                                    <div className="font-medium">{shift.label}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {shift.time}
                                                    </div>
                                                </td>
                                                {days.map((day, dayIndex) => (
                                                    <td key={`${day.short}-${shift.id}`} className="p-2 text-center border-r last:border-r-0">
                                                        <button
                                                            onClick={() => toggleShift(dayIndex, shift.id)}
                                                            className={`
                                  w-full h-12 rounded-md border-2 transition-all duration-200
                                  ${
                                                                availability[dayIndex][shift.id]
                                                                    ? `${shift.color} border-primary`
                                                                    : "bg-white hover:bg-gray-100 border-gray-200"
                                                            }
                                `}
                                                            aria-label={`${shift.label} on ${day.long}`}
                                                            aria-pressed={availability[dayIndex][shift.id]}
                                                        >
                                                            {availability[dayIndex][shift.id] && (
                                                                <Check className="mx-auto text-primary" size={18} />
                                                            )}
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            <TabsContent value="list">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {days.map((day, dayIndex) => (
                                        <Card key={day.long} className="overflow-hidden">
                                            <CardHeader className="bg-muted/30 py-3">
                                                <CardTitle className="text-lg">{day.long}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4">
                                                <div className="grid gap-2">
                                                    {shifts.map((shift) => (
                                                        <button
                                                            key={`${day.short}-${shift.id}`}
                                                            onClick={() => toggleShift(dayIndex, shift.id)}
                                                            className={`
                                flex items-center justify-between p-3 rounded-md border transition-all
                                ${
                                                                availability[dayIndex][shift.id]
                                                                    ? `${shift.color} border-primary`
                                                                    : "bg-white hover:bg-gray-100 border-gray-200"
                                                            }
                              `}
                                                        >
                                                            <div className="text-left">
                                                                <div className="font-medium">{shift.label}</div>
                                                                <div className="text-xs text-muted-foreground">{shift.time}</div>
                                                            </div>
                                                            {availability[dayIndex][shift.id] && <Check className="text-primary" size={18} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t p-6">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-sm py-1 px-3">
                                {selectedCount} shifts selected
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={clearAll}>
                                Clear all
                            </Button>
                        </div>
                        <Button onClick={handleSave} className="gap-2">
                            <Save size={16} />
                            Save Availability
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

