import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, FileText, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isImage = (f: File) => {
		if (f.type?.startsWith("image/")) return true;
		const name = f.name.toLowerCase();
		return (
			name.endsWith(".jpg") ||
			name.endsWith(".jpeg") ||
			name.endsWith(".png") ||
			name.endsWith(".webp") ||
			name.endsWith(".gif")
		);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (selected && isImage(selected)) {
			setFile(selected);
			setPreview(URL.createObjectURL(selected));
			setResult(null);
			setError(null);
		} else if (selected) {
			setError("Please select a valid image file (JPG, PNG, WebP).");
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const selected = e.dataTransfer.files?.[0];
		if (selected && isImage(selected)) {
			setFile(selected);
			setPreview(URL.createObjectURL(selected));
			setResult(null);
			setError(null);
		} else if (selected) {
			setError("Please select a valid image file (JPG, PNG, WebP).");
		}
	};

	const handleScan = async () => {
		if (!file) return;

		setLoading(true);
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("http://localhost:8000/api/ocr", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.detail || "Failed to scan image");
			}

			const data = await response.json();
			setResult(data.text);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An error occurred during OCR scanning");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-200 p-8 flex flex-col items-center font-sans">
			<header className="mb-12 text-center">
				<h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-tight">
					AI OCR Scanner
				</h1>
				<p className="text-slate-400 text-lg max-w-2xl mx-auto">
					Upload an image containing text, and our FastAPI backend will extract
					it instantly.
				</p>
			</header>

			<main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Upload Section */}
				<section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
					<h2 className="text-xl font-semibold mb-6 flex items-center text-slate-100">
						<UploadCloud className="w-6 h-6 mr-2 text-cyan-400" />
						Upload Image
					</h2>

					<button
						type="button"
						className="flex-1 w-full border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 transition-colors hover:border-cyan-500/50 hover:bg-slate-800/50 cursor-pointer relative overflow-hidden min-h-[300px]"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
					>
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							accept="image/*"
							onChange={handleFileChange}
						/>

						{preview ? (
							<img
								src={preview}
								alt="Preview"
								className="absolute inset-0 w-full h-full object-contain p-2"
							/>
						) : (
							<div className="text-center flex flex-col items-center">
								<UploadCloud className="w-16 h-16 text-slate-600 mb-4" />
								<p className="text-slate-400 font-medium">
									Click or drag image here to upload
								</p>
								<p className="text-slate-500 text-sm mt-2">
									Supports JPG, PNG, WebP
								</p>
							</div>
						)}
					</button>

					<div className="mt-6 flex flex-col gap-4">
						{error && (
							<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start">
								<AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
								<p className="text-sm">{error}</p>
							</div>
						)}

						<button
							type="button"
							onClick={handleScan}
							disabled={!file || loading}
							className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center"
						>
							{loading ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Scanning...
								</>
							) : (
								"Scan Document"
							)}
						</button>
					</div>
				</section>

				{/* Output Section */}
				<section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
					<h2 className="text-xl font-semibold mb-6 flex items-center text-slate-100">
						<FileText className="w-6 h-6 mr-2 text-blue-400" />
						Extracted Text
					</h2>

					<div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-y-auto min-h-[300px]">
						{loading ? (
							<div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
								<Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
								<p>Analyzing image structure...</p>
							</div>
						) : result !== null ? (
							result.length > 0 ? (
								<pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
									{result}
								</pre>
							) : (
								<div className="absolute inset-0 flex items-center justify-center text-slate-500 text-center p-6">
									<p>
										No text could be extracted from this image.
										<br />
										Try an image with clearer text.
									</p>
								</div>
							)
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 text-center p-6">
								<FileText className="w-16 h-16 text-slate-800 mb-4" />
								<p>Upload an image and click scan to see the results here.</p>
							</div>
						)}
					</div>

					{result && (
						<div className="mt-6 flex justify-end">
							<button
								type="button"
								onClick={() => navigator.clipboard.writeText(result)}
								className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600 flex items-center"
							>
								Copy to Clipboard
							</button>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
