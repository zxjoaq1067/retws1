document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('retention-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

const clientName = document.getElementById('client-name').value;
const status = document.getElementById('status').value;
const reason = document.getElementById('reason').value;
const contract = document.getElementById('contract').value; // Add the contract field

const result = {
    clientName: clientName,
    status: status,
    reason: reason,
    contract: contract, // Add the contract field
    date: new Date().toISOString().split('T')[0] // Add the current date
};

        // Store the client data in local storage
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients.push(result);
        localStorage.setItem('clients', JSON.stringify(clients));

        console.log(result);

        // Clear the form
        form.reset();
    });

    function openTab(tabName) {
        const tabcontent = document.getElementsByClassName('tabcontent');
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = 'none';
        }
        document.getElementById(tabName).style.display = 'block';
    }

    // Ensure the first tab is active by default
    document.querySelector('.tab').classList.add('active');
    document.getElementById('home').classList.add('active');

    // Add event listeners to the tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to the clicked tab
            this.classList.add('active');
            // Open the corresponding tab content
            openTab(this.getAttribute('onclick').split("'")[1]);
        });
    });

function calculateRetention() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Fetch client data from local storage
    const clients = JSON.parse(localStorage.getItem('clients')) || [];

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

    const retentionPercentageElement = document.getElementById('retention-percentage');
    if (retentionPercentageElement) {
        retentionPercentageElement.innerText = `Taxa de Retenção: ${retentionPercentage.toFixed(2)}%`;
    } else {
        const retentionPercentageDiv = document.createElement('div');
        retentionPercentageDiv.id = 'retention-percentage';
        retentionPercentageDiv.innerText = `Taxa de Retenção: ${retentionPercentage.toFixed(2)}%`;
        document.getElementById('history').appendChild(retentionPercentageDiv);
    }

    const clientHistoryTable = document.getElementById('client-history').getElementsByTagName('tbody')[0];
    clientHistoryTable.innerHTML = '';

    filteredClients.forEach(client => {
        const row = clientHistoryTable.insertRow();
        const nameCell = row.insertCell(0);
        const contractCell = row.insertCell(1);
        const statusCell = row.insertCell(2);
        const reasonCell = row.insertCell(3); // Add the reason cell

        nameCell.innerText = client.clientName;
        contractCell.innerText = client.contract;
        statusCell.innerText = client.status;
        statusCell.style.color = client.status === 'retido' ? 'green' : 'red';
        reasonCell.innerText = client.reason; // Add the reason
    });
}
});
