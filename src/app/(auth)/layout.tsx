export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="bg-red-600 min-h-screen">
            {children}
        </div>
    )
}