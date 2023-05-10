import Dropzone from "react-dropzone";
import { useCallback, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import UserContext from "@/contexts/userContext";

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
      window.location.reload();

      // fetchUser();
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

  return (
    <div className="bg-gray-100 p-6 flex flex-col items-center">
      <div className="flex flex-row w-full justify-start gap-3 mb-4">
        <button
          onClick={onGoBackClick}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
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
            src={dataProfile.image}
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
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 cursor-pointer flex justify-center">
              Selecionar Foto
            </button>
            {image && (
              <button
                className="mt-4 bg-green-500 text-white py-2 px-10 rounded-lg hover:bg-green-600"
                onClick={handleSubmit}
              >
                Salvar no Servidor
              </button>
            )}
          </div>
        )}
      </Dropzone>

      <div className="mt-4 flex flex-row justify-around w-full">
        <label htmlFor="name" className="block font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="mt-1 block rounded-md bg-gray-200 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-center"
          value={newName || dataProfile.name}
          onChange={handleNameChange}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="mt-4 bg-green-500 text-white py-2 px-10 rounded-lg hover:bg-green-600"
          onClick={handleSubmitName}
        >
          Atualizar Nome
        </button>
      </div>
    </div>
  );
}
