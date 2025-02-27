const btnMenu = document.querySelector('#btnMenu');
const header = document.getElementsByTagName('header');
const contentFace = document.querySelector('.content-face');
const skillsContent = document.querySelector('.skills .content');
const infoWorkBtn = document.querySelector('.info-work button');
const modal = document.querySelector('.modal');
const infoWorkContainer = document.querySelector('.info-work-container');
const imageWork = document.querySelector('.info-work-container .top img');
const titleWork = document.querySelector('.info-work .title-work-h2');
const textInfoWork = document.querySelector('.info-work .text-info-work');
const dateInfoWork = document.querySelector('.info-work .date-info-work');
const accessProject = document.querySelector('#accessProject');
const accessRepository = document.querySelector('#accessRepository');
const xIconWork = document.querySelector('.title-work .close-modal');
const linksHeader = document.querySelectorAll('.links-header a');
const toTopBtn = document.querySelector('footer button')

btnMenu.addEventListener('click', () => {
    btnMenu.classList.toggle('active');
    header[0].classList.toggle('active')
    document.body.classList.toggle('active');
})

linksHeader.forEach(link => {
    link.addEventListener('click', () => {
        btnMenu.classList.remove('active');
        header[0].classList.remove('active')
        document.body.classList.remove('active');
    })
})

function updatePadding() {
    const altura = header[0].offsetHeight;
    contentFace.style.paddingTop = `calc(${altura}px - 2rem)`;
}

updatePadding();

window.addEventListener('resize', updatePadding);

// Função para mostrar/ocultar os elementos com base no scroll
function handleScroll() {
    const scrollY = window.scrollY;

    document.querySelectorAll('.hidden').forEach(element => {
        if (scrollY == 0) {
            element.classList.remove('show'); // Esconde quando volta ao topo
        }
    });
}

// Observador para detectar elementos visíveis
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

// Aplicar observer nos elementos escondidos
document.querySelectorAll('.hidden').forEach(element => observer.observe(element));

// Evento de scroll para ocultar quando `scrollY === 0`
window.addEventListener('scroll', handleScroll);

fetch('json/listSkills.json') // Busca o arquivo JSON
    .then(response => response.json()) // Converte para objeto JavaScript
    .then(skillsData => { // Manipula os dados
        const skillsContent = document.querySelector('.skills-items');

        skillsData.forEach(skill => {
            const skillItem = document.createElement("div");
            skillItem.classList.add("skill-item");

            const cssSkillsItems = `
                .skill-${skill.class} {
                    width: 40px;
                    height: 40px;
                    background-color: #4abca5;
                    -webkit-mask-image: url('${skill.svgUrl}');
                    mask-image: url('${skill.svgUrl}');
                    transition: .6s ease;
                }

                .skill-item:hover .skill-${skill.class} {
                    background-color: #142745;
                }
            `;

            skillItem.innerHTML = `
                <p>${skill.skill}</p>
                <div alt="${skill.class}">
                    <div class="skill-${skill.class}">
                </div>
            `;

            skillsContent.appendChild(skillItem);
            const styleTag = document.createElement('style');
            styleTag.textContent = cssSkillsItems;
            document.querySelector(`.skill-${skill.class}`).classList.add("svg-icon")
            document.head.appendChild(styleTag);
        });
    })
.catch(error => console.error("Erro ao carregar JSON:", error));

fetch('json/listWorks.json')
    .then(response => response.json())
    .then(worksData => {
        const worksContent = document.querySelector('.works-items');

        worksData.forEach(work => {
            const workItem = document.createElement("div");
            workItem.classList.add("work-item");
            workItem.setAttribute("data-id", work.id)

            workItem.innerHTML = `
                <div class="cover">
                    <img src="${work.image}" alt="${work.work}">
                    <p class="work-name">${work.work}</p>
                </div>

                <div class="info-work">
                    <p>${work.day} de ${work.mouth} de ${work.year}</p>
                    <button type="button">Ver mais</button>
                </div>
            `;

            worksContent.appendChild(workItem);
        });

        document.querySelectorAll('.work-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const clickedItem = event.currentTarget;
                const id = clickedItem.getAttribute('data-id');
                const selectedWork = worksData.find(work => work.id == id);
                console.log(selectedWork);

                if (selectedWork) {
                    imageWork.src = selectedWork.image;
                    titleWork.textContent = selectedWork.work;
                    textInfoWork.innerHTML = selectedWork.textInfo.replace(/\n/g, "<br>");
                    dateInfoWork.textContent = `Última alteração: ${selectedWork.day} de ${selectedWork.mouth} de ${selectedWork.year}`;
                    accessProject.setAttribute('href', selectedWork.hostedProjectLink);
                    accessRepository.setAttribute('href', selectedWork.githubLink);
                    modal.classList.add('active');
                    infoWorkContainer.classList.add('active');
                    document.body.classList.toggle('active');
                }
            });
        });
    })
.catch(error => console.error("Erro ao carregar JSON:", error));

function toggleModal() {
    modal.classList.toggle('active');
    infoWorkContainer.classList.toggle('active');
    document.body.classList.toggle('active');

    // Remove o event listener
    modal.removeEventListener('click', toggleModal);

    // Adiciona de volta após 600ms
    setTimeout(() => {
        modal.addEventListener('click', toggleModal);
}, 600);
}

// Adiciona o event listener inicial
modal.addEventListener('click', toggleModal);
xIconWork.addEventListener('click', toggleModal);

toTopBtn.addEventListener('click', () => {
    window.scrollTo({top: 0})
})