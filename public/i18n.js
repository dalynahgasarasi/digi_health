const EXACT = {

  'Home': 'Ahabanza', 'Symptoms': 'Ibimenyetso', 'Appointments': 'Gahunda', 'Consultations': 'Inama za muganga',
  'Prescriptions': 'Imiti wandikiwe', 'Patients': 'Abarwayi', 'Help': 'Ubufasha', 'Emergency 112': 'Ubutabazi 112',
  'Log out': 'Sohoka', 'Close': 'Funga', 'What would you like to do?': 'Wifuza gukora iki?',

  'Log in': 'Injira', 'Sign up': 'Iyandikishe', 'Create account': 'Fungura konti',
  'Care from home, wherever you are': 'Kwivuza uri mu rugo, aho waba uri hose',
  'Log symptoms': 'Andika ibimenyetso', 'Talk to a doctor': 'Vugana na muganga',
  'Get prescriptions': 'Fata imiti wandikiwe',
  'No account?': 'Nta konti ufite?', 'Have an account?': 'Usanzwe ufite konti?',
  'Phone number': 'Numero ya telefone', 'Password': 'Ijambobanga', 'Password (8+ characters)': 'Ijambobanga (nibura inyuguti 8)',
  'Name': 'Izina', 'Location (village or district)': 'Aho utuye (umudugudu cyangwa akarere)', 'Specialisation': 'Ubuhanga bwihariye',
  'Patient': 'Umurwayi', 'Community health worker': "Umujyanama w'ubuzima", 'Doctor': 'Muganga',

  'Log my symptoms': 'Andika ibimenyetso byanjye', 'Describe how you feel': 'Sobanura uko wiyumva',
  'Normal': 'Bisanzwe', 'Urgent': 'Byihutirwa', 'Submit symptoms': 'Ohereza ibimenyetso',
  'My symptom history': "Amateka y'ibimenyetso byanjye", 'Book an appointment': 'Fata gahunda',
  'Choose a doctor': 'Hitamo muganga', 'Reason (optional)': 'Impamvu (si itegeko)', 'Book appointment': 'Fata gahunda',
  'My appointments': 'Gahunda zanjye', 'Request a remote consultation': 'Saba inama ya muganga ukoresheje telefone',
  'Why do you need a consultation?': 'Kuki ukeneye inama ya muganga?', 'Request consultation': 'Saba inama',
  'My consultations': 'Inama nasabye', 'Talk to my nearest CHW': "Vugana n'umujyanama w'ubuzima uri hafi yanjye",
  'Ask my nearest community health worker': "Saba umujyanama w'ubuzima uri hafi yanjye", 'My prescriptions': 'Imiti nandikiwe',

  'View symptom history': "Reba amateka y'ibimenyetso", 'View prescriptions': 'Reba imiti yandikiwe',
  'Log symptoms for the selected patient': "Andika ibimenyetso by'umurwayi wahisemo",
  "Describe the patient's symptoms": "Sobanura ibimenyetso by'umurwayi",
  'Request a consultation for the selected patient': 'Saba inama ya muganga ku murwayi wahisemo',
  'Why does this patient need a doctor?': 'Kuki uyu murwayi akeneye muganga?',
  'Consultations I requested': 'Inama nasabye', 'Patients asking for a CHW': "Abarwayi basaba umujyanama w'ubuzima",
  'Recent symptoms from all patients': "Ibimenyetso biheruka by'abarwayi bose",
  'Consultation requests': "Ubusabe bw'inama za muganga", 'Write a prescription for the selected patient': 'Andikira imiti umurwayi wahisemo',
  'Medicine, dose and instructions': "Umuti, urugero n'uko unywa", 'Save prescription': 'Bika imiti',
  'Choose a patient': 'Hitamo umurwayi', 'Please choose a patient first.': 'Banza uhitemo umurwayi.',
  'Accept': 'Emera', 'Mark as completed': 'Emeza ko birangiye', 'Mark as responded': 'Emeza ko wasubije',

  'No symptoms logged yet.': 'Nta bimenyetso birandikwa.', 'No appointments yet.': 'Nta gahunda zirafatwa.',
  'No consultations yet.': 'Nta nama zirasabwa.', 'No requests yet.': 'Nta busabe burasabwa.',
  'No prescriptions yet.': 'Nta miti wandikiwe.', 'No symptoms logged for this patient.': 'Nta bimenyetso byanditswe kuri uyu murwayi.',
  'No prescriptions for this patient.': 'Nta miti yandikiwe uyu murwayi.',

  'pending': 'bitegereje', 'accepted': 'byemewe', 'completed': 'byarangiye', 'responded': 'byasubijwe',
  'normal': 'bisanzwe', 'urgent': 'byihutirwa',
  'Fever': 'Umuriro', 'Headache': 'Kubabara umutwe', 'Nausea': 'Iseseme', 'Vomiting': 'Kuruka',
  'Cough': 'Inkorora', 'Difficulty breathing': 'Guhumeka bigoye', 'Body pain': 'Kubabara umubiri', 'Chills': 'Gukonja',
  'How to use DigiHealth': 'Uko wakoresha DigiHealth',
  'Use the tabs at the top to move between pages.': 'Koresha utubuto two hejuru ujye ku yindi paji.',
  'Tap the pictures to add symptoms if typing is hard.': 'Kanda amashusho wongere ibimenyetso niba kwandika bikugora.',
  'Choose Urgent if the problem is serious or getting worse.': 'Hitamo "Byihutirwa" niba ikibazo gikomeye cyangwa kirushaho kwiyongera.',
  'In an emergency, press the red Emergency button to call 112.': "Mu gihe cy'ubutabazi bwihuse, kanda buto itukura y'Ubutabazi uhamagare 112."
};
const PARTS = [
  ['Signed in as: Community health worker', "Winjiye nka: Umujyanama w'ubuzima"],
  ['Signed in as: Patient', 'Winjiye nka: Umurwayi'], ['Signed in as: Doctor', 'Winjiye nka: Muganga'],
  ['Welcome, ', 'Murakaza neza, '], ['Patient: ', 'Umurwayi: '], ['Doctor: ', 'Muganga: '],
  ['Status: ', 'Imimerere: '], ['Requested by: ', 'Byasabwe na: '], ['Logged by ', 'Byanditswe na '],
  ['CHW: ', 'Umujyanama: '], ['not assigned yet', 'ntaratoranywa']
];

