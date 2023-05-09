import Dropzone from "react-dropzone";
import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";

type ProfileProps = {
  onGoBackClick: () => void;
};

export default function Profile(props: ProfileProps) {
  const { onGoBackClick } = props;
  const { data: session } = useSession();
  const [showDefaultImage, setShowDefaultImage] = useState(true);

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
      console.log("TA INDO ALGO", image);

      const { data } = await axios.post(
        `/api/upload?email=${session?.user?.email}`,
        formData
      );

      console.log("Image uploaded:", data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="flex flex-row items-center text-center gap-3 mb-4">
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
      <h1>{session?.user?.name}'s Profile</h1>
      {showDefaultImage && (
        <div>
          <Image
            src={session?.user?.image}
            height={200}
            width={200}
            alt="Imagem"
          />
        </div>
      )}
      {image && (
        <div>
          <Image
            src={URL.createObjectURL(image)}
            alt="Imagem selecionada"
            height={200}
            width={200}
          />
        </div>
      )}
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p style={{ cursor: "pointer" }}>Selecionar Foto</p>
          </div>
        )}
      </Dropzone>
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
}
