/* ============================================================
   DONATIONS APP — MODALS, FORMS & CRUD
   Depends on donations.js + donations-ui.js. Reuses openConfirm,
   openModal/closeModal, nextId, esc globals.
   ============================================================ */

/* ---- option builders ---- */
function renderDonCatOptions(selected) {
  return DON.categories.map(c =>
    `<option value="${c.id}" data-kind="${c.kind}" ${c.id === selected ? 'selected' : ''}>${esc((c.icon || '') + ' ' + tData(c.name))}${c.kind === 'kind' ? ' — ' + window.t('don_kind') : ''}</option>`).join('');
}
function renderDonorOptions(selected) {
  return `<option value="">— ${window.t('don_select_donor')} —</option>` +
    DON.donors.slice().sort((a, b) => donorName(a).localeCompare(donorName(b))).map(d =>
      `<option value="${d.id}" ${d.id === selected ? 'selected' : ''}>${esc(donorName(d))}${d.mobile ? ' · ' + esc(d.mobile) : ''} · ${esc(donorTypeLabel(d))}</option>`).join('');
}

/* ---- toggles ---- */
function onDonationCategoryChange() {
  const sel = document.getElementById('donFieldCategory');
  const opt = sel.options[sel.selectedIndex];
  const kind = opt && opt.getAttribute('data-kind') === 'kind';
  document.getElementById('donCashFields').hidden = kind;
  document.getElementById('donKindFields').hidden = !kind;
  const mode = document.getElementById('donFieldMode');
  if (kind) { mode.value = 'In-Kind'; }
  else if (mode.value === 'In-Kind') { mode.value = 'Cash'; }
}
function onDonorSelectChange() {
  const d = donorById(document.getElementById('donFieldDonor').value);
  const hint = document.getElementById('donDonorHint');
  const comm = document.getElementById('donFieldCommittee');
  if (d) {
    hint.innerHTML = `${esc(donorTypeLabel(d))}${d.city ? ' · ' + esc(tData(d.city)) : ''}${d.pan ? ' · PAN ' + esc(d.pan) : ' · ' + window.t('don_no_pan')}`;
    if (comm && !comm.value.trim() && d.committee) comm.value = d.committee;
  } else {
    hint.innerHTML = '';
  }
}

/* ------------------------------------------------------------
   RECORD / EDIT DONATION
   ------------------------------------------------------------ */
function openRecordDonation(donorId) {
  DON.editingDonationId = null;
  document.getElementById('donationFormTitle').textContent = window.t('don_record');
  document.getElementById('donationFormSubmitBtn').textContent = window.t('don_save_receipt');
  const f = document.getElementById('formDonation');
  if (!f) return;
  f.reset();
  document.getElementById('donFieldCategory').innerHTML = renderDonCatOptions('DCT-001');
  document.getElementById('donFieldDonor').innerHTML = renderDonorOptions(donorId || '');
  document.getElementById('donFieldDate').value = donToday();
  document.getElementById('donFieldStatus').value = 'received';
  document.getElementById('donFieldMode').value = 'Cash';
  document.getElementById('donDonorHint').innerHTML = '';
  onDonationCategoryChange();
  onDonorSelectChange();
  openModal('modalDonation');
}

function openEditDonation(id) {
  const x = donationById(id);
  if (!x) return;
  DON.editingDonationId = id;
  document.getElementById('donationFormTitle').textContent = window.t('don_edit');
  document.getElementById('donationFormSubmitBtn').textContent = window.t('save');
  document.getElementById('donFieldCategory').innerHTML = renderDonCatOptions(x.categoryId);
  document.getElementById('donFieldDonor').innerHTML = renderDonorOptions(x.donorId);
  document.getElementById('donFieldMode').value = x.mode || 'Cash';
  document.getElementById('donFieldAmount').value = x.amount || '';
  document.getElementById('donFieldItem').value = x.item || '';
  document.getElementById('donFieldQty').value = x.qty || '';
  document.getElementById('donFieldValuation').value = x.valuation || '';
  document.getElementById('donFieldDate').value = x.date || donToday();
  document.getElementById('donFieldStatus').value = x.status || 'received';
  document.getElementById('donFieldCommittee').value = x.committee || '';
  document.getElementById('donFieldPurpose').value = x.purpose || '';
  document.getElementById('donFieldNotes').value = x.notes || '';
  onDonationCategoryChange();
  onDonorSelectChange();
  openModal('modalDonation');
}

