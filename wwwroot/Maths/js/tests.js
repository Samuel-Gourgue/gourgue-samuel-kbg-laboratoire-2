document.getElementById('start-test-btn').addEventListener('click', async function() {
    const resultList = document.getElementById('results-list');
    resultList.innerHTML = '';

    const tests = [
        { op: '+', x: -111, y: -244 },
        { op: '+', x: 1, y: 'abc' },
        { n: 'a', op: 'p' },
        { op: '-', x: 111, y: 244 },
        { op: '*', x: 11.56, y: 244.12345 },
        { op: '/', x: 99, y: 11.06 },
        { op: '/', x: 99, y: 0 },
        { op: '/', x: 0, y: 0 },
        { op: '%', x: 5, y: 5 },
        { op: '%', x: 100, y: 13 },
        { op: '%', x: 100, y: 0 },
        { op: '%', x: 0, y: 0 },
        { n: 0, op: '!' },
        { n: 0, op: 'p' },
        { n: 1, op: 'p' },
        { n: 2, op: 'p' },
        { n: 5, op: 'p' },
        { n: 6, op: 'p' },
        { n: 6.5, op: 'p' },
        { n: 113, op: 'p' },
        { n: 114, op: 'p' },
        { n: 1, op: 'np' },
        { n: 30, op: 'np' },
        { X: 111, op: '+', y: 244 },
        { Y: 244, op: '+', x: 111 },
        { op: '+', x: 111, y: 244, z: 0 },
        { n: 5, op: '!', z: 0 },
        { n: 5.5, op: '!' },
        { z: 0 },
        { n: -5, op: '!' },
        { x: null },
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
            allPassed = true;
        } else if (result && result.value !== undefined) {
            response.value = result.value;
            resultList.innerHTML += `<li>OK ---> ${JSON.stringify(response)}</li>`;
        } else {
            resultList.innerHTML += `<li>Erreur: ${JSON.stringify(test)} - Erreur inconnue</li>`;
            allPassed = false;
        }
    }

    if (allPassed) {
        document.getElementById('verdict-text').textContent = 'Bravo!! Aucun problème';
    } else {
        document.getElementById('verdict-text').textContent = 'Certaines erreurs détectées';
    }
});
