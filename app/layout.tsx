import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'银川 / 太原 · 2026 七日旅行计划',description:'2026年10月1日—7日，双人银川七日慢游与太原银川双城方案。'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><nav className="plan-switch" aria-label="旅行方案切换"><a href="/">银川七日</a><a href="/taiyuan-yinchuan">太原＋银川</a></nav>{children}</body></html>}

