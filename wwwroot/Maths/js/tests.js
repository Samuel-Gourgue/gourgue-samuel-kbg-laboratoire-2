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

        const response = { op: test.op };

        if (test.x !== undefined) response.x = test.x;
        if (test.y !== undefined) response.y = test.y;
        if (test.n !== undefined) response.n = test.n;

        if (result && result.error) {
            response.error = result.error;
            resultList.innerHTML += `<li>OK ---> ${JSON.stringify(response)}</li>`;
            allPassed = false;
        } else if (result && result.value !== undefined) {
            response.value = result.value;
            resultList.innerHTML += `<li>OK ---> ${JSON.stringify(response)}</li>`;
        } else {
            resultList.innerHTML += `<li>Erreur: ${JSON.stringify(test)} - Unknown error occurred</li>`;
            allPassed = false;
        }
    }

    document.getElementById('verdict-text').textContent = allPassed ? 'Bravo!! Aucun problème' : 'Certaines erreurs détectées';
});
