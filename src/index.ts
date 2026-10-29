import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, (error?: Error) => {
  if (error) throw error;
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
