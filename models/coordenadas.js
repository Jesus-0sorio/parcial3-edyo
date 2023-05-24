import { Schema, model } from 'mongoose'

const coordenadasSchema = Schema({
  x: {
    type: Number,
  },
  y: {
    type: Number,
  },
  pedido_id: {
    type: Schema.Types.ObjectId,
    ref: 'pedidos'
  }
})

export default model('coordenadas', coordenadasSchema)