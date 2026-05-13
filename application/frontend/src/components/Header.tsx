export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <span className="text-xl font-bold">CoachKit</span>
        <nav className="flex gap-6">
          <a href="/">Home</a>
          <a href="/classes">Classes</a>
          <a href="/pricing">Pricing</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
