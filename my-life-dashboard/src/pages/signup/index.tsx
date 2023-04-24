import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { name, email, password } = data;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const { userId } = await response.json();
        console.log(`Cadastro efetuado com sucesso, id: ${userId}`);

        // redireciona para a página inicial após o cadastro ser efetuado
        router.push("/");
      } else {
        const { message } = await response.json();
        setErrorMsg(message);
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex flex-1 justify-center align-middle">
      <Head>
        <title>SignUp</title>
      </Head>
      <div className="max-w-sm w-full space-y-8 mt-7">
        <div>
          <Image
            className="mx-auto h-28 w-auto"
            height={80}
            width={80}
            src="/signup.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta abaixo
          </h2>
        </div>
        <div className="max-w-sm w-full space-y-8 mt-7">
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Cristiano"
                {...register("name", {
                  required: "Esse campo é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Esse campo exige no mínimo 2 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "Esse campo tem limite de 20 caracteres",
                  },
                })}
              />
              {errors.name && (
                <span className="text-red-700">{errors.name.message}</span>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="cristiano@exemplo.com"
                {...register("email", {
                  required: "Esse campo é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Esse campo exige um endereço de e-mail valido",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-700">{errors.email.message}</span>
              )}
              {errorMsg && <span className="text-red-500">{errorMsg}</span>}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="********"
                {...register("password", {
                  required: "Esse campo é obrigatório",
                  minLength: {
                    value: 6,
                    message: "Esse campo exige no minimo 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-700">{errors.password.message}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
