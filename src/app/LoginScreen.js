'use client';
import { signIn } from "next-auth/react";
import DoubleHeader from "./components/DoubleHeader";


export default function LoginScreen() {
    return (
        <div className="bg-white mt-8 max-w-md border mx-auto rounded-xl p-4 py-6 border-blue-100 border-b-4 text-center">
            <DoubleHeader preTitle={'Welcome back'} mainTitle={'Login to your account'} />
            <button
                onClick={() => signIn('google')}
                className=" bg-indigo-400 text-white px-6 py-2 rounded-xl border-indigo-700 border-b-4 inline-flex gap-2 item-center my-6">
                <img className="w-6 " src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" />
                Login with google</button>
        </div>
    );
}