import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRouter from "./handlers/userHandler";
import productRouter from "./handlers/productHandler";
import orderRouter from "./handlers/orderHandler";
import orderProductRouter from "./handlers/orderProductHandler";


const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())
// Routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/order-products", orderProductRouter);

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

export default app;