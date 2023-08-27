import './globals.css'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'iCAN硬件申领',
    description: 'iCAN硬件申领 - 华北理工大学',
}

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh_CN">
        {
        }
        <head/>
        <body>
        {children}
        </body>
        </html>
    );
}
