// Global variables
let map;
let riskChart;
let reportsData = [];
let institutionsData = JSON.parse(localStorage.getItem('institutions')) || [];
let blogsData = JSON.parse(localStorage.getItem('blogs')) || [];
let awardsData = JSON.parse(localStorage.getItem('awards')) || [];


const firebaseConfig = {
    apiKey: "AIzaSyDG4Yh4PJUKcesMFwrT_Ij80ytwAC9NdP0",
    authDomain: "mapazzz-f3710.firebaseapp.com",
    projectId: "mapazzz-f3710",
    storageBucket: "mapazzz-f3710.firebasestorage.app",
    messagingSenderId: "651181150618",
    appId: "1:651181150618:web:ace0651cfe3120e115ea23",
    measurementId: "G-3VBNWW2ZJ0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Adicione isso no início do arquivo para debug
firebase.auth().onAuthStateChanged((user) => {
  console.log('Estado da autenticação mudou:', user ? 'Usuário logado' : 'Usuário não logado');
  console.log('Token atual:', localStorage.getItem('authToken'));
});

// Authentication functions
async function loginUser(email, password) {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const token = await userCredential.user.getIdToken();
    
    if (token) {
      localStorage.setItem('authToken', token);
      setTimeout(() => {
      window.location.href = 'index.html';
      }, 100);
    } else {
      throw new Error('Token de autenticação inválido');
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('Erro ao fazer login: ' + error.message);
  }
}

// Function to check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('authToken');
  const currentPage = window.location.pathname.split('/').pop();
  
  console.log('Checking auth:', { token, currentPage });
  
  if (currentPage === 'login.html' && token) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
    window.location.href = 'index.html';
      } else {
        localStorage.removeItem('authToken');
      }
    });
    return;
  }
  
  if (currentPage !== 'login.html' && !token) {
    window.location.href = 'login.html';
    return;
  }
}

// Function to logout
function logout() {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error('Error during logout:', error);
  });
}

// Add authentication header to all API requests
function getAuthenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('authToken');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token
    }
  });
}

// At the top of script.js
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

// Initialize chart and load data
document.addEventListener('DOMContentLoaded', function() {
    try {
        checkAuth(); // Check authentication first
        // Chart initialization
        const ctx = document.getElementById('riskChart').getContext('2d');
        riskChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Baixo', 'Médio', 'Alto'],
                datasets: [{
                    label: 'Número de Casos',
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(39, 174, 96, 0.6)',
                        'rgba(243, 156, 18, 0.6)',
                        'rgba(231, 76, 60, 0.6)'
                    ],
                    borderColor: [
                        'rgba(39, 174, 96, 1)',
                        'rgba(243, 156, 18, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de Casos'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Nível de Risco'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
        
        // Load data
        loadReportsData();
        loadInstitutionsData();
        loadBlogsData();
        loadAwardsData();
        
        // Refresh buttons
        document.getElementById('refreshMap').addEventListener('click', loadReportsData);
        document.getElementById('refreshChart').addEventListener('click', loadReportsData);
        document.getElementById('refreshActiveCases').addEventListener('click', loadReportsData);
        document.getElementById('refreshResolvedCases').addEventListener('click', loadReportsData);
        document.getElementById('refreshInstitutions').addEventListener('click', loadInstitutionsData);
        document.getElementById('refreshBlogs').addEventListener('click', loadBlogsData);
        document.getElementById('refreshAwards').addEventListener('click', loadAwardsData);
        
        // Institution form submission
        document.getElementById('institutionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const institution = {
                id: institutionsData.length + 1,
                name: document.getElementById('name').value,
                type: document.getElementById('type').value,
                address: document.getElementById('address').value,
                contact: document.getElementById('contact').value,
                location: document.getElementById('location').value
            };
            institutionsData.push(institution);
            localStorage.setItem('institutions', JSON.stringify(institutionsData));
            alert('Instituição adicionada com sucesso!');
            this.reset();
            loadInstitutionsData();
        });
        
        // Blog form submission
        document.getElementById('blogForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const blog = {
                id: blogsData.length + 1,
                title: document.getElementById('blogTitle').value,
                description: document.getElementById('blogDescription').value,
                photoUrl: document.getElementById('blogPhoto').value
            };
            blogsData.push(blog);
            localStorage.setItem('blogs', JSON.stringify(blogsData));
            alert('Blog adicionado com sucesso!');
            this.reset();
            loadBlogsData();
        });
        
        // Award form submission
        document.getElementById('awardForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const award = {
                id: awardsData.length + 1,
                title: document.getElementById('awardTitle').value,
                description: document.getElementById('awardDescription').value,
                photoUrl: document.getElementById('awardPhoto').value
            };
            awardsData.push(award);
            localStorage.setItem('awards', JSON.stringify(awardsData));
            alert('Prêmio adicionado com sucesso!');
            this.reset();
            loadAwardsData();
        });
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Erro na inicialização: ' + error.message);
    }
});

