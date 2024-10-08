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
        { op: '%', x: 50, y: 7 },
        { op: '', x: -5 },
    ];

    let allPassed = true;

    for (const test of tests) {
        let result;
        try {
            result = await API_Get(test.op, test);
        } catch (error) {
            resultList.innerHTML += `<li>Erreur: ${JSON.stringify(test)} - ${error.message}</li>`;
            allPassed = false;
            continue;
        }

        if (result && result.error) {
            resultList.innerHTML += `<li>Erreur: ${JSON.stringify(test)} - ${result.error}</li>`;
            allPassed = false;
        } else {
            const response = { op: test.op };
            if (test.x !== undefined && test.x !== null) response.x = test.x;
            if (test.y !== undefined && test.y !== null) response.y = test.y;
            if (test.n !== undefined && test.n !== null) response.n = test.n;

            if (result.value !== undefined) {
                response.value = result.value;
            } else if (result.error) {
                response.error = result.error;
            }

            resultList.innerHTML += `<li>OK ---> ${JSON.stringify(response)}</li>`;
        }
    }

    document.getElementById('verdict-text').textContent = allPassed ? 'Bravo!! Aucun problème' : 'Certaines erreurs détectées';
});
