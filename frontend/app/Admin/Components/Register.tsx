import Link from "next/link";
export default function Register() {
  return (
    <>
      <h1>Register Page</h1>
      <br />
      <br />
      <form method="post">
        <div>
          <label>Email</label>
          <input name="email" type="email" />
        </div>
        <br />
        <div>
          <label>Full Name</label>
          <input name="fullName" />
        </div>
        <br />
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
        <div>
          <label>Confirm Password</label>
          <input type="password" />
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
            <br /> 
        <Link href="../admin">Home</Link>
        <br />
    </>
  );
}
