export default function TopNav() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex-1">
        {/* Search or breadcrumbs could go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 font-medium">에디터님, 안녕하세요</div>
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
          ED
        </div>
      </div>
    </header>
  );
}
