import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'银川，慢慢来 · 2026 七日旅行计划',description:'2026年10月1日—7日，双人银川七日慢游。每日行程、公开地图、订票住宿提醒与预算。'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><head><link rel="stylesheet" href="/vendor/leaflet.css"/></head><body>{children}</body></html>}

