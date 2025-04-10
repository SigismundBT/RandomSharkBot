const express = require('express');
const app = express();

app.get('/',(req, res) => {
  res.send('All good.');
});

function keepAlive(){
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () =>{
    console.log('Server is ready.')
  })
}

module.exports = keepAlive