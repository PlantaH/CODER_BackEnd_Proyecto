const express = require('express')
const contenedor_items = require("./api/items.js")
const file_items = new contenedor_items('./api/items.txt')

const administrator = true

const { Router } = express

const PORT = 8080 || process.env.PORT;

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


/************************************************************************************************** */
validateFieldId = (req,res,next) => {    
    if ( !(Number.isInteger(Number(req.params.id))) ) 
         res.status(500).send('{ "error" : "el campo debe ser numerico"}')
    else     
        next()
}

validateFieldEmpty = (req,res,next) => {        
    if ( !(file_items.getById(req.params.id)) ) 
         res.status(500).send('{ "error" : "producto no encontrado"}')
    else     
        next()
}

validateBodyId = (req,res,next) => {    
    if ( !(Number.isInteger(Number(req.body.id))) ) 
         res.status(500).send('{ "error" : "el campo debe ser numerico"}')
    else     
        next()
}
/************************************************************************************************** */

/************************************************************************************************** */
const productos = Router() 

// POST ------------> OK
productos.post('/', (req, res) => {  
    if (administrator){   
        let item =  file_items.save(req.body)
        
        if (!item) 
            res.status(500).send('{ "error" : "error de grabacion"}')
        else
            res.status(200).send('{ "id" : ' + item + ', "sucess" : "sucess"}')  
    }else{
        res.status(500).send('{ "error" : "-1", "descripcion" : "ruta productos, método post no autorizada" }')
    }
})

// http://localhost:8080/productos/ ------------> OK
productos.get('/', (req, res) => {  
    res.send(file_items.getAll())
})

// http://localhost:8080/productos/1 ------------> OK
productos.get('/:id', validateFieldId,  (req, res) => {   
    res.send(file_items.getById(req.params.id))
})

// http://localhost:8080/productos/1
productos.delete('/:id', validateFieldId, (req, res) => {  
    if (administrator){
        if ( file_items.deleteById(req.params.id) )
            res.status(200).send('{ "sucess" : "sucess"}')
        else
            res.status(500).send('{ "error" : "producto no encontrado"}')
    }else{
        res.status(500).send('{ "error" : "-1", "descripcion" : "ruta productos, método delete no autorizada" }')
    }
  
})

// http://localhost:8080/productos/1
productos.put('/:id', validateFieldId, (req, res) => {   
    if (administrator){      
        if ( file_items.change(req.params.id, req.body) )
            res.status(200).send('{ "id" : "' + req.params.id + '", "sucess" : "sucess"}')
        else
            res.status(500).send('{ "error" : "error de grabacion"}')
    }else{
        res.status(500).send('{ "error" : "-1", "descripcion" : "ruta productos, método delete no autorizada" }')
    }
})



app.use('/productos', productos) 
/************************************************************************************************** */

/************************************************************************************************** */
const carrito = Router() 

// http://localhost:8080/carrito/
carrito.get('/', (req, res) => {  
    res.send(file_items.getAll())
})

app.use('/carrito', carrito) 

/************************************************************************************************** */
//app.use('/static', express.static('public')) //define donde esta los arch estaticos
 

const server = app.listen(PORT, () => {
    console.log(`Index.js http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))