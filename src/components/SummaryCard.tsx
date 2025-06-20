export default function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
}: { 
    title: string; 
    value: number ;
    icon: React.ComponentType<{ className: string }>;
  }) {
  return (
    <div className="bg-white shadow rounded p-4 flex items-center gap-4">
      <div className="p02 bg-gray-100 rounded-full">
        <Icon className="h-6 w-6 text-gray-700" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}
