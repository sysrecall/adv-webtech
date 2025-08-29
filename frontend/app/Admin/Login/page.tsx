import Input from "../Components/Input";
import Button from "../Components/Button";
import Layout from "../Components/Layout";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <Layout>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value=""
          onChange={() => {}}
        />
        <Input
          label="Password"
          type="password"
          value=""
          onChange={() => {}}
        />
        <Button type="submit" label="Login" />
      </form>
    </Layout>
  );
}