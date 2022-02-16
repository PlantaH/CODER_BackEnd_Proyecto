const express = require('express')
const contenedor_items = require("./api/items.js")
const file_items = new contenedor_items('./api/items.txt')

const contenedor_cart = require("./api/cart.js")
const file_cart = new contenedor_cart('./api/cart.txt') 

const administrator = true

const { Router } = express

const PORT = 8080 || process.env.PORT;

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

 


/************************************************************************************************** */
const validateFieldId = (req,res,next) => {    
    if ( !(Number.isInteger(Number(req.params.id))) ) 
         res.status(500).send('{ "error" : "el campo debe ser numerico"}')
    else     
        next()
}

const validateFieldEmpty = (req,res,next) => {        
    if ( !(file_items.getById(req.params.id)) ) 
         res.status(500).send('{ "error" : "producto no encontrado"}')
    else     
        next()
}

const validateBodyId = (req,res,next) => {    
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
        res.status(403).send('{ "error" : "-1", "descripcion" : "ruta productos, método post no autorizada" }')
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
        res.status(403).send('{ "error" : "-1", "descripcion" : "ruta productos, método delete no autorizada" }')
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
        res.status(403).send('{ "error" : "-1", "descripcion" : "ruta productos, método delete no autorizada" }')
    }
})



app.use('/productos', productos) 
/************************************************************************************************** */

/************************************************************************************************** */
const carrito = Router() 

// http://localhost:8080/carrito/
carrito.post('/', (req, res) => {  
       
    let item =  file_cart.save()
    
    if (!item) 
        res.status(500).send('{ "error" : "error de grabacion"}')
    else
        res.status(200).send('{ "id" : ' + item + ', "sucess" : "sucess"}')  
    
})

// http://localhost:8080/carrito/1/productos
carrito.get('/:id/productos', (req, res) => {  
    
   res.status(200).send(file_cart.getCart(req.params.id))

    
})


// http://localhost:8080/carrito/1/productos
carrito.post('/:id/productos', (req, res) => {  
    
    const itemData = file_items.getById(req.body.itemID) 

    if (itemData.length>0){
        let item =  file_cart.addItem(req.params.id, itemData)

        if (!item) 
            res.status(500).send('{ "error" : "error de grabacion"}')
        else
            res.status(200).send('{ "id" : ' + item + ', "sucess" : "sucess"}')     
    } else {
        res.status(500).send('{ "error" : "no existe el producto"}')
    }
    
})

// http://localhost:8080/carrito/1
carrito.delete('/:id', validateFieldId, (req, res) => {  
    if ( file_cart.deleteById(req.params.id) )
        res.status(200).send('{ "sucess" : "sucess"}')
    else
        res.status(500).send('{ "error" : "carrito no encontrado"}')
})

// http://localhost:8080/carrito/1
carrito.delete('/:id/productos/:id_prod', validateFieldId, (req, res) => {      
    if ( file_cart.deleteByItemId(req.params.id, req.params.id_prod) )
        res.status(200).send('{ "sucess" : "sucess"}')
    else
        res.status(500).send('{ "error" : "carrito no encontrado"}')
})


app.use('/carrito', carrito) 

app.get('*', (req, res) => {    
    res.status(404).send({ "error" : "-2", "descripcion" : "Ruta " + req.url + " metodo " + req.method + " no implementado" })
});

/************************************************************************************************** */
//app.use('/static', express.static('public')) //define donde esta los arch estaticos
 

const server = app.listen(PORT, () => {
    console.log(`Index.js http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))