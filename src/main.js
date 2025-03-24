const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const morgan = require('morgan');
// app.use(express.static(path.join(__dirname, 'src', 'public')));


const app = express();
const port = 3000;

// HTTP logger
app.use(morgan('combined'));

// Cấu hình Handlebars
app.engine('hbs', engine({ 
  extname: '.hbs',  
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'resources', 'views', 'layouts') // Đường dẫn thư mục layouts
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Route
app.get('/', (req, res) => {
  res.render('home'); 
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
