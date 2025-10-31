
document.addEventListener('DOMContentLoaded', () => {
    
    const surahNumber = getSurahNumberFromURL();

    if (surahNumber) {
        fetchSurahDetail(surahNumber);
    } else {
        
        document.getElementById('surah-title').innerText = "Error";
        document.getElementById('surah-subtitle').innerText = "Nomor surah tidak ditemukan di URL.";
    }
});


function getSurahNumberFromURL() {
    
    const urlParams = new URLSearchParams(window.location.search);
    
    return urlParams.get('surah'); 
}

async function fetchSurahDetail(surahNumber) {
    const container = document.getElementById('ayah-display-container');
    
    
    const urlArabic = `https://api.alquran.cloud/v1/surah/${surahNumber}`;
    
    const urlTranslation = `https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`;

    try {
        
        const [responseArabic, responseTranslation] = await Promise.all([
            fetch(urlArabic),
            fetch(urlTranslation)
        ]);

        if (!responseArabic.ok || !responseTranslation.ok) {
            throw new Error('Gagal mengambil data dari salah satu atau kedua API.');
        }

        const dataArabic = await responseArabic.json();
        const dataTranslation = await responseTranslation.json();

        
        const surahInfo = dataArabic.data; 
        const ayahsArabic = dataArabic.data.ayahs; 
        const ayahsTranslation = dataTranslation.data.ayahs; 

        
        displaySurahHeader(surahInfo);

        
        displayAyahs(ayahsArabic, ayahsTranslation);

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        container.innerHTML = `<p>Maaf, terjadi kesalahan saat memuat data ayat. Coba muat ulang halaman.</p>`;
    }
}

function displaySurahHeader(surahInfo) {
    document.getElementById('surah-title').innerText = `${surahInfo.number}. ${surahInfo.englishName} (${surahInfo.name})`;
    document.getElementById('surah-subtitle').innerText = 
        `Arti: ${surahInfo.englishNameTranslation} | Jumlah Ayat: ${surahInfo.numberOfAyahs} | Turun: ${surahInfo.revelationType}`;
}


function displayAyahs(ayahsArabic, ayahsTranslation) {
    const container = document.getElementById('ayah-display-container');
    container.innerHTML = ''; 

    for (let i = 0; i < ayahsArabic.length; i++) {
        const ayahAr = ayahsArabic[i];
        const ayahTrans = ayahsTranslation[i];

        
        const ayahCard = document.createElement('div');
        ayahCard.className = 'ayah-card'; 

        ayahCard.innerHTML = `
            <div class="ayah-number">${ayahAr.numberInSurah}</div>
            <div class="ayah-content">
                <p class="ayah-arabic">${ayahAr.text}</p>
                <p class="ayah-translation">${ayahTrans.text}</p>
            </div>
        `;

        container.appendChild(ayahCard);
    }
}