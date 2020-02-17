const digits = [
   65,  66,  67,  68,  69,  70,  71,  72,  73,  74,
   75,  76,  77,  78,  79,  80,  81,  82,  83,  84,
   85,  86,  87,  88,  89,  90,
   97,  98,  99, 100, 101, 102, 103, 104, 105, 106,
  107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
  117, 118, 119, 120, 121, 122,
   48,  49,  50,  51,  52,  53,  54,  55,  56,  57,
   43,  47
]

const revdigits = (() => {
  let a = new Uint8Array(128)
  for(let i=0;i<128;i++) {
    a[i] = 0xff
  }
  for(let i=0;i<64;i++) {
    a[digits[i]] = i
  }
  a[61] = 0
  return a
})()

function ui8tob64(ui8a) {
  let l = ui8a.length
  let olen = Math.ceil(l/ 3) * 4
  let obuf = new Uint16Array(olen)
	let i
  for(i = 0; l >= 3; i++, l-=3) {
    obuf[i*4+0] = digits[ui8a[i*3] >> 2]
    obuf[i*4+1] = digits[((ui8a[i*3] & 0x03) << 4) | (ui8a[i*3+1] >> 4)]
    obuf[i*4+2] = digits[((ui8a[i*3+1] & 0x0F) << 2) | (ui8a[i*3+2] >> 6)]
    obuf[i*4+3] = digits[ui8a[i*3+2] & 0x3F]
	}
	if (l == 1) {
    obuf[i*4+0] = digits[ui8a[i*3] >> 2]
    obuf[i*4+1] = digits[((ui8a[i*3] & 0x03) << 4)]
    obuf[i*4+2] = 61
    obuf[i*4+3] = 61
	} else if (l == 2) {
    obuf[i*4+0] = digits[ui8a[i*3] >> 2]
    obuf[i*4+1] = digits[((ui8a[i*3] & 0x03) << 4) | (ui8a[i*3+1] >> 4)]
    obuf[i*4+2] = digits[((ui8a[i*3+1] & 0x0F) << 2)]
    obuf[i*4+3] = 61
	}
	return String.fromCharCode.apply(null, obuf);
}

function b64toui8(b64) {
  let ibuf = new TextEncoder().encode(b64)
  let l = ibuf.length
  let olen = Math.ceil(l / 4) * 3
  let pad = 0
  let obuf = new Uint8Array(olen)
  let rd = ibuf.map(x => {
    if(x > 127) {
      throw new Error('Invalid Base64 Character: '+x)
    }
    let o = revdigits[x]
    if(o == 0xff) {
      throw new Error('Invalid Base64 Character: '+String.fromCharCode(x))
    }
    if(x == 61) {
      pad++
    }
    return o
  })
  for(let i = 0; l>=4; i++, l-=4) {
    obuf[i*3+0] = (rd[i*4+0] << 2) | (rd[i*4+1] >> 4)
    obuf[i*3+1] = ((rd[i*4+1] & 0xf) << 4) | (rd[i*4+2] >> 2)
    obuf[i*3+2] = ((rd[i*4+2] & 0x3) <<6) | (rd[i*4+3])
  }
  if(pad > 0){
    obuf = obuf.slice(0, olen - pad)
  }
  return obuf
}

module.exports = {
  ui8tob64,
  b64toui8
}
