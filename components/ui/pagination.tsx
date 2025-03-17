import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { useColors } from "@/app/context/color-context"
import { generateColorTones } from "@/utils/color-utils"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => {
  const { colorTones } = useColors();
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  return (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
      style={{ color: currentColorTones[1][3] }}
    {...props}
  />
)
}
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => {
  const { colorTones } = useColors();
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  return (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
        "hover:bg-opacity-30 transition-colors backdrop-blur-sm",
      className
    )}
      style={{
        borderColor: currentColorTones[1][3],
        color: currentColorTones[1][3],
        backgroundColor: isActive ? `${currentColorTones[1][3]}20` : 'transparent'
      }}
    {...props}
  />
)
}
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { colorTones } = useColors();
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  return (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
      className={cn("gap-1 pl-2.5 hover:bg-opacity-30 transition-colors backdrop-blur-sm", className)}
      style={{
        borderColor: currentColorTones[1][3],
        color: currentColorTones[1][3],
        backgroundColor: `${currentColorTones[1][3]}20`
      }}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
}
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const { colorTones } = useColors();
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  return (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
      className={cn("gap-1 pr-2.5 hover:bg-opacity-30 transition-colors backdrop-blur-sm", className)}
      style={{
        borderColor: currentColorTones[1][3],
        color: currentColorTones[1][3],
        backgroundColor: `${currentColorTones[1][3]}20`
      }}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
}
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  const { colorTones } = useColors();
  const defaultColors = ['#D3D3D3', '#62757f', '#4B4B4B', '#8A9A5B'];
  const defaultColorTones = defaultColors.map(color => generateColorTones(color));
  const currentColorTones = colorTones || defaultColorTones;

  return (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
      style={{ color: currentColorTones[1][3] }}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
}
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
