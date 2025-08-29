'use client';

export default function SubmitButton(
    {name}: {name?: string}
) {
    return <button type="submit">{name}</button>;
}