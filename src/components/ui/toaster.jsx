
import { useEffect, useState } from "react"
import { X } from "lucide-react"

function Toaster() {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        const handleToast = (event) => {
            const { title, description, id } = event.detail
            setToasts((prev) => [...prev, { id, title, description }])

            // Auto dismiss after 5 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id))
            }, 5000)
        }

        document.addEventListener("toast", handleToast)
        return () => document.removeEventListener("toast", handleToast)
    }, [])

    return (
        <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2 max-w-md w-full">
            {toasts.map((toast) => (
                <div key={toast.id} className="bg-white border rounded-lg shadow-lg p-4 animate-in slide-in-from-right-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-medium">{toast.title}</h3>
                            {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
                        </div>
                        <button
                            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Toaster;