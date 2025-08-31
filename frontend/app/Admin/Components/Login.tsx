import Link from "next/link";
export default function Login() {
  return (
    <>
      <h1>Login Page</h1>
      <br />
      <br />
      <form>
        <div>
          <label>Username</label>
          <input name="username" />
        </div>
        <br />
        <div>
          <label>Password</label>
          <input name="password" type="password" />
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
      <br /> 
        <Link href="../admin">Home</Link>
        <br />
    </>
  );
}
