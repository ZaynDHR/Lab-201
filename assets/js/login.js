import { supabase } from './supabase.js';

// Si déjà connecté → rediriger vers dashboard
const { data: { session } } = await supabase.auth.getSession();
if (session) window.location.href = 'dashboard.html';

const btnLogin = document.getElementById('btn-login');
const errorMsg = document.getElementById('error-msg');

btnLogin.addEventListener('click', async () => {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    errorMsg.textContent = 'Veuillez remplir tous les champs.';
    errorMsg.classList.add('visible');
    return;
  }

  btnLogin.textContent = 'Connexion...';
  btnLogin.disabled = true;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    errorMsg.textContent = 'Email ou mot de passe incorrect.';
    errorMsg.classList.add('visible');
    btnLogin.textContent = 'Accéder →';
    btnLogin.disabled = false;
  } else {
    window.location.href = 'dashboard.html';
  }
});

// Login avec la touche Entrée
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnLogin.click();
});