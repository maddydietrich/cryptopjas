const mybase64 = require('./base64.js')

function encrypt (key, text) {
  return new Promise((resolve, reject) => {
    console.log ('aes_cbc encrypting', text)
    console.log ('BASE64:', mybase64.ui8tob64(new TextEncoder().encode(text)))
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
      .then((kd) => {
        crypto.subtle.importKey('raw', kd.slice(0,16), {name:'AES-CBC'}, false, ['encrypt'])
          .then((ckey) => {
            console.log('imported key:', ckey)
            let encoded = new TextEncoder().encode(text);
            let iv = crypto.getRandomValues(new Uint8Array(16));
            console.log('iv:', iv)
            crypto.subtle.encrypt({name:'AES-CBC', iv}, ckey, encoded)
              .then((enc) => {
                console.log('encrypt returned:', enc)
                let ivout = mybase64.ui8tob64(iv)
                console.log('iv as base64:', ivout)
                let out = mybase64.ui8tob64(new Uint8Array(enc))
                console.log('enc as base64:', out)
                resolve(ivout + '.' + out)
              })
              .catch((e) => {
                console.log ('error from encryption', e)
                reject(e)
              })
          })
          .catch((e) => {
            console.log ('error from key import', e)
            reject(e)
          })
      })
      .catch((e) => {
        console.log ('error from key digest', e)
        reject(e)
      })
  })
}

function decrypt (key, text) {
  return new Promise((resolve, reject) => {
    console.log ('aes_cbc decrypting', text)
    let encval = text.split('.')
    console.log ('un base64 iv:', String.fromCharCode.apply(null, mybase64.b64toui8(encval[0])))
    console.log ('un base64 enc:', String.fromCharCode.apply(null, mybase64.b64toui8(encval[1])))
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
      .then((kd) => {
        crypto.subtle.importKey('raw', kd.slice(0,16), {name:'AES-CBC'}, false, ['decrypt'])
          .then((ckey) => {
            console.log('imported key:', ckey)
            let iv = mybase64.b64toui8(encval[0])
            console.log('iv Length:', iv.length)
            let enc = mybase64.b64toui8(encval[1])
            crypto.subtle.decrypt({name:'AES-CBC', iv}, ckey, enc)
              .then((encoded) => {
                let out = new TextDecoder().decode(encoded)
                console.log ('decrypt:', out)
                resolve(out)
              })
              .catch((e) => {
                console.log ('error from decrypt', e)
                reject(e)
              })
          })
          .catch((e) => {
            console.log ('error from key import', e)
            reject(e)
          })
      })
      .catch((e) => {
        console.log ('error from key digest', e)
        reject(e)
      })
    })
}

module.exports = {
  encrypt,
  decrypt
}
