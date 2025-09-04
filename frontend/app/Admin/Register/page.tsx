
import Layout from "../Components/Layout";
import Navbar from "../Components/Navbar";
import AdminRegister from "../Components/Register";
export default function RegisterPage() {

  return (
    <>
     <Navbar />
      <div className="mt-2 min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <AdminRegister />
      </div>
    </>
  );
  
}