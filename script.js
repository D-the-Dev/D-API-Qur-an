let allSurahsData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchSurahList();
    const searchInput = document.getElementById('search-bar');
    searchInput.addEventListener('input', (event) => {
        handleSearch(event.target.value);
    });
});

async function fetchSurahList() {
    const url = 'https://api.alquran.cloud/v1/surah';
    const container = document.getElementById('surah-list-container');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Gagal mengambil data. Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            allSurahsData = data.data; 
            displaySurahList(allSurahsData);
        } else {
            container.innerHTML = '<p>Tidak ada data surah yang ditemukan.</p>';
        }

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        container.innerHTML = `<p>Maaf, terjadi kesalahan saat memuat data. Coba muat ulang halaman.</p>`;
        console.error(error); 
    }
}

function handleSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    const filteredSurahs = allSurahsData.filter(surah => {
        const nameLatin = surah.englishName.toLowerCase();
        const nameTranslation = surah.englishNameTranslation.toLowerCase();
        const number = surah.number.toString();
        
        return nameLatin.includes(normalizedQuery) ||
               nameTranslation.includes(normalizedQuery) ||
               number.includes(normalizedQuery);
    });

    displaySurahList(filteredSurahs);
}

function displaySurahList(surahArray) {
    const container = document.getElementById('surah-list-container');
    container.innerHTML = '';

    if (surahArray.length === 0) {
        container.innerHTML = '<p class="no-results">Tidak ada surah yang cocok dengan pencarianmu.</p>';
        return;
    }

    surahArray.forEach(surah => {
        const surahCard = document.createElement('div');
        surahCard.className = 'surah-card';

        surahCard.innerHTML = `
            <div class="surah-info-left">
                <span class="surah-number">${surah.number}</span>
                <div class="surah-name-details">
                    <span class="surah-name-latin">${surah.englishName}</span>
                    <span class="surah-translation">${surah.englishNameTranslation}</span>
                </div>
            </div>
            <div class="surah-info-right">
                <span class="surah-name-arabic">${surah.name}</span>
                <span class="surah-verses">${surah.numberOfAyahs} Ayat</span>
            </div>
        `;

        surahCard.addEventListener('click', () => {
            window.location.href = `detail.html?surah=${surah.number}`;
        });

        container.appendChild(surahCard);
    });
}
