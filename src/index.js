import "./style.css"

const algorithms = {
  substitution: require ('./substitution.js'),
  nomenclator: require ('./nomenclator.js'),
  aes_cbc: require ('./aes_cbc.js'),
}

var output
var error

function encrypt(key, textarea, select) {
  let option = select.selectedOptions[0];
  console.log('encrypting algorithm:', option.value);
  output.value = ''
  error.innerHTML = ''
  let alg = algorithms[option.value];
  try {
    if (alg) {
      let algout = alg.encrypt(key.value, textarea.value)
      if(algout instanceof Promise) {
        algout
          .then((v) => {
            output.value = v
          })
          .catch((e) => {
            error.innerHTML = e.message
          })
      } else {
        output.value = algout
      }
    } else{
      console.error('no algorithm defined:', option.value);
    }
  } catch(err) {
    error.innerHTML = err.message
  }
}

function decrypt(key, textarea, select) {
  let option = select.selectedOptions[0];
  console.log('decrypting algorithm:', option.value);
  output.value = ''
  error.innerHTML = ''
  let alg = algorithms[option.value];
  try {
    if (alg) {
      let algout = alg.decrypt(key.value, textarea.value)
      if(algout instanceof Promise) {
        algout
        .then((v) => {
          output.value = v
        })
        .catch(e => {
          error.innerHTML = e.message
        })
      } else {
        output.value = algout
      }
    }else {
      console.error('no algorithm defined:', option.value);
    }
  } catch(err) {
    error.innerHTML = err.message
  }
}

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  var root = document.createElement('div');
  document.body.appendChild(root);

  // Create Key Label and input
  var box = document.createElement('div');
  root.appendChild(box);
  var label = document.createElement('label');
  label.append('Key:')
  box.appendChild(label);
  box = document.createElement('div');
  root.appendChild(box);
  var key = document.createElement('input')
  key.type = 'text'
  box.appendChild(key);

  // Create Text Label and input
  box = document.createElement('div');
  root.appendChild(box);
  label = document.createElement('label');
  label.append('Text:')
  box.appendChild(label);
  box = document.createElement('div');
  root.appendChild(box);
  var text = document.createElement('textarea')
  text.cols = 80
  text.rows = 10
  box.appendChild(text);

  // Create Algorithm Selector
  box = document.createElement('div');
  root.appendChild(box);
  label = document.createElement('label');
  label.append('Algorithm:')
  box.appendChild(label);
  box = document.createElement('div');
  root.appendChild(box);
  var algorithm = document.createElement('select')
  var option = document.createElement('option')
  option.append('Substitution Cipher')
  option.value = 'substitution'
  algorithm.appendChild(option)
  option = document.createElement('option')
  option.append('Nomenclator Cipher')
  option.value = 'nomenclator'
  algorithm.appendChild(option)
  option = document.createElement('option')
  option.append('AES Cipher')  // Advanced Encryption Standard
  option.value = 'aes_cbc'
  algorithm.appendChild(option)
  box.appendChild(algorithm);

  //Create Encrypt and Decrypt Functions
  box = document.createElement('div');
  root.appendChild(box);
  label = document.createElement('label');
  box.appendChild(label);
  box = document.createElement('div');
  root.appendChild(box);
  var value = document.createElement('input')
  value.type = 'button'
  value.value = 'Encrypt'
  box.appendChild(value);
  value.addEventListener('click', (event) => {
    encrypt(key, text, algorithm)
  })
  value = document.createElement('input')
  value.type = 'button'
  value.value = 'Decrypt'
  box.appendChild(value);
  value.addEventListener('click', (event) => {
    decrypt(key, text, algorithm)
  })
  error = document.createElement('div');
  root.appendChild(error);
  error.className = 'error'

  // Create Output
  box = document.createElement('div');
  root.appendChild(box);
  label = document.createElement('label');
  label.append('Output:')
  box.appendChild(label);
  box = document.createElement('div');
  root.appendChild(box);
  output = document.createElement('textarea')
  output.cols = 80
  output.rows = 10
  output.readOnly = true
  box.appendChild(output);

});