function handleSaveDonation(e) {
  e.preventDefault();
  const categoryId = document.getElementById('donFieldCategory').value;
  const donorId = document.getElementById('donFieldDonor').value;
  const c = donCatById(categoryId);
  const kind = c && c.kind === 'kind';

  if (!donorId) { donToast(window.t('don_pick_donor')); return; }
  if (!categoryId) { donToast(window.t('don_pick_category')); return; }

  const amount = parseInt(document.getElementById('donFieldAmount').value, 10);
  const valuation = parseInt(document.getElementById('donFieldValuation').value, 10);
  const item = document.getElementById('donFieldItem').value.trim();

  if (kind) {
    if (!item) { donToast(window.t('don_need_item')); return; }
    if (!valuation || valuation < 0) { donToast(window.t('don_need_value')); return; }
  } else {
    if (!amount || amount < 1) { donToast(window.t('don_need_amount')); return; }
  }

  const payload = {
    donorId, categoryId,
    mode: kind ? 'In-Kind' : document.getElementById('donFieldMode').value,
    amount: kind ? 0 : amount,
    item: kind ? item : '',
    qty: kind ? document.getElementById('donFieldQty').value.trim() : '',
    valuation: kind ? valuation : 0,
    date: document.getElementById('donFieldDate').value || donToday(),
    status: document.getElementById('donFieldStatus').value,
    committee: document.getElementById('donFieldCommittee').value.trim(),
    purpose: document.getElementById('donFieldPurpose').value.trim(),
    notes: document.getElementById('donFieldNotes').value.trim()
  };

  let saved;
  if (DON.editingDonationId) {
    saved = donationById(DON.editingDonationId);
    Object.assign(saved, payload);
    donToast(window.t('don_updated'));
  } else {
    saved = Object.assign({
      id: nextId('DON', DON.donations, 3),
      receiptNo: nextReceiptNo(), certNo: '', certificateIssued: false,
      recordedBy: (typeof MG !== 'undefined' && MG.session ? MG.session.userName : 'Administrator')
    }, payload);
    DON.donations.unshift(saved);
    donToast(window.t('don_saved') + ' — ' + saved.receiptNo);
  }

  DON.editingDonationId = null;
  closeModal('modalDonation');
  renderDonations();
  if (saved.status === 'received') openDonationReceipt(saved.id);
}

function confirmDeleteDonation(id) {
  const x = donationById(id);
  if (!x) return;
  openConfirm({
    title: window.t('don_delete_title'),
    danger: true,
    body: `<p>${window.t('don_delete_body')} <strong>${esc(x.receiptNo)}</strong> — ${esc(donationGiven(x))}?</p>`,
    confirmLabel: window.t('delete'),
    onConfirm: () => {
      DON.donations = DON.donations.filter(d => d.id !== id);
      donToast(window.t('don_deleted'));
      renderDonations();
    }
  });
}

/* ------------------------------------------------------------
   DONOR REGISTRY
   ------------------------------------------------------------ */
let _donorReturnTo = null;

function onDonorTypeChange() {
  const t = document.getElementById('donorFieldType').value;
  document.getElementById('donorIndividualFields').hidden = (t !== 'individual');
  document.getElementById('donorOrgFields').hidden = (t === 'individual');
}

function openAddDonor(returnTo) {
  _donorReturnTo = returnTo || null;
  DON.editingDonorId = null;
  document.getElementById('donorFormTitle').textContent = window.t('don_add_donor');
  document.getElementById('donorFormSubmitBtn').textContent = window.t('don_add_donor');
  document.getElementById('formDonor').reset();
  document.getElementById('donorFieldType').value = 'individual';
  document.getElementById('donorFieldState').value = 'Gujarat';
  document.getElementById('donorExistingHint').innerHTML = '';
  onDonorTypeChange();
  openModal('modalDonor');
}

