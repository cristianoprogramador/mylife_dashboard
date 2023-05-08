import multer from "multer";

// Configuração do armazenamento em disco
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Verifica se o arquivo enviado é uma imagem
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Arquivo enviado não é uma imagem."));
  }
};

const upload = multer({
  storage,
  fileFilter,
}).single("image");

export default (req, res) => {
  // Lida com a requisição POST
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
    // Se o upload for bem-sucedido, retorna o caminho da imagem salva no servidor
    return res.status(200).send(`/uploads/${req.file.filename}`);
  });
};
