import Head from "next/head";
import { AiFillLock } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { FormEvent, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";

export default function Home() {
  const { register, handleSubmit } = useForm();
  // const { signIn } = useContext(AuthContext);

  // async function handleSignIn(data) {
  //   await signIn(data);
  // }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    signIn("credentials");
  };

  return (
    <div className="flex flex-1 justify-center align-middle">
      <Head>
        <title>Home</title>
      </Head>

      <div className="max-w-sm w-full space-y-8 mt-7">
        <div>
          <img
            className="mx-auto h-20 w-auto"
            src="/dashboard.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Faça login em sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                {...register("email")}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Endereço de E-mail"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <AiFillLock
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Entrar
            </button>
          </div>
          <div className="flex flex-row">
            <img
              className="mx-auto h-10 w-auto cursor-pointer"
              src="/github.svg"
              alt="Workflow"
              onClick={() => signIn("github")}
            />
            <img
              className="mx-auto h-10 w-auto cursor-pointer"
              src="/google.svg"
              alt="Workflow"
              onClick={() => signIn("google")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // console.log("CADE A SESSION", session);

  if (session) {
    return {
      redirect: {
        destination: "/resume",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
