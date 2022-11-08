import { deepStrictEqual as same } from 'assert'
import { create, load } from 'prolly-trees/map'
import * as codec from '@ipld/dag-cbor'
import { sha256 as hasher } from 'multiformats/hashes/sha2'
import { nocache, global as globalCache } from 'prolly-trees/cache'
import { bf, simpleCompare as compare } from 'prolly-trees/utils'
import Transaction from 'car-transaction'
import { AbstractLevel } from 'abstract-level'

const chunker = bf(3)

const cache = nocache

const prolly_opts = { cache, chunker, codec, hasher }

const storage = ({ cache, getBlock, car }) => {
  const transaction = Transaction.create()
  if (cache === true) {
    cache = globalCache
  } else if (cache === false) {
    cache = nocache
  }
  const getMany = (keys, options, callback) => {
  }
  const batch = (ops, options, callback) => {
  }
  const iterator (options) => {
    const {
      gt, lt, reverse, limit,
      keys, values
    } = options

    cosnt iter = new AbstractIterator()
    iter.next = async () => {
    }
  }
  return { getMany, batch, iterator }
}
class RedwoodLevel {
  constructor ({ root, getBlock, cache, ...options }) {
    const encodings = { utf8: true }
    super({ encodings }, options)
    this._store = storage({ root, getBlock, cache })
    this._get = (key, options, callback) => {
      return this._getMany([ key ], options, (e, arr) => {
        if (e) return callback(e)
        const [ result ] = arr
        callback(null, result)
      })
    }
    this._put = (key, value, options, callback) => {
      return this._batch([{ type: 'put', key, value }], options, callback)
    }
    this._batch = this._store.batch
    this._getMany = this._store.getMany
    this._iterator = this._store.iterator
  }
  static async fromCar (car, options) {
    const { root, get } = await Transaction.load(car)
    return new this({ root, getBlock: get, ...options })
  }
}

