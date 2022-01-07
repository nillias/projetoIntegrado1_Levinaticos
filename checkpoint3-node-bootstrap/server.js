//importa configurações iniciais 
import app from "./config.js"
//importa as rotas
import home from "./routes/home.js";
import cadastro from "./routes/user/cadastro.js";
import login from "./routes/login.js";
import perfil from "./routes/user/perfil.js";

//agrupa todas as rotas em uma rota raiz
app.use('/', home, cadastro, login, perfil);

