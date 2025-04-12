document.addEventListener('DOMContentLoaded', function() {
    let currentLanguage = 'en';
    const months = {
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        zh: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    };

    // Load data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            initializeWebsite(data);
            renderContent(data, currentLanguage);
            setupLanguageToggle(data);
        })
        .catch(error => console.error('Error loading data:', error));

    function initializeWebsite(data) {
        // Set page title
        document.title = `${data.name.en} | Portfolio`;
        
        // Set profile image if available
        if (data.life_photos) {
            const profileImageContainer = document.getElementById('profile-image-container');
            const img = document.createElement('img');
            img.src = data.life_photos;
            img.alt = data.name.en;
            profileImageContainer.appendChild(img);
        }
    }

    function renderContent(data, language) {
        // Update name and profile
        document.getElementById('name').innerHTML = data.name[language];
        document.getElementById('profile').innerHTML = data.profile[language];
        
        // Update education
        renderEducation(data.education, language);
        
        // Update experience
        renderExperience(data.experience, language);
        
        // Update awards
        renderAwards(data.awards, language);
        
        // Update skills
        renderSkills(data.tech_stack);
        
        // Update all text elements with data attributes
        updateTextElements(language);
    }

    function setupLanguageToggle(data) {
        const langEn = document.getElementById('lang-en');
        const langZh = document.getElementById('lang-zh');
        
        langEn.addEventListener('click', function() {
            if (currentLanguage !== 'en') {
                currentLanguage = 'en';
                renderContent(data, currentLanguage);
                langEn.classList.add('active');
                langZh.classList.remove('active');
            }
        });
        
        langZh.addEventListener('click', function() {
            if (currentLanguage !== 'zh') {
                currentLanguage = 'zh';
                renderContent(data, currentLanguage);
                langZh.classList.add('active');
                langEn.classList.remove('active');
            }
        });
    }

    function renderEducation(education, language) {
        const container = document.getElementById('education-container');
        container.innerHTML = '';
        
        education.forEach(edu => {
            const fromDate = formatDate(edu.from, language);
            const toDate = edu.to === 'present' ? formatPresent(language) : formatDate(edu.to, language);
            
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-header">
                    <div>
                        <h3 class="timeline-title">${edu.degree[language]}</h3>
                        <h4 class="timeline-company">${edu.university[language]}</h4>
                    </div>
                    <span class="timeline-date">${fromDate} - ${toDate}</span>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function renderExperience(experience, language) {
        const pinnedContainer = document.getElementById('pinned-experience-container');
        const otherContainer = document.getElementById('other-experience-container');
        
        pinnedContainer.innerHTML = '';
        otherContainer.innerHTML = '';
        
        // Add "Other Experience" subtitle if there are non-pinned experiences
        if (experience.some(exp => !exp.pin)) {
            const subtitle = document.createElement('h3');
            subtitle.className = 'section-subtitle';
            subtitle.setAttribute('data-en', 'Other Experience');
            subtitle.setAttribute('data-zh', '其他經驗');
            subtitle.textContent = language === 'en' ? 'Other Experience' : '其他經驗';
            
            // Check if subtitle already exists
            const existingSubtitle = otherContainer.previousElementSibling;
            if (existingSubtitle && existingSubtitle.classList.contains('section-subtitle')) {
                existingSubtitle.replaceWith(subtitle);
            } else {
                otherContainer.parentNode.insertBefore(subtitle, otherContainer);
            }
        }
        
        experience.forEach(exp => {
            const container = exp.pin ? pinnedContainer : otherContainer;
            const fromDate = formatDate(exp.from, language);
            const toDate = exp.to === 'present' ? formatPresent(language) : formatDate(exp.to, language);
            
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            let descriptionHTML = '<ul>';
            exp.description[language].forEach(desc => {
                descriptionHTML += `<li>${desc}</li>`;
            });
            descriptionHTML += '</ul>';
            
            item.innerHTML = `
                <div class="timeline-header">
                    <div>
                        <h3 class="timeline-title">${exp.title[language]}</h3>
                        <h4 class="timeline-company">${exp.company[language]}</h4>
                    </div>
                    <span class="timeline-date">${fromDate} - ${toDate}</span>
                </div>
                <div class="timeline-description">
                    ${descriptionHTML}
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    function renderAwards(awards, language) {
        const pinnedContainer = document.getElementById('pinned-awards-container');
        const otherContainer = document.getElementById('other-awards-container');
        
        pinnedContainer.innerHTML = '';
        otherContainer.innerHTML = '';
        
        // Add "Other Awards" subtitle if there are non-pinned awards
        if (awards.some(award => !award.pin)) {
            const subtitle = document.createElement('h3');
            subtitle.className = 'section-subtitle';
            subtitle.setAttribute('data-en', 'Other Awards');
            subtitle.setAttribute('data-zh', '其他獎項');
            subtitle.textContent = language === 'en' ? 'Other Awards' : '其他獎項';
            
            // Check if subtitle already exists
            const existingSubtitle = otherContainer.previousElementSibling;
            if (existingSubtitle && existingSubtitle.classList.contains('section-subtitle')) {
                existingSubtitle.replaceWith(subtitle);
            } else {
                otherContainer.parentNode.insertBefore(subtitle, otherContainer);
            }
        }
        
        awards.forEach(award => {
            const container = award.pin ? pinnedContainer : otherContainer;
            const date = formatDate(award.date, language);
            
            const card = document.createElement('div');
            card.className = award.image ? 'award-card' : 'award-card award-card-no-image';
            
            let cardHTML = '';
            
            // Different layout based on image availability
            if (award.image) {
                cardHTML += `
                    <div class="award-image">
                        <img src="${award.image}" alt="${award.title[language]}">
                    </div>
                `;
            }
            
            let descriptionHTML = '<ul>';
            award.description[language].forEach(desc => {
                descriptionHTML += `<li>${desc}</li>`;
            });
            descriptionHTML += '</ul>';
            

            cardHTML += `
                <div class="award-content">
                    <h3 class="award-title">${award.title[language]}</h3>
                    <span class="award-date">${date}</span>
                    <div class="timeline-description">
                        ${descriptionHTML}
                    </div>
            `;
            
            if (award.link) {
                cardHTML += `
                    <a href="${award.link}" target="_blank" class="award-link">
                        ${language === 'en' ? 'Learn more' : '了解更多'} <i class="fas fa-external-link-alt"></i>
                    </a>
                `;
            }
            
            cardHTML += '</div>';
            card.innerHTML = cardHTML;
            container.appendChild(card);
        });
    }

    function renderSkills(techStack) {
        // Programming Languages
        renderSkillCategory('programming-languages', techStack.programming_languages);
        
        // Frameworks
        renderSkillCategory('frameworks', techStack.frameworks);
        
        // Databases
        renderSkillCategory('databases', techStack.databases);
        
        // Tools
        renderSkillCategory('tools', techStack.tools);
        
        // Cloud Services
        renderSkillCategory('cloud-services', techStack.cloud_services);
        
        // Other
        renderSkillCategory('other-skills', techStack.other);
    }

    function renderSkillCategory(containerId, skills) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        skills.forEach(skill => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            container.appendChild(tag);
        });
    }

    function updateTextElements(language) {
        const elements = document.querySelectorAll('[data-en][data-zh]');
        elements.forEach(el => {
            el.textContent = el.getAttribute(`data-${language}`);
        });
    }

    function formatDate(dateString, language) {
        if (!dateString) return '';
        
        const [year, month] = dateString.split('-');
        const monthIndex = parseInt(month) - 1;
        
        if (language === 'en') {
            return `${months.en[monthIndex]} ${year}`;
        } else {
            return `${year}年${months.zh[monthIndex]}`;
        }
    }

    function formatPresent(language) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        if (language === 'en') {
            return `${months.en[month]} ${year}`;
        } else {
            return `${year}年${months.zh[month]}`;
        }
    }
});