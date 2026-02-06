const STREAM_ORDER = ["Engineering", "Medical", "Management", "Commerce", "Law"];

const COLLEGE_DATA =
    (typeof STATEWISE_COLLEGES !== "undefined" && Array.isArray(STATEWISE_COLLEGES))
        ? STATEWISE_COLLEGES
        : (Array.isArray(window.STATEWISE_COLLEGES) ? window.STATEWISE_COLLEGES : []);

const stateFilter = document.getElementById("stateFilter");
const cityFilter = document.getElementById("cityFilter");
const streamFilter = document.getElementById("streamFilter");
const typeFilter = document.getElementById("typeFilter");
const allFilterBtn = document.getElementById("allFilterBtn");
const resultCount = document.getElementById("resultCount");
const programCounts = document.getElementById("programCounts");
const collegeTableBody = document.getElementById("collegeTableBody");
const collegeCards = document.getElementById("collegeCards");
const noResultMessage = document.getElementById("noResultMessage");

function normalizeValue(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function getUniqueStates() {
    return [...new Set(COLLEGE_DATA.map((item) => item.state))].sort((a, b) => a.localeCompare(b));
}

function getUniqueCities(stateValue = "") {
    const cities = COLLEGE_DATA.filter((item) => !stateValue || item.state === stateValue)
        .map((item) => String(item.city || "").trim())
        .filter((city) => city && !["na", "n/a", "null"].includes(city.toLowerCase()));

    return [...new Set(cities)].sort((a, b) => a.localeCompare(b));
}

function populateDropdowns() {
    const states = getUniqueStates();

    states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });

    STREAM_ORDER.forEach((stream) => {
        const option = document.createElement("option");
        option.value = stream;
        option.textContent = stream;
        streamFilter.appendChild(option);
    });

    populateCityDropdown();
}

function populateCityDropdown(options = {}) {
    const { state = stateFilter.value, preferredCity = cityFilter ? cityFilter.value : "" } = options;
    const cities = getUniqueCities(state);

    if (!cityFilter) return;

    cityFilter.innerHTML = '<option value="">Select City</option>';

    cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });

    const exactMatch = cities.find((city) => city === preferredCity);
    if (exactMatch) {
        cityFilter.value = exactMatch;
    }
}

function getFilteredColleges() {
    const selectedState = stateFilter.value;
    const selectedCity = cityFilter ? cityFilter.value : "";
    const selectedStream = streamFilter.value;
    const selectedType = typeFilter.value;

    return COLLEGE_DATA.filter((college) => {
        const matchesState = !selectedState || college.state === selectedState;
        const matchesCity = !selectedCity || college.city === selectedCity;
        const matchesStream = !selectedStream || college.program === selectedStream;
        const matchesType = !selectedType || college.instituteType === selectedType;
        return matchesState && matchesCity && matchesStream && matchesType;
    }).sort((a, b) => {
        const stateSort = a.state.localeCompare(b.state);
        if (stateSort !== 0) return stateSort;

        const streamSort = STREAM_ORDER.indexOf(a.program) - STREAM_ORDER.indexOf(b.program);
        if (streamSort !== 0) return streamSort;

        return a.college.localeCompare(b.college);
    });
}

function renderProgramCountChips(colleges) {
    const counts = {};

    STREAM_ORDER.forEach((stream) => {
        counts[stream] = 0;
    });

    colleges.forEach((college) => {
        counts[college.program] = (counts[college.program] || 0) + 1;
    });

    programCounts.innerHTML = STREAM_ORDER.map(
        (stream) => `<span class="program-chip">${stream}: ${counts[stream] || 0}</span>`
    ).join("");
}

function renderTable(colleges) {
    collegeTableBody.innerHTML = colleges
        .map(
            (college) => `
                <tr>
                    <td><span class="program-badge">${college.program}</span></td>
                    <td>${college.college}</td>
                    <td>${college.city}</td>
                    <td>${college.state}</td>
                    <td>
                        <span class="type-badge ${college.instituteType === "Government" ? "type-government" : "type-private"}">
                            ${college.instituteType}
                        </span>
                    </td>
                    <td><a class="site-link" href="${college.website}" target="_blank" rel="noopener noreferrer">Official Site</a></td>
                </tr>
            `
        )
        .join("");
}

