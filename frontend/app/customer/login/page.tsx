export default function Login() {
    return (
        <>
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
                            <button type="submit">Login</button>
                        </td>
                    </tr>

                </tbody>
                </table>
            </form>
        </>
    );
}