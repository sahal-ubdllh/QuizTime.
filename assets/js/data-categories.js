// Daftar kategori kuis
const quizCategories = {
    'geografi': 'Geografi',
    'saintek': 'Sains & Teknologi',
    'negara': 'Negara & Bendera',
    'logika': 'Logika',
    'sejarah': 'Sejarah Dunia',
    'seni-budaya': 'Seni & Budaya'
};

function getCategoryName(key) {
    return quizCategories[key] || 'Unknown';
}
