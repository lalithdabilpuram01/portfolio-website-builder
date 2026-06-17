export default function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
    </div>
  )
}
