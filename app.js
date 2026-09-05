/* ============================================================
   SHRI VISAT MELDI MATA MANDIR — DIVINE MANDALA JAVASCRIPT ENGINE
   ============================================================ */

// Master State Store
const state = {
  activePage: 'dashboard',
  roleScope: 'admin',
  currentLang: 'en',

  // Devotees Register (Central Person Model)
  devotees: [
    { id: '#DEV-1001', name: 'Rameshbhai Rabari', phone: '9876543210', city: 'Sanand', samaj: 'Rabari Samaj', status: 'Active', visits: 12 },
    { id: '#DEV-1002', name: 'Priya Sharma', phone: '9812345678', city: 'Ahmedabad', samaj: 'General Committee', status: 'Active', visits: 8 },
    { id: '#DEV-1003', name: 'Kiran Joshi', phone: '9723456789', city: 'Sanand', samaj: 'Marvadi Samaj', status: 'Active', visits: 15 },
    { id: '#DEV-1004', name: 'Mehul Shah', phone: '9988776655', city: 'Viramgam', samaj: 'General Committee', status: 'Active', visits: 5 },
    { id: '#DEV-1005', name: 'Bhavesh Desai', phone: '9654321098', city: 'Bavla', samaj: 'Rabari Samaj', status: 'Active', visits: 20 },
    { id: '#DEV-1006', name: 'Nilesh Parmar', phone: '9898012345', city: 'Changodar', samaj: 'General Committee', status: 'Active', visits: 4 },
    { id: '#DEV-1007', name: 'Hetal Shah', phone: '9712398765', city: 'Sanand', samaj: 'Marvadi Samaj', status: 'Active', visits: 11 },
    { id: '#DEV-1008', name: 'Jignesh Patel', phone: '9823456780', city: 'Ahmedabad', samaj: 'General Committee', status: 'Active', visits: 7 }
  ],
  
  // Financial Donations Log
  donations: [
    { receipt: '#REC-101', name: 'Rameshbhai Rabari', category: 'Pooja / Seva Booking', mode: 'Cash', date: '05 Sept 2026', amount: 1100 },
    { receipt: '#REC-102', name: 'Priya Sharma', category: 'General Donation', mode: 'UPI', date: '05 Sept 2026', amount: 501 },
    { receipt: '#REC-103', name: 'Kiran Joshi', category: 'Temple Renovation', mode: 'Bank Transfer', date: '04 Sept 2026', amount: 21000 },
    { receipt: '#REC-104', name: 'Mehul Shah', category: 'Annadan / Bhojan', mode: 'Cash', date: '04 Sept 2026', amount: 5100 },
    { receipt: '#REC-105', name: 'Bhavesh Desai', category: 'General Donation', mode: 'UPI', date: '03 Sept 2026', amount: 11000 },
    { receipt: '#REC-106', name: 'Hetal Shah', category: 'Pooja / Seva Booking', mode: 'UPI', date: '03 Sept 2026', amount: 251 }
  ],

  // 36 Pooja Master Catalog
  poojas: [
    { id: 1, name: 'Visat Meldi Mata Vishesh Havan', duration: '60 mins', fee: 1100, category: 'Special Havan' },
    { id: 2, name: 'Maha Aarti & Deepotsav', duration: '30 mins', fee: 501, category: 'Daily Ritual' },
    { id: 3, name: 'Rudrabhishek Seva', duration: '45 mins', fee: 1100, category: 'Abhishek' },
    { id: 4, name: 'Navgraha Shanti Pooja', duration: '90 mins', fee: 1251, category: 'Shanti Pooja' },
    { id: 5, name: 'Chandi Path & Archana', duration: '120 mins', fee: 2100, category: 'Path' },
    { id: 6, name: 'Shat Chandi Mahayagna', duration: '180 mins', fee: 5100, category: 'Special Yagna' },
    { id: 7, name: 'Gau Seva & Grass Donation', duration: '15 mins', fee: 251, category: 'Seva' },
    { id: 8, name: 'Annadan Mahaprasad Seva', duration: '60 mins', fee: 1100, category: 'Prasad' }
  ],

  // Inventory Stock
  inventory: [
    { id: '#INV-01', item: 'Pooja Ghee & Pure Oil', category: 'Pooja Materials', stock: '45 Ltrs', minStock: '15 Ltrs', status: 'In Stock' },
    { id: '#INV-02', item: 'Agarbatti & Dhoop', category: 'Incense', stock: '120 Packs', minStock: '30 Packs', status: 'In Stock' },
    { id: '#INV-03', item: 'Fresh Rose & Marigold Flowers', category: 'Flowers', stock: '8 Kgs', minStock: '10 Kgs', status: 'Low Stock' },
    { id: '#INV-04', item: 'Kesar & Chandan Paste', category: 'Pooja Materials', stock: '25 Boxes', minStock: '5 Boxes', status: 'In Stock' },
    { id: '#INV-05', item: 'Bhojan Shala Rice Bags', category: 'Prasad', stock: '2 Bags', minStock: '10 Bags', status: 'Out of Stock' },
    { id: '#INV-06', item: 'Brass Diyas & Wicks', category: 'Temple Supplies', stock: '150 Pcs', minStock: '20 Pcs', status: 'In Stock' }
  ],

  // Expense Records
  expenses: [
    { id: '#EXP-501', title: 'Temple Electricity & Power Utility', category: 'Electricity', amount: 14200, date: '01 Sept 2026', status: 'Paid' },
    { id: '#EXP-502', title: 'Pooja Supplies Bulk Order', category: 'Pooja Materials', amount: 8500, date: '02 Sept 2026', status: 'Paid' },
    { id: '#EXP-503', title: 'Sanitation & Cleaning Service', category: 'Cleaning', amount: 4800, date: '03 Sept 2026', status: 'Paid' },
    { id: '#EXP-504', title: 'Prasad Grain Procurement', category: 'Prasad', amount: 12000, date: '04 Sept 2026', status: 'Pending' }
  ]
};

