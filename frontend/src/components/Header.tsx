import { Link } from "@tanstack/react-router";
import { BookOpen, FileJson, Home, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
				<div className="flex items-center">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<h1 className="ml-4 text-xl font-semibold flex items-center gap-2">
						<Link to="/">
							<img
								src="/tanstack-word-logo-white.svg"
								alt="TanStack Logo"
								className="h-10"
							/>
						</Link>
						<span className="text-gray-400 font-light">|</span>
						<span>OCR Service</span>
					</h1>
				</div>
				<div className="hidden md:flex gap-4">
					<a
						href="http://127.0.0.1:8000/docs"
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
					>
						<BookOpen size={18} />
						<span>Swagger UI</span>
					</a>
					<a
						href="http://127.0.0.1:8000/redoc"
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
					>
						<FileJson size={18} />
						<span>ReDoc</span>
					</a>
				</div>
			</header>

			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold">Navigation</h2>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<Link
						to="/"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Home size={20} />
						<span className="font-medium">Home</span>
					</Link>

					<div className="mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
						API Documentation
					</div>

					<a
						href="http://127.0.0.1:8000/docs"
						target="_blank"
						rel="noreferrer"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
					>
						<BookOpen size={20} />
						<span className="font-medium">Swagger UI</span>
					</a>

					<a
						href="http://127.0.0.1:8000/redoc"
						target="_blank"
						rel="noreferrer"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
					>
						<FileJson size={20} />
						<span className="font-medium">ReDoc</span>
					</a>

					{/* Demo Links Start */}

					{/* Demo Links End */}
				</nav>
			</aside>
		</>
	);
}
