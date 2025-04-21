import './globals.css'
import ClientLayout from '../components/layout/ClientLayout'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: 'Off White',
  description: 'Off White Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
