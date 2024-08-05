document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('infoForm').style.display = 'none';
    document.getElementById('countingSection').style.display = 'block';
});

document.getElementById('toggleDarkMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

let doors = [];
let archways = [];

document.getElementById('addButton').addEventListener('click', function() {
    const doorType = document.getElementById('doorType').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    doors.push({ doorType, width, height });
    updateDoorList();
});

document.getElementById('goToArchwaysButton').addEventListener('click', function() {
    document.getElementById('countingSection').style.display = 'none';
    document.getElementById('archwaysSection').style.display = 'block';
});

document.getElementById('addArchwayButton').addEventListener('click', function() {
    const archwaySize = document.getElementById('archwaySize').value;
    archways.push(archwaySize);
    updateArchwayList();
});

document.getElementById('otherCountsAndNotesButton').addEventListener('click', function() {
    document.getElementById('archwaysSection').style.display = 'none';
    document.getElementById('otherCountingsSection').style.display = 'block';
});

document.getElementById('generateReportButton').addEventListener('click', function() {
    generateReport();
});

function updateDoorList() {
    const doorList = document.getElementById('doorList');
    doorList.innerHTML = '';
    doors.forEach((door, index) => {
        const li = document.createElement('li');
        li.textContent = `${door.doorType} - ${door.width} - ${door.height.replace('-', '\'').replace('/', '"')}`;
        doorList.appendChild(li);
    });
}

function updateArchwayList() {
    const archwayList = document.getElementById('archwayList');
    archwayList.innerHTML = '';
    archways.forEach((archway, index) => {
        const li = document.createElement('li');
        li.textContent = `${archway}`;
        archwayList.appendChild(li);
    });
}

function generateReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const inspectorName = document.getElementById('inspectorName').value;
    const buildingName = document.getElementById('buildingName').value;
    const floorLocation = document.getElementById('floorLocation').value;

    const pdfTitle = `${buildingName}_${inspectorName}_${floorLocation}`;

    let y = 10;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.height;

    function addText(text, fontSize = 12) {
        doc.setFontSize(fontSize);
        if (y + lineHeight > pageHeight) {
            doc.addPage();
            y = 10;
        }
        doc.text(text, 10, y);
        y += lineHeight;
    }

    // Add company name and date
    addText('DISTINCT DESIGN TRIM - 22249703 Ontario Inc., 644A Rogers Road, Toronto ON, M6M 1C2');
    addText(`Date: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}`);
    addText('Door Count Report', 18);
    addText(`Inspector Name: ${inspectorName}`);
    addText(`Building Name: ${buildingName}`);
    addText(`Floor/Location: ${floorLocation}`);

    addText('Doors Counted:', 14);
    doors.forEach(door => {
        addText(`${door.doorType} - ${door.width} - ${door.height.replace('-', '\'').replace('/', '"')}`);
    });

    addText('Archways Counted:', 14);
    archways.forEach(archway => {
        addText(`${archway}`);
    });

    addText('Summary:', 14);

    let doorCountSummary = {
        "Single - Standard": 0,
        "Single - French": 0,
        "Double - Standard": 0,
        "Double - French": 0,
        "Slide": 0
    };

    doors.forEach(door => {
        doorCountSummary[door.doorType]++;
    });

    for (const type in doorCountSummary) {
        addText(`${type} Doors: ${doorCountSummary[type]}`);
    }

    // Archway Summary
    let archwayCountSummary = {};
    archways.forEach(archway => {
        if (!archwayCountSummary[archway]) {
            archwayCountSummary[archway] = 0;
        }
        archwayCountSummary[archway]++;
    });

    addText('Archways:', 14);
    for (const archway in archwayCountSummary) {
        addText(`${archway} - Number of Archways: ${archwayCountSummary[archway]}`);
    }

    addText('MISC. MOULDING   TYPE       SIZE        QTY');
    
    function addTableRow(moulding, type, size, qty) {
        addText(`${moulding}   ${type}    ${size}    ${qty}`);
    }

    addTableRow('BASEBOARDS MDF', document.getElementById('baseboardsType').value, document.getElementById('baseboardsSize').value, document.getElementById('baseboardsQty').value);
    addTableRow('DOORS STOP', document.getElementById('doorsStopType').value, document.getElementById('doorsStopSize').value, document.getElementById('doorsStopQty').value);
    addTableRow('FJP QUARTER ROUND', document.getElementById('fjpQuarterRoundType').value, document.getElementById('fjpQuarterRoundSize').value, document.getElementById('fjpQuarterRoundQty').value);
    addTableRow('WINDOW', document.getElementById('windowType').value, document.getElementById('windowSize').value, document.getElementById('windowQty').value);

    addText('Special Notes:', 14);
    addText(document.getElementById('specialNotes').value);

    doc.save(`${pdfTitle}.pdf`);
}
