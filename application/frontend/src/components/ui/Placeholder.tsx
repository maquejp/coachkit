export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <h1 className="text-2xl font-semibold text-gray-400">{title}</h1>
    </div>
  );
}