function renderCards(colleges) {
    collegeCards.innerHTML = colleges
        .map(
            (college) => `
                <article class="college-card">
                    <span class="program-badge">${college.program}</span>
                    <h3>${college.college}</h3>
                    <p class="college-meta">${college.city}, ${college.state}</p>
                    <div class="card-row">
                        <span class="type-badge ${college.instituteType === "Government" ? "type-government" : "type-private"}">${college.instituteType}</span>
                        <a class="site-link" href="${college.website}" target="_blank" rel="noopener noreferrer">Official Site</a>
                    </div>
                </article>
            `
        )
        .join("");
}

function render() {
    const filteredColleges = getFilteredColleges();
    resultCount.textContent = filteredColleges.length;
    renderProgramCountChips(filteredColleges);
    renderTable(filteredColleges);
    renderCards(filteredColleges);

    if (filteredColleges.length === 0) {
        noResultMessage.classList.remove("hidden");
    } else {
        noResultMessage.classList.add("hidden");
    }
}

function resetFilters() {
    stateFilter.value = "";
    if (cityFilter) {
        cityFilter.value = "";
    }
    streamFilter.value = "";
    typeFilter.value = "";
    populateCityDropdown({ state: "", preferredCity: "" });
    render();
}

function applyFiltersFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const queryState = (params.get("state") || "").trim();
    const queryCity = (params.get("city") || "").trim();

    if (queryState) {
        const normalizedQueryState = queryState.toLowerCase();
        const matchingState = Array.from(stateFilter.options).find(
            (option) => option.value.toLowerCase() === normalizedQueryState
        );

        if (matchingState) {
            stateFilter.value = matchingState.value;
        }
    }

    populateCityDropdown({ state: stateFilter.value, preferredCity: "" });

    if (queryCity && cityFilter) {
        const normalizedQueryCity = normalizeValue(queryCity);
        const options = Array.from(cityFilter.options).map((option) => option.value).filter(Boolean);

        const aliasCityMap = {
            bangalore: "bengaluru",
            bengaluru: "bangalore",
            delhi: "newdelhi",
            newdelhi: "delhi"
        };

        let matchingCity = options.find((city) => normalizeValue(city) === normalizedQueryCity);

        if (!matchingCity && aliasCityMap[normalizedQueryCity]) {
            const alias = aliasCityMap[normalizedQueryCity];
            matchingCity = options.find((city) => normalizeValue(city) === alias);
        }

        if (!matchingCity) {
            matchingCity = options.find((city) => {
                const normalizedCity = normalizeValue(city);
                return normalizedCity.includes(normalizedQueryCity) || normalizedQueryCity.includes(normalizedCity);
            });
        }

        if (matchingCity) {
            cityFilter.value = matchingCity;
        }
    }
}

function validateMinimumPerState() {
    const stateCounts = COLLEGE_DATA.reduce((acc, college) => {
        acc[college.state] = (acc[college.state] || 0) + 1;
        return acc;
    }, {});

    const belowTwenty = Object.entries(stateCounts).filter(([, count]) => count < 20);
    if (belowTwenty.length > 0) {
        console.warn("States below 20 colleges:", belowTwenty);
    } else {
        console.log("All listed states have at least 20 colleges.");
    }
}

stateFilter.addEventListener("change", () => {
    const currentCity = cityFilter ? cityFilter.value : "";
    populateCityDropdown({ state: stateFilter.value, preferredCity: currentCity });
    render();
});

[cityFilter, streamFilter, typeFilter].forEach((filter) => {
    if (!filter) return;
    filter.addEventListener("change", render);
});

allFilterBtn.addEventListener("click", resetFilters);

populateDropdowns();
applyFiltersFromQuery();
validateMinimumPerState();
render();
