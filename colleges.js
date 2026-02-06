
console.log('🚀 Safarnama Colleges - Filter System Loading...');

// ============================================
// MEGA MENU FUNCTIONALITY
// ============================================

const buttons = document.querySelectorAll(".menu-btn");
const megaMenu = document.getElementById("megaMenu");
const megaContent = document.getElementById("megaContent");

const menus = {
    mba: `
        <div class="mega-col">
            <h4>Explore</h4>
            <a href="top-mba-colleges.html">Top MBA Colleges</a>
            <a href="mba-popular-courses.html">Popular Courses</a>
            <a href="mba-specializations.html">Specializations</a>
            <a href="mba-exams.html">Exams</a>
        </div>
        <div class="mega-col">
            <h4>By Location</h4>
            <a href="mba-colleges-india.html">MBA Colleges in India</a>
            <a href="mba-colleges-delhi.html">MBA Colleges in Delhi</a>
            <a href="mba-colleges-mumbai.html">MBA Colleges in Mumbai</a>
            <a href="mba-colleges-bangalore.html">MBA Colleges in Bangalore</a>
        </div>
        <div class="mega-col">
            <h4>Featured</h4>
            <a href="iims-pune.html">IIMS Pune</a>
            <a href="iebm.html">IEBM</a>
            <a href="cgc-university.html">CGC University</a>
        </div>
    `,
    engineering: `
        <div class="mega-col">
            <h4>Explore</h4>
            <a href="top-engineering-colleges.html">Top Engineering Colleges</a>
            <a href="btech-courses.html">B.Tech Courses</a>
            <a href="engineering-specializations.html">Specializations</a>
            <a href="engineering-exams.html">Entrance Exams</a>
        </div>
        <div class="mega-col">
            <h4>By Location</h4>
            <a href="engineering-india.html">Engineering in India</a>
            <a href="engineering-delhi.html">Engineering in Delhi</a>
            <a href="engineering-mumbai.html">Engineering in Mumbai</a>
            <a href="engineering-bangalore.html">Engineering in Bangalore</a>
        </div>
        <div class="mega-col">
            <h4>Top Institutes</h4>
            <a href="iit-bombay.html">IIT Bombay</a>
            <a href="iit-delhi.html">IIT Delhi</a>
            <a href="nit-trichy.html">NIT Trichy</a>
        </div>
    `,
    medical: `
        <div class="mega-col">
            <h4>Explore</h4>
            <a href="top-medical-colleges.html">Top Medical Colleges</a>
            <a href="mbbs-course.html">MBBS</a>
            <a href="medical-specializations.html">Specializations</a>
            <a href="medical-exams.html">Entrance Exams</a>
        </div>
        <div class="mega-col">
            <h4>By Location</h4>
            <a href="medical-india.html">Medical in India</a>
            <a href="medical-delhi.html">Medical in Delhi</a>
            <a href="medical-mumbai.html">Medical in Mumbai</a>
            <a href="medical-bangalore.html">Medical in Bangalore</a>
        </div>
        <div class="mega-col">
            <h4>Popular Institutes</h4>
            <a href="aiims-delhi.html">AIIMS Delhi</a>
            <a href="cmc-vellore.html">CMC Vellore</a>
            <a href="jipmer.html">JIPMER</a>
        </div>
    `,
    design: `
        <div class="mega-col">
            <h4>Explore</h4>
            <a href="top-design-colleges.html">Top Design Colleges</a>
            <a href="fashion-design.html">Fashion Design</a>
            <a href="interior-design.html">Interior Design</a>
            <a href="design-exams.html">Entrance Exams</a>
        </div>
        <div class="mega-col">
            <h4>By Location</h4>
            <a href="design-india.html">Design in India</a>
            <a href="design-delhi.html">Design in Delhi</a>
            <a href="design-mumbai.html">Design in Mumbai</a>
            <a href="design-bangalore.html">Design in Bangalore</a>
        </div>
        <div class="mega-col">
            <h4>Institutes</h4>
            <a href="nift.html">NIFT</a>
            <a href="nid.html">NID</a>
            <a href="pearl-academy.html">Pearl Academy</a>
        </div>
    `,
    abroad: `
        <div class="mega-col">
            <h4>Countries</h4>
            <a href="study-in-usa.html">Study in USA</a>
            <a href="study-in-uk.html">Study in UK</a>
            <a href="study-in-canada.html">Study in Canada</a>
            <a href="study-in-australia.html">Study in Australia</a>
        </div>
        <div class="mega-col">
            <h4>Programs</h4>
            <a href="ug-abroad.html">UG Abroad</a>
            <a href="pg-abroad.html">PG Abroad</a>
            <a href="mba-abroad.html">MBA Abroad</a>
            <a href="ms-abroad.html">MS Abroad</a>
        </div>
        <div class="mega-col">
            <h4>Exams & Help</h4>
            <a href="ielts.html">IELTS</a>
            <a href="toefl.html">TOEFL</a>
            <a href="student-visa.html">Student Visa</a>
        </div>
    `,
    agriculture: `
        <div class="mega-col">
            <h4>Explore</h4>
            <a href="top-agriculture-colleges.html">Top Agriculture Colleges</a>
            <a href="agriculture-courses.html">Popular Courses</a>
            <a href="agriculture-specializations.html">Specializations</a>
            <a href="agriculture-exams.html">Entrance Exams</a>
        </div>
        <div class="mega-col">
            <h4>By Location</h4>
            <a href="agriculture-india.html">Agriculture in India</a>
            <a href="agriculture-punjab.html">Agriculture in Punjab</a>
            <a href="agriculture-up.html">Agriculture in UP</a>
            <a href="agriculture-maharashtra.html">Agriculture in Maharashtra</a>
        </div>
        <div class="mega-col">
            <h4>Institutes</h4>
            <a href="iari.html">IARI</a>
            <a href="pau.html">PAU</a>
            <a href="tnau.html">TNAU</a>
        </div>
    `,
    online: `
        <div class="mega-col">
            <h4>Online Degrees</h4>
            <a href="online-mba.html">Online MBA</a>
            <a href="online-bba.html">Online BBA</a>
            <a href="online-bca.html">Online BCA</a>
            <a href="online-bcom.html">Online B.Com</a>
        </div>
        <div class="mega-col">
            <h4>Certifications</h4>
            <a href="data-science-cert.html">Data Science</a>
            <a href="ai-ml-cert.html">AI & ML</a>
            <a href="digital-marketing-cert.html">Digital Marketing</a>
            <a href="cyber-security-cert.html">Cyber Security</a>
        </div>
        <div class="mega-col">
            <h4>Platforms</h4>
            <a href="coursera-courses.html">Coursera</a>
            <a href="edx-courses.html">edX</a>
            <a href="upgrad-courses.html">UpGrad</a>
        </div>
    `
};