// Initialize Application Engine
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderDevoteeTable();
  renderDonationsTable();
  renderInventoryTable();
  renderExpensesTable();
  initCharts();
  renderCalendar();
  injectMandalaDecorations();
});

// Setup Navigation & Router
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageId = item.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
      }
    });
  });

  const toggleBtn = document.getElementById('toggleSidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebarMenu);
  }
}

function toggleSidebarMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

function switchPage(pageId) {
  state.activePage = pageId;

  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
    if (el.getAttribute('data-page') === pageId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  document.querySelectorAll('.page').forEach(page => {
    if (page.id === `page-${pageId}`) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scoped User Role Switcher
function changeRoleScope(role) {
  state.roleScope = role;
  const roleTitle = role === 'admin' ? 'Super Admin (Full Platform)' : role === 'pooja_manager' ? 'Pooja Manager' : role === 'accountant' ? 'Temple Accountant' : 'Parking & Operations Lead';
  showToast(`Context switched to: ${roleTitle}`);

  if (role === 'pooja_manager') {
    switchPage('puja');
  } else if (role === 'accountant') {
    switchPage('donations');
  } else if (role === 'parking_head') {
    switchPage('teams');
  } else {
    switchPage('dashboard');
  }
}

// Multilingual Translation Dictionary (English, Hindi, Gujarati)
const i18n = {
  en: {
    temple_name: "Shri Visat Meldi Mata Mandir",
    temple_loc: "Sanand, Gujarat Platform",
    sub_tagline: "Sanand, Gujarat — Central Management Platform",
    sign_in: "🔐 Sign In",
    search_placeholder: "Search devotees, receipts, poojas...",
    
    // Navigation
    nav_main: "Main Navigation",
    nav_ops: "Platform & Operations",
    nav_dashboard: "Dashboard Launcher",
    nav_puja: "🪔 Pooja & Seva",
    nav_donations: "💰 Donations",
    nav_devotees: "👥 Devotees",
    nav_committees: "🏛️ Committee / Samaj",
    nav_teams: "👷 Staff & Teams",
    nav_events: "📅 Events",
    nav_inventory: "📦 Inventory",
    nav_expenses: "💸 Expenses",
    nav_visits: "🙏 Bappa / Bhuvaji Visits",
    nav_calendar: "🗓️ Unified Calendar",
    nav_reports: "📊 Reports",
    nav_settings: "⚙️ Settings",
    nav_admin: "🛡️ Security & Audit",

    // Banner & KPIs
    jai_maa: "Jai Shri Visat Meldi Mataji 🙏",
    kpi_seva: "Today's Seva Bookings",
    kpi_donations: "Today's Donations",
    kpi_devotees: "Registered Devotees",
    kpi_visits: "Temple Visits Today",
    quick_actions: "Operational Quick Actions",
    modules_launcher: "Management Modules Launcher",

    // Quick Action Buttons
    action_book_seva: "Book Seva",
    action_record_donation: "Record Donation",
    action_add_devotee: "Add Devotee",
    action_add_expense: "Add Expense",
    action_qr_badge: "QR Badge",
    action_events: "Events",
    action_inventory: "Inventory",
    action_reports: "Reports",

    // Mobile Nav
    mob_home: "Home",
    mob_seva: "Seva",
    mob_donations: "Donations",
    mob_devotees: "Devotees",
    mob_more: "More"
  },
  hi: {
    temple_name: "श्री विसात मेलडी माता मंदिर",
    temple_loc: "साणंद, गुजरात प्लेटफॉर्म",
    sub_tagline: "साणंद, गुजरात — केंद्रीय प्रबंधन मंच",
    sign_in: "🔐 साइन इन करें",
    search_placeholder: "श्रद्धालु, रसीद, पूजा खोजें...",
    
    // Navigation
    nav_main: "मुख्य नेविगेशन",
    nav_ops: "मंच और संचालन",
    nav_dashboard: "डैशबोर्ड लॉन्चर",
    nav_puja: "🪔 पूजा और सेवा",
    nav_donations: "💰 दान प्रबंधन",
    nav_devotees: "👥 श्रद्धालु पंजी",
    nav_committees: "🏛️ समिति / समाज",
    nav_teams: "👷 स्टाफ एवं टीम",
    nav_events: "📅 कार्यक्रम / उत्सव",
    nav_inventory: "📦 इन्वेंट्री प्रबंधन",
    nav_expenses: "💸 खर्च प्रबंधन",
    nav_visits: "🙏 बाप्पा / भुवाजी यात्रा",
    nav_calendar: "🗓️ एकीकृत कैलेंडर",
    nav_reports: "📊 रिपोर्ट्स",
    nav_settings: "⚙️ सेटिंग्स",
    nav_admin: "🛡️ सुरक्षा एवं ऑडिट",

    // Banner & KPIs
    jai_maa: "जय श्री विसात मेलडी माताजी 🙏",
    kpi_seva: "आज की सेवा बुकिंग",
    kpi_donations: "आज का कुल दान",
    kpi_devotees: "पंजीकृत श्रद्धालु",
    kpi_visits: "आज के मंदिर दर्शन",
    quick_actions: "त्वरित संचालन कार्य",
    modules_launcher: "प्रबंधन मॉड्यूल लॉन्चर",

    // Quick Action Buttons
    action_book_seva: "सेवा बुक करें",
    action_record_donation: "दान रसीद काटें",
    action_add_devotee: "श्रद्धालु जोड़ें",
    action_add_expense: "खर्च दर्ज करें",
    action_qr_badge: "क्यूआर बैज",
    action_events: "कार्यक्रम",
    action_inventory: "सामग्री सूची",
    action_reports: "रिपोर्ट्स",

    // Mobile Nav
    mob_home: "होम",
    mob_seva: "सेवा",
    mob_donations: "दान",
    mob_devotees: "श्रद्धालु",
    mob_more: "अन्य"
  },
  gu: {
    temple_name: "શ્રી વિસાત મેલડી માતા મંદિર",
    temple_loc: "સાણંદ, ગુજરાત પ્લેટફોર્મ",
    sub_tagline: "સાણંદ, ગુજરાત — સેન્ટ્રલ મેનેજમેન્ટ પ્લેટફોર્મ",
    sign_in: "🔐 સાઇન ઇન કરો",
    search_placeholder: "શ્રદ્ધાળુ, પહોંચ, પૂજા શોધો...",
    
    // Navigation
    nav_main: "મુખ્ય નેવિગેશન",
    nav_ops: "પ્લેટફોર્મ અને કામગીરી",
    nav_dashboard: "ડેશબોર્ડ લૉન્ચર",
    nav_puja: "🪔 પૂજા અને સેવા",
    nav_donations: "💰 દાન મંડળ",
    nav_devotees: "👥 શ્રદ્ધાળુ રજીસ્ટર",
    nav_committees: "🏛️ સમિતિ / સમાજ",
    nav_teams: "👷 ટીમ અને સ્વયંસેવકો",
    nav_events: "📅 ધાર્મિક ઉત્સવો",
    nav_inventory: "📦 ઈન્વેન્ટરી સ્ટોક",
    nav_expenses: "💸 ખર્ચ હિસાબ",
    nav_visits: "🙏 બાપ્પા / ભુવાજી પધરામણી",
    nav_calendar: "🗓️ સંકલિત કેલેન્ડર",
    nav_reports: "📊 રિપોર્ટ્સ",
    nav_settings: "⚙️ સેટિંગ્સ",
    nav_admin: "🛡️ સુરક્ષા અને ઓડિટ",

    // Banner & KPIs
    jai_maa: "જય શ્રી વિસાત મેલડી માતાજી 🙏",
    kpi_seva: "આજની સેવા બુકિંગ",
    kpi_donations: "આજનું કુલ દાન",
    kpi_devotees: "નોંધાયેલ શ્રદ્ધાળુઓ",
    kpi_visits: "આજના મંદિર દર્શન",
    quick_actions: "ઝડપી કાર્યો",
    modules_launcher: "મેનેજમેન્ટ મોડ્યુલ્સ લૉન્ચર",

    // Quick Action Buttons
    action_book_seva: "સેવા બુક કરો",
    action_record_donation: "દાન પહોંચ નોંધો",
    action_add_devotee: "શ્રદ્ધાળુ ઉમેરો",
    action_add_expense: "ખર્ચ નોંધો",
    action_qr_badge: "QR બેજ",
    action_events: "ઉત્સવો",
    action_inventory: "સ્ટોક યાદી",
    action_reports: "રિપોર્ટ્સ",

    // Mobile Nav
    mob_home: "હોમ",
    mob_seva: "સેવા",
    mob_donations: "દાન",
    mob_devotees: "શ્રદ્ધાળુઓ",
    mob_more: "વધુ"
  }
};

function changeLanguage(lang) {
  state.currentLang = lang;
  const dict = i18n[lang] || i18n['en'];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT') {
        el.setAttribute('placeholder', dict[key]);
      } else {
        el.textContent = dict[key];
      }
    }
  });

  const langNames = { en: 'English', hi: 'हिन्दी (Hindi)', gu: 'ગુજરાતી (Gujarati)' };
  showToast(`Language switched to: ${langNames[lang]}`);
}

