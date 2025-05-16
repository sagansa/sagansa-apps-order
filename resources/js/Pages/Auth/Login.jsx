import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col items-center p-8 mx-auto space-y-6 max-w-md bg-white rounded-lg shadow-md">
                <div className="space-y-2 w-full">
                    <InputLabel htmlFor="email" value="Email" className="block text-center" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2 w-full">
                    <InputLabel htmlFor="password" value="Password" className="block text-center" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex justify-center items-center py-2 w-full">
                    <label className="flex items-center space-x-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="text-sm text-gray-600 ms-2">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex flex-col gap-4 justify-center items-center pt-4 w-full border-t border-gray-200 sm:flex-row">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-700"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="px-6 py-2 w-full sm:w-auto" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
