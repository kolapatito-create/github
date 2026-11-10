/* =====================================================
   script.js - Lógica del formulario de inicio de sesión
   ===================================================== */

/* ---------- 1. Referencias a elementos del DOM ---------- */
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const togglePassword = document.getElementById("toggle-password");
const rememberCheck = document.getElementById("remember");
const forgotLink = document.getElementById("forgot");
const messageBox = document.getElementById("message");

/* ---------- 2. Credenciales de demostración ----------
   IMPORTANTE: esta validación es EXCLUSIVAMENTE DIDÁCTICA.
   Guardar y comparar credenciales en el código del navegador NO es seguro:
   cualquier persona puede verlas. En un sistema real, la autenticación
   se realiza en un servidor, con contraseñas cifradas (hash). */
const DEMO_EMAIL = "demo@ejemplo.com";
const DEMO_PASSWORD = "Demo1234!";

/* Clave para guardar SOLO el correo (nunca la contraseña) */
const STORAGE_KEY = "correoRecordado";

/* Expresión regular sencilla para validar el formato del correo */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- 3. Funciones auxiliares ---------- */

// Muestra un error debajo del campo y lo marca visualmente
function showError(input, errorEl, text) {
  errorEl.textContent = text;
  input.classList.add("invalid");
  input.setAttribute("aria-invalid", "true");
}

// Limpia el error de un campo
function clearError(input, errorEl) {
  errorEl.textContent = "";
  input.classList.remove("invalid");
  input.removeAttribute("aria-invalid");
}

// Muestra un mensaje general (tipo: "ok", "fail" o "info")
function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
  messageBox.hidden = false;
}

// Oculta el mensaje general
function hideMessage() {
  messageBox.hidden = true;
  messageBox.textContent = "";
}

/* ---------- 4. Validaciones ---------- */

// Devuelve true si el correo es válido
function validateEmail() {
  const value = emailInput.value.trim();

  if (value === "") {
    showError(emailInput, emailError, "El correo electrónico es obligatorio.");
    return false;
  }
  if (!EMAIL_REGEX.test(value)) {
    showError(emailInput, emailError, "Ingresa un correo válido (ejemplo: nombre@dominio.com).");
    return false;
  }
  clearError(emailInput, emailError);
  return true;
}

// Devuelve true si la contraseña es válida
function validatePassword() {
  const value = passwordInput.value;

  if (value === "") {
    showError(passwordInput, passwordError, "La contraseña es obligatoria.");
    return false;
  }
  if (value.length < 8) {
    showError(passwordInput, passwordError, "La contraseña debe tener al menos 8 caracteres.");
    return false;
  }
  clearError(passwordInput, passwordError);
  return true;
}

/* ---------- 5. Eventos ---------- */

// Mostrar u ocultar la contraseña
togglePassword.addEventListener("click", function () {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
  togglePassword.setAttribute("aria-pressed", String(isHidden));
});

// Validar al salir de cada campo (mejor experiencia de usuario)
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

// Quitar el error mientras el usuario corrige
emailInput.addEventListener("input", function () {
  if (emailInput.classList.contains("invalid")) validateEmail();
});
passwordInput.addEventListener("input", function () {
  if (passwordInput.classList.contains("invalid")) validatePassword();
});

// Enlace "¿Olvidaste tu contraseña?" (solo demostrativo)
forgotLink.addEventListener("click", function (event) {
  event.preventDefault(); // evita que la página salte al inicio
  showMessage("Función de recuperación no disponible en esta demostración.", "info");
});

// Envío del formulario
form.addEventListener("submit", function (event) {
  event.preventDefault(); // evita recargar la página
  hideMessage();

  // Ejecutamos ambas validaciones (sin cortar en la primera para mostrar todos los errores)
  const emailOk = validateEmail();
  const passwordOk = validatePassword();

  // Si hay errores, se detiene el envío y se enfoca el primer campo con problema
  if (!emailOk || !passwordOk) {
    (!emailOk ? emailInput : passwordInput).focus();
    return;
  }

  // Datos válidos: guardar o borrar el correo recordado (NUNCA la contraseña)
  if (rememberCheck.checked) {
    localStorage.setItem(STORAGE_KEY, emailInput.value.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Autenticación simulada (solo didáctica)
  const emailCoincide = emailInput.value.trim().toLowerCase() === DEMO_EMAIL;
  const passwordCoincide = passwordInput.value === DEMO_PASSWORD;

  if (emailCoincide && passwordCoincide) {
    showMessage("¡Bienvenido! Has iniciado sesión correctamente.", "ok");
  } else {
    showMessage("Credenciales incorrectas. Verifica tu correo y contraseña.", "fail");
  }
});

/* ---------- 6. Al cargar la página: recuperar el correo guardado ---------- */
(function loadRememberedEmail() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    emailInput.value = saved;
    rememberCheck.checked = true;
  }
})();
