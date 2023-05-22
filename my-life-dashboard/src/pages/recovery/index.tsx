import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";

const initValues = { name: "", email: "", subject: "", message: "" };

const initState = { isLoading: false, error: "", values: initValues };

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [userEnteredCode, setUserEnteredCode] = useState("");

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleCodeChange = (event: any) => {
    setRecoveryCode(event.target.value);
  };

  const handleNewPasswordChange = (event: any) => {
    setNewPassword(event.target.value);
  };

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (!showNewPasswordInput) {
        const recoveryCode = nanoid(6); // Gera um código de recuperação de 6 caracteres

        const response = await fetch("/api/sendRecoveryEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, recoveryCode }),
        });

        if (response.ok) {
          setSent(true);
          setRecoveryCode(recoveryCode); // Armazena o código de recuperação gerado
        } else {
          const data = await response.json();
          setError(data.message);
        }
      } else {
        // Verifique se o código inserido pelo usuário está correto
        if (recoveryCode === userEnteredCode) {
          // Atualize a senha do usuário com a nova senha fornecida
          const updateResponse = await fetch("/api/updatePassword", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password: newPassword }),
          });

          if (updateResponse.ok) {
            console.log("Senha do usuário atualizada com sucesso");
            alert("Senha do usuário atualizada com sucesso");
            window.location.reload();
          } else {
            const data = await updateResponse.json();
            setError(data.message);
          }
        } else {
          // Código incorreto, exiba uma mensagem de erro
          console.log("Código incorreto");
          alert("Código incorreto");
        }
      }
    } catch (error) {
      setError("Erro ao enviar o e-mail de recuperação de senha.");
      alert("Erro ao enviar o e-mail de recuperação de senha.");
    }
  };

  const handleCodeConfirmation = () => {
    setShowNewPasswordInput(true);
  };

  const handleUserEnteredCodeChange = (event: any) => {
    setUserEnteredCode(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {sent ? (
        <div className="text-center">
          <p className="mb-4">
            E-mail de recuperação de senha enviado. Verifique sua caixa de
            entrada.
          </p>
          {showNewPasswordInput ? (
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col items-center"
            >
              <input
                type="text"
                placeholder="Código de recuperação"
                value={userEnteredCode}
                onChange={handleUserEnteredCodeChange}
                required
                className="mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                className="mb-2 p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Atualizar senha
              </button>
            </form>
          ) : (
            <button
              onClick={handleCodeConfirmation}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Confirmar código de recuperação
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col items-center"
        >
          <input
            type="email"
            placeholder="Digite o seu e-mail"
            value={email}
            onChange={handleEmailChange}
            required
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enviar e-mail de recuperação
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
}
