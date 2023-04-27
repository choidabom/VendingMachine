import express, { Request, Response } from "express";
const app = express();

type Data = {
    name: string;
    age: number;
    url: string;
};

const sendData: Data = {
    name: "name",
    age: 10,
    url: "tistory.com",
};

const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send(sendData);
});

app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
});