import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import express from "express"
import fs from "fs"
import zlib from "zlib"

// Streams allow you to read data from a source or write data to a destination in a continuous flow. 
// They are particularly useful for handling large amounts of data, such as files etc.

//put data chunks in buffer and also send it to the browser at the same time!
//memory consumption of server wont spike up!

const app = express()
const PORT = process.env.PORT
console.log("port no ==> ", PORT)

app.get("/", (req, res) => {
    ////////// read and load on ram
    fs.readFile("./sample.txt", "utf-8", (err, data) => {
        if (err) return res.end("error")
        console.log("data ==>", data)
        //res.status(200).json(data)
        //res.end(data) //end:Ends the response process without sending any data (or just a string if provided).
        res.send(data)//Sends a response with any type of data — string, buffer, object, or array.
        // problem :send after loading the data in server memory
    })
})

app.get("/stream", (req, res) => {

    ///////////////////////////////////////////////// read in utf-8 format
    const stream = fs.createReadStream("./sample.txt", "utf-8")

    ///////////as son as data comes write in frontend
    stream.on("data", chunk => res.write(chunk))

    //end when things are finished
    stream.on("end", () => res.end())

})

console.log("zip==>")

// pipe() is a method used to connect readable and writable streams,
// allowing (stream of chunks/chunks) of data to flow between them — usually used for things like file copying, compression, HTTP streaming, etc.
// syntax : readableStream.pipe(writableStream);
////// read not load
fs.createReadStream("./sample.txt").pipe(
    zlib.createGzip() // compresses the stream on-the-fly
        .pipe(fs.createWriteStream("./zip.zip")) //save compress stream here
)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT} port no!`)
})


