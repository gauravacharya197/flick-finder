import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>

      <div className="flex items-center gap-4">
        <NavbarClient /> {/* Only this part is client-side */}
      </div>
    </nav>
  );
}
