"use client";
import { useState, useRef, useEffect } from "react";
import { z, ZodError, ZodIssue } from "zod";
import api from "@/lib/axios";


// Zod schema for form validation
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(255, "Full name must be 255 characters or less"),
  username: z.string().min(1, "Username is required").max(50, "Username must be 50 characters or less"),
  email: z.string().email("Invalid email format").max(255, "Email must be 255 characters or less"),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password must be 255 characters or less"),
  age: z.number().min(18, "Age must be 18 or older").max(120, "Age must be 120 or less"),
  phone: z.string().min(1, "Phone number is required").max(20, "Phone number must be 20 characters or less").regex(/^\+?\d+$/, "Invalid phone number format"),
  gender: z.enum(["male", "female", "other"], { message: "Please select a valid gender" }),
  nid: z.string().min(1, "NID number is required").max(50, "NID number must be 50 characters or less"),
});

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  age: string;
  phone: string;
  gender: string;
  nid: string;
}

export default function AdminRegister() {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    gender: "",
    nid: "",
  });
  const [nidImage, setNidImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Use 2MB limit
    if (file.size > 2 * 1024 * 1024) {
      setMessage("File size exceeds 2MB!");
      setNidImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage("Please upload an image file!");
      setNidImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setNidImage(file);
    setMessage("");
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted.current) return;

    setErrors({});
    setMessage("");

    const parsedForm = {
      ...form,
      age: parseInt(form.age) || 0,
    };
    const result = formSchema.safeParse(parsedForm);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((err: ZodIssue) => {
        const field = err.path[0] as keyof FormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!form) {
      setMessage("Form data is missing. Please try again.");
      console.error("Form is undefined");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      if (nidImage) formData.append("nidImage", nidImage); // Append the file

      console.log("FormData being sent:", Object.fromEntries(formData)); // Debug log
      const res = await api.post("/admin/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (isMounted.current) {
        setMessage("Registration successful!");
        setForm({ fullName: "", username: "", email: "", password: "", age: "", phone: "", gender: "", nid: "" });
        setNidImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      console.log("API Response:", res.data); // Debug response
    } catch (err: unknown) {
      if (isMounted.current) {
        setMessage((err as any)?.response?.data?.message || "Registration failed!");
        console.error("API Error:", err); // Log the error
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-700">Admin Register</h2>
      {message && <p className={message.includes("failed") ? "text-red-500" : "text-green-500"}>{message}</p>}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          id="fullName"
          type="text"
          placeholder="Full Name"
          className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          value={form.fullName}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          className={`w-full border ${errors.username ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          value={form.username}
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          value={form.email}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          value={form.password}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
        <input
          id="age"
          type="number"
          placeholder="Age"
          className={`w-full border ${errors.age ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          value={form.age}
        />
        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          id="phone"
          type="text"
          placeholder="Phone Number (e.g., +1234567890)"
          className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          value={form.phone}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          id="gender"
          className={`w-full border ${errors.gender ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          value={form.gender}
        >
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
      </div>

      <div>
        <label htmlFor="nid" className="block text-sm font-medium text-gray-700">NID Number</label>
        <input
          id="nid"
          type="text"
          placeholder="NID Number"
          className={`w-full border ${errors.nid ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          onChange={(e) => setForm({ ...form, nid: e.target.value })}
          value={form.nid}
        />
        {errors.nid && <p className="text-red-500 text-sm">{errors.nid}</p>}
      </div>

      <div>
        <label htmlFor="nidImage" className="block text-sm font-medium text-gray-700">NID Image</label>
        <input
          id="nidImage"
          type="file"
          accept="image/*"
          className="w-full text-gray-600"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}