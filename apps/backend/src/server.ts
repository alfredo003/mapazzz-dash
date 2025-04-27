import express from "express";
import cors from "cors"
import routes from "./routes";
const PORT = process.env.PORT || 2000;

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', routes);

app.listen(PORT,()=>{
    console.log(`Server running , PORT = ${PORT}`);
});