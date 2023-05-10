const express = require('express')
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

/*  - Query params => meusite.com/users?name=rodolfo&age=28 //FILTROS
    - Route params => /users/2      //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
    - Request Body => { "name": "Rodolfo", "age"}

    - GET => Buscar informacao no back end
    - POST => Criar informacao no back end
    - PUT/PATCH => Alterar/atualizar informacao no back end
    - DELETE => Deletar informacao no back end

    - Middlewares => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição.
*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex( user => user.id === id)

    if(index < 0){
        return response.status(404).json({message: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}


app.get('/users', (request, response) => {

    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age} = request.body
    
    const user = { id:uuid.v4(), name, age }

    users.push(user)
    return response.status(201).json(users)
})

app.put('/users/:id', checkUserId, (request, response) => {
   
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser
    
    return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    
    const index = request.userIndex

    users.splice(index,1)

    return response.status(204).json()
})


app.listen(port, () =>{
    console.log(`Server started on port ${port}`)
})


/*
//depois de fazer a aplicacao acima, precisa rodar o programa. Para isso tem que ir no terminal
//abaixo e digitar: node index.js
//toda vez que fizer uma alteracao, precisa parar o terminal digitando: control C e depois
//roda novamente digitando: node index.js
//
*/