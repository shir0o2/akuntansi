// auth.js

// Ambil user dari localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

// Simpan user ke localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Registrasi user baru
function register(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert("Username dan password tidak boleh kosong!");
    return;
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    alert("Username sudah terdaftar!");
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  alert("Registrasi berhasil. Silakan login.");
  window.location.href = "login.html";
}

// Login
function login(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Username atau password salah!");
    return;
  }

  localStorage.setItem("loggedInUser", username);

  // Bersihkan data transaksi yang rusak saat login
  bersihkanTransaksi();

  window.location.href = "index.html";
}

// Reset password
function resetPassword(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const newPassword = document.getElementById('newPassword').value;

  const users = getUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    alert("Username tidak ditemukan.");
    return;
  }

  user.password = newPassword;
  saveUsers(users);

  alert("Password berhasil direset. Silakan login.");
  window.location.href = "login.html";
}
function login(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Username atau password salah!");
    return;
  }

  localStorage.setItem("loggedInUser", username);
  window.location.href = "index.html"; // GANTI sesuai halaman aplikasi utama
}
