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
app.listen(PORT, () => {
    // 3000번 포트로 웹 서버 실행 
    console.log(`Server started. Listen on port ${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
    res.send(`sendData: ${sendData.age}, ${sendData.name}, ${sendData.url}`);
});

// 클라이언트에서 HTTP 요청 메소드 GET 방식으로 'host:3000/customer'를 호출했을 때
app.get("/customer", (req: Request, res: Response) => {
    res.send("get 요청에 대한 응답");
});

// 클라이언트에서 HTTP 요청 메소드 POST 방식으로 'host:3000/customer'를 호출했을 때
app.post("/customer", (req: Request, res: Response) => {
    res.send("post 요청에 대한 응답");
})


