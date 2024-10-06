const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId);
    nav = document.getElementById(navId);

    // Validate that variables exist
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-menu');
        });
    }
}

showMenu('nav-toggle', 'nav-menu');


const navLink = document.querySelectorAll('.nav_link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
}

navLink.forEach(n => n.addEventListener('click', linkAction));


const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive);


function scrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    if (this.scrollY >= 200) {
        scrollTop.classList.add('show-scroll');
    } else {
        scrollTop.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', scrollTop);

const themeButton = document.getElementById('theme-button');
let darkTheme = 'dark-theme';
let darkMode = localStorage.getItem("dark-mode");

function enableDarkMode() {
    document.body.classList.add(darkTheme);
    themeButton.classList.add('fa-sun');
    themeButton.classList.remove('fa-moon');
    localStorage.setItem("dark-mode", "enabled");
};

function disableDarkMode() {
    document.body.classList.remove(darkTheme);
    themeButton.classList.add('fa-moon');
    themeButton.classList.remove('fa-sun');
    localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
    enableDarkMode();
}

themeButton.addEventListener("click", () => {
    darkMode = localStorage.getItem("dark-mode");
    if (darkMode === "disabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});


const downloadButton = document.getElementById('download-button');

downloadButton.addEventListener('click', () => {
    if (document.body.classList.contains(darkTheme)) {
        downloadButton.href = "assets/pdf/myResumeCV-dark.pdf";
    } else {
        downloadButton.href = "assets/pdf/myResumeCV-light.pdf";
    }
});

function addScaleCV() {
    document.body.classList.add("scale-cv");
}

function removeScaleCV() {
    document.body.classList.remove("scale-cv");
}

let areaCV = document.getElementById('area-cv');

let resumeButton = document.getElementById("resume-button");

function generateResume() {
    // PDF filename change depending of the light/dark mode
    if (document.body.classList.contains(darkTheme)) {
        // html2pdf.js options
        let opt = {
            margin: 0,
            filename: 'myResumeCV-dark.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 4, useCORS: true},
            jsPDF: {format: 'a4', orientation: 'portrait'}
        };
        html2pdf(areaCV, opt);
    } else {
        // html2pdf.js options
        let opt = {
            margin: 0,
            filename: 'myResumeCV-light.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 4, useCORS: true},
            jsPDF: {format: 'a4', orientation: 'portrait'}
        };
        html2pdf(areaCV, opt);
    }
}

resumeButton.addEventListener("click", () => {
    // Adapt the area of the PDF
    addScaleCV();
    // Generate the PDF
    generateResume();
    // Remove adaptation after 1 second (you can choose to set more than 1 second if your PDF download time is long)
    setTimeout(removeScaleCV, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
    const cvSelect = document.getElementById('cvSelect');

    // Charger le premier CV par défaut
    loadCV('assets/data/david_brouste.json');

    // Charger un CV en fonction de la sélection
    cvSelect.addEventListener('change', (event) => {
        const selectedCV = event.target.value;
        loadCV('assets/data/' + selectedCV);
    });
});

function updateContent(selector, callback) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 1) {
        // Un seul élément trouvé, on applique le callback directement
        callback(elements[0]);
    } else if (elements.length > 1) {
        // Plusieurs éléments trouvés, on boucle pour appliquer le callback à chaque élément
        elements.forEach(callback);
    } else {
        console.warn(`Aucun élément trouvé pour le sélecteur: ${selector}`);
    }
}

function loadCV(cvPath) {
    fetch(cvPath)
        .then(response => response.json())
        .then(data => {
            // Mettre à jour les éléments du DOM avec les données JSON
            updateContent('.firstname', el => el.innerHTML = data.firstname);
            updateContent('.lastname', el => el.innerHTML = data.lastname);
            updateContent('#home-img', el => el.src = data.profil_path);
            updateContent('.home_profession', el => el.innerHTML = data.profession);
            updateContent('.home_information:nth-child(1)', el => {
                el.querySelector('.home_icon').insertAdjacentText('afterend', ` ${data.location}`);
            });
            updateContent('.home_information:nth-child(2) a', el => {
                el.href = `mailto:${data.email}`;
                el.querySelector('.home_icon').insertAdjacentText('afterend', ` ${data.email}`);
            });
            updateContent('.home_information:nth-child(3) a', el => {
                el.href = `tel:${data.phoneWithIndicator}`;
                el.querySelector('.home_icon').insertAdjacentText('afterend', ` ${data.phone}`);
            });
            updateContent('.profile_description', el => el.innerHTML = data.profile);

            data.social.forEach((social) => {
                document.querySelector('.social_container').innerHTML += `                            
        <a href="${social.href}" target="_blank" class="social_link">
            <i class="fa-brands ${social.icon} social_icon"></i> ${social.description}
        </a>`;
            });

            // Mettre à jour les compétences
            const skillsContent = document.querySelector('.skills_content');
            skillsContent.innerHTML = '';
            data.skills.forEach(skill => {
                skillsContent.innerHTML += `
          <div class="skills_name">
            <span class="skills_text">${skill.name}</span>
            <div class="skills_box">
              <span class="skills_progress" style="width: ${skill.level};"></span>
            </div>
          </div>
        `;
            });

            // Mettre à jour les langues
            const languages = data.languages;
            const languageList = document.querySelector('.languages_content');
            languageList.innerHTML = '';
            languages.forEach(lang => {
                // Générer les étoiles dynamiquement en fonction du niveau (level)
                let starsHtml = '';

                for (let i = 0; i < 5; i++) {
                    if (i < lang.level) {
                        starsHtml += '<i class="fa-solid fa-star"></i>';
                    } else {
                        starsHtml += '<i class="fa-solid fa-star languages_stars_checked"></i>';
                    }
                }

                // Ajouter l'élément HTML pour chaque langue
                languageList.innerHTML += `
      <li class="languages_name">
        <span class="languages_text">${lang.description}</span>
        <span class="languages_stars">${starsHtml}</span>
      </li>
    `;
            });

            const experiences = document.querySelector('.experience_container');
            experiences.innerHTML = '';
            const nbExp = data.experiences.length;
            let i = 1;
            data.experiences.forEach(experience => {
                experiences.innerHTML += `
                <div class="experience_content">
                    <div class="experience_time">
                        <span class="experience_rounder"></span>
                        ${i !== nbExp ? '<span class="experience_line"></span>' : ''}
                    </div>
                    <div class="experience_data bd-grid">
                        <h3 class="experience_title">${experience.title}</h3>
                        <span class="experience_company">${experience.company}</span>
                        <span class="experience_year">${experience.year}</span>
                        <p class="experience_description">${experience.description}</p>
                    </div>
                </div>
        `;
                i++;
            });

            const educations = document.querySelector('.education_container');
            educations.innerHTML = '';
            const nbEdu = data.educations.length;
            i = 1;
            data.educations.forEach(education => {
                educations.innerHTML += `
                <div class="education_content">
                    <div class="education_time">
                        <span class="education_rounder"></span>
                        ${i !== nbEdu ? '<span class="education_line"></span>' : ''}
                    </div>
                    <div class="education_data bd-grid">
                        <h3 class="education_title">${education.title}</h3>
                        <span class="education_studies">${education.studies}</span>
                        <span class="education_year">${education.year}</span>
                    </div>
                </div>
        `;
                i++;
            });

            const interests = document.querySelector('.interests_container');
            interests.innerHTML = '';
            data.interests.forEach(interest => {
                interests.innerHTML += `
            <div class="interests_content">
                <i class="fa-solid ${interest.icon} interests_icon"></i>
                <span class="interests_name">${interest.title}</span>
            </div>
        `;
            });
        })
        .catch(error => console.error('Erreur lors du chargement des données JSON:', error));
}