buttons.forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        const key = btn.dataset.menu;
        megaContent.innerHTML = menus[key];
        megaMenu.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if (!e.target.classList.contains("menu-btn") && !megaMenu.contains(e.target)) {
        megaMenu.classList.remove("active");
    }
});

// ============================================
// FILTER SYSTEM
// ============================================

// Filter Data Configuration
const filterData = {
    stream: [
        'Management', 'Science', 'Engineering', 'Medical', 'Pharmacy', 
        'Commerce', 'Computer Applications', 'Design', 'Paramedical', 
        'Law', 'Agriculture', 'Programming', 'Dental'
    ],
    state: [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ],
    city: [
        'New Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad',
        'Bangalore', 'Patna', 'Pune', 'Ahmedabad', 'Gurgaon',
        'Noida', 'Lucknow', 'Coimbatore', 'Jaipur', 'Bhopal',
        'Nagpur', 'Bhubaneswar', 'Indore', 'Dehradun', 'Greater Noida',
        'Ghaziabad', 'Meerut', 'Visakhapatnam'
    ],
    degree: [
        'MBA/PGDM (5291)', 'B.Sc', 'B.Com', 'BA', 'BE/B.Tech',
        'BBA/BMS', 'M.Sc', 'BCA', 'MA', 'ME/M.Tech',
        'M.Com', 'Polytechnic', 'B.Ed', 'MCA', 'M.Phil/Ph.D in Science',
        'BE/B.Tech Lateral', 'B.Pharm', 'B.Sc (Nursing)', 'M.Phil/Ph.D in Arts', 'M.Phil/Ph.D in Management'
    ],
    entrance: [
        'JEE Advanced', 'JEE Main', 'NEET UG', 'CAT', 'MAT', 'XAT', 'GATE',
        'IPMAT', 'CUET', 'CLAT', 'NIFT', 'NID DAT', 'UCEED', 'CEED',
        'GPAT', 'NATA', 'AIAPGET', 'NEET MDS', 'NEET PG', 'AILET'
    ],
    collegeType: [
        'Government', 'Private'
    ],
    totalFee: [
        '0 - 25K', '25 - 50K', '50 - 75K', '75K - 1L', '1 - 2L', 'Above 2L'
    ]
};

// Filter State
let selectedFilters = {
    stream: [],
    state: [],
    city: [],
    degree: [],
    collegeType: [],
    entrance: [],
    totalFee: []
};

let currentModalCategory = 'stream';
let activeDropdown = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing filters...');
    initializeFilters();
    populateMBATable();
    populateBTechTable();
    populateBComTable();
    populateBBATable();
    populateMBBSTable();
    initializeCloseButton();
});

// Initialize Close Button for Content Header
function initializeCloseButton() {
    const closeBtn = document.getElementById('closeHeaderBtn');
    const contentHeader = document.getElementById('contentHeader');
    
    if (closeBtn && contentHeader) {
        closeBtn.addEventListener('click', function() {
            contentHeader.classList.add('closing');
            
            // Remove element after animation completes
            setTimeout(() => {
                contentHeader.style.display = 'none';
            }, 400);
        });
    }
}

function initializeFilters() {
    initializeDropdowns();
    initializeModal();
    console.log('✅ All filters initialized!');
}

