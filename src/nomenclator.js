let codepoints = [
  0x1f40c,
  0x1F40D,
  0x1f40e,
  0x1f411,
  0x1F412,
  0x1F414,
  0x1F417,
  0x1F418,
  0x1F419,
  0x1F41A,
  0x1F41B,
  0x1F41C,
  0x1F41D,
  0x1F41E,
  0x1F41F,
  0x1F420,
  0x1F421,
  0x1F422,
  0x1F423,
  0x1F424,
  0x1F425,
  0x1F426,
  0x1F427,
  0x1F428,
  0x1F429,
  0x1F42B,
  0x1F42C,
  0x1F42D,
  0x1F42E,
  0x1F42F,
  0x1F430,
  0x1F431,
  0x1F432,
  0x1F433,
  0x1F434,
  0x1F435,
  0x1F436,
  0x1F437,
  0x1F438,
  0x1F439,
  0x1F43A,
  0x1F43B,
  0x1F43C,
  0x1F43D,
  0x1F43E,
  0x1F440,
  0x1F442,
  0x1F443,
  0x1F444,
  0x1F445,
  0x1F446,
  0x1F447,
  0x1F448,
  0x1F449,
  0x1F44A,
  0x1F44B,
  0x1F44C,
  0x1F44D,
  0x1F44E,
  0x1F44F,
  0x1F450,
  0x1F451,
  0x1F452,
  0x1F453,
  0x1F454,
  0x1F455,
  0x1F456,
  0x1F457,
  0x1F458,
  0x1F459,
  0x1F45A,
  0x1F45B,
  0x1F45C,
  0x1F45D,
  0x1F45E,
  0x1F45F,
  0x1F460,
  0x1F461,
  0x1F462,
  0x1F463,
  0x1F464,
  0x1F466,
  0x1F467,
  0x1F468,
  0x1F469,
  0x1F46A,
  0x1F46B,
  0x1F46E,
  0x1F46F,
  0x1F470,
  0x1F471,
  0x1F472,
  0x1F473,
  0x1F474,
  0x1F475,
  0x1F476,
  0x1F477,
  0x1F478,
  0x1F479,
  0x1F47A,
  0x1F47B
]

function encrypt (key, text) {
  console.log('nomenclator encrypting:', text)
  var distance = parseInt(key);
  if (isNaN(distance) || distance == 0) {
    console.error('invalid key:', key);
    throw new Error('invalid key: must be an integer');
  }
  console.log('string has n characters:', text.length);
  var len = text.length
  if (len==0){
    throw new Error('invalid text: must not be empty')
  }
  var out = []
  for (let i=0; i<len; i++) {
    let char = text.charCodeAt(i)
    let newchar = char + distance
    while(newchar < 32) {
      newchar = newchar - 31 + 126
    }
    while(newchar > 126) {
      newchar = newchar - 127 + 32
    }
    newchar = newchar - 32
    out.push(codepoints[newchar]);
  }
  return String.fromCodePoint.apply(null, out)
}

function decrypt (key, text) {
  console.log('nomenclator decrypting:', text)
  var distance = parseInt(key);
  if (isNaN(distance) || distance == 0) {
    console.error('invalid key:', key);
    throw new Error('invalid key: must be an integer');
  }
  console.log('string has n characters:', text.length);
  var len = text.length
  if (len==0){
    throw new Error('invalid text: must not be empty')
  }
  var out = []
  // NB: Our expected codepoints are all 2 16-bit characters, so we increment
  // NB: by 2 and always assume that is what the user gave us.  The findIndex
  // NB: below will enforce we actually have valid codepoints in our check always
  for (let i=0; i<len; i+=2) {
    let cp = text.codePointAt(i)
    console.log('['+i+']: 0x'+(new Number(cp).toString(16))+' ('+cp+')')
    let char = codepoints.findIndex(e => e == cp)
    if (char == -1){
      console.error('invalid input at character:', i, new Number(cp).toString(16));
      throw new Error('invalid text: invalid character');
    }
    char = char + 32 - distance
    while(char < 32) {
      char = char - 31 + 126
    }
    while(char > 126) {
      char = char - 127 + 32
    }
    out.push(char)
  }
  return String.fromCharCode.apply(null, out);
}

module.exports = {
  encrypt,
  decrypt
}
