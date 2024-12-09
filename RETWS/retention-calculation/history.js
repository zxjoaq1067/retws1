function clearRetentionLog() {
    localStorage.removeItem('clients');
    document.getElementById('client-history').getElementsByTagName('tbody')[0].innerHTML = '';
    document.getElementById('retention-percentage').innerText = 'Taxa de Retenção: 0.00%';
}

function calculateRetention() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Fetch client data from local storage
    const clients = JSON.parse(localStorage.getItem('clients')) || [];

    // Update status for clients with "vencimento" to "visita tecnica"
    clients.forEach(client => {
        if (client.status === 'vencimento') {
            client.status = 'visita tecnica';
            client.reason = 'Visita técnica agendada';
        }
    });

    const filteredClients = clients.filter(client => {
        const clientDate = new Date(client.date);
        return clientDate >= new Date(startDate) && clientDate <= new Date(endDate);
    });

    const retainedCount = filteredClients.filter(client => client.status === 'retido').length;
    const canceledCount = filteredClients.filter(client => client.status === 'nao-retido').length;
    const totalClients = retainedCount + canceledCount;

const initialTotalWeight = totalClients;
const adjustedTotalWeight = (retainedCount * 1) - (canceledCount * 2);
const retentionPercentage = Math.max((adjustedTotalWeight / initialTotalWeight) * 100, 0);
// Explanation: 1 retido = 1 retido, 1 cancelado = 2 retidos
// Example: 4 clientes, 1 cancelado, 3 revertidos -> initialTotalWeight = 4, adjustedTotalWeight = (3 * 1) - (1 * 2) = 1, retentionPercentage = (1 / 4) * 100 = 25%
// Note: The retention percentage is clamped to a minimum of 0% to avoid negative values.

    // Get the desired retention percentage
    const desiredRetention = parseFloat(document.getElementById('desired-retention').value);

    // Display retention percentage
    const retentionPercentageElement = document.getElementById('retention-percentage');
    retentionPercentageElement.textContent = `Taxa de Retenção: ${retentionPercentage.toFixed(2)}%`;

    // Change color based on desired retention
    if (retentionPercentage >= desiredRetention) {
        retentionPercentageElement.classList.add('green');
        retentionPercentageElement.classList.remove('red');
    } else {
        retentionPercentageElement.classList.add('red');
        retentionPercentageElement.classList.remove('green');
    }

    const clientHistoryTable = document.getElementById('client-history').getElementsByTagName('tbody')[0];
    clientHistoryTable.innerHTML = '';

    filteredClients.forEach(client => {
        const row = clientHistoryTable.insertRow();
        const nameCell = row.insertCell(0);
        const contractCell = row.insertCell(1);
        const statusCell = row.insertCell(2);
        const reasonCell = row.insertCell(3); // New column for reason

        nameCell.innerText = client.clientName;
        contractCell.innerText = client.contract;
        statusCell.innerText = client.status;
        statusCell.style.color = client.status === 'retido' ? 'green' : 'red';
        reasonCell.innerText = client.reason || ''; // Display reason if available
    });
}
