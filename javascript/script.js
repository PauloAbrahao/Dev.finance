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

//Momento de alocar as informações de entradas e saídas e os valores no local storage do navegador
const Storage = {
    //Agora ele transforma novamente a string em array por meio do parse ou não retorna nada
    get() {
        return JSON.parse(localStorage.getItem("dev.finances: transactions")) || []
    },
    //Pega os valores do array de transactions e transforma em string pelo construtor JSON.stringify
    set(transactions) {
        localStorage.setItem("dev.finances: transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    /* 
    [
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
    ],*/

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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = 
        `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}"> ${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
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
    formatAmount(value) { //Expressão Regular = tira as vírgulas e pontos
        /*value = Number(value.replace(/\,\./g, "")) * 100*/
        value = value * 100  
        
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

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

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() { //Acessa os valores numéricos das         
                  //estruturas acima (querySelector)
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    //Verificar se todos os dados do form foram preenchidos
    validatedFields() {
        const{ description, amount, date } = Form.getValues() 
         
        //trim = faz uma limpeza dos espaços vazios na string
        if (
            description.trim() === "" || 
            amount.trim() === "" ||
            date.trim() === "" ) { 
                //retorna um novo erro
                throw new Error("Por favor, preencha todos os campos!") 
        }
    },

    //Validar os dados 
    formatValues() {
        let{ description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) { //Envia o event do html para o JS 
                    //através do onsubmit

        event.preventDefault() //Interrompe o evento default

        try {
            Form.validatedFields();
            const transaction = Form.formatValues();

            //Salva a nova transação
            Transaction.add(transaction)

            // Limpando os campos do form
            Form.clearFields()

            modal.close()

        } catch (error) { //Qualquer erro que ocorra esse "catch" vai pegar e capturar a mensagem de erro do validatedFields (throw new Error)
            alert(error.message)
        }

    }

}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()