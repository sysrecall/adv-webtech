import SubmitButton from "./SubmitButton";

export default function LoginForm() {
    return (
        <form method="post">
            <table>
            <tbody>
                <tr>
                    <td>Username</td>
                    <td><input name="username" /> </td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td><input name="password" type="password" /></td> 
                </tr>
                <tr>
                    <td>
                        <SubmitButton name="Login" />
                    </td>
                </tr>

            </tbody>
            </table>
        </form>
    );
}