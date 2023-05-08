type ProfileProps = {
  onGoBackClick: () => void;
};

export default function Profile(props: ProfileProps) {
  const { onGoBackClick } = props;

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
    </div>
  );
}
