// Validasi transaksi agar tidak muncul undefined / [object Object]
function isTransaksiValid(item) {
  return (
    item &&
    typeof item.tanggal === 'string' && item.tanggal.trim() !== '' &&
    typeof item.akun === 'string' && item.akun.trim() !== '' &&
    typeof item.keterangan === 'string' && item.keterangan.trim() !== '' &&
    typeof item.debit === 'number' &&
    typeof item.kredit === 'number' &&
    (item.debit > 0 || item.kredit > 0)
  );
}

// Menampilkan halaman sesuai tombol
function tampilkan(halaman) {
  document.querySelectorAll('.halaman').forEach(h => h.style.display = 'none');
  document.getElementById(halaman).style.display = 'block';

  if (halaman === 'jurnal') tampilJurnal();
  if (halaman === 'buku') tampilBukuBesar();
  if (halaman === 'neraca') tampilNeraca();
}

tampilkan('form');

const form = document.getElementById('form-transaksi');
let transaksi = JSON.parse(localStorage.getItem("transaksi") || "[]");

// Simpan transaksi
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const tgl = document.getElementById('tanggal').value;
  const akun = document.getElementById('akun').value.trim();
  const ket = document.getElementById('keterangan').value.trim();
  const debit = parseFloat(document.getElementById('debit').value) || 0;
  const kredit = parseFloat(document.getElementById('kredit').value) || 0;

  const data = { tanggal: tgl, akun, keterangan: ket, debit, kredit };

  if (!isTransaksiValid(data)) {
    alert("Isi semua kolom dengan benar. Minimal debit atau kredit harus lebih dari 0.");
    return;
  }

  transaksi.push(data);
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  form.reset();
  tampilkan('jurnal');
});

// JURNAL UMUM
function tampilJurnal() {
  const tbody = document.getElementById('tabel-jurnal');
  tbody.innerHTML = '';

  const validTransaksi = transaksi.filter(isTransaksiValid);
  const grouped = {};

  validTransaksi.forEach(item => {
    if (!grouped[item.tanggal]) grouped[item.tanggal] = [];
    grouped[item.tanggal].push(item);
  });

  for (const tanggal in grouped) {
    const data = grouped[tanggal];
    data.forEach((item, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        ${i === 0 ? `<td rowspan="${data.length}">${tanggal}</td>` : ''}
        <td>${item.akun}</td>
        <td>${item.keterangan}</td>
        <td>${item.debit > 0 ? item.debit.toLocaleString('id-ID') : ''}</td>
        <td>${item.kredit > 0 ? item.kredit.toLocaleString('id-ID') : ''}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

// BUKU BESAR
function tampilBukuBesar() {
  const div = document.getElementById('tabel-buku-besar');
  div.innerHTML = '';
  const akunList = {};

  const validTransaksi = transaksi.filter(isTransaksiValid);

  validTransaksi.forEach(item => {
    if (!akunList[item.akun]) akunList[item.akun] = [];
    akunList[item.akun].push(item);
  });

  for (const akun in akunList) {
    div.innerHTML += `<h3>${akun}</h3>
      <table class="jurnal">
        <thead>
          <tr><th>Tanggal</th><th>Keterangan</th><th>Debit</th><th>Kredit</th></tr>
        </thead>
        <tbody>
          ${akunList[akun].map(t => `
            <tr>
              <td>${t.tanggal}</td>
              <td>${t.keterangan}</td>
              <td>${t.debit ? t.debit.toLocaleString('id-ID') : ''}</td>
              <td>${t.kredit ? t.kredit.toLocaleString('id-ID') : ''}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }
}

// NERACA SALDO
function tampilNeraca() {
  const tbody = document.getElementById('tabel-neraca');
  tbody.innerHTML = '';

  const validTransaksi = transaksi.filter(isTransaksiValid);
  const saldo = {};

  validTransaksi.forEach(item => {
    if (!saldo[item.akun]) saldo[item.akun] = { debit: 0, kredit: 0 };
    saldo[item.akun].debit += item.debit;
    saldo[item.akun].kredit += item.kredit;
  });

  for (const akun in saldo) {
    const s = saldo[akun];
    tbody.innerHTML += `
      <tr>
        <td>${akun}</td>
        <td>${s.debit.toLocaleString('id-ID')}</td>
        <td>${s.kredit.toLocaleString('id-ID')}</td>
      </tr>
    `;
  }
}
