/* ============================================================
   COMMITTEE / SAMAJ — MODALS, FORMS & CRUD
   ============================================================ */

/* ---- committee ---- */
function cmtLeadOptions(sel) {
  return `<option value="">— ${window.t('cmt_select_leader', 'Select leader')} —</option>` +
    CMT.leaders.map(l => `<option value="${l.id}" ${l.id === sel ? 'selected' : ''}>${esc(l.name)} · ${esc(l.mobile)}</option>`).join('');
}
function cmtColorOptions(sel) {
  return CMT.palette.map(p => `<option value="${p.hex}" ${p.hex === sel ? 'selected' : ''}>${esc(p.name)}</option>`).join('');
}
function openAddCommittee() {
  if (!isCmtAdmin()) { cmtToast(window.t('cmt_admin_only', 'Only an administrator can do this.')); return; }
  CMT.editingCmtId = null;
  document.getElementById('committeeFormTitle').textContent = window.t('cmt_add', 'Add Committee');
  document.getElementById('committeeFormSubmitBtn').textContent = window.t('cmt_create', 'Create Committee');
  document.getElementById('formCommittee').reset();
  document.getElementById('cmtLeadSelect').innerHTML = cmtLeadOptions('');
  document.getElementById('cmtColorSelect').innerHTML = cmtColorOptions(CMT.palette[0].hex);
  document.getElementById('cmtFieldSize').value = 20;
  document.getElementById('cmtFieldStatus').value = 'active';
  openModal('modalCommittee');
}
function openEditCommittee(id) {
  const c = cmtById(id); if (!c || !isCmtAdmin()) { cmtToast(window.t('cmt_admin_only', 'Only an administrator can do this.')); return; }
  CMT.editingCmtId = id;
  document.getElementById('committeeFormTitle').textContent = window.t('cmt_edit', 'Edit Committee');
  document.getElementById('committeeFormSubmitBtn').textContent = window.t('save');
  document.getElementById('cmtLeadSelect').innerHTML = cmtLeadOptions(c.leaderId);
  document.getElementById('cmtColorSelect').innerHTML = cmtColorOptions(c.color);
  document.getElementById('cmtFieldName').value = c.name;
  document.getElementById('cmtFieldSamaj').value = c.samaj || '';
  document.getElementById('cmtFieldSize').value = c.expectedSize;
  document.getElementById('cmtFieldStatus').value = c.status;
  document.getElementById('cmtFieldPurpose').value = c.purpose;
  document.getElementById('cmtFieldNotes').value = c.notes || '';
  openModal('modalCommittee');
}
function handleSaveCommittee(e) {
  e.preventDefault();
  const name = document.getElementById('cmtFieldName').value.trim();
  const leaderId = document.getElementById('cmtLeadSelect').value;
  const size = parseInt(document.getElementById('cmtFieldSize').value, 10);
  const purpose = document.getElementById('cmtFieldPurpose').value.trim();
  if (!name) { cmtToast(window.t('cmt_need_name', 'Name is required.')); return; }
  if (!leaderId) { cmtToast(window.t('cmt_need_leader', 'Assign a leader.')); return; }
  if (!purpose) { cmtToast(window.t('cmt_need_purpose', 'Purpose is required.')); return; }
  const payload = {
    name, leaderId, expectedSize: size || 20, purpose,
    samaj: document.getElementById('cmtFieldSamaj').value.trim(),
    status: document.getElementById('cmtFieldStatus').value,
    color: document.getElementById('cmtColorSelect').value,
    notes: document.getElementById('cmtFieldNotes').value.trim()
  };
  if (CMT.editingCmtId) {
    Object.assign(cmtById(CMT.editingCmtId), payload);
    cmtLogActivity(CMT.editingCmtId, window.t('cmt_updated_by', 'Committee updated by') + ' ' + CMT.session.userName);
    cmtToast(name + ' — ' + window.t('save') + ' ✓');
  } else {
    const id = cmtNextId('CMT', CMT.committees, 3);
    CMT.committees.push(Object.assign({ id, createdDate: cmtToday() }, payload));
    CMT.communication.push({ committeeId: id, groupName:'', groupLink:'', broadcastName:'', broadcastLink:'' });
    cmtLogActivity(id, window.t('cmt_created', 'Committee created') + ' — ' + cmtLeadName(id));
    cmtToast(name + ' — ' + window.t('cmt_create', 'created'));
  }
  CMT.editingCmtId = null;
  closeModal('modalCommittee');
  populateCmtRoleOptions();
  renderCommittee();
}
function confirmDeleteCommittee(id) {
  const c = cmtById(id); if (!c || !isCmtAdmin()) return;
  openConfirm({
    title: window.t('cmt_delete', 'Delete Committee'), danger: true,
    body: `<p>${window.t('cmt_delete_body', 'This deletes the committee, its members, meetings and attendance.')}<br><strong>${esc(c.name)}</strong></p>`,
    confirmLabel: window.t('cmt_delete', 'Delete Committee'),
    onConfirm: () => {
      const mtgIds = CMT.meetings.filter(m => m.committeeId === id).map(m => m.id);
      CMT.attendance = CMT.attendance.filter(a => mtgIds.indexOf(a.meetingId) === -1);
      CMT.meetings = CMT.meetings.filter(m => m.committeeId !== id);
      CMT.members = CMT.members.filter(m => m.committeeId !== id);
      CMT.communication = CMT.communication.filter(x => x.committeeId !== id);
      CMT.drafts = CMT.drafts.filter(d => d.committeeId !== id);
      CMT.activity = CMT.activity.filter(a => a.committeeId !== id);
      CMT.committees = CMT.committees.filter(x => x.id !== id);
      if (CMT.activeCmtId === id) { CMT.activeCmtId = null; CMT.view = 'directory'; }
      populateCmtRoleOptions();
      cmtToast(c.name + ' ' + window.t('cmt_deleted', 'deleted'));
      renderCommittee();
    }
  });
}