function openEditDonor(id, returnTo) {
  const d = donorById(id);
  if (!d) return;
  _donorReturnTo = returnTo || 'directory';
  DON.editingDonorId = id;
  document.getElementById('donorFormTitle').textContent = window.t('don_edit_donor');
  document.getElementById('donorFormSubmitBtn').textContent = window.t('save');
  document.getElementById('donorFieldType').value = d.type || 'individual';
  document.getElementById('donorFieldFirst').value = d.firstName || '';
  document.getElementById('donorFieldLast').value = d.lastName || '';
  document.getElementById('donorFieldOrg').value = d.orgName || '';
  document.getElementById('donorFieldContact').value = d.contactPerson || '';
  document.getElementById('donorFieldMobile').value = d.mobile || '';
  document.getElementById('donorFieldPan').value = d.pan || '';
  document.getElementById('donorFieldCity').value = d.city || '';
  document.getElementById('donorFieldState').value = d.state || '';
  document.getElementById('donorFieldCommittee').value = d.committee || '';
  document.getElementById('donorFieldNotes').value = d.notes || '';
  document.getElementById('donorExistingHint').innerHTML = '';
  onDonorTypeChange();
  openModal('modalDonor');
}

function checkExistingDonor() {
  const mobile = document.getElementById('donorFieldMobile').value.trim();
  const hint = document.getElementById('donorExistingHint');
  if (!hint || DON.editingDonorId) return;
  if (mobile.length < 10) { hint.innerHTML = ''; return; }
  const found = DON.donors.find(d => d.mobile === mobile);
  if (!found) { hint.innerHTML = ''; return; }
  hint.innerHTML = `<div class="mg-note-box mg-warn">⚠ ${window.t('don_donor_exists')}: <strong>${esc(donorName(found))}</strong> (${esc(found.id)}). ${window.t('don_edit_instead')}</div>`;
}

function handleSaveDonor(e) {
  e.preventDefault();
  const type = document.getElementById('donorFieldType').value;
  const first = document.getElementById('donorFieldFirst').value.trim();
  const last = document.getElementById('donorFieldLast').value.trim();
  const org = document.getElementById('donorFieldOrg').value.trim();
  const contact = document.getElementById('donorFieldContact').value.trim();
  const mobile = document.getElementById('donorFieldMobile').value.replace(/\D/g, '').slice(0, 10);
  const pan = document.getElementById('donorFieldPan').value.trim().toUpperCase();
  const city = document.getElementById('donorFieldCity').value.trim();
  const state = document.getElementById('donorFieldState').value.trim();
  const committee = document.getElementById('donorFieldCommittee').value.trim();
  const notes = document.getElementById('donorFieldNotes').value.trim();

  if (type === 'individual') {
    if (!first || !last) { donToast(window.t('don_need_name')); return; }
  } else if (!org) { donToast(window.t('don_need_org')); return; }
  if (!/^[0-9]{10}$/.test(mobile)) { donToast(window.t('don_need_mobile')); return; }
  if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) { donToast(window.t('don_bad_pan')); return; }

  const wasEditing = !!DON.editingDonorId;
  let saved;
  if (wasEditing) {
    saved = donorById(DON.editingDonorId);
    Object.assign(saved, { type, firstName: first, lastName: last, orgName: org, contactPerson: contact, mobile, pan, city, state, committee, notes });
    donToast(window.t('don_donor_updated'));
  } else {
    const dupe = DON.donors.find(d => d.mobile === mobile);
    if (dupe) { donToast(window.t('don_donor_exists') + ' — ' + donorName(dupe)); return; }
    saved = {
      id: nextId('DNR', DON.donors, 3), type,
      firstName: first, lastName: last, orgName: org, contactPerson: contact,
      mobile, pan, city, state, committee, notes, addedDate: donToday()
    };
    DON.donors.push(saved);
    donToast(window.t('don_donor_added') + ' — ' + donorName(saved));
  }

  DON.editingDonorId = null;
  const back = _donorReturnTo;
  _donorReturnTo = null;
  closeModal('modalDonor');

  if (back === 'donationForm') {
    const sel = document.getElementById('donFieldDonor');
    if (sel) { sel.innerHTML = renderDonorOptions(saved.id); onDonorSelectChange(); }
  } else if (back === 'profile' && DON.view === 'donor') {
    renderDonations();
  } else {
    renderDonations();
  }
}

