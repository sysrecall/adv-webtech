// Correct the import path
import Layout from "./Components/Layout";
import Link from "next/link";
export default function HomePage() {
  return (
    <> 

       <div>Admin Panel </div>
            <br />
            <br />
            <Link href='admin/login'>Login </Link>
            <br />
            <Link href='admin/register'>Register</Link>
    </>
  );
}