/* ---- member ---- */
function openAddCmtMember(cid) {
  if (!canOpenCmt(cid)) { cmtToast(window.t('cmt_access_denied', 'Access denied.')); return; }
  CMT.editingMemberId = null; CMT.activeCmtId = cid;
  document.getElementById('cmtMemberFormTitle').textContent = window.t('cmt_add_member', 'Add Member');
  document.getElementById('cmtMemberFormSubmitBtn').textContent = window.t('cmt_add_member', 'Add Member');
  document.getElementById('cmtMemberFormCmt').textContent = cmtById(cid).name;
  document.getElementById('formCmtMember').reset();
  document.getElementById('cmmFieldState').value = 'Gujarat';
  document.getElementById('cmmFieldRole').value = 'Member';
  document.getElementById('cmmFieldStatus').value = 'active';
  document.getElementById('cmmExistingHint').innerHTML = '';
  openModal('modalCmtMember');
}
function openEditCmtMember(id) {
  const x = cmtMemberById(id); if (!x || !canOpenCmt(x.committeeId)) { cmtToast(window.t('cmt_access_denied', 'Access denied.')); return; }
  CMT.editingMemberId = id; CMT.activeCmtId = x.committeeId;
  document.getElementById('cmtMemberFormTitle').textContent = window.t('cmt_edit_member', 'Edit Member');
  document.getElementById('cmtMemberFormSubmitBtn').textContent = window.t('save');
  document.getElementById('cmtMemberFormCmt').textContent = cmtById(x.committeeId).name;
  document.getElementById('cmmFieldFirst').value = x.firstName;
  document.getElementById('cmmFieldLast').value = x.lastName;
  document.getElementById('cmmFieldMobile').value = x.mobile;
  document.getElementById('cmmFieldCity').value = x.city || '';
  document.getElementById('cmmFieldState').value = x.state || '';
  document.getElementById('cmmFieldRole').value = x.role || 'Member';
  document.getElementById('cmmFieldStatus').value = x.status;
  document.getElementById('cmmFieldNotes').value = x.notes || '';
  document.getElementById('cmmExistingHint').innerHTML = '';
  openModal('modalCmtMember');
}
function checkExistingCmtMember() {
  const mobile = document.getElementById('cmmFieldMobile').value.trim();
  const hint = document.getElementById('cmmExistingHint');
  if (!hint || CMT.editingMemberId || mobile.length < 10) { if (hint) hint.innerHTML = ''; return; }
  const found = CMT.members.find(m => m.mobile === mobile);
  if (!found) { hint.innerHTML = ''; return; }
  const already = CMT.members.some(m => m.mobile === mobile && m.committeeId === CMT.activeCmtId);
  if (already) hint.innerHTML = `<div class="mg-note-box mg-warn">⚠ ${esc(cmtMemberName(found))} ${window.t('cmt_already_member', 'is already on this committee.')}</div>`;
  else {
    hint.innerHTML = `<div class="mg-note-box">✓ ${window.t('cmt_existing_devotee', 'Existing devotee')} <strong>${esc(found.devoteeId)}</strong> — ${window.t('cmt_will_link', 'will be linked, not duplicated.')}</div>`;
    document.getElementById('cmmFieldFirst').value = found.firstName;
    document.getElementById('cmmFieldLast').value = found.lastName;
    document.getElementById('cmmFieldCity').value = found.city || '';
    document.getElementById('cmmFieldState').value = found.state || '';
  }
}
function handleSaveCmtMember(e) {
  e.preventDefault();
  const cid = CMT.editingMemberId ? cmtMemberById(CMT.editingMemberId).committeeId : CMT.activeCmtId;
  const first = document.getElementById('cmmFieldFirst').value.trim();
  const last = document.getElementById('cmmFieldLast').value.trim();
  const mobile = document.getElementById('cmmFieldMobile').value.trim();
  if (!first || !last) { cmtToast(window.t('cmt_need_member_name', 'First and last name are required.')); return; }
  if (!/^[0-9]{10}$/.test(mobile)) { cmtToast(window.t('cmt_need_mobile', 'Mobile must be 10 digits.')); return; }
  const fields = {
    firstName: first, lastName: last, mobile,
    city: document.getElementById('cmmFieldCity').value.trim(),
    state: document.getElementById('cmmFieldState').value.trim(),
    role: document.getElementById('cmmFieldRole').value.trim() || 'Member',
    status: document.getElementById('cmmFieldStatus').value,
    notes: document.getElementById('cmmFieldNotes').value.trim()
  };
  if (CMT.editingMemberId) {
    Object.assign(cmtMemberById(CMT.editingMemberId), fields);
    cmtToast(first + ' ' + last + ' — ' + window.t('save') + ' ✓');
  } else {
    if (CMT.members.some(m => m.mobile === mobile && m.committeeId === cid)) { cmtToast(window.t('cmt_already_member', 'already on this committee.')); return; }
    const existing = CMT.members.find(m => m.mobile === mobile);
    const devoteeId = existing ? existing.devoteeId : cmtNextId('DEV', CMT.members.map(m => ({ id: m.devoteeId })), 3);
    const id = cmtNextId('CMM', CMT.members, 3);
    CMT.members.push(Object.assign({ id, committeeId: cid, devoteeId, joinedDate: cmtToday() }, fields));
    cmtLogActivity(cid, first + ' ' + last + ' ' + window.t('cmt_added_word', 'added'));
    cmtToast(first + ' ' + last + ' ' + window.t('cmt_added_word', 'added'));
  }
  CMT.editingMemberId = null;
  closeModal('modalCmtMember');
  renderCommittee();
}
function toggleCmtMemberStatus(id) {
  const x = cmtMemberById(id); if (!x) return;
  if (x.status === 'active') {
    openConfirm({
      title: window.t('cmt_deactivate', 'Deactivate Member'),
      body: `<p>${window.t('cmt_deactivate_body', 'They stop appearing in new meetings but history is kept.')}<br><strong>${esc(cmtMemberName(x))}</strong></p>`,
      confirmLabel: window.t('cmt_deactivate', 'Deactivate'),
      onConfirm: () => { x.status = 'inactive'; cmtToast(cmtMemberName(x) + ' — ' + window.t('inactive').toLowerCase()); renderCommittee(); }
    });
  } else { x.status = 'active'; cmtToast(cmtMemberName(x) + ' — ' + window.t('active').toLowerCase()); renderCommittee(); }
}
function confirmRemoveCmtMember(id) {
  const x = cmtMemberById(id); if (!x) return;
  openConfirm({
    title: window.t('cmt_remove_member', 'Remove Member'), danger: true,
    body: `<p>${window.t('cmt_remove_body', 'Removes the committee assignment and its attendance rows. The devotee record is kept.')}<br><strong>${esc(cmtMemberName(x))}</strong></p>`,
    confirmLabel: window.t('remove'),
    onConfirm: () => {
      CMT.meetings.forEach(m => { m.memberIds = (m.memberIds || []).filter(i => i !== id); });
      CMT.attendance = CMT.attendance.filter(a => a.memberId !== id);
      CMT.members = CMT.members.filter(m => m.id !== id);
      if (CMT.activeMemberId === id) CMT.activeMemberId = null;
      cmtToast(cmtMemberName(x) + ' ' + window.t('cmt_removed', 'removed'));
      renderCommittee();
    }
  });
}

