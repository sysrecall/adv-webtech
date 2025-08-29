import SubmitButton from "./SubmitButton";

export default function RegisterForm() {
    return (
        <form method="post">
            <table>
            <tbody>
                <tr>
                    <td>Email</td>
                    <td><input name="email" type="email"/> </td>
                </tr>
                <tr>
                    <td>Full Name</td>
                    <td><input name="fullName" /></td> 
                </tr>
                <tr>
                    <td>Username</td>
                    <td><input name="username" /> </td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td><input name="password" type="password" /></td> 
                </tr>
                <tr>
                    <td>Confirm Password</td>
                    <td><input type="password" /></td> 
                </tr>
                <tr>
                    <td>
                        <SubmitButton name="Register" />
                    </td>
                </tr>

            </tbody>
            </table>
        </form>
    );
}