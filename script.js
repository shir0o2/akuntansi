// Membersihkan transaksi yang rusak dari localStorage
function bersihkanTransaksi() {
  const semuaTransaksi = JSON.parse(localStorage.getItem("transaksi") || "[]");

  const transaksiBersih = semuaTransaksi.filter(transaksiItem =>
    transaksiItem &&
    typeof transaksiItem === 'object' &&
    typeof transaksiItem.tanggal === 'string' &&
    typeof transaksiItem.akun === 'string' &&
    typeof transaksiItem.keterangan === 'string' &&
    typeof transaksiItem.debit === 'number' &&
    typeof transaksiItem.kredit === 'number' &&
    transaksiItem.tanggal.trim() !== '' &&
    transaksiItem.akun.trim() !== '' &&
    transaksiItem.keterangan.trim() !== '' &&
    !transaksiItem.tanggal.includes('[object') &&
    !transaksiItem.akun.includes('[object') &&
    !transaksiItem.keterangan.includes('[object') &&
    (transaksiItem.debit > 0 || transaksiItem.kredit > 0)
  );

  localStorage.setItem("transaksi", JSON.stringify(transaksiBersih));
}

// Menampilkan Jurnal ke tabel HTML
function tampilJurnal() {
  const tbody = document.getElementById('tabel-jurnal');
  tbody.innerHTML = '';

  bersihkanTransaksi();

  const semuaTransaksi = JSON.parse(localStorage.getItem("transaksi") || "[]");

  // Kelompokkan berdasarkan tanggal
  const transaksiPerTanggal = {};
  semuaTransaksi.forEach(transaksiItem => {
    const tgl = transaksiItem.tanggal;
    if (!transaksiPerTanggal[tgl]) transaksiPerTanggal[tgl] = [];
    transaksiPerTanggal[tgl].push(transaksiItem);
  });

  // Tampilkan ke tabel
  for (const tanggal in transaksiPerTanggal) {
    const transaksiPadaTanggal = transaksiPerTanggal[tanggal];

    transaksiPadaTanggal.forEach((item, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        ${index === 0 ? `<td rowspan="${transaksiPadaTanggal.length}">${tanggal}</td>` : ''}
        <td>${item.akun}</td>
        <td>${item.keterangan}</td>
        <td>${item.debit ? item.debit.toLocaleString('id-ID') : ''}</td>
        <td>${item.kredit ? item.kredit.toLocaleString('id-ID') : ''}</td>
      `;

      tbody.appendChild(tr);
    });
  }
}
