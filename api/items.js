 

const fs = require('fs')

 
/*CLASES*/
 class product{
    constructor(nombre,descripcion,codigo,foto,precio,stock) {
        this.id = 0;
        this.nombre = nombre;
        this.descripcion = descripcion; 
        this.codigo = codigo; 
        this.precio = precio;  
        this.foto  = foto;    
        this.stock = stock;     
        this.timestamp = '';     
    }
}

module.exports =  class contenedor{
    constructor(fileName) {
        this.fileName = fileName;         
    }
    
    getAll(){
        let data = ''   
        
        try {          
            let items = fs.readFileSync(this.fileName,'utf-8')    
            data = JSON.parse(items)
        } catch (err) {
            data = []
        }
        
        return data  
    }
    
    save(obj){  
        let data = null

        const objs = this.getAll()
        
        let newId
        if (objs.length == 0) {
            newId = 1
        } else {         
            newId = objs[objs.length - 1].id + 1
        }

        const newObj = { ...obj, id: newId, timestamp: new Date().toLocaleString() }       
        objs.push(newObj)

        try {
            fs.writeFileSync(this.fileName, JSON.stringify(objs, null, 2))
           
            data =  newId    

        } catch (error) {
            data =  null     
        }

        return data 
    }
    
    change(id,obj){  
        
        let data = null
        
        try {                             
            let objs = JSON.parse(   fs.readFileSync(this.fileName,'utf-8')   )  

            if(objs.filter(e => e.id == id) != 0) {
                objs.map(function(dato){
                    if(dato.id == id){
                        dato.nombre = obj.nombre;
                        dato.descripcion = obj.descripcion;
                        dato.codigo = obj.codigo;
                        dato.precio = obj.precio;
                        dato.stock = obj.stock;
                        dato.foto  = obj.foto ;
                    }   
                });
                
                
                fs.writeFileSync(this.fileName, JSON.stringify(objs, null, 2))
                    
                data =  true   
            }          
        } catch (err) {
            data =  null     
        }

        return data  
    }
 
    getById(id){
        let data = []
       
        let items = fs.readFileSync(this.fileName,'utf-8')    
        let filtrar =  JSON.parse(items)
       
  
        if(filtrar.filter(e => e.id == id) != 0)  data = filtrar.filter(e => e.id == id)       
        return data  
    }
 
    deleteById(id){
        let data = null  
            
        try {
           
            let items = fs.readFileSync(this.fileName,'utf-8')
           
            let borrar = JSON.parse(items)
            if(borrar.filter(e => e.id == id) != 0)  {                     

                let items = borrar.filter(e => e.id != id)                 
                
                fs.writeFileSync(this.fileName, JSON.stringify(items, null, 2))                    

                data = true
            }
        } catch (err) {
            data = false
        }
        
        return data  
    }

   
}
/*FIN CLASES*/
 