import { Schema, model } from 'mongoose'

const PedidosSchema = Schema({
  fecha: {
    type: Date,
  }
})

export default model('pedidos', PedidosSchema)