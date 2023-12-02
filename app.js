// Importe as bibliotecas do Firebase Storage
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js"; // Importe as bibliotecas corretas do Firebase Storage

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAJYyBYOVdRWIRRe3NuHWnEOxMwVxRZDbA",
    authDomain: "tirafoto-e05e9.firebaseapp.com",
    projectId: "tirafoto-e05e9",
    storageBucket: "tirafoto-e05e9.appspot.com",
    messagingSenderId: "584170287207",
    appId: "1:584170287207:web:2d79b5b259be579150a4c2",
    measurementId: "G-1ZB2P99KGG"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firebase Storage
const storage = getStorage(app);

// Variável global para rastrear o índice da imagem atual
let currentImageIndex = 0;

// Variável global para armazenar as URLs das imagens
const images = [];

async function listarFotos() {
    try {
        const storageRef = ref(storage); // Raiz do seu bucket
        const files = await listAll(storageRef);

        // Ordenar os arquivos pela data (os mais recentes primeiro)
        const sortedFiles = files.items.sort((a, b) => b.timeCreated - a.timeCreated);

        const imageList = document.getElementById('imageList');

        // Limpar qualquer conteúdo existente na div
        imageList.innerHTML = '';

        // Loop através dos arquivos e criar elementos HTML para exibi-los
        sortedFiles.forEach(async (item) => {
            const url = await getDownloadURL(item);

            // Criar um elemento de coluna no Bootstrap para cada imagem
            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4'); // Defina o tamanho da coluna conforme necessário

            // Criar um elemento de cartão no Bootstrap
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', 'mb-4', 'image-card');

            // Criar uma imagem
            const img = document.createElement('img');
            img.src = url;
            img.classList.add('card-img-top');

            // Adicionar a imagem ao cartão
            cardDiv.appendChild(img);

            // Adicionar um evento de clique para abrir o modal
            img.addEventListener('click', () => {
                const modalImage = document.getElementById('modalImage');
                modalImage.src = url;
                currentImageIndex = images.findIndex((imgUrl) => imgUrl === url);
                $('#imageModal').modal('show'); // Exibe o modal
            });

            // Armazenar a URL da imagem no array
            images.push(url);

            // Adicionar o cartão à coluna
            colDiv.appendChild(cardDiv);

            // Adicionar a coluna à lista de imagens
            imageList.appendChild(colDiv);
        });

        // Inicializar o Swiper para criar o slider de galeria
        new Swiper('.swiper-container', {
            loop: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

    } catch (error) {
        console.error("Erro ao listar fotos:", error);
    }
}

function showNextImage() {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateModalImage();
    }
}

function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
}

function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = images[currentImageIndex];
}

// Adicione um evento de teclado global para as setas esquerda e direita
document.addEventListener('keydown', (event) => {
    if ($('#imageModal').is(':visible')) {
        if (event.key === 'ArrowRight') {
            showNextImage();
        } else if (event.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// Chame a função para listar fotos quando necessário
listarFotos();