/* ---- meeting ---- */
function openScheduleMeeting(cid) {
  if (!canOpenCmt(cid)) { cmtToast(window.t('cmt_access_denied', 'Access denied.')); return; }
  CMT.editingMeetingId = null; CMT.activeCmtId = cid;
  document.getElementById('meetingFormTitle').textContent = window.t('cmt_schedule', 'Schedule Meeting');
  document.getElementById('meetingFormSubmitBtn').textContent = window.t('cmt_schedule', 'Schedule Meeting');
  document.getElementById('meetingFormCmt').textContent = cmtById(cid).name;
  document.getElementById('formMeeting').reset();
  document.getElementById('mtgFieldDate').value = cmtToday();
  document.getElementById('mtgFieldStart').value = '10:00';
  document.getElementById('mtgFieldEnd').value = '12:00';
  renderMeetingPicker(cid, cmtActiveOf(cid).map(m => m.id));
  openModal('modalMeeting');
}
function openEditMeeting(id) {
  const x = meetingById(id); if (!x || !canOpenCmt(x.committeeId)) { cmtToast(window.t('cmt_access_denied', 'Access denied.')); return; }
  CMT.editingMeetingId = id; CMT.activeCmtId = x.committeeId;
  document.getElementById('meetingFormTitle').textContent = window.t('cmt_edit_meeting', 'Edit Meeting');
  document.getElementById('meetingFormSubmitBtn').textContent = window.t('save');
  document.getElementById('meetingFormCmt').textContent = cmtById(x.committeeId).name;
  document.getElementById('mtgFieldTitle').value = x.title;
  document.getElementById('mtgFieldDate').value = x.date;
  document.getElementById('mtgFieldStart').value = x.startTime;
  document.getElementById('mtgFieldEnd').value = x.endTime;
  document.getElementById('mtgFieldVenue').value = x.venue || '';
  document.getElementById('mtgFieldAgenda').value = x.agenda || '';
  renderMeetingPicker(x.committeeId, x.memberIds || []);
  openModal('modalMeeting');
}
function renderMeetingPicker(cid, selected) {
  const box = document.getElementById('mtgMemberPicker');
  const list = cmtMembersOf(cid).filter(m => m.status === 'active' || selected.indexOf(m.id) !== -1);
  box.innerHTML = list.length ? list.map(m => `
    <label class="mg-pick ${selected.indexOf(m.id) !== -1 ? 'picked' : ''}">
      <input type="checkbox" class="cmt-mtg-check" value="${m.id}" ${selected.indexOf(m.id) !== -1 ? 'checked' : ''}
        onchange="this.closest('.mg-pick').classList.toggle('picked', this.checked)">
      <span class="mg-avatar">${esc((m.firstName[0] || '') + (m.lastName[0] || ''))}</span>
      <span class="mg-pick-body"><strong>${esc(cmtMemberName(m))}</strong><small>${esc(m.role || 'Member')} · ${esc(m.mobile)}</small></span>
    </label>`).join('') : `<div class="mg-pad-note">${window.t('cmt_no_active_members', 'No active members yet.')}</div>`;
}
function handleSaveMeeting(e) {
  e.preventDefault();
  const cid = CMT.editingMeetingId ? meetingById(CMT.editingMeetingId).committeeId : CMT.activeCmtId;
  const title = document.getElementById('mtgFieldTitle').value.trim();
  const date = document.getElementById('mtgFieldDate').value;
  const start = document.getElementById('mtgFieldStart').value;
  const end = document.getElementById('mtgFieldEnd').value;
  const memberIds = Array.from(document.querySelectorAll('.cmt-mtg-check:checked')).map(c => c.value);
  if (!title) { cmtToast(window.t('cmt_need_meeting_title', 'Meeting title is required.')); return; }
  if (!date || !start || !end) { cmtToast(window.t('cmt_need_datetime', 'Date and time are required.')); return; }
  if (end <= start) { cmtToast(window.t('cmt_end_after_start', 'End time must be after start time.')); return; }
  if (!memberIds.length) { cmtToast(window.t('cmt_pick_members', 'Invite at least one member.')); return; }
  const fields = { title, date, startTime: start, endTime: end,
    venue: document.getElementById('mtgFieldVenue').value.trim(),
    agenda: document.getElementById('mtgFieldAgenda').value.trim(), memberIds };
  if (CMT.editingMeetingId) {
    const x = meetingById(CMT.editingMeetingId);
    const dropped = (x.memberIds || []).filter(i => memberIds.indexOf(i) === -1);
    CMT.attendance = CMT.attendance.filter(a => !(a.meetingId === x.id && dropped.indexOf(a.memberId) !== -1));
    Object.assign(x, fields);
    cmtToast(window.t('cmt_meeting_updated', 'Meeting updated.'));
  } else {
    const id = cmtNextId('MTG', CMT.meetings, 3);
    CMT.meetings.push(Object.assign({ id, committeeId: cid, notes:'', completed:false }, fields));
    cmtLogActivity(cid, window.t('cmt_meeting_scheduled', 'Meeting scheduled') + ': ' + title + ' — ' + fmtDate(date));
    cmtToast(window.t('cmt_meeting_scheduled', 'Meeting scheduled') + '.');
  }
  CMT.editingMeetingId = null;
  const [y, m] = date.split('-').map(Number);
  CMT.calendarYear = y; CMT.calendarMonth = m - 1;
  closeModal('modalMeeting');
  renderCommittee();
}
function confirmDeleteMeeting(id) {
  const x = meetingById(id); if (!x) return;
  openConfirm({
    title: window.t('cmt_delete_meeting', 'Delete Meeting'), danger: true,
    body: `<p><strong>${esc(x.title)}</strong> — ${fmtDate(x.date)}</p>`,
    confirmLabel: window.t('delete'),
    onConfirm: () => {
      CMT.attendance = CMT.attendance.filter(a => a.meetingId !== id);
      CMT.meetings = CMT.meetings.filter(m => m.id !== id);
      if (CMT.activeMeetingId === id) CMT.activeMeetingId = null;
      cmtToast(window.t('cmt_meeting_deleted', 'Meeting deleted.'));
      renderCommittee();
    }
  });
}

