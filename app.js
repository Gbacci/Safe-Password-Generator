function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('passwordSettings')) || {};
  if (settings.length) document.getElementById('length').value = settings.length;
  if (typeof settings.includeLower === 'boolean') document.getElementById('includeLower').checked = settings.includeLower;
  if (typeof settings.includeUpper === 'boolean') document.getElementById('includeUpper').checked = settings.includeUpper;
  if (typeof settings.includeNumbers === 'boolean') document.getElementById('includeNumbers').checked = settings.includeNumbers;
  if (typeof settings.includeSpecial === 'boolean') document.getElementById('includeSpecial').checked = settings.includeSpecial;
}

function saveSettings() {
  const settings = {
    length: document.getElementById('length').value,
    includeLower: document.getElementById('includeLower').checked,
    includeUpper: document.getElementById('includeUpper').checked,
    includeNumbers: document.getElementById('includeNumbers').checked,
    includeSpecial: document.getElementById('includeSpecial').checked
  };
  localStorage.setItem('passwordSettings', JSON.stringify(settings));
}

function generatePassword() {
  const length = parseInt(document.getElementById('length').value);
  if (isNaN(length) || length < 1 || length > 100) {
    alert('Comprimento inválido! Escolha entre 1 e 100.');
    return;
  }
  const includeLower = document.getElementById('includeLower').checked;
  const includeUpper = document.getElementById('includeUpper').checked;
  const includeNumbers = document.getElementById('includeNumbers').checked;
  const includeSpecial = document.getElementById('includeSpecial').checked;

  if (!includeLower && !includeUpper && !includeNumbers && !includeSpecial) {
    alert('Selecione ao menos uma opção de caractere!');
    return;
  }

  saveSettings();

  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?/~`-=';
  let possibleChars = '';
  if (includeLower) possibleChars += lowerChars;
  if (includeUpper) possibleChars += upperChars;
  if (includeNumbers) possibleChars += numberChars;
  if (includeSpecial) possibleChars += specialChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = window.crypto.getRandomValues(new Uint32Array(1))[0] % possibleChars.length;
    password += possibleChars.charAt(randomIndex);
  }

  document.getElementById('passwordOutput').value = password;
}

function copyPassword() {
  const passwordField = document.getElementById('passwordOutput');
  if (!passwordField.value) return;
  const copyBtn = document.getElementById('copyBtn');
  const originalText = copyBtn.textContent;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(passwordField.value)
      .then(() => {
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
      })
      .catch(err => { alert('Erro ao copiar senha: ' + err); });
  } else {
    passwordField.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
  }
}

function checkOptions() {
  const generateBtn = document.getElementById('generateBtn');
  const lower = document.getElementById('includeLower').checked;
  const upper = document.getElementById('includeUpper').checked;
  const numbers = document.getElementById('includeNumbers').checked;
  const special = document.getElementById('includeSpecial').checked;
  const enable = lower || upper || numbers || special;
  generateBtn.disabled = !enable;
  generateBtn.style.backgroundColor = enable ? '#007BFF' : 'gray';
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  checkOptions();
  document.getElementById('generateBtn').addEventListener('click', generatePassword);
  document.getElementById('copyBtn').addEventListener('click', copyPassword);
  document.getElementById('includeLower').addEventListener('change', checkOptions);
  document.getElementById('includeUpper').addEventListener('change', checkOptions);
  document.getElementById('includeNumbers').addEventListener('change', checkOptions);
  document.getElementById('includeSpecial').addEventListener('change', checkOptions);
});