// Initialize Dropdowns
function initializeDropdowns() {
    const dropdownWraps = document.querySelectorAll('.filter-dropdown-wrap');
    console.log('📋 Found', dropdownWraps.length, 'dropdown wrappers');
    
    dropdownWraps.forEach(wrap => {
        const filterType = wrap.getAttribute('data-filter');
        const button = wrap.querySelector('.filter-toggle');
        const dropdown = wrap.querySelector('.filter-dropdown');
        
        if (!button || !dropdown || !filterType) return;
        
        // Populate dropdown
        populateDropdown(dropdown, filterType, wrap);
        
        // Add click event
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            if (activeDropdown && activeDropdown !== wrap) {
                activeDropdown.classList.remove('active');
            }
            
            // Toggle current
            const isActive = wrap.classList.toggle('active');
            activeDropdown = isActive ? wrap : null;
            
            // Position dropdown using fixed positioning
            if (isActive) {
                const rect = button.getBoundingClientRect();
                dropdown.style.top = (rect.bottom + 8) + 'px';
                dropdown.style.left = rect.left + 'px';
            }
        });
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-dropdown-wrap')) {
            closeAllDropdowns();
        }
    });
    
    // Reposition dropdown on scroll
    window.addEventListener('scroll', function() {
        if (activeDropdown) {
            const button = activeDropdown.querySelector('.filter-toggle');
            const dropdown = activeDropdown.querySelector('.filter-dropdown');
            if (button && dropdown) {
                const rect = button.getBoundingClientRect();
                dropdown.style.top = (rect.bottom + 8) + 'px';
                dropdown.style.left = rect.left + 'px';
            }
        }
    });
}

// Populate Dropdown
function populateDropdown(dropdown, filterType, wrap) {
    const data = filterData[filterType] || [];
    const firstSix = data.slice(0, 6);
    
    dropdown.innerHTML = '';
    
    // Add options
    firstSix.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'filter-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${filterType}-${option.replace(/[^a-zA-Z0-9]/g, '-')}`;
        checkbox.value = option;
        
        if (selectedFilters[filterType].includes(option)) {
            checkbox.checked = true;
            optionDiv.classList.add('checked');
        }
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = option;
        label.style.cursor = 'pointer';
        label.style.flex = '1';
        
        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(label);
        
        optionDiv.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            toggleFilterSelection(filterType, option, checkbox.checked);
            optionDiv.classList.toggle('checked', checkbox.checked);
            updateButtonText(wrap, filterType);
        });
        
        dropdown.appendChild(optionDiv);
    });
    
    // Add View All button
    if (data.length > 6) {
        const viewAllBtn = document.createElement('button');
        viewAllBtn.className = 'view-all-btn';
        viewAllBtn.textContent = 'View All';
        viewAllBtn.type = 'button';
        
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal(filterType);
            closeAllDropdowns();
        });
        
        dropdown.appendChild(viewAllBtn);
    }
}

// Close All Dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown-wrap').forEach(wrap => {
        wrap.classList.remove('active');
    });
    activeDropdown = null;
}

// Toggle Filter Selection
function toggleFilterSelection(filterType, option, isSelected) {
    if (isSelected) {
        if (!selectedFilters[filterType].includes(option)) {
            selectedFilters[filterType].push(option);
        }
    } else {
        selectedFilters[filterType] = selectedFilters[filterType].filter(item => item !== option);
    }
    console.log('✅ Selected Filters:', selectedFilters);
    
    // Apply filtering to colleges
    filterColleges();
}

// Update Button Text
function updateButtonText(wrap, filterType) {
    const button = wrap.querySelector('.filter-toggle');
    const count = selectedFilters[filterType].length;
    
    let displayName = filterType.replace(/([A-Z])/g, ' $1').trim();
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    
    if (count > 0) {
        button.innerHTML = `${displayName} (${count}) <span class="chevron">⌄</span>`;
        button.style.background = '#eff6ff';
        button.style.borderColor = '#2563eb';
        button.style.color = '#2563eb';
    } else {
        button.innerHTML = `${displayName} <span class="chevron">⌄</span>`;
        button.style.background = '#fff';
        button.style.borderColor = '#e0e0e0';
        button.style.color = '#444';
    }
}

// Initialize Modal
function initializeModal() {
    const modal = document.getElementById('filterModal');
    const allFilterBtn = document.getElementById('allFilterBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const applyBtn = document.getElementById('applyBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');
    const categoryButtons = document.querySelectorAll('.filter-category-btn');
    const searchInput = document.getElementById('filterSearchInput');
    
    if (allFilterBtn) {
        allFilterBtn.addEventListener('click', () => openModal('stream'));
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            closeModal();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            selectedFilters[currentModalCategory] = [];
            populateModalOptions(currentModalCategory);
        });
    }
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            switchModalCategory(category);
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            populateModalOptions(currentModalCategory, e.target.value);
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Open Modal
function openModal(category = 'stream') {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.add('active');
        switchModalCategory(category);
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Switch Modal Category
function switchModalCategory(category) {
    currentModalCategory = category;
    
    document.querySelectorAll('.filter-category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    const searchInput = document.getElementById('filterSearchInput');
    if (searchInput) {
        searchInput.placeholder = `FIND ${category.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}`;
        searchInput.value = '';
    }
    
    populateModalOptions(category);
}

// Populate Modal Options
function populateModalOptions(category, searchTerm = '') {
    const optionsGrid = document.getElementById('filterOptionsGrid');
    if (!optionsGrid) return;
    
    const data = filterData[category] || [];
    const filteredData = searchTerm 
        ? data.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
        : data;
    
    optionsGrid.innerHTML = '';
    
    if (filteredData.length === 0) {
        optionsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #9ca3af; padding: 40px;">No results found</p>';
        return;
    }
    
    filteredData.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'filter-option-modal';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `modal-${category}-${option.replace(/[^a-zA-Z0-9]/g, '-')}`;
        checkbox.value = option;
        
        if (selectedFilters[category].includes(option)) {
            checkbox.checked = true;
            optionDiv.classList.add('selected');
        }
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = option;
        
        optionDiv.appendChild(checkbox);
        optionDiv.appendChild(label);
        
        optionDiv.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            toggleFilterSelection(category, option, checkbox.checked);
            optionDiv.classList.toggle('selected', checkbox.checked);
        });
        
        optionsGrid.appendChild(optionDiv);
    });
}

