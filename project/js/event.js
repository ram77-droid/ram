var event= require('events');
var ee=new event.EventEmitter();
var handler=function (){
	console.log("i anm developer");
}
ee.on('d',handler);
ee.emit('d');