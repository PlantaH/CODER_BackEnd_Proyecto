 

const fs = require('fs');
const { isExternal } = require('util/types');

 
/*CLASES*/
 class cart{
    constructor() {
        this.id = 0;
        this.timestamp = ''; 
        this.productos = null;
    }
}

module.exports =  class contenedor_cart{
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

        const newObj = { ...obj, id: newId, timestamp: new Date().toLocaleString(), productos: [] }       
        objs.push(newObj)
 
        try {
            fs.writeFileSync(this.fileName, JSON.stringify(objs, null, 2))
           
            data =  newId    

        } catch (error) {
            data =  null     
        }

        return data 
    }
     
    addItem(id,obj){  
        
        let data = null
        
        try {                             
            let objs = JSON.parse(   fs.readFileSync(this.fileName,'utf-8')   )  

            if(objs.filter(e => e.id == id) != 0) {
                objs.map(function(dato){
                    if(dato.id == id){
                        const items = dato.productos
                        items.push(obj)
                        dato.productos = items
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

    getCart(id){  
        
        let data =  [] 
        
        try {                             
            let objs = JSON.parse(   fs.readFileSync(this.fileName,'utf-8')   )  

            if(objs.filter(e => e.id == id) != 0) {
                objs.map(function(dato){
                    if(dato.id == id){
                       data = dato.productos
                    }   
                });
                   
            }          
        } catch (err) {
            data =  []     
        }

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

    deleteByItemId(id, itemId){
        let data = null
        
        try {                             
            let objs = JSON.parse(   fs.readFileSync(this.fileName,'utf-8')   )  

            if(objs.filter(e => e.id == id) != 0) {
                objs.map(function(dato){
                    if(dato.id == id){ 
                        const items = dato.productos
                        const newItems = []
                        
                        items.map(function(ite){                                
                            ite.map(function(c){
                                if (c.id != itemId) newItems.push(ite);
                            }) 
                        })      
                        
                        dato.productos = newItems

                        data =  true 
                    }   
                });

 
                fs.writeFileSync(this.fileName, JSON.stringify(objs, null, 2))
                    
                  
            }          
        } catch (err) {
            data =  null     
        }

        return data  
    }
}
/*FIN CLASES*/
 