// Page navigation
function showPage(pageId) {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        currentPage.classList.remove('active');
    }
    
    const newPage = document.getElementById(`${pageId}-page`);
    newPage.style.display = 'block';
    setTimeout(() => {
        newPage.classList.add('active');
    }, 10);
    
    document.querySelectorAll('.sidebar-menu li a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.sidebar-menu li a[href="#${pageId}"]`).classList.add('active');
    
    document.getElementById('page-title').textContent = 
        pageId === 'dashboard' ? 'Dashboard' :
        pageId === 'institutions' ? 'Instituições' :
        pageId === 'blogs' ? 'Blogs' :
        pageId === 'awards' ? 'Prêmios' :
        pageId === 'risk-map' ? 'Mapa de Risco' :
        pageId === 'alerts' ? 'Alertas' :
        pageId === 'users' ? 'Usuários' :
        pageId === 'reports' ? 'Relatórios' :
        'Configurações';
    
    // Reset card animations
    newPage.querySelectorAll('.card').forEach((card, index) => {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
        card.style.setProperty('--card-index', index);
    });
    
    // Reset stat animations
    newPage.querySelectorAll('.stat-card').forEach((stat, index) => {
        stat.style.animation = 'none';
        stat.offsetHeight;
        stat.style.animation = '';
        stat.style.setProperty('--stat-index', index);
    });
    
    // Initialize or resize map
    if (pageId === 'risk-map') {
        const mapElement = document.getElementById('map');
        mapElement.classList.remove('loaded');
        
        if (!map) {
            map = L.map('map').setView([-8.9308, 13.2017], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            updateMap(reportsData);
            setTimeout(() => {
                mapElement.classList.add('loaded');
            }, 100);
        } else {
            setTimeout(() => {
                map.invalidateSize();
                mapElement.classList.add('loaded');
            }, 100);
        }
    }
}

// Load reports data from API
async function loadReportsData() {
    try {
        const response = await getAuthenticatedFetch('/api/reportagens');
        const data = await response.json();
        if (response.ok) {
            reportsData = data.reports;
            updateStats(reportsData);
            updateMap(reportsData);
            updateChart(reportsData);
            updateActiveCasesTable(reportsData);
            updateResolvedCasesTable(reportsData);
        } else {
            throw new Error(data.message || 'Failed to load reports');
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        if (error.message === 'Unauthorized') {
            window.location.href = 'login.html';
        }
    }
}

// Update stats cards
function updateStats(data) {
    const totalReports = data.length;
    const highRisk = data.filter(item => item.riskLevel === 3).length;
    const mediumRisk = data.filter(item => item.riskLevel === 2).length;
    
    document.getElementById('totalReports').textContent = totalReports;
    document.getElementById('reportsChange').textContent = `${highRisk} alto risco`;
    
    document.getElementById('activeAlerts').textContent = highRisk + mediumRisk;
    document.getElementById('alertsChange').textContent = `${highRisk} críticos`;
    
    document.getElementById('riskZones').textContent = new Set(data.map(item => item.location)).size;
    document.getElementById('zonesChange').textContent = `${highRisk} zonas críticas`;
    
    document.getElementById('activeUsers').textContent = Math.floor(totalReports * 1.5);
    document.getElementById('usersChange').textContent = "+15% este mês";
}

// Update map with markers
function updateMap(data) {
    if (!map) return;
    
    map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });
    
    const validMarkers = [];
    data.forEach(item => {
        if (item.latitude && item.longitude && !isNaN(parseFloat(item.latitude)) && !isNaN(parseFloat(item.longitude))) {
            const lat = parseFloat(item.latitude);
            const lng = parseFloat(item.longitude);
            
            const opacity = item.riskLevel === 3 ? 0.8 : item.riskLevel === 2 ? 0.6 : 0.4;
            
            L.circleMarker([lat, lng], {
                radius: 8,
                fillColor: 'red',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: opacity
            }).addTo(map).bindPopup(`
                <b>${item.title || 'Sem título'}</b><br>
                Local: ${item.location || 'N/A'}<br>
                Risco: ${item.riskLevel === 3 ? 'Alto' : item.riskLevel === 2 ? 'Médio' : 'Baixo'}<br>
                Reportado em: ${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
            `);
            
            validMarkers.push([lat, lng]);
        }
    });
    
    if (validMarkers.length > 0) {
        map.fitBounds(validMarkers);
    } else {
        map.setView([-8.9308, 13.2017], 12);
    }
}

