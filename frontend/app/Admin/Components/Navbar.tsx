import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <h1> Wrong Store</h1>
      <div>
        <br />

        <br />
        <Link href="../Login">Login</Link>
        <br />
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
}
