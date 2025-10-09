// src/components/NavbarAdmin.jsx
export default function NavbarAdmin({ username, avatar }) {
  return (
    <header className="flex items-center justify-end px-6 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <span className="font-medium">{username}</span>
        <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
      </div>
    </header>
  );
}
