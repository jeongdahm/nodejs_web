
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3030);
app.set('stylesheets', __dirname + '/stylesheets');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

//app.use(express.static(path.join(__dirname, 'html')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


///////////////////////
var mysql = require('mysql');
var dbConfig={
host:'',
port:'',
user:'',
password:'',
database:'test'
};
// cd, name, price(int), memo
var connection = mysql.createConnection(dbConfig);
connection.connect(function(err){
if(err){
console.log('error connecting:'+err.stack);
return;
}
console.log('connected as id'+connection.threadId);

});;
///////////////////////

//app.get('/', routes.index);
//app.get('/users', user.list);

//책 리스트 
app.get('/books',function(req,res){
	var select ='select cd, name, price, memo from na_test';
	
	console.log(select);
	
	connection.query(select, function(err,results){//쿼리 select의 err와 결과값 
		if(err){
			console.error('select Error',err);
		}else{
			//res.send(results);
			console.log(results);
			res.render(path.join(__dirname+'/html/index.html'),{title:'Books',books:results});
		}
	});
	
	});
//책 추가 화면
app.get('/books/add',function(req,res){
	console.log("/books/add");
	res.render(path.join(__dirname+'/html/add.html'),{title:'Book추가'}); 
		
});
//책 추가기능 
app.post('/books/add',function(req,res){
	console.log("/books/add");
	
	console.log(req);
	var insert = 'insert into na_test (name, price, memo) values(?,?,?)';
	
	connection.query(insert,[req.body.name,req.body.price,req.body.memo],
			function(err,results){//id가 넘어온다. 
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/books");
		}
	});
	
});
	
//책 상세 
app.get('/books/:id',function(req,res){
	console.log("/books/:id");
	var select = 'select  cd, name, price, memo from na_test where cd=?';
	connection.query(select,[req.params.id] ,function(err,results){
		if(err){
			console.error('select Error',err);
		}else{
			if(results.length >0){
				console.log(results);
				res.render(path.join(__dirname+'/html/detail.html'),{title:'Book상세',book:results}); //results를 movies로 내려줌 
			}
			
		}
		
	});
	
});
//책 수정 
app.post('/books/update',function(req,res){
	var update = 'update na_test set memo=?, price=?, name=? where cd=?;';
	connection.query(update,[req.body.memo,req.body.price,req.body.name,Number(req.body.cd)],
			function(err,result){
		if(err){console.log(err);}
		else{
			res.redirect('/books/'+req.body.cd);
		}
	});
});
//책 삭제 
app.delete('/books/:id',function(req,res){
	console.log(req);
	var del ='delete from na_test where cd=?;'
		connection.query(del,[req.params.id] ,function(err,results){
			if(err){
				console.log(err);
			}else{
				res.redirect("/books");
				
			}
		});

});

var fs = require('fs');




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