let LANG = localStorage.getItem('lang') === 'rw' ? 'rw' : 'en';

function translateText(en) {
  if (LANG === 'en') return en;
  const core = en.trim();
  if (core && EXACT.hasOwnProperty(core)) return en.replace(core, function () { return EXACT[core]; });
  let out = en;
  PARTS.forEach(function (p) { out = out.split(p[0]).join(p[1]); });
  return out.replace(/(\d) at (\d)/g, '$1 saa $2');
}
function fixText(n) {
  const tag = n.parentNode && n.parentNode.nodeName;
  if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return;
  if (n._en === undefined) n._en = n.nodeValue;
  const out = translateText(n._en);
  if (n.nodeValue !== out) n.nodeValue = out;
}
function fixPlaceholder(el) {
  if (el._enph === undefined) el._enph = el.getAttribute('placeholder');
  const rw = EXACT.hasOwnProperty(el._enph) ? EXACT[el._enph] : el._enph;
  el.setAttribute('placeholder', LANG === 'rw' ? rw : el._enph);
}
function translateTree(root) {
  if (root.nodeType === 3) { fixText(root); return; }
  if (root.nodeType !== 1) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) fixText(n);
  if (root.hasAttribute('placeholder')) fixPlaceholder(root);
  root.querySelectorAll('[placeholder]').forEach(fixPlaceholder);
}
function markLangButtons() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.classList.toggle('active', b.getAttribute('data-lang') === LANG);
  });
}
function setLang(l) {
  LANG = l;
  localStorage.setItem('lang', l);
  translateTree(document.body);
  markLangButtons();
}

translateTree(document.body);
markLangButtons();
new MutationObserver(function (list) {
  list.forEach(function (m) { m.addedNodes.forEach(translateTree); });
}).observe(document.body, { childList: true, subtree: true });