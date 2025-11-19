export default function NavbarAdmin({ username }) {
  return (
    <header className="flex items-center justify-end px-6 py-3 bg-white shadow-sm">
      <span className="font-medium text-gray-800">{username}</span>
    </header>
  );
}
