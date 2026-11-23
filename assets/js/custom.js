document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("custom-contact-form");
  const btnSubmit = document.getElementById("btn-submit");
  const btnClear = document.getElementById("btn-clear");
  const resultsContainer = document.getElementById("form-results");
  const resultsContent = document.getElementById("results-content");

  // Laukai
  const fields = {
    vardas: document.getElementById("vardas"),
    pavarde: document.getElementById("pavarde"),
    email: document.getElementById("email"),
    telefonas: document.getElementById("telefonas"),
    adresas: document.getElementById("adresas"),
    q1: document.getElementById("q1"),
    q2: document.getElementById("q2"),
    q3: document.getElementById("q3")
  };

  // RegEx taisyklės
  const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/; // Tik raidės
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // El. pašto formatas

  // Slankiklių reikšmių atnaujinimas realiu laiku
  ['q1', 'q2', 'q3'].forEach(q => {
    fields[q].addEventListener('input', (e) => {
      document.getElementById(`${q}-val`).textContent = e.target.value;
      validateForm();
    });
  });

  // Telefono numerio formatavimas realiu laiku (+370 6xx xxxxx)
  fields.telefonas.addEventListener('input', (e) => {
    let digits = e.target.value.replace(/\D/g, ''); // Paliekame tik skaičius
    if (digits.startsWith('370')) digits = digits.substring(3);
    if (digits.length > 8) digits = digits.substring(0, 8); // Max 8 skaičiai po +370
    
    let formatted = '';
    if (digits.length > 0) {
      formatted = '+370';
      if (digits.length > 0) formatted += ' ' + digits.substring(0, 3);
      if (digits.length > 3) formatted += ' ' + digits.substring(3, 8);
    }
    e.target.value = formatted;
    validateForm();
  });

  // Realaus laiko validacija kitiems laukams
  ['vardas', 'pavarde', 'email', 'adresas'].forEach(id => {
    fields[id].addEventListener('input', validateForm);
  });

  // Validacijos funkcija
  function validateForm() {
    let isValid = true;

    // Vardas
    if (!fields.vardas.value.trim() || !nameRegex.test(fields.vardas.value)) {
      showError(fields.vardas, "Vardas privalomas ir turi būti tik iš raidžių.");
      isValid = false;
    } else clearError(fields.vardas);

    // Pavardė
    if (!fields.pavarde.value.trim() || !nameRegex.test(fields.pavarde.value)) {
      showError(fields.pavarde, "Pavardė privaloma ir turi būti tik iš raidžių.");
      isValid = false;
    } else clearError(fields.pavarde);

    // El. paštas
    if (!fields.email.value.trim() || !emailRegex.test(fields.email.value)) {
      showError(fields.email, "Įveskite teisingą el. paštą.");
      isValid = false;
    } else clearError(fields.email);

    // Telefonas
    if (fields.telefonas.value.replace(/\D/g, '').length !== 11) {
      showError(fields.telefonas, "Įveskite teisingą numerį (+370 6XX XXXXX).");
      isValid = false;
    } else clearError(fields.telefonas);

    // Adresas
    if (!fields.adresas.value.trim()) {
      showError(fields.adresas, "Adresas yra privalomas.");
      isValid = false;
    } else clearError(fields.adresas);

    // Mygtuko aktyvavimas
    btnSubmit.disabled = !isValid;
    return isValid;
  }

  // Klaidų rodymo ir slėpimo funkcijos
  function showError(input, message) {
    input.classList.add('input-error');
    input.classList.remove('input-success');
    document.getElementById(`${input.id}-error`).textContent = message;
  }

  function clearError(input) {
    input.classList.remove('input-error');
    if(input.value.trim() !== '') input.classList.add('input-success');
    document.getElementById(`${input.id}-error`).textContent = "";
  }

  // Formos pateikimas (Submit)
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Sustabdo puslapio perkrovimą

    if (!validateForm()) return;

    // JS Objekto sukūrimas
    const formData = {
      Vardas: fields.vardas.value.trim(),
      Pavarde: fields.pavarde.value.trim(),
      El_pastas: fields.email.value.trim(),
      Telefonas: fields.telefonas.value.trim(),
      Adresas: fields.adresas.value.trim(),
      Klausimas_1: parseInt(fields.q1.value),
      Klausimas_2: parseInt(fields.q2.value),
      Klausimas_3: parseInt(fields.q3.value)
    };

    // Vidurkio skaičiavimas
    const average = ((formData.Klausimas_1 + formData.Klausimas_2 + formData.Klausimas_3) / 3).toFixed(1);

    // Išvedimas į konsolę
    console.log("Išsaugoti formos duomenys:", formData);

    // Atvaizdavimas svetainėje
    resultsContent.innerHTML = `
      <p><strong>Vardas:</strong> ${formData.Vardas}</p>
      <p><strong>Pavardė:</strong> ${formData.Pavarde}</p>
      <p><strong>El. paštas:</strong> <a href="mailto:${formData.El_pastas}">${formData.El_pastas}</a></p>
      <p><strong>Tel. Numeris:</strong> ${formData.Telefonas}</p>
      <p><strong>Adresas:</strong> ${formData.Adresas}</p>
      <hr>
      <p class="fs-5"><strong>${formData.Vardas} ${formData.Pavarde}:</strong> ${average} <em>(įvertinimų vidurkis)</em></p>
    `;
    resultsContainer.classList.remove('d-none'); // Parodome bloką
  });

  // Formos išvalymas (Clear)
  btnClear.addEventListener('click', () => {
    form.reset();
    ['q1', 'q2', 'q3'].forEach(q => document.getElementById(`${q}-val`).textContent = "5");
    Object.values(fields).forEach(input => {
      input.classList.remove('input-error', 'input-success');
      if (document.getElementById(`${input.id}-error`)) {
        document.getElementById(`${input.id}-error`).textContent = "";
      }
    });
    resultsContainer.classList.add('d-none');
    resultsContent.innerHTML = "";
    btnSubmit.disabled = true;
  });

});
// ==========================================
// LD 12: Kanban Įgūdžių Lenta (Interaktyvumas)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Duomenų masyvas (Pradiniai duomenys)
    const defaultSkills = [
        { id: 1, name: "Python duomenų analizė", state: "Planuojama", xp: 50 },
        { id: 2, name: "Saulės elektrinių projektavimas", state: "Planuojama", xp: 60 },
        { id: 3, name: "AutoCAD 3D modeliavimas", state: "Mokomasi", xp: 50 },
        { id: 4, name: "Išmaniųjų tinklų inžinerija", state: "Mokomasi", xp: 40 },
        { id: 5, name: "C/C++ pagrindai", state: "Atlikta", xp: 50 },
        { id: 6, name: "SQL duomenų bazių valdymas", state: "Atlikta", xp: 60 },
        { id: 7, name: "MATLAB inžineriniai skaičiavimai", state: "Atlikta", xp: 40 }
    ];

    // Local Storage patikrinimas (Papildoma užduotis)
    let skills = JSON.parse(localStorage.getItem('kanbanSkills'));
    if (!skills) {
        skills = defaultSkills; // Jei tuščia, imam pradinius
    }

    // 2. Pagrindinės funkcijos (Kaip reikalaujama suskirstyti)

    // A. Funkcija kortelių atvaizdavimui
    function renderCards() {
        // Išvalome stulpelius
        document.getElementById('col-planuojama').innerHTML = '<h5 class="kanban-title text-center">Planuojama</h5>';
        document.getElementById('col-mokomasi').innerHTML = '<h5 class="kanban-title text-center">Mokomasi</h5>';
        document.getElementById('col-atlikta').innerHTML = '<h5 class="kanban-title text-center">Atlikta</h5>';

        skills.forEach(skill => {
            // Sukuriame kortelės HTML
            const cardHTML = `
                <div class="kanban-card">
                    <h6>${skill.name}</h6>
                    <span class="status status-${skill.state.toLowerCase()}">${skill.state}</span>
                    <span class="xp-value">${skill.xp} XP</span>
                    
                    <div class="kanban-actions">
                        ${skill.state !== 'Planuojama' ? `<button class="btn-state" onclick="changeState(${skill.id}, 'Planuojama')">Į Planuojama</button>` : ''}
                        ${skill.state !== 'Mokomasi' ? `<button class="btn-state" onclick="changeState(${skill.id}, 'Mokomasi')">Į Mokomasi</button>` : ''}
                        ${skill.state !== 'Atlikta' ? `<button class="btn-state" onclick="changeState(${skill.id}, 'Atlikta')">Į Atlikta</button>` : ''}
                    </div>
                </div>
            `;
            // Įdedame į atitinkamą stulpelį
            document.getElementById(`col-${skill.state.toLowerCase()}`).innerHTML += cardHTML;
        });
    }

    // B. Funkcija XP, Lygio ir Progreso perskaičiavimui
    function calculateProgress() {
        let totalXP = 0;
        let totalSkills = skills.length;
        let completedSkills = 0;

        // Skaičiuojame tik tuos XP, kurie yra "Atlikta" būsenoje
        skills.forEach(skill => {
            if (skill.state === "Atlikta") {
                totalXP += skill.xp;
                completedSkills++;
            }
        });

        // Lygio ir Rango nustatymas pagal XP
        let level = 1, rank = "Pradedantysis", nextLvlXP = 50, currentBase = 0;
        
        if (totalXP >= 300) {
            level = 4; rank = "Profesionalas"; currentBase = 300; nextLvlXP = 300; // Maksimalus lygis
        } else if (totalXP >= 150) {
            level = 3; rank = "Specialistas"; currentBase = 150; nextLvlXP = 300;
        } else if (totalXP >= 50) {
            level = 2; rank = "Praktikantas"; currentBase = 50; nextLvlXP = 150;
        }

        // Progreso procento skaičiavimas juostai
        let progressPercent = 100;
        let missingXP = 0;
        if (level < 4) {
            let xpInCurrentLevel = totalXP - currentBase;
            let xpNeededForNext = nextLvlXP - currentBase;
            progressPercent = (xpInCurrentLevel / xpNeededForNext) * 100;
            missingXP = nextLvlXP - totalXP;
        }

        // C. Atnaujiname HTML elementus (Statistika ir Profilis)
        document.getElementById('user-level').textContent = level;
        document.getElementById('user-rank').textContent = rank;
        document.getElementById('user-xp').textContent = totalXP;
        
        if (level === 4) {
            document.getElementById('progress-text').textContent = `Pasiektas maksimalus lygis! (${totalXP} XP)`;
        } else {
            document.getElementById('progress-text').textContent = `Iki ${level + 1} lygio (trūksta ${missingXP} XP)`;
        }
        document.getElementById('progress-fill').style.width = `${progressPercent}%`;

        document.getElementById('stat-total').textContent = totalSkills;
        document.getElementById('stat-done').textContent = completedSkills;
        document.getElementById('stat-percent').textContent = Math.round((completedSkills / totalSkills) * 100);
    }

    // Būsenos keitimo funkcija (Pasiekiama globaliai, kad mygtukai matytų)
    window.changeState = function(id, newState) {
        // Randame įgūdį masyve ir pakeičiame būseną
        let skill = skills.find(s => s.id === id);
        if (skill) {
            skill.state = newState;
        }
        // Išsaugome naršyklėje
        localStorage.setItem('kanbanSkills', JSON.stringify(skills));
        
        // Atnaujiname vaizdą
        renderCards();
        calculateProgress();
    };

    // 3. Paleidžiame pradines funkcijas užsikrovus puslapiui
    if (document.getElementById('col-planuojama')) { // Patikrinam ar esame tame puslapyje
        renderCards();
        calculateProgress();
    }
});

