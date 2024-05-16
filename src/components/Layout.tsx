import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from "@tanstack/react-router"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { BellIcon, HomeIcon, LineChartIcon, MenuIcon, Package2Icon, PackageIcon, SearchIcon, UsersIcon } from 'lucide-react';


export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link className="flex items-center gap-2 font-semibold" to="/">
              <Package2Icon className="h-6 w-6" />
              <span className="">Building Inspection</span>
            </Link>
            <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
              <BellIcon className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                to="/"
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                to="/"
              >
                <PackageIcon className="h-5 w-5" />
                Projects
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                to="/"
              >
                <UsersIcon className="h-5 w-5" />
                Clients
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                to="/"
              >
                <LineChartIcon className="h-5 w-5" />
                Reports
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="shrink-0 md:hidden" size="icon" variant="outline">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col" side="left">
              <nav className="grid gap-2 text-lg font-medium">
                <Link className="flex items-center gap-2 text-lg font-semibold" to="/">
                  <Package2Icon className="h-6 w-6" />
                  <span className="sr-only">Building Inspection</span>
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                  to="/"
                >
                  <HomeIcon className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  to="/"
                >
                  <PackageIcon className="h-5 w-5" />
                  Projects
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  to="/"
                >
                  <UsersIcon className="h-5 w-5" />
                  Clients
                </Link>
                <Link
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  to="/"
                >
                  <LineChartIcon className="h-5 w-5" />
                  Reports
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  placeholder="Search projects..."
                  type="search"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" size="icon" variant="secondary">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 cursor-pointer">
                  {
                    "Muhammad Hammad".split(' ').map((name) => name[0]).join('')
                  }
                </div>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="link"
                  className='hover:no-underline p-0 h-auto'
                  onClick={() => navigate({ to: '/logout' })}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </main>
  )
}

