import { Form, Link, useLocation, useSubmit } from '@remix-run/react'
import { ButtonLink } from './utils/forms.tsx'
import { Github, X } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { getUserImgSrc } from './utils/misc.ts'
import { useOptionalUser, useUser } from './utils/user.ts'
import { cn } from './lib/utils.ts'
import { useState } from 'react'
import { useLockBody } from './lib/hooks.ts'

const items: Array<NavItem> = [
	{ title: 'Home', href: '/' },
	{ title: 'About', href: '/about' },
]

const LogoIcon = () => (
	<img
		src="/img/kraatz-logo-light.svg"
		className="h-7 w-7 bg-opacity-0"
		alt="Kraatz App"
	/>
)

export default function MainNavigation({
	children,
}: {
	children?: React.ReactNode
}) {
	const user = useOptionalUser()
	const location = useLocation()
	const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)

	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-40 w-full border-b bg-background">
				<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
					<div className="flex gap-6 md:gap-10">
						<Link to="/" className="hidden items-center space-x-2 md:flex">
							<LogoIcon />
							<span className="hidden font-bold sm:inline-block">
								Kraatz App
							</span>
						</Link>
						{items?.length ? (
							<nav className="hidden gap-6 md:flex">
								{items?.map((item, index) => (
									<Link
										key={index}
										to={item.href}
										className={cn(
											'text-lg sm:text-sm flex items-center font-medium transition-colors hover:text-foreground/80',
											item.href.startsWith(
												`/${location.pathname.split('/')[1]}`,
											)
												? 'text-foreground'
												: 'text-foreground/60',
										)}
									>
										{item.title}
									</Link>
								))}
							</nav>
						) : null}
						<button
							className="flex items-center space-x-2 md:hidden"
							onClick={() => setShowMobileMenu(!showMobileMenu)}
						>
							{showMobileMenu ? <X /> : <LogoIcon />}
							<span className="font-bold">Menu</span>
						</button>
						{showMobileMenu && items && (
							<MobileNav items={items}>{children}</MobileNav>
						)}
					</div>
					<div className="flex flex-1 items-center space-x-4 sm:justify-end">
						<div className="flex-1 sm:grow-0">
							{user ? (
								<UserDropdown user={user} />
							) : (
								<ButtonLink to="/login" size="sm" variant="primary">
									Log In
								</ButtonLink>
							)}
						</div>
						<nav className="flex space-x-4">
							<Link
								to={'https://github.com/MattKraatz/kraatz-app'}
								target="_blank"
								rel="noreferrer"
							>
								<Github className="h-7 w-7" />
								<span className="sr-only">GitHub</span>
							</Link>
						</nav>
					</div>
				</div>
			</header>
			<div className="container flex-1">{children}</div>
			<SiteFooter className="border-t" />
		</div>
	)
}

export type NavItem = {
	title: string
	href: string
}

interface MobileNavProps {
	items: NavItem[]
	children?: React.ReactNode
}

function MobileNav({ items, children }: MobileNavProps) {
	useLockBody()

	return (
		<div
			className={cn(
				'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden',
			)}
		>
			<div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
				<Link to="/" className="flex items-center space-x-2">
					<LogoIcon />
					<span className="font-bold">Kraatz App</span>
				</Link>
				<nav className="text-sm grid grid-flow-row auto-rows-max">
					{items.map((item, index) => (
						<Link
							key={index}
							to={item.href}
							className={cn(
								'text-sm flex w-full items-center rounded-md p-2 font-medium hover:underline',
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>
				{children}
			</div>
		</div>
	)
}

interface Props {
	user: ReturnType<typeof useUser>
}

function UserDropdown({ user }: Props) {
	const submit = useSubmit()

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<Link
					to={`/users/${user.username}`}
					// this is for progressive enhancement
					onClick={e => e.preventDefault()}
					className="flex items-center gap-2 rounded-full bg-night-500 py-2 pl-2 pr-4 outline-none hover:bg-night-400 focus:bg-night-400 radix-state-open:bg-night-400"
				>
					<img
						className="h-8 w-8 rounded-full object-cover"
						alt={user.name ?? user.username}
						src={getUserImgSrc(user.imageId)}
					/>
					<span className="text-body-sm font-bold">
						{user.name ?? user.username}
					</span>
				</Link>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={8}
					align="start"
					className="flex flex-col rounded-3xl bg-[#323232]"
				>
					<DropdownMenu.Item asChild>
						<Link
							prefetch="intent"
							to={`/users/${user.username}`}
							className="rounded-t-3xl px-7 py-5 outline-none hover:bg-night-500 radix-highlighted:bg-night-500"
						>
							Profile
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Link
							prefetch="intent"
							to={`/users/${user.username}/notes`}
							className="px-7 py-5 outline-none hover:bg-night-500 radix-highlighted:bg-night-500"
						>
							Notes
						</Link>
					</DropdownMenu.Item>
					<DropdownMenu.Item asChild>
						<Form
							action="/logout"
							method="POST"
							className="rounded-b-3xl px-7 py-5 outline-none radix-highlighted:bg-night-500"
							onClick={e => submit(e.currentTarget)}
						>
							<button type="submit">Logout</button>
						</Form>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
	return (
		<footer className={cn(className)}>
			<div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<LogoIcon />
					<p className="text-sm text-center leading-loose md:text-left">
						Built by{' '}
						<a
							href={'https://twitter.com/MattKraatz'}
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							Matt Kraatz
						</a>
						. Hosted on{' '}
						<a
							href="https://fly.io"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							Fly.io
						</a>
						. The source code is available on{' '}
						<a
							href={'https://github.com/MattKraatz/kraatz-app'}
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							GitHub
						</a>
						.
					</p>
				</div>
			</div>
		</footer>
	)
}
