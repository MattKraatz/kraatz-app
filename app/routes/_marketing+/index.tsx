import type { V2_MetaFunction } from '@remix-run/node'
import { logos } from './logos/logos.ts'
import { Separator } from '@/components/separator.tsx'

export const meta: V2_MetaFunction = () => [{ title: 'Kraatz App' }]

export default function Index() {
	return (
		<>
			<section className="flex h-[40vh] w-full flex-col justify-center md:h-[60vh] md:flex-row">
				<div className="flex max-w-2xl items-center justify-center md:grow">
					<img
						src="/img/kraatz-logo.svg"
						alt="Personal Logo"
						className="ml-auto"
					/>
				</div>
				<div className="m-8 flex items-center justify-center">
					<div className="text-center md:text-start">
						<h1 className="text-5xl">Matt Kraatz</h1>
						<h2 className="italic">Full Stack Web Developer</h2>
					</div>
				</div>
			</section>

			<section className="mx-auto mt-8 max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
				<div className="bg-day-300 flex flex-wrap justify-center gap-8 rounded-3xl py-4">
					{logos.map(img => (
						<a
							key={img.href}
							href={img.href}
							className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
						>
							<img alt={img.alt} src={img.src} className="object-contain" />
						</a>
					))}
				</div>
			</section>
		</>
	)
}