// Update chart
function updateChart(data) {
    const lowRisk = data.filter(item => item.riskLevel === 1).length;
    const mediumRisk = data.filter(item => item.riskLevel === 2).length;
    const highRisk = data.filter(item => item.riskLevel === 3).length;
    
    riskChart.data.datasets[0].data = [lowRisk, mediumRisk, highRisk];
    riskChart.update();
}

// Update active cases table
function updateActiveCasesTable(data) {
    const tableBody = document.getElementById('activeCasesTableBody');
    
    const activeCases = data.filter(item => item.status !== 'fixed');
    
    if (activeCases.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Nenhum caso ativo encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    const sortedData = [...activeCases].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 10);
    
    tableBody.innerHTML = sortedData.map((item, index) => {
        item.tableIndex = index;
        return `
            <tr style="--row-index: ${index};">
                <td>#${index + 1}</td>
                <td>${item.title || 'Sem título'}</td>
                <td>${item.location || 'N/A'}</td>
                <td>
                    <span class="text-${item.riskLevel === 3 ? 'danger' : 
                                      item.riskLevel === 2 ? 'warning' : 'success'}">
                        ${item.riskLevel === 3 ? 'Alto' : item.riskLevel === 2 ? 'Médio' : 'Baixo'}
                    </span>
                </td>
                <td>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewReport(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="confirmReport(${index})">
                        <i class="fas fa-check"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update resolved cases table
function updateResolvedCasesTable(data) {
    const tableBody = document.getElementById('resolvedCasesTableBody');
    
    const resolvedCases = data.filter(item => item.status === 'fixed');
    
    if (resolvedCases.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Nenhum caso resolvido encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    const sortedData = [...resolvedCases].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 10);
    
    tableBody.innerHTML = sortedData.map((item, index) => {
        item.tableIndex = index;
        return `
            <tr style="--row-index: ${index};">
                <td>#${index + 1}</td>
                <td>${item.title || 'Sem título'}</td>
                <td>${item.location || 'N/A'}</td>
                <td>
                    <span class="text-${item.riskLevel === 3 ? 'danger' : 
                                      item.riskLevel === 2 ? 'warning' : 'success'}">
                        ${item.riskLevel === 3 ? 'Alto' : item.riskLevel === 2 ? 'Médio' : 'Baixo'}
                    </span>
                </td>
                <td>${item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewReport(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load institutions data
function loadInstitutionsData() {
    const tableBody = document.getElementById('institutionsTableBody');
    
    if (institutionsData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center;">
                    Nenhuma instituição encontrada.
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = institutionsData.map((item, index) => `
        <tr style="--row-index: ${index};">
            <td>#${item.id}</td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.address}</td>
            <td>${item.contact}</td>
            <td>${item.location}</td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewInstitution(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load blogs data
function loadBlogsData() {
    const tableBody = document.getElementById('blogsTableBody');
    
    if (blogsData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;">
                    Nenhum blog encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = blogsData.map((item, index) => `
        <tr style="--row-index: ${index};">
            <td>#${item.id}</td>
            <td>${item.title}</td>
            <td>${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}</td>
            <td><img src="${item.photoUrl}" class="photo-preview" alt="Blog Photo"></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewBlog(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load awards data
function loadAwardsData() {
    const tableBody = document.getElementById('awardsTableBody');
    
    if (awardsData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;">
                    Nenhum prêmio encontrado.
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = awardsData.map((item, index) => `
        <tr style="--row-index: ${index};">
            <td>#${item.id}</td>
            <td>${item.title}</td>
            <td>${item.description.substring(0, 50)}${item.description.length > 50 ? '...' : ''}</td>
            <td><img src="${item.photoUrl}" class="photo-preview" alt="Award Photo"></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewAward(${item.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// View report details
function viewReport(index) {
    let report;
    const activeCases = reportsData.filter(item => item.status !== 'fixed')
                                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                  .slice(0, 10);
    const resolvedCases = reportsData.filter(item => item.status === 'fixed')
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .slice(0, 10);
    
    if (index < activeCases.length) {
        report = activeCases[index];
    } else {
        const resolvedIndex = index - activeCases.length;
        if (resolvedIndex < resolvedCases.length) {
            report = resolvedCases[resolvedIndex];
        }
    }
    
    if (report) {
        document.getElementById('modalTitle').textContent = 'Relatório';
        document.getElementById('modalReportTitle').textContent = report.title || 'N/A';
        document.getElementById('modalLocation').textContent = report.location || 'N/A';
        document.getElementById('modalRiskLevel').textContent = 
            report.riskLevel === 3 ? 'Alto' : 
            report.riskLevel === 2 ? 'Médio' : 'Baixo';
        document.getElementById('modalDate').textContent = 
            report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A';
        document.getElementById('modalDescription').textContent = report.description || 'N/A';
        
        const modalImage = document.getElementById('modalImage');
        const imageSpinner = document.getElementById('imageSpinner');
        modalImage.classList.remove('loaded');
        imageSpinner.style.display = 'block';
        
        if (report.imageUrl) {
            modalImage.src = '';
            modalImage.src = report.imageUrl;
            modalImage.onload = () => {
                modalImage.classList.add('loaded');
                imageSpinner.style.display = 'none';
            };
            modalImage.onerror = () => {
                modalImage.src = '';
                modalImage.classList.remove('loaded');
                imageSpinner.style.display = 'none';
            };
        } else {
            modalImage.src = '';
            modalImage.classList.remove('loaded');
            imageSpinner.style.display = 'none';
        }
        
        const modal = document.getElementById('reportModal');
        const modalContent = modal.querySelector('.modal-content');
        modal.style.display = 'block';
        setTimeout(() => {
            modalContent.classList.add('visible');
        }, 10);
        document.body.classList.add('modal-open');
        
        modalContent.focus();
    } else {
        alert('Relatório não encontrado.');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('reportModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.classList.remove('visible');
    modalContent.classList.add('closing');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modalContent.classList.remove('closing');
        document.body.classList.remove('modal-open');
    }, 300);
}

// Close modal when clicking outside
document.getElementById('reportModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('reportModal').style.display === 'block') {
        closeModal();
    }
});

// Confirm report
function confirmReport(index) {
    const activeCases = reportsData.filter(item => item.status !== 'fixed')
                                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                  .slice(0, 10);
    const report = activeCases[index];
    
    if (report && confirm(`Deseja confirmar o relatório #${index + 1}?`)) {
        alert(`Relatório #${index + 1} confirmado com sucesso!`);
        loadReportsData();
    }
}

// View institution details
function viewInstitution(id) {
    const institution = institutionsData.find(item => item.id === id);
    if (institution) {
        alert(`Detalhes da Instituição #${id}\n\n` +
              `Nome: ${institution.name}\n` +
              `Tipo: ${institution.type}\n` +
              `Endereço: ${institution.address}\n` +
              `Contacto: ${institution.contact}\n` +
              `Coordenadas: ${institution.location}`);
    }
}

// View blog details
function viewBlog(id) {
    const blog = blogsData.find(item => item.id === id);
    if (blog) {
        alert(`Detalhes do Blog #${id}\n\n` +
              `Título: ${blog.title}\n` +
              `Descrição: ${blog.description}\n` +
              `Foto: ${blog.photoUrl}`);
    }
}

// View award details
function viewAward(id) {
    const award = awardsData.find(item => item.id === id);
    if (award) {
        alert(`Detalhes do Prêmio #${id}\n\n` +
              `Título: ${award.title}\n` +
              `Descrição: ${award.description}\n` +
              `Foto: ${award.photoUrl}`);
    }
}