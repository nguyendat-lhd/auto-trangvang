import { cn } from "./utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export const CardHeader = (p: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      p.className
    )}
    {...p}
  />
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


