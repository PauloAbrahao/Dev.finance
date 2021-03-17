const modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document
        .querySelector('.modal-overlay')
        .classList
        .add('active')
    },
    close() {
        // Fechar o modal
        // Remover a class active do modal
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Design',
        amount: 400000,
        date: '28/02/2021'
    },
    {
        id: 2,
        description: 'Internet',
        amount: -20000,
        date: '28/02/2021'
    },    
    {
        id: 3,
        description: 'Steam',
        amount: -4000,
        date: '28/02/2021'
    },
    {
        id: 4,
        description: 'Varejo',
        amount: -8900,
        date: '17/03/2021'
    },
]

const Transaction = {
    incomes() {
        // Somar as entradas
    },
    expenses() {
        // Somar as saídas
    },
    total() {
        // Entradas - saídas
    }

}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        

        const html = 
        `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}"> ${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html;
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
    }
}

transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})