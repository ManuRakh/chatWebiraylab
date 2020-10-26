//===========================Объявление глобальных переменных и библиотек========================================
var express = 			require('express');
var app = 				express();
var server = 			require('http').createServer(app);
var io = 				require('socket.io').listen(server);
io.rooms = []

bodyParser = 			require('body-parser'),
						require("./routes")(app, __dirname); //находится в папке routes в файле index.js
						app.use(bodyParser.json())
						app.use(bodyParser.urlencoded({ extended: true }))
const rooms_functions = require("./main_functions/rooms.js"); 
//===========================Конец объявления========================================

// Отслеживание порта
server.listen(3000, console.log("чат для сервера запущен")); //к примеру для входа используется localhost:3000
//===========================******************========================================

//Глобальные Массивы со всеми подключениями

try{
	workWithSockets(); //основная серверная часть со всеми операциями
}
catch(exception)
{
	console.log("error" + exception);
}
//===========================******************========================================

function workWithSockets()
{
// Событие подключения к серверу
	io.sockets.on('connection', function(socket) {
		// слушатель события "новый пользователь"
		rooms_functions.addUser(socket, io);
	//===========================******************========================================
		// слушатель события "создание комнаты"
		rooms_functions.createRoom(socket);
	//===========================******************========================================
		// слушатель события "удаление комнаты"
		rooms_functions.deleteRoom(socket);
		//===========================******************========================================
		// слушатель события "смена комнаты"
		rooms_functions.switchRoom(socket, io);
		//===========================******************========================================
		// // слушатель события "передача сообщения на сервер"
		rooms_functions.toServerMess(socket, io);
		//===========================******************========================================
		// слушатель события "отключение"
		rooms_functions.disconnect(socket);
		//===========================******************========================================
		//слушатель события - получить все диалоги
		rooms_functions.get_all_conversations(socket, io)
	});
}