// Devotees Table Renderer & Filter
function renderDevoteeTable() {
  const tbody = document.getElementById('devoteeTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.devotees.forEach(dev => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${dev.id}</strong></td>
      <td>${dev.name}</td>
      <td>${dev.phone}</td>
      <td>${dev.city}</td>
      <td><span class="badge badge-maroon">${dev.samaj}</span></td>
      <td><span class="badge badge-confirmed">${dev.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="showToast('Profile: ${dev.name} (${dev.visits} visits)')">Profile</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const label = document.getElementById('devoteeCountLabel');
  if (label) label.innerText = `Showing ${state.devotees.length} Devotees`;
}

function filterDevotees() {
  const query = (document.getElementById('devoteeSearch')?.value || '').toLowerCase();
  const filterSamaj = document.getElementById('devoteeSamajFilter')?.value || 'all';

  const filtered = state.devotees.filter(dev => {
    const matchesQuery = dev.name.toLowerCase().includes(query) || dev.phone.includes(query) || dev.city.toLowerCase().includes(query);
    const matchesSamaj = filterSamaj === 'all' || dev.samaj === filterSamaj;
    return matchesQuery && matchesSamaj;
  });

  const tbody = document.getElementById('devoteeTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  filtered.forEach(dev => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${dev.id}</strong></td>
      <td>${dev.name}</td>
      <td>${dev.phone}</td>
      <td>${dev.city}</td>
      <td><span class="badge badge-maroon">${dev.samaj}</span></td>
      <td><span class="badge badge-confirmed">${dev.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="showToast('Profile: ${dev.name}')">Profile</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const label = document.getElementById('devoteeCountLabel');
  if (label) label.innerText = `Showing ${filtered.length} Devotees`;
}

// Donations Table Renderer
function renderDonationsTable() {
  const tbody = document.getElementById('donationsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.donations.forEach(don => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${don.receipt}</strong></td>
      <td>${don.name}</td>
      <td>${don.category}</td>
      <td><span class="badge badge-maroon">${don.mode}</span></td>
      <td>${don.date}</td>
      <td><strong>₹${don.amount.toLocaleString('en-IN')}</strong></td>
      <td>
        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="openReceiptViewer('${don.receipt}', '${don.name}', ${don.amount}, '${don.category}')">View Receipt</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Inventory Table Renderer
function renderInventoryTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.inventory.forEach(inv => {
    const badgeClass = inv.status === 'In Stock' ? 'badge-confirmed' : inv.status === 'Low Stock' ? 'badge-pending' : 'badge-cancelled';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${inv.id}</strong></td>
      <td>${inv.item}</td>
      <td>${inv.category}</td>
      <td><strong>${inv.stock}</strong></td>
      <td>${inv.minStock}</td>
      <td><span class="badge ${badgeClass}">${inv.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="showToast('Reorder requested for ${inv.item}')">Reorder</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Expenses Table Renderer
function renderExpensesTable() {
  const tbody = document.getElementById('expensesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  state.expenses.forEach(exp => {
    const badgeClass = exp.status === 'Paid' ? 'badge-confirmed' : 'badge-pending';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${exp.id}</strong></td>
      <td>${exp.title}</td>
      <td>${exp.category}</td>
      <td><strong>₹${exp.amount.toLocaleString('en-IN')}</strong></td>
      <td>${exp.date}</td>
      <td><span class="badge ${badgeClass}">${exp.status}</span></td>
      <td>
        <button class="btn btn-outline" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" onclick="showToast('Voucher details for ${exp.id}')">Voucher</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Modal Management
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Form Submission Handlers
function handleSaveDevotee(e) {
  e.preventDefault();
  const name = document.getElementById('inputDevoteeName').value;
  const phone = document.getElementById('inputDevoteePhone').value;
  const samaj = document.getElementById('inputDevoteeSamaj').value;
  const city = document.getElementById('inputDevoteeCity').value;

  const newDevotee = {
    id: `#DEV-${1000 + state.devotees.length + 1}`,
    name, phone, city, samaj, status: 'Active', visits: 1
  };

  state.devotees.unshift(newDevotee);
  renderDevoteeTable();
  closeModal('modalAddDevotee');
  e.target.reset();
  showToast(`Devotee ${name} registered successfully!`);
}

function handleSaveDonation(e) {
  e.preventDefault();
  const name = document.getElementById('inputDonorName').value;
  const amount = parseInt(document.getElementById('inputDonationAmount').value);
  const category = document.getElementById('inputDonationCategory').value;
  const mode = document.getElementById('inputPaymentMode').value;

  const newReceipt = `#REC-${100 + state.donations.length + 1}`;
  const newDonation = {
    receipt: newReceipt,
    name, category, mode, date: '05 Sept 2026', amount
  };

  state.donations.unshift(newDonation);
  renderDonationsTable();
  closeModal('modalRecordDonation');
  e.target.reset();
  openReceiptViewer(newReceipt, name, amount, category);
  showToast(`Donation of ₹${amount.toLocaleString('en-IN')} recorded!`);
}

function handleSavePuja(e) {
  e.preventDefault();
  const pujaName = document.getElementById('inputPujaType').value;
  const devotee = document.getElementById('inputPujaDevotee').value;
  closeModal('modalSchedulePuja');
  e.target.reset();
  showToast(`Seva '${pujaName}' booked for ${devotee}!`);
}

function handleSaveExpense(e) {
  e.preventDefault();
  const title = document.getElementById('inputExpenseTitle').value;
  const amount = parseInt(document.getElementById('inputExpenseAmount').value);
  const category = document.getElementById('inputExpenseCategory').value;

  const newExpense = {
    id: `#EXP-${500 + state.expenses.length + 1}`,
    title, category, amount, date: '05 Sept 2026', status: 'Paid'
  };

  state.expenses.unshift(newExpense);
  renderExpensesTable();
  closeModal('modalAddExpense');
  e.target.reset();
  showToast(`Expense voucher created for ₹${amount.toLocaleString('en-IN')}!`);
}

function handleSaveInventory(e) {
  e.preventDefault();
  const item = document.getElementById('inputInventoryItem').value;
  const category = document.getElementById('inputInventoryCategory').value;
  const stock = document.getElementById('inputInventoryStock').value;
  const minStock = document.getElementById('inputInventoryMinStock').value;

  const newInventory = {
    id: `#INV-0${state.inventory.length + 1}`,
    item, category, stock, minStock, status: 'In Stock'
  };

  state.inventory.unshift(newInventory);
  renderInventoryTable();
  closeModal('modalAddInventory');
  e.target.reset();
  showToast(`Item '${item}' added to temple inventory!`);
}

function handleJoinTeam(e) {
  e.preventDefault();
  const name = document.getElementById('inputVolunteerName').value;
  closeModal('modalJoinTeam');
  e.target.reset();
  showToast(`Volunteer application submitted for ${name}!`);
}

function handleLogin(e) {
  e.preventDefault();
  closeModal('modalLogin');
  showToast('Signed in successfully!');
}

// Official 80G Receipt Generator Modal
function openReceiptViewer(receiptNo, donorName, amount, category) {
  const container = document.getElementById('receiptContent');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <h2 style="font-family: var(--font-heading); color: var(--primary-maroon); margin: 0; font-size: 1.35rem;">श्री विsat मेलडी माता मंदिर</h2>
      <p style="font-size: 0.82rem; color: var(--muted-brown);">Sanand, Gujarat | Official Donation Receipt</p>
    </div>
    <hr style="border: 0; border-top: 1px dashed var(--warm-border); margin: 0.85rem 0;">
    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
      <span>Receipt No: <strong>${receiptNo}</strong></span>
      <span>Date: <strong>05 Sept 2026</strong></span>
    </div>
    <div style="font-size: 0.9rem; margin-bottom: 0.4rem;">Received with thanks from: <strong>${donorName}</strong></div>
    <div style="font-size: 0.9rem; margin-bottom: 0.4rem;">Donation Category: <strong>${category}</strong></div>
    <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary-maroon); margin: 0.85rem 0; padding: 0.6rem; background: #FFF; border-radius: 6px; text-align: center; border: 1px solid var(--warm-border);">
      Sum of Rupees: ₹${amount.toLocaleString('en-IN')} /-
    </div>
    <div style="font-size: 0.75rem; color: var(--muted-brown); text-align: center;">Tax Exempt under Sec 80G | Authorised Trustee Signature</div>
  `;
  openModal('modalReceiptViewer');
}

function openBadgeGeneratorModal() {
  openModal('modalBadgeViewer');
}

function approveVolunteer(btn) {
  const parent = btn.closest('.summary-item');
  if (parent) {
    parent.innerHTML = `
      <div>
        <strong>Volunteer Application Approved</strong>
        <div style="font-size: 0.8rem; color: var(--success);">Added to Active Roster</div>
      </div>
      <span class="badge badge-confirmed">Accepted</span>
    `;
    showToast('Volunteer application approved!');
  }
}

function terminateSession(btn) {
  const row = btn.closest('tr');
  if (row) {
    row.remove();
    showToast('User session terminated.');
  }
}

function toggleNotificationsDrawer() {
  showToast('Notifications: 3 unread temple updates');
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <span>${msg}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function handleGlobalSearch(val) {
  if (val.length > 2) {
    showToast(`Searching temple records for: "${val}"...`);
  }
}

// High-DPI Canvas Charts Initializer
function initCharts() {
  // 1. Donation Bar Chart
  const barCanvas = document.getElementById('donationBarChart');
  if (barCanvas) {
    const ctx = barCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = barCanvas.getBoundingClientRect();
    barCanvas.width = (rect.width || 500) * dpr;
    barCanvas.height = (rect.height || 230) * dpr;
    ctx.scale(dpr, dpr);

    const data = [18, 24, 20, 32, 30, 42, 36, 48, 52, 40, 50, 58];
    const maxVal = 65;
    const barWidth = 14;
    const width = rect.width || 500;
    const height = rect.height || 230;
    const gap = (width - (data.length * barWidth)) / (data.length + 1);

    ctx.clearRect(0, 0, width, height);

    data.forEach((val, i) => {
      const x = gap + i * (barWidth + gap);
      const barHeight = (val / maxVal) * (height - 30);
      const y = height - barHeight - 20;

      ctx.fillStyle = i % 2 === 0 ? '#6B1F2A' : '#C96A20';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barHeight);
      }
      ctx.fill();
    });
  }

  // 2. Donation Categories Donut Chart
  const donutCanvas = document.getElementById('sourcesDonutChart');
  if (donutCanvas) {
    const ctx = donutCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    donutCanvas.width = 140 * dpr;
    donutCanvas.height = 140 * dpr;
    ctx.scale(dpr, dpr);

    const segments = [
      { percentage: 0.48, color: '#6B1F2A' },
      { percentage: 0.32, color: '#C96A20' },
      { percentage: 0.12, color: '#C9A24A' },
      { percentage: 0.08, color: '#EFE3CF' }
    ];

    let startAngle = -Math.PI / 2;
    const cx = 70, cy = 70, radius = 55, innerRadius = 35;

    segments.forEach(seg => {
      const sliceAngle = seg.percentage * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      startAngle += sliceAngle;
    });
  }
}

// Calendar Grid Renderer
function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;

  grid.innerHTML = '';
  for (let i = 1; i <= 30; i++) {
    const cell = document.createElement('div');
    cell.style.cssText = `
      padding: 0.75rem 0.25rem;
      background: var(--warm-ivory);
      border: 1px solid var(--warm-border);
      border-radius: 6px;
      font-size: 0.8rem;
      min-height: 52px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
    `;
    cell.innerHTML = `<strong>${i}</strong>`;

    if (i === 15 || i === 22 || i === 28) {
      cell.style.background = '#FFF5EC';
      cell.style.borderColor = 'var(--saffron)';
      cell.innerHTML += `<span style="font-size: 0.65rem; color: var(--saffron); font-weight:800;">🪔 Seva</span>`;
    }

    cell.onclick = () => showToast(`Selected Date: ${i} September 2026`);
    grid.appendChild(cell);
  }
}

// Mandala Geometric SVG Decorator
function injectMandalaDecorations() {
  // Can programmatically append background mandala overlays or corner flourishes if needed
}
