document.getElementById('start-test-btn').addEventListener('click', async function() {
    const resultList = document.getElementById('results-list');
    resultList.innerHTML = '';

    const tests = [
        { op: '+', x: -111, y: -244 },
        { op: '+', x: 1, y: 'abc' },
        { op: '-', x: 111.56, y: 244.12345 },
        { op: '/', x: 99, y: 0 },
        { op: '*', x: 9, y: ' ' },
        { op: '!', n: 5 },
        { op: 'p', n: 113 },
        { op: 'np', n: 30 },
        { op: '', x: -5 },
    ];

    let allPassed = true;

    for (const test of tests) {
        let result = await Maths_API.Get(test.op, test);
        if (result && result.error) {
            resultList.innerHTML += `<li>Erreur: ${JSON.stringify(test)} - ${result.error}</li>`;
            allPassed = false;
        } else {
            resultList.innerHTML += `<li>OK ---> ${JSON.stringify(test)}: value=${result.value}</li>`;
        }
    }

    document.getElementById('verdict-text').textContent = allPassed ? 'Bravo!! Aucun problème' : 'Certaines erreurs détectées';
});