// Apply Filters
function applyFilters() {
    console.log('✅ Applying filters:', selectedFilters);
    
    document.querySelectorAll('.filter-dropdown-wrap').forEach(wrap => {
        const filterType = wrap.getAttribute('data-filter');
        const dropdown = wrap.querySelector('.filter-dropdown');
        
        if (filterType && dropdown) {
            populateDropdown(dropdown, filterType, wrap);
            updateButtonText(wrap, filterType);
        }
    });
    
    filterColleges();
}

// ============================================
// COMPREHENSIVE FILTER SYSTEM
// ============================================

// Stream to Section Mapping
const streamSectionMapping = {
    'Management': ['mbaSection', 'bbaSection'],
    'Engineering': ['engineeringSection', 'mtechSection'],
    'Medical': ['mbbsSection'],
    'Pharmacy': ['bpharmaSection'],
    'Commerce': ['bcomSection'],
    'Computer Applications': ['bcaSection'],
    'Design': ['animationSection'],
    'Paramedical': ['bscNursingSection', 'bamsSection'],
    'Law': ['llbSection', 'llmSection'],
    'Agriculture': ['agriSection'],
    'Dental': ['bdsSection'],
    'Science': ['biotechSection', 'bscNursingSection'],
    'Programming': ['bcaSection']
};

// Degree to Section Mapping
const degreeSectionMapping = {
    'MBA/PGDM (5291)': ['mbaSection'],
    'BBA/BMS': ['bbaSection'],
    'BE/B.Tech': ['engineeringSection'],
    'ME/M.Tech': ['mtechSection'],
    'B.Pharm': ['bpharmaSection'],
    'B.Com': ['bcomSection'],
    'BCA': ['bcaSection'],
    'B.Sc (Nursing)': ['bscNursingSection'],
    'B.Sc': ['biotechSection', 'agriSection'],
    'BA': ['massCommSection'],
    'MA': ['massCommSection'],
    'MCA': ['bcaSection'],
    'Polytechnic': ['engineeringSection'],
    'B.Ed': []
};

// All section IDs
const allSections = [
    'mbaSection', 'bbaSection', 'engineeringSection', 'mtechSection',
    'bcomSection', 'mbbsSection', 'llbSection', 'llmSection',
    'bscNursingSection', 'bamsSection', 'biotechSection', 'animationSection',
    'hmSection', 'bpharmaSection', 'bcaSection', 'agriSection',
    'bdsSection', 'massCommSection'
];

// Fee Range Mapping (in rupees)
const feeRanges = {
    '0 - 25K': { min: 0, max: 25000 },
    '25 - 50K': { min: 25000, max: 50000 },
    '50 - 75K': { min: 50000, max: 75000 },
    '75K - 1L': { min: 75000, max: 100000 },
    '1 - 2L': { min: 100000, max: 200000 },
    'Above 2L': { min: 200000, max: Infinity }
};

// Parse fee string to number
function parseFee(feeString) {
    if (!feeString || feeString === 'N/A') return 0;
    
    // Remove currency symbol and commas
    let cleanFee = feeString.replace(/[₹,\s]/g, '');
    
    // Handle Crore format
    if (cleanFee.toLowerCase().includes('cr')) {
        return parseFloat(cleanFee) * 10000000;
    }
    // Handle Lakh format (LPA, L, Lakh, etc.)
    if (cleanFee.toLowerCase().includes('l')) {
        return parseFloat(cleanFee) * 100000;
    }
    // Handle K format
    if (cleanFee.toLowerCase().includes('k')) {
        return parseFloat(cleanFee) * 1000;
    }
    
    return parseInt(cleanFee) || 0;
}

// Extract city from location string
function extractCity(location) {
    if (!location) return '';
    // "New Delhi, Delhi" → "New Delhi"
    // "Mumbai, Maharashtra" → "Mumbai"
    return location.split(',')[0].trim();
}

