## Hướng dẫn UI cho Admin (Vite) — Đồng bộ giao diện với TrangVang.AI

Mục tiêu: xây dựng một hệ thống Admin độc lập (Vite + React) có giao diện nhất quán với Admin hiện tại: màu sắc, bố cục, typography, component states và hành vi responsive.

### 1) Nguyên tắc thiết kế
- **Tone**: Admin trung tính (trắng/xám), tối ưu đọc & tập trung vào dữ liệu; không dùng tông vàng rực như public site.
- **Khả dụng**: trạng thái hover/focus/disabled nhất quán; ring focus rõ ràng; đủ tương phản.
- **Hệ thống**: dùng token màu/spacing/radius/typography để tái sử dụng; tránh hardcode.

### 2) Token màu & theme (CSS Variables)
Áp dụng mặc định cho Admin (tương đương `app/globals.css` lớp `.admin-theme`). Nếu muốn hỗ trợ Dark Mode, kế thừa cấu trúc tương tự `:root`/`.dark`.

```css
/* src/styles/theme.css */
:root {
  /* Neutrals cho admin */
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.205 0 0); /* xám đậm cho CTA */
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem; /* 10px */

  /* Sidebar */
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);

  /* Font */
  --font-sans: "Roboto", Arial, sans-serif;
}
```

### 3) Tailwind thiết lập (ưu tiên Tailwind v4)
Sử dụng mapping token → theme để class tiện truy cập. Với Tailwind v4, có thể dùng `@theme` inline như app hiện tại.

```css
/* src/styles/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground font-sans; }
}
```

Gợi ý bổ sung: thêm `tw-animate-css` nếu bạn muốn hiệu ứng đồng bộ với app.

### 4) Typography & spacing
- **Font**: `var(--font-sans)` = Roboto, Arial, sans-serif.
- **Radius**: mặc định 10px (`--radius`); dùng `rounded-md/rounded-xl` theo map radius ở trên.
- **Spacing**: theo Tailwind scale; card nội dung padding `px-6 py-6`, topbar `h-14`.

### 5) Khung bố cục Admin
Sidebar trái + Topbar dính + Main content. Sidebar có chế độ thu gọn.

```tsx
// Layout.tsx (Vite + React)
import { useState } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-dvh bg-background text-foreground flex w-full">
      <aside className="hidden md:block sticky top-0 h-[100dvh]">
        <div className={`flex h-full shrink-0 flex-col border-r bg-card ${collapsed ? "w-16" : "w-64"}`}>
          <div className="h-14 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <img src="/trangvang-ai-logo.png" alt="TrangVang Admin" className="h-6 w-6" />
              {!collapsed && <span>TrangVang Admin</span>}
            </div>
            <button className={`btn-ghost ${collapsed ? "mx-auto" : ""}`} onClick={() => setCollapsed(v => !v)}>
              {collapsed ? "▶" : "◀"}
            </button>
          </div>
          <nav className="p-2 space-y-1 overflow-y-auto">
            {/* Nav items: active -> bg-accent text-accent-foreground; hover -> hover:bg-accent */}
            <a className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground" href="#">Dashboard</a>
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1 flex flex-col">
        <div className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-2 px-4">
            {/* Mobile menu trigger đặt ở đây */}
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:flex items-center">
                {/* ô tìm kiếm */}
                <input className="pl-8 w-64 input" placeholder="Quick search..." />
              </div>
              {/* Avatar + dropdown tài khoản */}
            </div>
          </div>
        </div>
        <main className="min-w-0 flex-1 px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
```

Chi tiết khớp với app:
- **Sidebar**: rộng `w-64`, thu gọn `w-16`, nền `bg-card`, viền `border-r`.
- **Topbar**: cao `h-14`, `border-b`, nền mờ `bg-background/80` + `backdrop-blur`.
- **Nav item**: active = `bg-accent text-accent-foreground`; hover = `hover:bg-accent`.

### 6) Component recipes (khuyến nghị)

#### 6.1 Button
Biến thể và kích thước tương thích với app (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`).

```tsx
// ui/button.tsx (Vite)
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export function Button({ className, variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

#### 6.2 Input

```tsx
// ui/input.tsx (Vite)
import { cn } from "./utils";

export function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}
```

#### 6.3 Card

```tsx
// ui/card.tsx (Vite)
import { cn } from "./utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className)} {...props} />;
}

export const CardHeader = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", p.className)} {...p} />
);
export const CardTitle = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("leading-none font-semibold", p.className)} {...p} />
);
export const CardDescription = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-muted-foreground text-sm", p.className)} {...p} />
);
export const CardContent = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6", p.className)} {...p} />
);
export const CardFooter = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center px-6 [.border-t]:pt-6", p.className)} {...p} />
);

function cn(...a: any[]) { return a.filter(Boolean).join(" "); }
```

### 7) Trạng thái & accessibility
- **Focus**: dùng ring 3px `ring-ring/50` + `border-ring` khi focus-visible.
- **Disabled**: `disabled:opacity-50 disabled:pointer-events-none`.
- **Aria-invalid**: thêm `aria-invalid` → ring `destructive` mờ.
- **Contrasts**: đảm bảo WCAG AA cho text chính (foreground vs background).

### 8) Icon & motion
- **Icon**: lucide-react (kích thước mặc định 16px/20px theo context, `size-4`/`h-4 w-4`).
- **Motion**: dùng `transition-colors/transition-all`, có thể thêm `tw-animate-css` nếu cần.

### 9) Mapping nhanh class quan trọng
- **Nút chính**: `bg-primary text-primary-foreground hover:bg-primary/90`.
- **Viền/ô nhập**: `border-input focus-visible:border-ring`.
- **Card**: `bg-card text-card-foreground border rounded-xl shadow-sm`.
- **Nav active**: `bg-accent text-accent-foreground`.
- **Topbar**: `h-14 border-b bg-background/80 backdrop-blur`.

### 10) Checklist tích hợp Vite
1. Cài: Tailwind v4, class-variance-authority, lucide-react (nếu dùng), PostCSS.
2. Thêm `src/styles/theme.css` và `src/styles/globals.css` như trên, import trong entry (ví dụ `main.tsx`).
3. Đặt font Roboto (Google Fonts) trong `index.html` hoặc dùng hệ thống.
4. Tạo các component `Button`, `Input`, `Card` theo recipe để đảm bảo tương thích.
5. Dựng `AdminLayout` với sidebar/topbar đúng kích thước & class.

Tài liệu này phản chiếu trực tiếp token/behaviour từ app hiện tại, bảo đảm Admin (Vite) có giao diện nhất quán.


