import Input from "../Components/Input";
import Button from "../Components/Button";
import Layout from "../Components/Layout";

export default function RegisterPage() {
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <Layout>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <Input label="Name" value="" onChange={() => {}} />
        <Input label="Email" type="email" value="" onChange={() => {}} />
        <Input label="Password" type="password" value="" onChange={() => {}} />
        <Button type="submit" label="Register" />
      </form>
    </Layout>
  );
}