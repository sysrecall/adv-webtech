import Link from 'next/link';

export default async function Customer() {
    return (
        <>
            <div><em>Customer Page</em></div>
            <Link href='customer/login'>Login </Link>
            <Link href='customer/register'>Register</Link>
        </>
    );
}