// Normalize city name for comparison
function normalizeCity(city) {
    const cityMappings = {
        'new delhi': 'New Delhi',
        'delhi': 'New Delhi',
        'mumbai': 'Mumbai',
        'bangalore': 'Bangalore',
        'bengaluru': 'Bangalore',
        'chennai': 'Chennai',
        'kolkata': 'Kolkata',
        'hyderabad': 'Hyderabad',
        'pune': 'Pune',
        'ahmedabad': 'Ahmedabad',
        'jaipur': 'Jaipur',
        'lucknow': 'Lucknow',
        'patna': 'Patna',
        'bhopal': 'Bhopal',
        'indore': 'Indore',
        'nagpur': 'Nagpur',
        'coimbatore': 'Coimbatore',
        'noida': 'Noida',
        'gurgaon': 'Gurgaon',
        'gurugram': 'Gurgaon',
        'greater noida': 'Greater Noida',
        'ghaziabad': 'Ghaziabad',
        'meerut': 'Meerut',
        'dehradun': 'Dehradun',
        'bhubaneswar': 'Bhubaneswar'
    };
    
    const normalized = city.toLowerCase().trim();
    return cityMappings[normalized] || city;
}

// Main Filter Colleges Function
function filterColleges() {
    console.log('🔍 Filtering colleges with:', selectedFilters);
    
    // Get all selected filters
    const selectedStreams = selectedFilters.stream || [];
    const selectedDegrees = selectedFilters.degree || [];
    const selectedCities = selectedFilters.city || [];
    const selectedCollegeTypes = selectedFilters.collegeType || [];
    const selectedFeeRanges = selectedFilters.totalFee || [];
    
    // Step 1: Determine which sections should be visible based on Stream and Degree
    let visibleSections = new Set();
    
    // If no stream or degree selected, all sections are potentially visible
    if (selectedStreams.length === 0 && selectedDegrees.length === 0) {
        allSections.forEach(section => visibleSections.add(section));
    } else {
        // Add sections from selected streams
        selectedStreams.forEach(stream => {
            const sections = streamSectionMapping[stream] || [];
            sections.forEach(section => visibleSections.add(section));
        });
        
        // Add sections from selected degrees
        selectedDegrees.forEach(degree => {
            const sections = degreeSectionMapping[degree] || [];
            sections.forEach(section => visibleSections.add(section));
        });
    }
    
    // Step 2: Show/hide sections
    allSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            if (visibleSections.has(sectionId)) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });
    
    // Step 3: Apply row-level filtering for City, College Type, and Fee
    const needsRowFiltering = selectedCities.length > 0 || 
                               selectedCollegeTypes.length > 0 || 
                               selectedFeeRanges.length > 0;
    
    if (needsRowFiltering) {
        // Filter rows in all visible sections
        visibleSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const tbody = section.querySelector('tbody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr');
            let visibleRowCount = 0;
            
            rows.forEach(row => {
                let showRow = true;
                
                // Get row data from cells
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) return;
                
                // Extract location (usually 2nd or 3rd column with class or containing location info)
                const locationCell = row.querySelector('.college-location') || 
                                    row.querySelector('td:nth-child(2) .college-location') ||
                                    cells[2]; // Fallback to 3rd cell
                const locationText = locationCell ? locationCell.textContent : '';
                const rowCity = extractCity(locationText);
                
                // Extract fee (search for cell containing ₹)
                let feeText = '';
                cells.forEach(cell => {
                    if (cell.textContent.includes('₹') && !feeText) {
                        feeText = cell.textContent;
                    }
                });
                const rowFee = parseFee(feeText);
                
                // Extract college type (look for "Govt" or "Private" in cells)
                let rowType = '';
                cells.forEach(cell => {
                    const text = cell.textContent.toLowerCase();
                    if (text.includes('govt') || text === 'government') {
                        rowType = 'Government';
                    } else if (text.includes('private')) {
                        rowType = 'Private';
                    }
                });
                
                // Apply City filter
                if (selectedCities.length > 0 && showRow) {
                    const normalizedRowCity = normalizeCity(rowCity);
                    // EXACT MATCH logic to prevent "Patna" matching "Visakhapatnam"
                    const cityMatch = selectedCities.some(selectedCity => {
                        return normalizedRowCity.toLowerCase() === selectedCity.toLowerCase();
                    });
                    if (!cityMatch) showRow = false;
                }
                
                // Apply College Type filter
                if (selectedCollegeTypes.length > 0 && showRow) {
                    if (rowType && !selectedCollegeTypes.includes(rowType)) {
                        showRow = false;
                    }
                }
                
                // Apply Fee Range filter
                if (selectedFeeRanges.length > 0 && showRow && rowFee > 0) {
                    const feeMatch = selectedFeeRanges.some(range => {
                        const { min, max } = feeRanges[range] || { min: 0, max: Infinity };
                        return rowFee >= min && rowFee <= max;
                    });
                    if (!feeMatch) showRow = false;
                }
                
                // Show or hide row
                row.style.display = showRow ? '' : 'none';
                if (showRow) visibleRowCount++;
            });
            
            // Hide section if no rows are visible
            if (visibleRowCount === 0 && needsRowFiltering) {
                section.style.display = 'none';
            }
        });
    } else {
        // Show all rows when no row-level filters are applied
        allSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;
            
            const tbody = section.querySelector('tbody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
            });
        });
    }
    console.log('Filter applied. Visible sections:', Array.from(visibleSections));
}

// ============================================
// MBA COLLEGES TABLE POPULATION
// ============================================