function confirmDeleteDonor(id) {
  const d = donorById(id);
  if (!d) return;
  const used = donationsOfDonor(id).length;
  if (used) { donToast(window.t('don_donor_in_use').replace('{n}', used)); return; }
  openConfirm({
    title: window.t('don_delete_donor'),
    danger: true,
    body: `<p>${window.t('don_delete_donor_body')} <strong>${esc(donorName(d))}</strong>?</p>`,
    confirmLabel: window.t('delete'),
    onConfirm: () => {
      DON.donors = DON.donors.filter(x => x.id !== id);
      if (DON.activeDonorId === id) { DON.activeDonorId = null; DON.view = 'directory'; }
      donToast(window.t('don_donor_deleted'));
      renderDonations();
    }
  });
}

/* ------------------------------------------------------------
   DONATION CATEGORIES
   ------------------------------------------------------------ */
function openAddDonCategory() {
  DON.editingCatId = null;
  document.getElementById('donCatFormTitle').textContent = window.t('don_add_category');
  document.getElementById('donCatFormSubmitBtn').textContent = window.t('don_add_category');
  document.getElementById('formDonCategory').reset();
  openModal('modalDonCategory');
}
function openEditDonCategory(id) {
  const c = donCatById(id);
  if (!c) return;
  DON.editingCatId = id;
  document.getElementById('donCatFormTitle').textContent = window.t('don_edit_category');
  document.getElementById('donCatFormSubmitBtn').textContent = window.t('save');
  document.getElementById('donCatFieldName').value = c.name;
  document.getElementById('donCatFieldIcon').value = c.icon || '';
  document.getElementById('donCatFieldKind').value = c.kind;
  document.getElementById('donCatFieldDesc').value = c.description || '';
  openModal('modalDonCategory');
}
function handleSaveDonCategory(e) {
  e.preventDefault();
  const name = document.getElementById('donCatFieldName').value.trim();
  if (!name) { donToast(window.t('don_need_cat_name')); return; }
  const dupe = DON.categories.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== DON.editingCatId);
  if (dupe) { donToast(window.t('don_cat_exists')); return; }
  const payload = {
    name,
    icon: document.getElementById('donCatFieldIcon').value.trim() || (document.getElementById('donCatFieldKind').value === 'kind' ? '🎁' : '🪙'),
    kind: document.getElementById('donCatFieldKind').value,
    description: document.getElementById('donCatFieldDesc').value.trim()
  };
  if (DON.editingCatId) { Object.assign(donCatById(DON.editingCatId), payload); donToast(window.t('don_cat_updated')); }
  else { DON.categories.push(Object.assign({ id: nextId('DCT', DON.categories, 3) }, payload)); donToast(window.t('don_cat_added')); }
  DON.editingCatId = null;
  closeModal('modalDonCategory');
  renderDonations();
}
function confirmDeleteDonCategory(id) {
  const c = donCatById(id);
  if (!c) return;
  const used = DON.donations.filter(x => x.categoryId === id).length;
  if (used) { donToast(window.t('don_cat_in_use').replace('{n}', used)); return; }
  openConfirm({
    title: window.t('don_delete_category'),
    danger: true,
    body: `<p>${window.t('don_delete_cat_body')} <strong>${esc(tData(c.name))}</strong>?</p>`,
    confirmLabel: window.t('delete'),
    onConfirm: () => {
      DON.categories = DON.categories.filter(x => x.id !== id);
      donToast(window.t('don_cat_deleted'));
      renderDonations();
    }
  });
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('donationsRoot')) return;
  renderDonations();
  if (typeof onLanguageChange === 'function') onLanguageChange(() => renderDonations());
});
