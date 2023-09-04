import express from 'express';
// Routers for routes
import { userRouter } from "./userRouter.js"
import { staticDataRouter } from "./staticDataRouter.js"
import { otherDataRouter } from "./otherDataRouter.js"
import { commandsRouter } from "./commandRouter.js"
import { createRouter } from "./createRouter.js"
import { editRouter } from "./editRouter.js"
import { deleteRouter } from "./deleteRouter.js"

const Router = express.Router()


// http://localhost:8200/api/user
Router.use('/user', userRouter)
// http://localhost:8200/api/static-data/
Router.use('/static-data', staticDataRouter)
// http://localhost:8200/api/other-data/
Router.use('/other-data', otherDataRouter) 
// http://localhost:8200/api/commands
Router.use('/commands', commandsRouter)
// http://localhost:8200/api/create/
Router.use('/create', createRouter)  
// http://localhost:8200/api/edit/
Router.use('/edit', editRouter) 
// http://localhost:8200/api/delete/
Router.use('/delete', deleteRouter) 

export { Router }
