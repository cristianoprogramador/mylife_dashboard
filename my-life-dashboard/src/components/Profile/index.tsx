import Dropzone from "react-dropzone";
import { useCallback, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import UserContext from "@/contexts/userContext";
import { useTheme } from "next-themes";

type ProfileProps = {
  onGoBackClick: () => void;
};

export default function Profile(props: ProfileProps) {
  const { onGoBackClick } = props;
  const { data: session } = useSession();
  const [showDefaultImage, setShowDefaultImage] = useState(true);
  const [newName, setNewName] = useState("");

  const dataProfile = JSON.parse(localStorage.getItem("userData") || "null");
  // console.log(dataProfile);

  const [image, setImage] = useState<File | null>(null);
  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setShowDefaultImage(false);
      console.log(acceptedFiles[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!image) return;
      const formData = new FormData();
      formData.append("myImage", image);

      const { data } = await axios.post(
        `/api/upload?email=${session?.user?.email}`,
        formData
      );

      console.log("Image uploaded:", data);

      // const response = await axios.put(
      //   `http://localhost:3030/uploadPhoto/${session?.user?.email}`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      // console.log("Image uploaded:", response);
      window.location.reload();
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  const handleSubmitName = async () => {
    try {
      if (!newName || newName === dataProfile.name) {
        return;
      }
      console.log(newName);
      await axios.put(`/api/updateUserName?email=${session?.user?.email}`, {
        name: newName,
      });

      // await axios.put(
      //   `http://localhost:3030/uploadUserName/${session?.user?.email}`,
      //   {
      //     name: newName,
      //   }
      // );

      console.log("Name updated:", newName);
      window.location.reload();

      // fetchUser();
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  const handleNameChange = (e: any) => {
    setNewName(e.target.value);
  };

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-700" : "bg-white";
  const bgColorInput =
    theme === "dark"
      ? "mt-1 block rounded-md  border-transparent focus:border-gray-500  focus:ring-0 text-center"
      : "mt-1 block rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-center";
  const bgColorButtonGreen =
    theme === "dark"
      ? "py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-75 transition duration-100 ease-in-out"
      : "py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-100 ease-in-out";
  const bgColorButtonBlue =
    theme === "dark"
      ? "py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75 transition duration-100 ease-in-out"
      : "py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-100 ease-in-out";

  // const ImageHoster = `http://localhost:3030+${dataProfile?.image}`;

  return (
    <div className={`${bgColor}  p-6 flex flex-col items-center rounded-md`}>
      <div className="flex flex-row w-full justify-start gap-3 mb-4">
        <button onClick={onGoBackClick} className={`${bgColorButtonBlue}`}>
          Voltar
        </button>
        <h1 className="text-2xl font-bold">Dados da Conta:</h1>
      </div>
      <p className="text-lg mb-4">
        Aqui você pode visualizar seus dados de conta.
      </p>

      {showDefaultImage && (
        <div className="flex justify-center h-40 w-40">
          <Image
            src={dataProfile?.image}
            height={160}
            width={160}
            alt="Imagem"
            style={{ borderRadius: "80px", objectFit: "cover" }}
          />
        </div>
      )}
      {image && (
        <div className="flex justify-center h-40 w-40">
          <Image
            src={URL.createObjectURL(image)}
            alt="Imagem selecionada"
            height={160}
            width={160}
            style={{ borderRadius: "80px", objectFit: "cover" }}
          />
        </div>
      )}
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div
            className="flex flex-row justify-center items-center gap-3"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <button className={`${bgColorButtonBlue} mt-4`}>
              Selecionar Foto
            </button>
            {image && (
              <button
                className={`${bgColorButtonGreen}  mt-4`}
                onClick={handleSubmit}
              >
                Salvar no Servidor
              </button>
            )}
          </div>
        )}
      </Dropzone>

      <div className="mt-4 flex flex-row justify-around w-full">
        <label htmlFor="name" className="block font-medium ">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`${bgColorInput}`}
          value={newName || dataProfile.name}
          onChange={handleNameChange}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button className={`${bgColorButtonGreen}`} onClick={handleSubmitName}>
          Atualizar Nome
        </button>
      </div>
    </div>
  );
}
