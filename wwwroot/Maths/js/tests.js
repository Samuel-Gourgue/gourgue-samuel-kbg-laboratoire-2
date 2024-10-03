document.getElementById('start-test').addEventListener('click', runTests);

async function runTests() {
    const serviceUrl = document.getElementById('service-url').value;
    const resultsElem = document.getElementById('results');
    const verdictElem = document.getElementById('verdict-text');

    const tests = [
        { op: "+", x: -111, y: -244 },
        { op: "-", x: 1, y: "abc" },
        { op: "*", x: 11.56, y: 244.12345 },
        { op: "/", x: 99, y: 11.06 },
        { op: "/", x: 99, y: 0 },
        { op: "!", n: 5 },
        { op: "p", n: 11 },
        { op: "np", n: 30 }
    ];

    resultsElem.textContent = "";

    let allTestsPassed = true;

    for (const test of tests) {
        const url = `${serviceUrl}?op=${test.op}&x=${test.x}&y=${test.y}&n=${test.n}`;
        
        try {
            const response = await fetch(url);
            const result = await response.json();
            resultsElem.textContent += `OK ---> ${JSON.stringify(result)}\n`;
            if (result.error) {
                allTestsPassed = false;
            }
        } catch (error) {
            resultsElem.textContent += `ERREUR ---> ${error.message}\n`;
            allTestsPassed = false;
        }
    }
    verdictElem.textContent = allTestsPassed ? "Bravo!! Aucun problème" : "Des erreurs ont été détectées.";
}
