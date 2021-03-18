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
        description: 'Design',
        amount: 39900,
        date: '28/02/2021'
    },
    {
        description: 'Internet',
        amount: -20012,
        date: '28/02/2021'
    },    
    {
        description: 'Steam',
        amount: -4000,
        date: '28/02/2021'
    },
    {
        description: 'Varejo',
        amount: -8999,
        date: '17/03/2021'
    },
]

const Transaction = {
    all: transactions,

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload();
    },

    incomes() {
        let income = 0;
        // Pega todas as transações
        // Para cada transação,
        Transaction.all.forEach(transaction => {
            //se o valor for > 0
            if (transaction.amount > 0) {
                // Somar a uma variável e retornar essa variável
                income += transaction.amount
            }
        })
        
        return income
    },
    
    expenses() {
        let expense = 0;
        // Pega todas as transações
        // Para cada transação,
        Transaction.all.forEach(transaction => {
            //se o valor for < 0
            if (transaction.amount < 0) {
                // Somar a uma variável e retornar essa variável
                expense += transaction.amount
            }
        })
        
        return expense
    },
    
    total() {
        return Transaction.incomes() + Transaction.expenses();
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
            <td class="${CSSclass}"> ${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return html;
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        // "/ /" é uma expressão regular, o uso do "\D" é
        // para ele procurar por tudo que não for número e 
        // substituir pelo que estiver entre as aspas " "
        value = String(value).replace(/\D/g, "") 

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}


const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance();
    },

    reload() {
        DOM.clearTransactions(),
        App.init()
    }
}

App.init()

Transaction.remove(0)

