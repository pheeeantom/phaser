const http = require("http");
const fs = require("fs");

http.createServer(function(request,response){
     
    console.log(`Запрошенный адрес: ${request.url}`);
    // получаем путь после слеша
    let filePath = request.url.substr(1);
    if (!filePath) {
    	filePath = "index.html";
    }
    fs.readFile(filePath, function(error, data){
              
        if(error){
                  
            response.statusCode = 404;
            response.end("Resourse not found!");
        }   
        else{
            response.end(data);
        }
    });
     
}).listen(3000, "127.0.0.1",function(){
    console.log("Сервер начал прослушивание запросов на порту 3000");
});