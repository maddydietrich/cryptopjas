
function helper(distance, text) {
  if (isNaN(distance) || distance == 0) {
    console.error('invalid key:', distance);
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
    out.push(newchar)
  }
  return String.fromCharCode.apply(null, out)
}

function encrypt (key, text) {
  console.log('substitution encrypting:', text)
  var distance = parseInt(key);
  return helper(distance, text)
}

function decrypt (key, text) {
  console.log('substitution decrypting:', text)
  var distance = parseInt(key);
  return helper(-distance, text)
}

module.exports = {
  encrypt,
  decrypt
}
