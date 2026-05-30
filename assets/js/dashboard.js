import { supabase } from '../../assets/js/supabase.js';

// ─── AUTH GUARD ───────────────────────────────────────────
const { data: { session } } = await supabase.auth.getSession();
if (!session) window.location.href = 'index.html';

// Afficher l'email de l'admin connecté
document.getElementById('nav-user').textContent = session.user.email;

// Déconnexion
document.getElementById('btn-logout').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

// ─── ÉLÉMENTS DOM ─────────────────────────────────────────
const concertsBody  = document.getElementById('concerts-body');
const modalOverlay  = document.getElementById('modal-overlay');
const modalTitle    = document.getElementById('modal-title');
const btnAdd        = document.getElementById('btn-add');
const btnSave       = document.getElementById('btn-save');
const btnCancel     = document.getElementById('btn-cancel');
const modalClose    = document.getElementById('modal-close');
const toast         = document.getElementById('toast');

const inputId       = document.getElementById('concert-id');
const inputDate     = document.getElementById('input-date');
const inputVille    = document.getElementById('input-ville');
const inputPays     = document.getElementById('input-pays');
const inputLieu     = document.getElementById('input-lieu');
const inputSoldout  = document.getElementById('input-soldout');

// ─── TOAST ────────────────────────────────────────────────
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── FORMAT DATE ──────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

// ─── CHARGER LES CONCERTS ─────────────────────────────────
async function loadConcerts() {
  const { data, error } = await supabase
    .from('concerts')
    .select('*')
    .order('date_concert', { ascending: true });

  if (error) {
    concertsBody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>Erreur de chargement</p></div></td></tr>`;
    return;
  }

  if (!data.length) {
    concertsBody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><p>Aucune date ajoutée</p></div></td></tr>`;
    return;
  }

  concertsBody.innerHTML = data.map(c => `
    <tr>
      <td>${formatDate(c.date_concert)}</td>
      <td>${c.ville}</td>
      <td>${c.pays}</td>
      <td>${c.lieu}</td>
      <td>
        ${c.sold_out
          ? '<span class="sold-out-badge">Sold-out</span>'
          : '<span class="available-badge">Disponible</span>'
        }
      </td>
      <td>
        <div class="td-actions">
          <button class="btn-secondary" onclick="editConcert('${c.id}')">Modifier</button>
          <button class="btn-danger" onclick="deleteConcert('${c.id}')">Supprimer</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── OUVRIR MODAL ─────────────────────────────────────────
function openModal() {
  modalOverlay.classList.add('open');
}

function closeModal() {
  modalOverlay.classList.remove('open');
  resetForm();
}

function resetForm() {
  inputId.value      = '';
  inputDate.value    = '';
  inputVille.value   = '';
  inputPays.value    = '';
  inputLieu.value    = '';
  inputSoldout.checked = false;
  modalTitle.textContent = 'Ajouter une date';
}

// ─── AJOUTER ──────────────────────────────────────────────
btnAdd.addEventListener('click', () => {
  resetForm();
  openModal();
});

// ─── MODIFIER ─────────────────────────────────────────────
window.editConcert = async (id) => {
  const { data, error } = await supabase
    .from('concerts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) { showToast('Erreur lors du chargement.'); return; }

  inputId.value        = data.id;
  inputDate.value      = data.date_concert;
  inputVille.value     = data.ville;
  inputPays.value      = data.pays;
  inputLieu.value      = data.lieu;
  inputSoldout.checked = data.sold_out;
  modalTitle.textContent = 'Modifier la date';

  openModal();
};

// ─── SUPPRIMER ────────────────────────────────────────────
window.deleteConcert = async (id) => {
  if (!confirm('Supprimer cette date ?')) return;

  const { error } = await supabase
    .from('concerts')
    .delete()
    .eq('id', id);

  if (error) {
    showToast('Erreur lors de la suppression.');
  } else {
    showToast('Date supprimée.');
    loadConcerts();
  }
};

// ─── ENREGISTRER (ajout ou modif) ─────────────────────────
btnSave.addEventListener('click', async () => {
  const id      = inputId.value;
  const payload = {
    date_concert : inputDate.value,
    ville        : inputVille.value.trim(),
    pays         : inputPays.value.trim(),
    lieu         : inputLieu.value.trim(),
    sold_out     : inputSoldout.checked,
  };

  if (!payload.date_concert || !payload.ville || !payload.pays || !payload.lieu) {
    showToast('Veuillez remplir tous les champs.');
    return;
  }

  btnSave.textContent = 'Enregistrement...';
  btnSave.disabled = true;

  let error;

  if (id) {
    // Modification
    ({ error } = await supabase.from('concerts').update(payload).eq('id', id));
  } else {
    // Ajout
    ({ error } = await supabase.from('concerts').insert(payload));
  }

  btnSave.textContent = 'Enregistrer';
  btnSave.disabled = false;

  if (error) {
    showToast('Erreur lors de l\'enregistrement.');
  } else {
    showToast(id ? 'Date modifiée ✓' : 'Date ajoutée ✓');
    closeModal();
    loadConcerts();
  }
});

// ─── FERMER MODAL ─────────────────────────────────────────
btnCancel.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ─── INIT ─────────────────────────────────────────────────
loadConcerts();