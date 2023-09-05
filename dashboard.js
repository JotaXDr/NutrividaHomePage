
const habitosLista = document.querySelector('.habitos-lista');

function registrarHabito() {
    const dataInput = document.getElementById('data-input');
    const habitoInput = document.getElementById('habito-input');

    const data = dataInput.value;
    const habito = habitoInput.value.trim();

    if (data && habito !== '') {
        // Salvar no localStorage
        const savedHabitos = JSON.parse(localStorage.getItem('habitos')) || [];
        savedHabitos.push({ data, habito });
        localStorage.setItem('habitos', JSON.stringify(savedHabitos));

        carregarHabitos()
    }
}

function carregarHabitos() {
    const savedHabitos = JSON.parse(localStorage.getItem('habitos')) || [];
    habitosLista.innerHTML = ""

    savedHabitos.forEach(item => {
        const habitoElement = document.createElement('div');
        habitoElement.classList.add('habit-item');
        if (item.concluido) {
            habitoElement.style.textDecoration = 'line-through';
        }
        habitoElement.innerHTML = `
            <p>Data: ${item.data}</p>
            <p>Hábito: ${item.habito}</p>
            <button class="complete-button">Concluir</button>
            <button class="delete-button">Excluir</button>
        `;
        habitosLista.appendChild(habitoElement);

        // Adicionar evento para o botão "Concluir"
        const completeButton = habitoElement.querySelector('.complete-button');
        completeButton.addEventListener('click', () => {
            habitoElement.style.textDecoration = 'line-through';
            marcarConcluido(item.habito);
            agendarLembrete(item.habito);
        });

        // Adicionar evento para o botão "Excluir"
        const deleteButton = habitoElement.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            habitosLista.removeChild(habitoElement);
            excluirHabito(item.habito);
        });
    });
}

function excluirHabito(habito) {
    const savedHabitos = JSON.parse(localStorage.getItem('habitos')) || [];
    const updatedHabitos = savedHabitos.filter(item => item.habito !== habito);
    localStorage.setItem('habitos', JSON.stringify(updatedHabitos));
}

document.addEventListener('DOMContentLoaded', () => {
    carregarHabitos();
    criarGraficoProgresso();
});

// Restante do código


function criarGraficoProgresso() {
    const ctx = document.getElementById('progressChart').getContext('2d');

    const activities = ['Beber água', 'Caminhada 30min', 'Refeições Corretas', 'Academia 60min'];
    const progressData = [42, 16, 19, 23];

    const progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: activities,
            datasets: [{
                label: 'Progresso das Atividades',
                data: progressData,
                backgroundColor: 'rgb(75, 192, 192)',
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Progresso das Atividades ao Longo do Tempo'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Progresso'
                    }
                },
                x: {}
            }
        }
    });
}


function agendarLembrete() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        scheduleReminder(taskText);
        taskInput.value = '';
    }
}

function scheduleReminder(taskText) {
    const notificationTime = new Date(Date.now() + 5 * 1000); // Notificação em 5 segundos

    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Lembrete de Tarefa', {
            body: taskText,
            icon: 'path/to/icon.png' // Insira o caminho para um ícone de notificação, se desejar
        });

        notification.onclick = function() {
            // Ação a ser executada quando o usuário clica na notificação
            // Por exemplo, redirecionar para um link ou executar uma função
            alert(`Lembrete: ${taskText}`);
        };
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const notification = new Notification('Lembrete de Tarefa', {
                    body: taskText,
                    icon: 'path/to/icon.png'
                });

                notification.onclick = function() {
                    alert(`Lembrete: ${taskText}`);
                };
            }
        });
    }
}