/* ---- drafts ---- */
function openCmtDraft(cid, draftId) {
  if (!canOpenCmt(cid)) { cmtToast(window.t('cmt_access_denied', 'Access denied.')); return; }
  CMT.activeCmtId = cid; CMT.editingDraftId = draftId || null;
  const d = draftId ? CMT.drafts.find(x => x.id === draftId) : null;
  document.getElementById('cmtDraftFormTitle').textContent = d ? window.t('cmt_edit_draft', 'Edit Draft') : window.t('cmt_new_draft', 'New Draft');
  document.getElementById('cmtDraftFieldTitle').value = d ? d.title : '';
  document.getElementById('cmtDraftFieldMsg').value = d ? d.message : '';
  openModal('modalCmtDraft');
}
function handleSaveCmtDraft(e) {
  e.preventDefault();
  const title = document.getElementById('cmtDraftFieldTitle').value.trim();
  const message = document.getElementById('cmtDraftFieldMsg').value.trim();
  if (!title || !message) { cmtToast(window.t('cmt_need_draft', 'Title and message are required.')); return; }
  if (CMT.editingDraftId) {
    const d = CMT.drafts.find(x => x.id === CMT.editingDraftId);
    d.title = title; d.message = message; d.updatedAt = cmtToday();
  } else {
    CMT.drafts.push({ id: cmtNextId('CDR', CMT.drafts, 3), committeeId: CMT.activeCmtId, title, message, updatedAt: cmtToday() });
  }
  CMT.editingDraftId = null;
  closeModal('modalCmtDraft');
  cmtToast(window.t('save') + ' ✓');
  renderCommittee();
}
function confirmDeleteCmtDraft(id) {
  const d = CMT.drafts.find(x => x.id === id); if (!d) return;
  openConfirm({
    title: window.t('cmt_delete_draft', 'Delete Draft'), danger: true,
    body: `<p><strong>${esc(d.title)}</strong></p>`,
    confirmLabel: window.t('delete'),
    onConfirm: () => { CMT.drafts = CMT.drafts.filter(x => x.id !== id); cmtToast(window.t('cmt_draft_deleted', 'Draft deleted.')); renderCommittee(); }
  });
}

/* ---- settings save ---- */
function saveCmtSettings(e, cid) {
  e.preventDefault();
  const c = cmtById(cid); if (!c) return;
  c.name = document.getElementById('setCmtName').value.trim() || c.name;
  c.samaj = document.getElementById('setCmtSamaj').value.trim();
  c.expectedSize = parseInt(document.getElementById('setCmtSize').value, 10) || c.expectedSize;
  c.status = document.getElementById('setCmtStatus').value;
  c.color = document.getElementById('setCmtColor').value;
  c.purpose = document.getElementById('setCmtPurpose').value.trim() || c.purpose;
  c.notes = document.getElementById('setCmtNotes').value.trim();
  if (isCmtAdmin()) c.leaderId = document.getElementById('setCmtLead').value;
  cmtLogActivity(cid, window.t('cmt_updated_by', 'Committee updated by') + ' ' + CMT.session.userName);
  cmtToast(window.t('save') + ' ✓');
  populateCmtRoleOptions();
  renderCommittee();
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('committeeRoot')) return;
  populateCmtRoleOptions();
  renderCommittee();
  if (typeof onLanguageChange === 'function') onLanguageChange(() => renderCommittee());
});