function populateMBATable() {
    const tbody = document.getElementById('mbaCollegesTableBody');
    if (!tbody) {
        console.error('❌ Table body not found!');
        return;
    }
    
    if (typeof mbaColleges === 'undefined') {
        console.error('❌ MBA colleges data not found!');
        return;
    }

    tbody.innerHTML = '';

    mbaColleges.forEach(college => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="rank-cell">
                <div class="rank-badge">${college.rank}</div>
            </td>
            <td>
                <div class="college-name">${college.name}</div>
                ${college.location ? `<div class="college-location">${college.location}</div>` : ''}
            </td>
            <td class="fee-cell">${college.fees}</td>
            <td class="placement-cell">${college.avgPlacement}</td>
            <td class="highest-placement-cell">
                ${college.highestPlacement.includes('LPA') ? 
                    `<div>${college.highestPlacement.replace(' (reported)', '')}</div><div class="lpa-badge">REPORTED</div>` : 
                    `<span class="to-be-verified">${college.highestPlacement}</span>`
                }
            </td>
            <td style="text-align: center;">
                <a href="college-site.html?id=${college.rank}" class="site-btn">View Site</a>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    console.log('✅ MBA Colleges table populated with', mbaColleges.length, 'colleges');
}

// ============================================
// B-TECH COLLEGES TABLE POPULATION
// ============================================

function populateBTechTable() {
    const tbody = document.getElementById('btechCollegesTableBody');
    if (!tbody) {
        console.error('❌ B-Tech Table body not found!');
        return;
    }
    
    if (typeof btechColleges === 'undefined') {
        console.error('❌ B-Tech colleges data not found!');
        return;
    }

    tbody.innerHTML = '';

    btechColleges.forEach(college => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="rank-cell">
                <div class="rank-badge">${college.rank}</div>
            </td>
            <td>
                <div class="college-name">${college.name}</div>
                ${college.location ? `<div class="college-location">${college.location}</div>` : ''}
            </td>
            <td>${college.estYear}</td>
            <td>${college.entrance}</td>
            <td class="fee-cell">${college.fees}</td>
            <td class="placement-cell">${college.avgPlacement}</td>
            <td class="highest-placement-cell">
                ${college.highestPlacement.includes('LPA') || college.highestPlacement.includes('Cr') ? 
                    `<div>${college.highestPlacement}</div>` : 
                    `<span class="to-be-verified">${college.highestPlacement}</span>`
                }
            </td>
            <td>${college.specialization}</td>
            <td style="text-align: center;">
                <a href="college-site.html?id=${college.rank}" class="site-btn">View Site</a>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    console.log('✅ B-Tech Colleges table populated with', btechColleges.length, 'colleges');
}

// ============================================
// B-COM COLLEGES TABLE POPULATION
// ============================================

function populateBComTable() {
    const tbody = document.getElementById('bcomCollegesTableBody');
    if (!tbody) {
        console.error('❌ B-Com Table body not found!');
        return;
    }
    
    if (typeof bcomColleges === 'undefined') {
        console.error('❌ B-Com colleges data not found!');
        return;
    }

    tbody.innerHTML = '';

    bcomColleges.forEach(college => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="rank-cell">
                <div class="rank-badge">${college.rank}</div>
            </td>
            <td>
                <div class="college-name">${college.name}</div>
            </td>
            <td>${college.location ? college.location.split(',')[0] : ''}</td>
            <td>${college.entrance}</td>
            <td class="fee-cell">${college.fees}</td>
            <td class="placement-cell">${college.avgPlacement}</td>
            <td class="highest-placement-cell">${college.highestPlacement}</td>
            <td>${college.specialization}</td>
            <td style="text-align: center;">
                <a href="college-site.html?id=${college.rank}" class="site-btn">View Site</a>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    console.log('✅ B-Com Colleges table populated with', bcomColleges.length, 'colleges');
}

// ============================================
// BBA COLLEGES TABLE POPULATION
// ============================================

function populateBBATable() {
    const tbody = document.getElementById('bbaCollegesTableBody');
    if (!tbody) {
        console.error('❌ BBA Table body not found!');
        return;
    }
    
    if (typeof bbaColleges === 'undefined') {
        console.error('❌ BBA colleges data not found!');
        return;
    }

    tbody.innerHTML = '';

    bbaColleges.forEach(college => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="rank-cell">
                <div class="rank-badge">${college.rank}</div>
            </td>
            <td>
                <div class="college-name">${college.name}</div>
            </td>
            <td>${college.location ? college.location.split(',')[0] : ''}</td>
            <td>${college.entrance || 'Merit Based'}</td>
            <td class="fee-cell">${college.fees}</td>
            <td class="placement-cell">${college.avgPlacement}</td>
            <td class="highest-placement-cell">${college.highestPlacement}</td>
            <td>${college.specialization || 'Management'}</td>
            <td style="text-align: center;">
                <a href="college-site.html?id=${college.rank}" class="site-btn">View Site</a>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    console.log('✅ BBA Colleges table populated with', bbaColleges.length, 'colleges');
}

// ============================================
// MBBS COLLEGES TABLE POPULATION
// ============================================

function populateMBBSTable() {
    const tbody = document.getElementById('mbbsCollegesTableBody');
    if (!tbody) {
        console.error('❌ MBBS Table body not found!');
        return;
    }
    
    if (typeof mbbsColleges === 'undefined') {
        console.error('❌ MBBS colleges data not found!');
        return;
    }

    tbody.innerHTML = '';

    mbbsColleges.forEach(college => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="rank-cell">
                <div class="rank-badge">${college.rank}</div>
            </td>
            <td>
                <div class="college-name">${college.name}</div>
            </td>
            <td>${college.location ? college.location.split(',')[0] : ''}</td>
            <td>NEET</td>
            <td class="fee-cell">${college.fees}</td>
            <td class="placement-cell">${college.avgPlacement}</td>
            <td class="highest-placement-cell">${college.highestPlacement}</td>
            <td>${college.type || 'Government'}</td>
            <td style="text-align: center;">
                <a href="college-site.html?id=${college.rank}" class="site-btn">View Site</a>
            </td>
        `;
        
        tbody.appendChild(row);
    });

    console.log('✅ MBBS Colleges table populated with', mbbsColleges.length, 'colleges');
}

console.log('✅ Filter script loaded successfully!');

// ============================================
// GLOBAL SEARCH FUNCTIONALITY
// ============================================

// Course/Section data for search
const courseSearchData = [
    { name: 'MBA', fullName: 'Master of Business Administration', sectionId: 'mbaSection', type: 'course' },
    { name: 'BBA', fullName: 'Bachelor of Business Administration', sectionId: 'bbaSection', type: 'course' },
    { name: 'B.Tech', fullName: 'Bachelor of Technology', sectionId: 'engineeringSection', type: 'course' },
    { name: 'M.Tech', fullName: 'Master of Technology', sectionId: 'mtechSection', type: 'course' },
    { name: 'MBBS', fullName: 'Bachelor of Medicine and Surgery', sectionId: 'mbbsSection', type: 'course' },
    { name: 'B.Pharma', fullName: 'Bachelor of Pharmacy', sectionId: 'bpharmaSection', type: 'course' },
    { name: 'BCA', fullName: 'Bachelor of Computer Applications', sectionId: 'bcaSection', type: 'course' },
    { name: 'B.Sc Nursing', fullName: 'Bachelor of Science in Nursing', sectionId: 'bscNursingSection', type: 'course' },
    { name: 'LLB', fullName: 'Bachelor of Laws', sectionId: 'llbSection', type: 'course' },
    { name: 'LLM', fullName: 'Master of Laws', sectionId: 'llmSection', type: 'course' },
    { name: 'BAMS', fullName: 'Bachelor of Ayurveda Medicine', sectionId: 'bamsSection', type: 'course' },
    { name: 'BDS', fullName: 'Bachelor of Dental Surgery', sectionId: 'bdsSection', type: 'course' },
    { name: 'B.Sc Agriculture', fullName: 'Bachelor of Science in Agriculture', sectionId: 'agriSection', type: 'course' },
    { name: 'Animation', fullName: 'Animation & Design', sectionId: 'animationSection', type: 'course' },
    { name: 'Hotel Management', fullName: 'Hotel Management & Hospitality', sectionId: 'hmSection', type: 'course' },
    { name: 'Biotechnology', fullName: 'Biotechnology', sectionId: 'biotechSection', type: 'course' },
    { name: 'Mass Communication', fullName: 'Mass Communication & Journalism', sectionId: 'massCommSection', type: 'course' }
];

// Collect all college data for search
function getAllColleges() {
    const allColleges = [];
    
    // MBA Colleges
    if (typeof mbaColleges !== 'undefined') {
        mbaColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'mbaSection',
                course: 'MBA',
                type: 'college'
            });
        });
    }
    
    // B.Tech Colleges
    if (typeof btechColleges !== 'undefined') {
        btechColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'engineeringSection',
                course: 'B.Tech',
                type: 'college'
            });
        });
    }
    
    // BBA Colleges
    if (typeof bbaColleges !== 'undefined') {
        bbaColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'bbaSection',
                course: 'BBA',
                type: 'college'
            });
        });
    }
    
    // MBBS Colleges
    if (typeof mbbsColleges !== 'undefined') {
        mbbsColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'mbbsSection',
                course: 'MBBS',
                type: 'college'
            });
        });
    }
    
    // M.Tech Colleges
    if (typeof mtechColleges !== 'undefined') {
        mtechColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'mtechSection',
                course: 'M.Tech',
                type: 'college'
            });
        });
    }
    
    // LLB Colleges
    if (typeof llbColleges !== 'undefined') {
        llbColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'llbSection',
                course: 'LLB',
                type: 'college'
            });
        });
    }
    
    // B.Pharma Colleges
    if (typeof bpharmaColleges !== 'undefined') {
        bpharmaColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'bpharmaSection',
                course: 'B.Pharma',
                type: 'college'
            });
        });
    }
    
    // BCA Colleges
    if (typeof bcaColleges !== 'undefined') {
        bcaColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'bcaSection',
                course: 'BCA',
                type: 'college'
            });
        });
    }

    // B.Com Colleges
    if (typeof bcomColleges !== 'undefined') {
        bcomColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'bcomSection',
                course: 'B.Com',
                type: 'college'
            });
        });
    }

    // BBA Colleges
    if (typeof bbaColleges !== 'undefined') {
        bbaColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'bbaSection',
                course: 'BBA',
                type: 'college'
            });
        });
    }

    // MBBS Colleges
    if (typeof mbbsColleges !== 'undefined') {
        mbbsColleges.forEach(college => {
            allColleges.push({
                name: college.name,
                location: college.location,
                sectionId: 'mbbsSection',
                course: 'MBBS',
                type: 'college'
            });
        });
    }
    
    return allColleges;
}

// Search function
function searchAll(query) {
    if (!query || query.length < 2) return { courses: [], colleges: [] };
    
    const lowerQuery = query.toLowerCase();
    
    // Search courses
    const matchingCourses = courseSearchData.filter(course => 
        course.name.toLowerCase().includes(lowerQuery) ||
        course.fullName.toLowerCase().includes(lowerQuery)
    ).slice(0, 5);
    
    // Search colleges
    const allColleges = getAllColleges();
    const matchingColleges = allColleges.filter(college =>
        college.name.toLowerCase().includes(lowerQuery) ||
        (college.location && (
            // Check if location starts with query OR contains query as a distinct word
            college.location.toLowerCase().startsWith(lowerQuery) ||
            college.location.toLowerCase().includes(' ' + lowerQuery)
        ))
    ).slice(0, 8);
    
    return { courses: matchingCourses, colleges: matchingColleges };
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const suggestions = document.getElementById('searchSuggestions');
    const clearBtn = document.getElementById('searchClearBtn');
    
    if (!searchInput || !suggestions) {
        console.log('Search elements not found');
        return;
    }
    
    // Handle input
    searchInput.addEventListener('input', function() {
        const query = this.value;
        
        // Show/hide clear button
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? 'flex' : 'none';
        }
        
        if (query.length < 2) {
            suggestions.classList.remove('active');
            return;
        }
        
        const results = searchAll(query);
        displaySuggestions(results, suggestions);
    });
    
    // Handle focus
    searchInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            const results = searchAll(this.value);
            displaySuggestions(results, suggestions);
        }
    });
    
    // Handle clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            suggestions.classList.remove('active');
            this.style.display = 'none';
            searchInput.focus();
        });
    }
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            suggestions.classList.remove('active');
        }
    });
    
    console.log('🔍 Search initialized');
}

// Display suggestions
function displaySuggestions(results, container) {
    container.innerHTML = '';
    
    const { courses, colleges } = results;
    
    if (courses.length === 0 && colleges.length === 0) {
        container.innerHTML = `
            <div class="search-no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <div>No results found</div>
            </div>
        `;
        container.classList.add('active');
        return;
    }
    
    // Add courses
    if (courses.length > 0) {
        container.innerHTML += `<div class="suggestion-category">Courses</div>`;
        courses.forEach(course => {
            const item = document.createElement('div');
            item.className = 'suggestion-item course-item';
            item.innerHTML = `
                <div class="suggestion-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                </div>
                <div class="suggestion-info">
                    <div class="suggestion-name">${course.name}</div>
                    <div class="suggestion-meta">${course.fullName}</div>
                </div>
                <svg class="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            `;
            item.addEventListener('click', () => scrollToSection(course.sectionId));
            container.appendChild(item);
        });
    }
    
    // Add colleges
    if (colleges.length > 0) {
        container.innerHTML += `<div class="suggestion-category">Colleges</div>`;
        colleges.forEach(college => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <div class="suggestion-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 21h18"/>
                        <path d="M5 21V7l8-4 8 4v14"/>
                        <path d="M9 21v-4h6v4"/>
                    </svg>
                </div>
                <div class="suggestion-info">
                    <div class="suggestion-name">${college.name}</div>
                    <div class="suggestion-meta">${college.location || ''} • ${college.course}</div>
                </div>
                <svg class="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            `;
            item.addEventListener('click', () => scrollToCollegeInSection(college.sectionId, college.name));
            container.appendChild(item);
        });
    }
    
    container.classList.add('active');
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Make sure section is visible
        section.style.display = 'block';
        
        // Scroll to section
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Hide suggestions
        document.getElementById('searchSuggestions').classList.remove('active');
        document.getElementById('globalSearchInput').blur();
        
        // Highlight effect
        section.style.boxShadow = '0 0 0 3px #2563eb';
        setTimeout(() => {
            section.style.boxShadow = '';
        }, 2000);
    }
}

// Scroll to specific college within a section
function scrollToCollegeInSection(sectionId, collegeName) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Make sure section is visible
        section.style.display = 'block';
        
        // Find the college row in the table
        const rows = section.querySelectorAll('tbody tr');
        let targetRow = null;
        
        rows.forEach(row => {
            const nameCell = row.querySelector('.college-name') || row.querySelector('td:nth-child(2)');
            if (nameCell && nameCell.textContent.includes(collegeName.substring(0, 30))) {
                targetRow = row;
            }
        });
        
        if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight effect
            targetRow.style.background = 'linear-gradient(90deg, #dbeafe 0%, #ffffff 100%)';
            targetRow.style.boxShadow = '0 0 0 2px #2563eb';
            setTimeout(() => {
                targetRow.style.background = '';
                targetRow.style.boxShadow = '';
            }, 3000);
        } else {
            // Fallback to section scroll
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Hide suggestions
        document.getElementById('searchSuggestions').classList.remove('active');
        document.getElementById('globalSearchInput').blur();
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

